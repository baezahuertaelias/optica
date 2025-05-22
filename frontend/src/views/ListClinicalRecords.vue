<template>
  <div class="p-3">
    <Toast />
    <div class="pb-4">
      <h1 class="text-3xl font-bold">Listado Ficha Clínica</h1>
      <p class="text-gray-600 mt-1"></p>
    </div>

    <!-- Debug section to verify data loading -->
    <div v-if="loading" class="flex justify-center my-4">
      <p>Loading clinical records...</p>
    </div>
    <div
      v-else-if="clinicalRecords.length === 0"
      class="flex justify-center my-4"
    >
      <p>No clinical records found.</p>
    </div>

    <!-- Main DataTable -->
    <DataTable
      v-if="clinicalRecords.length > 0"
      v-model:expandedRowGroups="expandedRowGroups"
      :value="clinicalRecords"
      expandableRowGroups
      rowGroupMode="subheader"
      groupRowsBy="patient.name"
      @rowgroup-expand="onRowGroupExpand"
      @rowgroup-collapse="onRowGroupCollapse"
      sortMode="single"
      sortField="patient.name"
      :sortOrder="1"
      :rowsPerPageOptions="[10, 25, 50]"
      :paginator="true"
      :rows="10"
      responsiveLayout="scroll"
      class="p-datatable-sm"
      stripedRows
      :filters="filters"
      filterDisplay="menu"
      :globalFilterFields="['patient.name', 'user.username', 'observations']"
    >
      <template #header>
        <div class="flex justify-end">
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText
              v-model="filters['global'].value"
              placeholder="Keyword Search"
            />
          </IconField>
        </div>
      </template>

      <template #groupheader="slotProps">
        <span class="align-middle ml-2 font-bold leading-normal">
          {{ slotProps.data.patient?.name || "Unknown Patient" }}
        </span>
      </template>
      <Column field="patient.name" header="Name"></Column>
      <Column field="user.username" header="Medico"></Column>
      <Column field="createdAt" header="Fecha">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.createdAt) }}
        </template>
      </Column>
      <Column field="anamnesis" header="Observaciones"></Column>
      <Column header="Actions">
        <template #body="slotProps">
          <Button
            icon="pi pi-eye"
            class="p-button-text p-button-sm"
            @click="viewRecord(slotProps.data)"
          />
        </template>
      </Column>

      <template #groupfooter="slotProps">
        <div class="flex justify-end font-bold w-full">
          Registros Totales:
          {{ calculateClinicalRecordsTotal(slotProps.data.patientId) }}
        </div>
      </template>
    </DataTable>

    <!-- Using the new clinical record dialog component with patients data -->
    <ClinicalRecordDialog
      v-model:visible="visible"
      :clinicalRecord="detailClinicalRecord"
      :patients="patients"
      :indications="indications"
      :controls="controls"
      @print="handlePrintRecord"
    />
  </div>
</template>
  
<script setup>
import { ref, onMounted } from "vue";
import Toast from "primevue/toast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import apiClient from "../axios-config";
import { FilterMatchMode } from "@primevue/core/api";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import ClinicalRecordDialog from "../components/clinicalRecord/ClinicalRecordDialog.vue";

const toast = useToast();
const clinicalRecords = ref([]);
const expandedRowGroups = ref([]);
const loading = ref(true);
const visible = ref(false);

//Used for the dialog, to block edit
const isNew = ref(false);

// Add patients ref for the dialog component
const patients = ref([]);
const indications = ref([]);
const controls = ref([]);

// Initialize with empty structure matching the expected format
const detailClinicalRecord = ref({
  patientId: null,
  userId: parseInt(localStorage.getItem("iduser")),
  anamnesis: null,
  otherExam: null,
  observations: null,
  indicationId: null,
  controlId: null,
  latestClinicalDate: null,
  ophthalmologicalMedicalHistory: "",
  familyMedicalHistory: "",
  generalMedicalHistory: "",
  visualAcuity: {
    withoutCorrectionRE: null,
    laserCorrectionRE: null,
    pinholeRE: null,
    withoutCorrectionLE: null,
    laserCorrectionLE: null,
    pinholeLE: null,
    withoutCorrectionBI: null,
    laserCorrectionBI: null,
    pinholeBI: null,
    pupilRedRE: null,
    pupilRedLE: null,
  },
  lensometry: {
    sphereLE: null,
    sphereRE: null,
    cylinderLE: null,
    cylinderRE: null,
    axisLE: null,
    axisRE: null,
    vareachedLE: null,
    vareachedRE: null,
    pupilarDistance: null,
    add: null,
  },
  autorefractometry: {
    sphereLE: null,
    sphereRE: null,
    cylinderLE: null,
    cylinderRE: null,
    axisLE: null,
    axisRE: null,
    vareachedLE: null,
    vareachedRE: null,
    pupilarDistance: null,
    add: null,
  },
  subjectiveRefractionFar: {},
  subjectiveRefractionNear: {},
  applanationTonometry: {
    leftEye: null,
    rightEye: null,
  },
  typeDiagnosis: {
    myopia: null,
    hyperopia: null,
    astigmatism: null,
    presbyopia: null,
    emmetrope: null,
    derived: null,
    artificialTear: null
  },
});

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// Fetch patient names function
const fetchPatientNames = async () => {
  try {
    const response = await apiClient.get("clinicalRecords/patients/name");
    if (response.status === 200) {
      console.log("[fetchPatients]", response.data.patients);
      patients.value = response.data.patients;
    }
  } catch (error) {
    console.error("Failed to fetch patients:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error al cargar la lista de pacientes",
      life: 3000,
    });
  }
};

// Fetch indications function
const fetchIndications = async () => {
  try {
    const response = await apiClient.get("clinicalRecords/indications");
    if (response.status === 200) {
      console.log("[fetchIndications]", response.data.indications);
      indications.value = response.data.indications;
    }
  } catch (error) {
    console.error("Failed to fetch indications:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error al cargar las indicaciones",
      life: 3000,
    });
  }
};

// Fetch controls function
const fetchControls = async () => {
  try {
    const response = await apiClient.get("clinicalRecords/controls");
    if (response.status === 200) {
      console.log("[fetchControls]", response.data.controls);
      controls.value = response.data.controls;
    }
  } catch (error) {
    console.error("Failed to fetch controls:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error al cargar los controles",
      life: 3000,
    });
  }
};

// Format date function
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const viewRecord = async (record) => {
  const { id } = record;
  console.log("Viewing record:", id);

  try {
    const response = await apiClient.get(
      `/clinicalRecords/${id}/with-relations`
    );
    if (response.status === 200) {
      console.log("[viewRecord] API Response:", response.data);
      detailClinicalRecord.value = response.data.data;
      visible.value = true; // Ensure the dialog is made visible
    }
  } catch (error) {
    console.error("API Error:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail:
        error.response?.data?.message ||
        "Error al cargar los registros clinicos",
      life: 3000,
    });
  }
};

// Function to handle print event from the dialog component
const handlePrintRecord = async (record) => {
  console.log("Printing record:", record.id);
  toast.add({
    severity: "info",
    summary: "Imprimir",
    detail: `Imprimiendo ficha del paciente: ${record.patient.name}`,
    life: 3000,
  });

  try {
    // Setting responseType to 'blob'
    const response = await apiClient.post(
      `clinicalRecords/generatePDF/${record.id}`,
      null,
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to generate PDF");
  }
};

const onRowGroupExpand = (event) => {
  toast.add({
    severity: "info",
    summary: "Grupo Expandido",
    detail: "Paciente: " + (event.data.patient?.name || "Unknown"),
    life: 3000,
  });
};

const onRowGroupCollapse = (event) => {
  toast.add({
    severity: "success",
    summary: "Grupo Colapsado",
    detail: "Paciente: " + (event.data.patient?.name || "Unknown"),
    life: 3000,
  });
};

const calculateClinicalRecordsTotal = (patientId) => {
  let total = 0;

  if (clinicalRecords.value) {
    for (let clinicalRecord of clinicalRecords.value) {
      if (clinicalRecord.patientId === patientId) {
        total++;
      }
    }
  }

  return total;
};

const fetchClinicalRecords = async () => {
  loading.value = true;
  try {
    const response = await apiClient.get("/clinicalRecords");
    if (response.status === 200) {
      console.log("API Response:", response.data);
      clinicalRecords.value = response.data.records || [];

      // Check if the data structure is as expected
      if (clinicalRecords.value.length > 0) {
        const sampleRecord = clinicalRecords.value[0];
        console.log("Sample record structure:", sampleRecord);

        // Validate required fields
        if (!sampleRecord.patient?.name) {
          console.warn("Warning: patient.name is missing in records");
        }
        if (!sampleRecord.user?.username) {
          console.warn("Warning: user.username is missing in records");
        }
      }
    }
  } catch (error) {
    console.error("API Error:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail:
        error.response?.data?.message ||
        "Error al cargar los registros clinicos",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // Fetch all required data on component mount
  fetchClinicalRecords();
  fetchPatientNames();
  fetchIndications();
  fetchControls();
});
</script>
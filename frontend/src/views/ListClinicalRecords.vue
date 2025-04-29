<template>
  <div class="p-3">
    <Toast />

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
      groupRowsBy="Patient.name"
      @rowgroup-expand="onRowGroupExpand"
      @rowgroup-collapse="onRowGroupCollapse"
      sortMode="single"
      sortField="Patient.name"
      :sortOrder="1"
      :rowsPerPageOptions="[10, 25, 50]"
      :paginator="true"
      :rows="10"
      responsiveLayout="scroll"
      class="p-datatable-sm"
      stripedRows
      :filters="filters"
      filterDisplay="menu"
      :globalFilterFields="['Patient.name', 'User.username', 'observations']"
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
          {{ slotProps.data.Patient?.name || "Unknown Patient" }}
        </span>
      </template>
      <Column field="Patient.name" header="Name"></Column>
      <Column field="User.username" header="Medico"></Column>
      <Column field="createdAt" header="Fecha">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.createdAt) }}
        </template>
      </Column>
      <Column field="observations" header="Observaciones"></Column>
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
          {{ calculateClinicalRecordsTotal(slotProps.data.idPatient) }}
        </div>
      </template>
    </DataTable>

    <Dialog
      v-model:visible="visible"
      modal
      header="Edit Profile"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-8"
        >Update your information.</span
      >
      <div class="flex items-center gap-4 mb-4">
        <label for="username" class="font-semibold w-24">Username</label>
        <InputText id="username" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex items-center gap-4 mb-8">
        <label for="email" class="font-semibold w-24">Email</label>
        <InputText id="email" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="visible = false"
        ></Button>
        <Button type="button" label="Save" @click="visible = false"></Button>
      </div>
    </Dialog>
  </div>
</template>
  
<script setup>
import { ref, onMounted } from "vue";
import Toast from "primevue/toast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { useToast } from "primevue/usetoast";
import apiClient from "../axios-config";
import { FilterMatchMode } from "@primevue/core/api";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";

const toast = useToast();
const clinicalRecords = ref([]);
const expandedRowGroups = ref([]);
const loading = ref(true);
const visible = ref(false);
const detailClinicalRecord = ref({
  id: null,
  idPatient: null,
  userId: null,
  anamnesis: null,
  othersDetails: null,
  createdAt: null,
  updatedAt: null,
  Patient: {
    id: null,
    name: null,
    passport: null,
    genderId: null,
    tel: null,
    birthday: null,
    homeAddress: null,
    mail: null,
    occupation: null,
    legalRepresentative: null,
    idIsapre: null,
    createdAt: null,
    updatedAt: null,
    Gender: {
      id: null,
      value: null,
    },
    Isapre: {
      id: null,
      value: null,
    },
  },
  User: {
    id: null,
    username: null,
    password: null,
    userTypeId: null,
    status: true,
    createdAt: null,
    updatedAt: null,
    UserType: {
      id: null,
      type: null,
      createdAt: null,
      updatedAt: null,
    },
  },
  VisualAcuity: {
    id: null,
    clinicalrecordId: null,
    withoutCorrectionLE: null,
    withoutCorrectionRE: null,
    withoutCorrectionBI: null,
    laserCorrectionLE: null,
    laserCorrectionRE: null,
    laserCorrectionBI: null,
    pinholeLE: null,
    pinholeRE: null,
    pinholeBI: null,
    pupilRedLE: null,
    pupilRedRE: null,
    createdAt: null,
    updatedAt: null,
  },
  SubjectiveRefractionFar: {
    id: null,
    clinicalrecordId: null,
    sphereLE: null,
    sphereRE: null,
    cylinderLE: null,
    cylinderRE: null,
    axisLE: null,
    axisRE: null,
    vareachedLE: null,
    vareachedRE: null,
    pupilarDistance: null,
    createdAt: null,
    updatedAt: null,
  },
  SubjectiveRefractionNear: {
    id: null,
    clinicalrecordId: null,
    sphereLE: null,
    sphereRE: null,
    cylinderLE: null,
    cylinderRE: null,
    axisLE: null,
    axisRE: null,
    vareachedLE: null,
    vareachedRE: null,
    pupilarDistance: null,
    createdAt: null,
    updatedAt: null,
  },
  ApplanationTonometry: {
    id: null,
    leftEye: null,
    rightEye: null,
    dateTime: null,
    createdAt: null,
    updatedAt: null,
    clinicalrecordId: null,
  },
});

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

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

// View record function
const viewRecord = async (record) => {
  const { id } = record;
  console.log("Viewing record:", id);

  try {
    const response = await apiClient.get(`/clinicalRecords/detail/${id}`);
    if (response.status === 200) {
      console.log("[viewRecord] API Response:", response.data);
      detailClinicalRecord.value = response.data.records || [];
      visible.value = true;

      // Check if the data structure is as expected
      if (detailClinicalRecord.value.length > 0) {
        const sampleRecord = detailClinicalRecord.value[0];
        console.log("Sample record structure:", sampleRecord);

        // Validate required fields
        /* if (!sampleRecord.Patient?.name) {
          console.warn("Warning: Patient.name is missing in records");
        }
        if (!sampleRecord.User?.username) {
          console.warn("Warning: User.username is missing in records");
        } */
      }
    }
  } catch (error) {
    console.error("API Error:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail:
        error.response?.data?.message ||
        "Error al cargar los registros clínicos",
      life: 3000,
    });
  }

  visible.value = true;
  // Implement your view logic here
};

const onRowGroupExpand = (event) => {
  toast.add({
    severity: "info",
    summary: "Grupo Expandido",
    detail: "Paciente: " + (event.data.Patient?.name || "Unknown"),
    life: 3000,
  });
};

const onRowGroupCollapse = (event) => {
  toast.add({
    severity: "success",
    summary: "Grupo Colapsado",
    detail: "Paciente: " + (event.data.Patient?.name || "Unknown"),
    life: 3000,
  });
};

const calculateClinicalRecordsTotal = (idPatient) => {
  let total = 0;

  if (clinicalRecords.value) {
    for (let clinicalRecord of clinicalRecords.value) {
      if (clinicalRecord.idPatient === idPatient) {
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
        if (!sampleRecord.Patient?.name) {
          console.warn("Warning: Patient.name is missing in records");
        }
        if (!sampleRecord.User?.username) {
          console.warn("Warning: User.username is missing in records");
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
        "Error al cargar los registros clínicos",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchClinicalRecords();
});
</script>
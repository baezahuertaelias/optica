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

    <Dialog
      v-model:visible="visible"
      modal
      :header="`Ficha clinica ${detailClinicalRecord.id}`"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <Card>
        <template #title>Información de Paciente</template>
        <template #content>
          <FloatLabel variant="on">
            <Textarea
              id="on_label_nombre"
              v-model="detailClinicalRecord.patient.name"
              rows="5"
              cols="30"
              style="resize: none"
            />
            <label for="on_label_nombre">Nombre</label>
          </FloatLabel>

          <FloatLabel variant="on">
            <Textarea
              id="on_label_anamnsis"
              v-model="detailClinicalRecord.anamnesis"
              rows="5"
              cols="30"
              style="resize: none"
            />
            <label for="on_label_anamnsis">Anamnesis</label>
          </FloatLabel>

          <FloatLabel variant="on">
            <Textarea
              id="othersDetails"
              v-model="detailClinicalRecord.othersDetails"
              rows="5"
              cols="30"
              style="resize: none"
            />
            <label for="othersDetails">Otros Detalles</label>
          </FloatLabel>
        </template>
      </Card>

      <Card>
        <template #title>Agudeza Visual</template>
        <template #content>
          <!-- visualAcuity -->
          <InputNumber
            v-model="detailClinicalRecord.visualAcuity.withoutCorrectionLE"
            :invalid="
              detailClinicalRecord.visualAcuity.withoutCorrectionLE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="withoutCorrectionLE"
          />
          <InputNumber
            v-model="detailClinicalRecord.visualAcuity.withoutCorrectionRE"
            :invalid="
              detailClinicalRecord.visualAcuity.withoutCorrectionRE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="withoutCorrectionRE"
          />
          <InputNumber
            v-model="detailClinicalRecord.visualAcuity.withoutCorrectionBI"
            :invalid="
              detailClinicalRecord.visualAcuity.withoutCorrectionBI === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="withoutCorrectionBI"
          />

          <InputNumber
            v-model="detailClinicalRecord.visualAcuity.laserCorrectionLE"
            :invalid="
              detailClinicalRecord.visualAcuity.laserCorrectionLE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="laserCorrectionLE"
          />
          <InputNumber
            v-model="detailClinicalRecord.visualAcuity.laserCorrectionRE"
            :invalid="
              detailClinicalRecord.visualAcuity.laserCorrectionRE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="laserCorrectionRE"
          />
          <InputNumber
            v-model="detailClinicalRecord.visualAcuity.laserCorrectionBI"
            :invalid="
              detailClinicalRecord.visualAcuity.laserCorrectionBI === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="laserCorrectionBI"
          />

          <InputNumber
            v-model="detailClinicalRecord.visualAcuity.pinholeLE"
            :invalid="detailClinicalRecord.visualAcuity.pinholeLE === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="pinholeLE"
          />
          <InputNumber
            v-model="detailClinicalRecord.visualAcuity.pinholeRE"
            :invalid="detailClinicalRecord.visualAcuity.pinholeRE === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="pinholeRE"
          />
          <InputNumber
            v-model="detailClinicalRecord.visualAcuity.pinholeBI"
            :invalid="detailClinicalRecord.visualAcuity.pinholeBI === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="pinholeBI"
          />

          <InputNumber
            v-model="detailClinicalRecord.visualAcuity.pupilRedLE"
            :invalid="detailClinicalRecord.visualAcuity.pupilRedLE === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="pupilRedLE"
          />
          <InputNumber
            v-model="detailClinicalRecord.visualAcuity.pupilRedRE"
            :invalid="detailClinicalRecord.visualAcuity.pupilRedRE === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="pupilRedRE"
          />
        </template>
      </Card>

      <Card>
        <template #title>Refracción Subjetiva (Lejos)</template>
        <template #content>
          <!-- FAR -->
          <InputNumber
            v-model="detailClinicalRecord.subjectiveRefractionsFar.sphereLE"
            :invalid="
              detailClinicalRecord.subjectiveRefractionsFar.sphereLE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionsFar.sphereLE"
          />

          <InputNumber
            v-model="detailClinicalRecord.subjectiveRefractionsFar.sphereRE"
            :invalid="
              detailClinicalRecord.subjectiveRefractionsFar.sphereRE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionsFar.sphereRE"
          />

          <InputNumber
            v-model="detailClinicalRecord.subjectiveRefractionsFar.cylinderLE"
            :invalid="
              detailClinicalRecord.subjectiveRefractionsFar.cylinderLE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionsFar.cylinderLE"
          />

          <InputNumber
            v-model="detailClinicalRecord.subjectiveRefractionsFar.cylinderRE"
            :invalid="
              detailClinicalRecord.subjectiveRefractionsFar.cylinderRE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionsFar.cylinderRE"
          />

          <InputNumber
            v-model="detailClinicalRecord.subjectiveRefractionsFar.axisLE"
            :invalid="
              detailClinicalRecord.subjectiveRefractionsFar.axisLE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionsFar.axisLE"
          />

          <InputNumber
            v-model="detailClinicalRecord.subjectiveRefractionsFar.axisRE"
            :invalid="
              detailClinicalRecord.subjectiveRefractionsFar.axisRE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionsFar.axisRE"
          />

          <InputNumber
            v-model="detailClinicalRecord.subjectiveRefractionsFar.vareachedLE"
            :invalid="
              detailClinicalRecord.subjectiveRefractionsFar.vareachedLE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionsFar.vareachedLE"
          />

          <InputNumber
            v-model="detailClinicalRecord.subjectiveRefractionsFar.vareachedRE"
            :invalid="
              detailClinicalRecord.subjectiveRefractionsFar.vareachedRE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionsFar.vareachedRE"
          />

          <InputNumber
            v-model="
              detailClinicalRecord.subjectiveRefractionsFar.pupilarDistance
            "
            :invalid="
              detailClinicalRecord.subjectiveRefractionsFar.pupilarDistance ===
              null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionsFar.pupilarDistance"
          />
        </template>
      </Card>

      <Card>
        <template #title>Refracción Subjetiva (Cerca)</template>
        <template #content>
          <!-- NEAR -->
          <InputNumber
            v-model="detailClinicalRecord.subjectiveRefractionsNear.sphereLE"
            :invalid="
              detailClinicalRecord.subjectiveRefractionsNear.sphereLE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionsNear.sphereLE"
          />

          <InputNumber
            v-model="detailClinicalRecord.subjectiveRefractionsNear.sphereRE"
            :invalid="
              detailClinicalRecord.subjectiveRefractionsNear.sphereRE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionsNear.sphereRE"
          />

          <InputNumber
            v-model="detailClinicalRecord.subjectiveRefractionsNear.cylinderLE"
            :invalid="
              detailClinicalRecord.subjectiveRefractionsNear.cylinderLE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionsNear.cylinderLE"
          />

          <InputNumber
            v-model="detailClinicalRecord.subjectiveRefractionsNear.cylinderRE"
            :invalid="
              detailClinicalRecord.subjectiveRefractionsNear.cylinderRE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionsNear.cylinderRE"
          />

          <InputNumber
            v-model="detailClinicalRecord.subjectiveRefractionsNear.axisLE"
            :invalid="
              detailClinicalRecord.subjectiveRefractionsNear.axisLE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionsNear.axisLE"
          />

          <InputNumber
            v-model="detailClinicalRecord.subjectiveRefractionsNear.axisRE"
            :invalid="
              detailClinicalRecord.subjectiveRefractionsNear.axisRE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionsNear.axisRE"
          />

          <InputNumber
            v-model="detailClinicalRecord.subjectiveRefractionsNear.vareachedLE"
            :invalid="
              detailClinicalRecord.subjectiveRefractionsNear.vareachedLE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionsNear.vareachedLE"
          />

          <InputNumber
            v-model="detailClinicalRecord.subjectiveRefractionsNear.vareachedRE"
            :invalid="
              detailClinicalRecord.subjectiveRefractionsNear.vareachedRE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionsNear.vareachedRE"
          />

          <InputNumber
            v-model="
              detailClinicalRecord.subjectiveRefractionsNear.pupilarDistance
            "
            :invalid="
              detailClinicalRecord.subjectiveRefractionsNear.pupilarDistance ===
              null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionsNear.pupilarDistance"
          />
        </template>
      </Card>

      <Card>
        <template #title>Tonometría de Aplanación</template>
        <template #content>
          <InputNumber
            v-model="detailClinicalRecord.applanationTonometry.leftEye"
            :invalid="
              detailClinicalRecord.applanationTonometry.leftEye === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="ApplanationTonometry.leftEye"
          />

          <InputNumber
            v-model="detailClinicalRecord.applanationTonometry.rightEye"
            :invalid="
              detailClinicalRecord.applanationTonometry.rightEye === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="ApplanationTonometry.rightEye"
          />
        </template>
      </Card>

      <template #footer>
        <Button
          label="Cancel"
          text
          severity="secondary"
          @click="visible = false"
          autofocus
        />
        <Button
          label="Save"
          outlined
          severity="secondary"
          @click="visible = false"
          autofocus
        />
      </template>

      <div class="flex justify-end gap-2"></div>
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
import InputNumber from "primevue/inputnumber";
import IconField from "primevue/iconfield";
import Card from "primevue/card";
import FloatLabel from "primevue/floatlabel";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";

const toast = useToast();
const clinicalRecords = ref([]);
const expandedRowGroups = ref([]);
const loading = ref(true);
const visible = ref(false);
const detailClinicalRecord = ref({
  id: null,
  patientId: null,
  userId: null,
  anamnesis: null,
  othersDetails: null,
  createdAt: null,
  updatedAt: null,
  patient: {
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
    gender: {
      id: null,
      value: null,
    },
    isapre: {
      id: null,
      value: null,
    },
  },
  user: {
    id: null,
    username: null,
    password: null,
    userTypeId: null,
    status: true,
    createdAt: null,
    updatedAt: null,
    userType: {
      id: null,
      type: null,
      createdAt: null,
      updatedAt: null,
    },
  },
  visualAcuity: {
    id: null,
    clinicalRecordId: null,
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
  subjectiveRefractionsFar: {
    id: null,
    clinicalRecordId: null,
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
  subjectiveRefractionsNear: {
    id: null,
    clinicalRecordId: null,
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
  applanationTonometry: {
    id: null,
    leftEye: null,
    rightEye: null,
    dateTime: null,
    createdAt: null,
    updatedAt: null,
    clinicalRecordId: null,
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
    const response = await apiClient.get(`/clinicalRecords/${id}/with-relations`);
    if (response.status === 200) {
      console.log("[viewRecord] API Response:", response.data);
      detailClinicalRecord.value = response.data.data || {};
      visible.value = true;
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
  fetchClinicalRecords();
});
</script>
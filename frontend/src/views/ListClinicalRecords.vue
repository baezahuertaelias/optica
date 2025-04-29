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
      :header="`Ficha clinica ${detailClinicalRecord.id}`"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <Card>
        <template #title>Simple Card</template>
        <template #content>
          <FloatLabel variant="on">
            <Textarea
              id="on_label_nombre"
              v-model="detailClinicalRecord.Patient.name"
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
            <label for="othersDetails">othersDetails</label>
          </FloatLabel>
        </template>
      </Card>

      <Card>
        <template #title>Simple Card</template>
        <template #content>
          <!-- visualAcuity -->
          <InputNumber
            v-model="detailClinicalRecord.VisualAcuity.withoutCorrectionLE"
            :invalid="
              detailClinicalRecord.VisualAcuity.withoutCorrectionLE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="withoutCorrectionLE"
          />
          <InputNumber
            v-model="detailClinicalRecord.VisualAcuity.withoutCorrectionRE"
            :invalid="
              detailClinicalRecord.VisualAcuity.withoutCorrectionRE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="withoutCorrectionRE"
          />
          <InputNumber
            v-model="detailClinicalRecord.VisualAcuity.withoutCorrectionBI"
            :invalid="
              detailClinicalRecord.VisualAcuity.withoutCorrectionBI === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="withoutCorrectionBI"
          />

          <InputNumber
            v-model="detailClinicalRecord.VisualAcuity.laserCorrectionLE"
            :invalid="
              detailClinicalRecord.VisualAcuity.laserCorrectionLE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="laserCorrectionLE"
          />
          <InputNumber
            v-model="detailClinicalRecord.VisualAcuity.laserCorrectionRE"
            :invalid="
              detailClinicalRecord.VisualAcuity.laserCorrectionRE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="laserCorrectionRE"
          />
          <InputNumber
            v-model="detailClinicalRecord.VisualAcuity.laserCorrectionBI"
            :invalid="
              detailClinicalRecord.VisualAcuity.laserCorrectionBI === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="laserCorrectionBI"
          />

          <InputNumber
            v-model="detailClinicalRecord.VisualAcuity.pinholeLE"
            :invalid="detailClinicalRecord.VisualAcuity.pinholeLE === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="pinholeLE"
          />
          <InputNumber
            v-model="detailClinicalRecord.VisualAcuity.pinholeRE"
            :invalid="detailClinicalRecord.VisualAcuity.pinholeRE === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="pinholeRE"
          />
          <InputNumber
            v-model="detailClinicalRecord.VisualAcuity.pinholeBI"
            :invalid="detailClinicalRecord.VisualAcuity.pinholeBI === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="pinholeBI"
          />

          <InputNumber
            v-model="detailClinicalRecord.VisualAcuity.pupilRedLE"
            :invalid="detailClinicalRecord.VisualAcuity.pupilRedLE === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="pupilRedLE"
          />
          <InputNumber
            v-model="detailClinicalRecord.VisualAcuity.pupilRedRE"
            :invalid="detailClinicalRecord.VisualAcuity.pupilRedRE === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="pupilRedRE"
          />
        </template>
      </Card>

      <Card>
        <template #title>Simple Card</template>
        <template #content>
          <!-- FAR -->
          <InputNumber
            v-model="detailClinicalRecord.SubjectiveRefractionFar.sphereLE"
            :invalid="
              detailClinicalRecord.SubjectiveRefractionFar.sphereLE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionFar.sphereLE"
          />

          <InputNumber
            v-model="detailClinicalRecord.SubjectiveRefractionFar.sphereRE"
            :invalid="
              detailClinicalRecord.SubjectiveRefractionFar.sphereRE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionFar.sphereRE"
          />

          <InputNumber
            v-model="detailClinicalRecord.SubjectiveRefractionFar.cylinderLE"
            :invalid="
              detailClinicalRecord.SubjectiveRefractionFar.cylinderLE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionFar.cylinderLE"
          />

          <InputNumber
            v-model="detailClinicalRecord.SubjectiveRefractionFar.cylinderRE"
            :invalid="
              detailClinicalRecord.SubjectiveRefractionFar.cylinderRE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionFar.cylinderRE"
          />

          <InputNumber
            v-model="detailClinicalRecord.SubjectiveRefractionFar.axisLE"
            :invalid="
              detailClinicalRecord.SubjectiveRefractionFar.axisLE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionFar.axisLE"
          />

          <InputNumber
            v-model="detailClinicalRecord.SubjectiveRefractionFar.axisRE"
            :invalid="
              detailClinicalRecord.SubjectiveRefractionFar.axisRE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionFar.axisRE"
          />

          <InputNumber
            v-model="detailClinicalRecord.SubjectiveRefractionFar.vareachedLE"
            :invalid="
              detailClinicalRecord.SubjectiveRefractionFar.vareachedLE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionFar.vareachedLE"
          />

          <InputNumber
            v-model="detailClinicalRecord.SubjectiveRefractionFar.vareachedRE"
            :invalid="
              detailClinicalRecord.SubjectiveRefractionFar.vareachedRE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionFar.vareachedRE"
          />

          <InputNumber
            v-model="
              detailClinicalRecord.SubjectiveRefractionFar.pupilarDistance
            "
            :invalid="
              detailClinicalRecord.SubjectiveRefractionFar.pupilarDistance ===
              null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionFar.pupilarDistance"
          />

          <!-- NEAR -->

          <InputNumber
            v-model="detailClinicalRecord.SubjectiveRefractionNear.sphereLE"
            :invalid="
              detailClinicalRecord.SubjectiveRefractionNear.sphereLE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionNear.sphereLE"
          />

          <InputNumber
            v-model="detailClinicalRecord.SubjectiveRefractionNear.sphereRE"
            :invalid="
              detailClinicalRecord.SubjectiveRefractionNear.sphereRE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionNear.sphereRE"
          />

          <InputNumber
            v-model="detailClinicalRecord.SubjectiveRefractionNear.cylinderLE"
            :invalid="
              detailClinicalRecord.SubjectiveRefractionNear.cylinderLE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionNear.cylinderLE"
          />

          <InputNumber
            v-model="detailClinicalRecord.SubjectiveRefractionNear.cylinderRE"
            :invalid="
              detailClinicalRecord.SubjectiveRefractionNear.cylinderRE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionNear.cylinderRE"
          />

          <InputNumber
            v-model="detailClinicalRecord.SubjectiveRefractionNear.axisLE"
            :invalid="
              detailClinicalRecord.SubjectiveRefractionNear.axisLE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionNear.axisLE"
          />

          <InputNumber
            v-model="detailClinicalRecord.SubjectiveRefractionNear.axisRE"
            :invalid="
              detailClinicalRecord.SubjectiveRefractionNear.axisRE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionNear.axisRE"
          />

          <InputNumber
            v-model="detailClinicalRecord.SubjectiveRefractionNear.vareachedLE"
            :invalid="
              detailClinicalRecord.SubjectiveRefractionNear.vareachedLE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionNear.vareachedLE"
          />

          <InputNumber
            v-model="detailClinicalRecord.SubjectiveRefractionNear.vareachedRE"
            :invalid="
              detailClinicalRecord.SubjectiveRefractionNear.vareachedRE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionNear.vareachedRE"
          />

          <InputNumber
            v-model="
              detailClinicalRecord.SubjectiveRefractionNear.pupilarDistance
            "
            :invalid="
              detailClinicalRecord.SubjectiveRefractionNear.pupilarDistance ===
              null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="SubjectiveRefractionNear.pupilarDistance"
          />
        </template>
      </Card>

      <Card>
        <template #title>Simple Card</template>
        <template #content>
          <InputNumber
            v-model="detailClinicalRecord.ApplanationTonometry.leftEye"
            :invalid="
              detailClinicalRecord.ApplanationTonometry.leftEye === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="ApplanationTonometry.leftEye"
          />

          <InputNumber
            v-model="detailClinicalRecord.ApplanationTonometry.rightEye"
            :invalid="
              detailClinicalRecord.ApplanationTonometry.rightEye === null
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
      detailClinicalRecord.value = response.data.data || [];
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
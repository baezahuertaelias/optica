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
    >
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
    <Toast />
  </div>
</template>
  
<script setup>
import { ref, onMounted } from "vue";
import Toast from "primevue/toast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Tag from "primevue/tag";
import { useToast } from "primevue/usetoast";
import apiClient from "../axios-config";

const toast = useToast();
const clinicalRecords = ref([]);
const expandedRowGroups = ref([]);
const loading = ref(true);

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
const viewRecord = (record) => {
  console.log("Viewing record:", record);
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
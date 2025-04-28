<template>
    <div class="p-3">
      <Toast/>
      <h1>Lista de Fichas Clinicas</h1>
      <DataTable
        :value="clinicalRecords"
        :paginator="true"
        :rows="10"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 20]"
        responsiveLayout="scroll"
      >
        <Column field="Patient.name" header="Nombre del Paciente"></Column>
        <Column field="createdAt" header="Fecha de Creación"></Column>
        <Column field="User.username" header="Nombre del medico"></Column>
        <Column header="Acciones">
          <!-- <template #body="{ data }">
            <Button
              label="Ver Detalles"
              @click="viewDetails(data)"
              class="p-button-rounded p-button-secondary mr-2"
            />
          </template> -->
        </Column>
        <template #expansion="slotProps">
        <div class="p-4">
            <h5>Orders for {{ slotProps.data.name }}</h5>
            <DataTable :value="slotProps.data.orders">
                <Column field="id" header="Id" sortable></Column>
                <Column field="customer" header="Customer" sortable></Column>
                <Column field="date" header="Date" sortable></Column>
                <Column field="amount" header="Amount" sortable>
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.amount) }}
                    </template>
                </Column>
                <Column field="status" header="Status" sortable>
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.status.toLowerCase()" :severity="getOrderSeverity(slotProps.data)" />
                    </template>
                </Column>
                <Column headerStyle="width:4rem">
                    <template #body>
                        <Button icon="pi pi-search" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </template>
      </DataTable>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import Toast from "primevue/toast";
  import DataTable from "primevue/datatable";
  import Column from "primevue/column";
  import Button from "primevue/button";
  import { useToast } from 'primevue/usetoast';
  import apiClient from '../axios-config'; // Adjust the import according to your file structure
  
  const toast = useToast();
  const clinicalRecords = ref([]);
  
  const fetchClinicalRecords = async () => {
    try {
      const response = await apiClient.get("/clinicalRecords");
      if (response.status === 200) {
        
        clinicalRecords.value = response.data.patients;
      }
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: error.response.data.message || "Algo fallo",
        life: 3000,
      });
    }
  };
  
  onMounted(() => {
    fetchClinicalRecords();
  });
  </script>
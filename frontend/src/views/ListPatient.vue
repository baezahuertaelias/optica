<template>
  <div class="min-h-screen">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="mb-6 pb-4">
        <h1 class="text-3xl font-bold">Listado de pacientes</h1>
        <p class="text-gray-600 mt-1"></p>
      </div>
    </div>

    <!-- Search and filter section -->
    <div class="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div class="flex flex-wrap gap-3 mb-3">
        <span class="p-input-icon-left flex-1">
          <InputText
            v-model="filters.global.value"
            placeholder="Buscar paciente..."
            class="w-full"
          />
        </span>
        <!-- <Dropdown 
          v-model="selectedIsapre" 
          :options="isapreOptions" 
          optionLabel="label" 
          placeholder="Filtrar por Isapre" 
          class="w-48"
        /> -->
      </div>
    </div>

    <!-- Data table -->
    <div class="bg-white rounded-lg shadow-sm">
      <DataTable
        :value="filteredClients"
        :paginator="true"
        :rows="10"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 20]"
        responsiveLayout="stack"
        breakpoint="960px"
        stripedRows
        :filters="filters"
        filterDisplay="menu"
        :loading="loading"
        class="p-datatable-sm"
        v-model:selection="selectedPatients"
        dataKey="id"
      >
        <template #empty>
          <div class="text-center py-6 text-gray-500">
            No se encontraron pacientes
          </div>
        </template>
        <template #loading>
          <div class="text-center py-6">
            <i class="pi pi-spin pi-spinner text-2xl text-primary"></i>
            <div class="text-gray-500 mt-2">Cargando pacientes...</div>
          </div>
        </template>
        <!-- Removed the selection column -->
        <Column field="name" header="Nombre" sortable>
          <template #body="{ data }">
            <div class="flex items-center">
              <Avatar
                :label="getInitials(data.name)"
                shape="circle"
                size="large"
                class="mr-2"
              />
              <div>{{ data.name }}</div>
            </div>
          </template>
        </Column>
        <Column field="passport" header="RUT" sortable></Column>
        <Column field="tel" header="Teléfono">
          <template #body="{ data }">
            <div class="flex items-center">
              <i class="pi pi-phone mr-2 text-gray-500"></i>
              <span>{{ data.tel }}</span>
            </div>
          </template>
        </Column>
        <Column field="mail" header="Email">
          <template #body="{ data }">
            <div class="flex items-center">
              <i class="pi pi-envelope mr-2 text-gray-500"></i>
              <span>{{ data.mail }}</span>
            </div>
          </template>
        </Column>
        <!-- <Column field="isapre" header="Isapre" sortable>
<template #body="{ data }">
<Tag :value="data.isapre.value" :style="'background-color: '+data.isapre.color" />
</template>
</Column> -->
        <Column
          header="Acciones"
          bodyStyle="text-align:center"
          headerStyle="width: 10rem"
        >
          <template #body="{ data }">
            <div class="flex justify-center gap-2">
              <Button
                icon="pi pi-eye"
                @click="viewPatientDetails(data)"
                class="p-button-rounded p-button-info p-button-sm"
                :title="'Ver detalles'"
              />
              <Button
                icon="pi pi-pencil"
                @click="editUser(data)"
                class="p-button-rounded p-button-secondary p-button-sm"
                :title="'Editar'"
              />
              <Button
                icon="pi pi-trash"
                @click="confirmDelete(data)"
                class="p-button-rounded p-button-danger p-button-sm"
                :title="'Eliminar'"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <!-- Batch actions -->
      <div
        v-if="selectedPatients.length > 0"
        class="p-3 bg-gray-100 border-t flex justify-between items-center"
      >
        <span class="text-sm text-gray-700"
          >{{ selectedPatients.length }} pacientes seleccionados</span
        >
        <div>
          <Button
            label="Enviar Correo"
            icon="pi pi-envelope"
            class="p-button-outlined p-button-sm mr-2"
          />
          <Button
            label="Eliminar Seleccionados"
            icon="pi pi-trash"
            class="p-button-danger p-button-sm"
            @click="confirmDeleteMultiple"
          />
        </div>
      </div>
    </div>

    <!-- Patient Details Dialog -->
    <Dialog
      v-model:visible="patientDetailsDialog"
      :style="{ width: '500px' }"
      header="Detalles del Paciente"
      modal
      class="p-fluid"
    >
      <div v-if="selectedPatient" class="grid grid-cols-1 gap-4">
        <div class="flex justify-center mb-3">
          <Avatar
            :label="getInitials(selectedPatient.name)"
            size="xlarge"
            shape="circle"
          />
        </div>
        <div class="text-center mb-3">
          <h2 class="text-xl font-bold">{{ selectedPatient.name }}</h2>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="field">
            <label class="font-bold">RUT</label>
            <p>{{ selectedPatient.passport }}</p>
          </div>
          <div class="field">
            <label class="font-bold">Teléfono</label>
            <p>{{ selectedPatient.tel }}</p>
          </div>
          <div class="field col-span-2">
            <label class="font-bold">Email</label>
            <p>{{ selectedPatient.mail }}</p>
          </div>
        </div>
      </div>
      <template #footer>
        <Button
          label="Cerrar"
          icon="pi pi-times"
          @click="patientDetailsDialog = false"
          class="p-button-text"
        />
        <Button
          label="Editar"
          icon="pi pi-pencil"
          @click="editFromDetails"
          class="p-button-primary"
        />
      </template>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog
      v-model:visible="deleteUserDialog"
      :style="{ width: '450px' }"
      header="Confirmar Eliminación"
      :modal="true"
    >
      <div class="flex align-items-center justify-content-center">
        <i class="pi pi-exclamation-triangle mr-3 text-3xl text-yellow-500" />
        <span>
          ¿Está seguro de que desea eliminar este paciente?<br />
          <small class="text-gray-500">Esta acción no se puede deshacer.</small>
        </span>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          @click="deleteUserDialog = false"
          class="p-button-text"
        />
        <Button
          label="Sí, Eliminar"
          icon="pi pi-trash"
          @click="deleteUser"
          class="p-button-danger"
          autofocus
        />
      </template>
    </Dialog>

    <!-- Multiple Delete Confirmation Dialog -->
    <Dialog
      v-model:visible="deleteMultipleDialog"
      :style="{ width: '450px' }"
      header="Confirmar Eliminación Múltiple"
      :modal="true"
    >
      <div class="flex align-items-center justify-content-center">
        <i class="pi pi-exclamation-triangle mr-3 text-3xl text-yellow-500" />
        <span>
          ¿Está seguro de que desea eliminar
          {{ selectedPatients.length }} pacientes?<br />
          <small class="text-gray-500">Esta acción no se puede deshacer.</small>
        </span>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          @click="deleteMultipleDialog = false"
          class="p-button-text"
        />
        <Button
          label="Sí, Eliminar"
          icon="pi pi-trash"
          @click="deleteMultipleUsers"
          class="p-button-danger"
          autofocus
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from "vue";
import apiClient from "../axios-config";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Tag from "primevue/tag";
import Toast from "primevue/toast";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Avatar from "primevue/avatar";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
// Use built-in string value instead of importing FilterMatchMode
// This will work regardless of how PrimeVue exposes the constants

// State
const clients = ref([]);
const router = useRouter();
const toast = useToast();
const loading = ref(true);
const deleteUserDialog = ref(false);
const deleteMultipleDialog = ref(false);
const patientDetailsDialog = ref(false);
const selectedPatient = ref(null);
const selectedPatients = ref([]);
let deletePatientId = null;

// Search and filters
const filters = reactive({
  global: { value: null, matchMode: "contains" }, // Use string value directly
});
const selectedIsapre = ref(null);

// Isapre options
const isapreOptions = ref([
  { label: "Todas", value: null },
  { label: "Fonasa", value: "Fonasa" },
  { label: "Banmédica", value: "Banmédica" },
  { label: "Cruz Blanca", value: "Cruz Blanca" },
  { label: "Colmena", value: "Colmena" },
  { label: "Vida Tres", value: "Vida Tres" },
  { label: "Consalud", value: "Consalud" },
]);

// Filtered clients based on selected Isapre
const filteredClients = computed(() => {
  if (!selectedIsapre.value || !selectedIsapre.value.value) {
    return clients.value;
  }

  return clients.value.filter(
    (client) =>
      client.isapre && client.isapre.value === selectedIsapre.value.value
  );
});

// Fetch patients
const fetchClients = async () => {
  loading.value = true;
  try {
    const response = await apiClient.get("/patients");

    if (response.status === 200) {
      clients.value = response.data.patients;
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.response?.data?.message || "Algo falló al cargar pacientes",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

// Navigation functions
const navigateToCreatePatient = () => {
  router.push({ name: "Crear paciente" });
};

const editUser = (user_) => {
  router.push({ name: "Crear paciente", params: { id: user_.id } });
};

const editFromDetails = () => {
  if (selectedPatient.value) {
    patientDetailsDialog.value = false;
    router.push({
      name: "Crear paciente",
      params: { id: selectedPatient.value.id },
    });
  }
};

// Delete functions
const confirmDelete = (patient) => {
  deletePatientId = patient.id;
  deleteUserDialog.value = true;
};

const confirmDeleteMultiple = () => {
  if (selectedPatients.value.length > 0) {
    deleteMultipleDialog.value = true;
  }
};

const deleteUser = async () => {
  try {
    const response = await apiClient.delete(`/patients/${deletePatientId}`);
    if (response.status === 200) {
      toast.add({
        severity: "success",
        summary: "Éxito",
        detail: "Paciente eliminado correctamente",
        life: 3000,
      });
      // Refresh the patient list after successful deletion
      fetchClients();
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail:
        error.response?.data?.message || "No se pudo eliminar el paciente",
      life: 3000,
    });
  } finally {
    deleteUserDialog.value = false;
  }
};

const deleteMultipleUsers = async () => {
  try {
    const patientIds = selectedPatients.value.map((patient) => patient.id);
    // Implement the API call to delete multiple patients
    // This is a placeholder - you'll need to create the actual endpoint
    const response = await apiClient.post("/patients/delete-multiple", {
      ids: patientIds,
    });

    if (response.status === 200) {
      toast.add({
        severity: "success",
        summary: "Éxito",
        detail: `${patientIds.length} pacientes eliminados correctamente`,
        life: 3000,
      });
      selectedPatients.value = [];
      fetchClients();
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail:
        error.response?.data?.message ||
        "No se pudieron eliminar los pacientes",
      life: 3000,
    });
  } finally {
    deleteMultipleDialog.value = false;
  }
};

// View patient details
const viewPatientDetails = (patient) => {
  selectedPatient.value = patient;
  patientDetailsDialog.value = true;
};

// Utility functions
const getInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

const getIsapreSeverity = (isapre) => {
  const map = {
    Fonasa: "info",
    Banmédica: "success",
    "Cruz Blanca": "warning",
    Colmena: "primary",
    "Vida Tres": "secondary",
    Consalud: "help",
  };
  return map[isapre] || "secondary";
};

// Fetch patients on component mount
onMounted(() => {
  fetchClients();
});
</script>

<style scoped>
:deep(.p-datatable-wrapper) {
  overflow-x: auto;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  transition: background-color 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f1f5f9;
}

:deep(.p-tag) {
  font-size: 0.75rem;
  font-weight: 600;
}

:deep(.p-button-sm) {
  padding: 0.4rem;
}

:deep(.p-avatar) {
  background-color: #64748b;
  color: #fff;
}

:deep(.p-dialog .p-dialog-header) {
  border-bottom: 1px solid #e2e8f0;
}

:deep(.p-dialog .p-dialog-footer) {
  border-top: 1px solid #e2e8f0;
  padding: 1rem;
}

.field p {
  margin: 0.5rem 0;
  padding: 0.5rem;
  background-color: #f8fafc;
  border-radius: 4px;
}
</style>

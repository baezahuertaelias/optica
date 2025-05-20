<template>
  <div class="min-h-screen">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="mb-6 pb-4">
        <h1 class="text-3xl font-bold">Listado de usuarios</h1>
        <p class="text-gray-600 mt-1"></p>
      </div>
    </div>

    <div
      class="mb-3 flex flex-column sm:flex-row gap-3 justify-content-between"
    >
      <div class="p-input-icon-left w-full sm:w-auto">
        <InputText
          v-model="globalFilterValue"
          placeholder="Buscar..."
          class="w-full"
          @input="onGlobalFilterChange"
        />
      </div>
      <div class="flex gap-2">
        <Dropdown
          v-model="selectedStatus"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Estado"
          @change="applyFilters"
        />
        <Dropdown
          v-model="selectedType"
          :options="typeOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Tipo"
          @change="applyFilters"
        />
      </div>
    </div>

    <DataTable
      :value="filteredUsers"
      :paginator="true"
      :rows="10"
      stripedRows
      :loading="loading"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      responsiveLayout="stack"
      breakpoint="960px"
      dataKey="id"
      class="p-datatable-sm"
      :rowHover="true"
      :rowClass="rowClass"
      emptyMessage="No se encontraron usuarios"
    >
      <template #empty>
        <div class="text-center p-4">
          <i class="pi pi-search text-3xl text-gray-300"></i>
          <p class="mt-2 text-gray-500">
            No se encontraron usuarios que coincidan con la búsqueda
          </p>
        </div>
      </template>

      <template #loading>
        <div class="text-center p-4">
          <i class="pi pi-spin pi-spinner text-3xl text-gray-300"></i>
          <p class="mt-2 text-gray-500">Cargando usuarios...</p>
        </div>
      </template>

      <Column field="name" header="Nombre" sortable>
        <template #body="{ data }">
          <div class="font-medium">{{ data.name }}</div>
        </template>
      </Column>

      <Column field="username" header="Nombre de usuario" sortable>
        <template #body="{ data }">
          <div class="text-gray-700">{{ data.username }}</div>
        </template>
      </Column>

      <Column field="status" header="Estado" sortable>
        <template #body="{ data }">
          <Tag
            :value="data.status === true ? 'Activo' : 'Inactivo'"
            :severity="data.status === true ? 'success' : 'danger'"
            class="text-xs"
          />
        </template>
      </Column>

      <Column field="typeUser.type" header="Tipo usuario" sortable>
        <template #body="{ data }">
          <Tag
            :value="data.typeUser.value"
            :style="'background-color: ' + data.typeUser.color"
          />
        </template>
      </Column>

      <Column header="Acciones" :exportable="false" style="min-width: 12rem">
        <template #body="{ data }">
          <div class="flex flex-wrap gap-2 justify-content-center">
            <Button
              icon="pi pi-pencil"
              @click="editUser(data)"
              class="p-button-rounded p-button-outlined p-button-secondary p-button-sm"
              label="Editar"
            />
            <Button
              icon="pi pi-trash"
              @click="confirmDelete(data)"
              class="p-button-rounded p-button-outlined p-button-danger p-button-sm"
              label="Eliminar"
            />
            <Button
              icon="pi pi-lock"
              @click="resetPassword(data)"
              class="p-button-rounded p-button-outlined p-button-info p-button-sm"
              label="Resetear contraseña"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Confirmation Dialog for Delete -->
    <Dialog
      v-model:visible="deleteUserDialog"
      :style="{ width: '450px' }"
      header="Confirmar eliminación"
      :modal="true"
      :closable="false"
      class="p-dialog-delete"
    >
      <div class="flex align-items-center justify-content-center">
        <i class="pi pi-exclamation-triangle mr-3 text-3xl text-yellow-500" />
        <span>
          ¿Está seguro de que desea eliminar el usuario
          <b>{{ userToDelete?.name }}</b
          >?
          <br />
          <small class="text-gray-500">Esta acción no se puede deshacer.</small>
        </span>
      </div>

      <template #footer>
        <Button
          label="Cancelar"
          icon="pi pi-times"
          @click="closeDeleteDialog"
          class="p-button-text"
          :disabled="deleteLoading"
        />
        <Button
          label="Eliminar"
          icon="pi pi-trash"
          @click="deleteUser"
          class="p-button-danger"
          :loading="deleteLoading"
          autofocus
        />
      </template>
    </Dialog>

    <!-- Password Reset Dialog -->
    <Dialog
      v-model:visible="resetPasswordDialog"
      :style="{ width: '450px' }"
      header="Restablecer contraseña"
      :modal="true"
      :closable="false"
    >
      <div class="mb-4">
        <p>
          Ingrese una nueva contraseña para el usuario
          <b>{{ userToReset?.name }}</b
          >:
        </p>
      </div>
      <div class="field">
        <label for="newPassword" class="block mb-1 font-medium"
          >Nueva contraseña</label
        >
        <Password
          id="newPassword"
          v-model="newPassword"
          toggleMask
          :feedback="true"
          required
          class="w-full"
        />
      </div>

      <template #footer>
        <Button
          label="Cancelar"
          icon="pi pi-times"
          @click="closeResetDialog"
          class="p-button-text"
          :disabled="resetLoading"
        />
        <Button
          label="Guardar"
          icon="pi pi-check"
          @click="saveNewPassword"
          class="p-button-primary"
          :loading="resetLoading"
          autofocus
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Tag from "primevue/tag";
import Toast from "primevue/toast";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Password from "primevue/password";
import apiClient from "../axios-config";

// State to hold the list of users
const users = ref([]);
const router = useRouter();
const toast = useToast();
const loading = ref(false);
const deleteLoading = ref(false);
const resetLoading = ref(false);

const filters = ref({
  global: { value: null, matchMode: "contains" },
});
const globalFilterValue = ref("");

const selectedStatus = ref(null);
const selectedType = ref(null);
const filteredUsers = ref([]);

// Status filter options
const statusOptions = ref([
  { label: "Todos los estados", value: null },
  { label: "Activos", value: true },
  { label: "Inactivos", value: false },
]);

// Type filter options (will be populated from the API)
const typeOptions = ref([{ label: "Todos los tipos", value: null }]);

// Dialog states
const deleteUserDialog = ref(false);
const resetPasswordDialog = ref(false);
const userToDelete = ref(null);
const userToReset = ref(null);
const newPassword = ref("");

// Function to fetch users
const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await apiClient.get("/users");
    if (response.status === 200) {
      users.value = response.data.users;
      filteredUsers.value = [...response.data.users];

      // Extract unique user types for filter dropdown
      const uniqueTypes = [
        ...new Set(
          response.data.users.map((user) => ({
            id: user.typeUser.id,
            value: user.typeUser.value,
          }))
        ),
      ];

      console.log("uniqueTypes", uniqueTypes);

      typeOptions.value = [
        { label: "Todos los tipos", value: null }, // Changed from "admin" to null for "all types"
        ...uniqueTypes.map((type) => ({
          label: type.value,
          value: type.value,
        })),
      ];

      console.log("aaaaatype", typeOptions.value);
    }
  } catch (error) {
    console.error(error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail:
        error.response?.data?.message || "No se pudieron cargar los usuarios",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

// Navigation to create user page
const createUser = () => {
  router.push({ name: "Crear usuario" });
};

// Edit user navigation
const editUser = (user) => {
  router.push({ name: "Crear usuario", params: { id: user.id } });
};

// Delete confirmation
const confirmDelete = (user) => {
  userToDelete.value = user;
  deleteUserDialog.value = true;
};

// Reset password dialog
const resetPassword = (user) => {
  userToReset.value = user;
  newPassword.value = "";
  resetPasswordDialog.value = true;
};

// Close dialogs
const closeDeleteDialog = () => {
  deleteUserDialog.value = false;
  userToDelete.value = null;
};

const closeResetDialog = () => {
  resetPasswordDialog.value = false;
  userToReset.value = null;
  newPassword.value = "";
};

// Complete the deleteUser method
const deleteUser = async () => {
  if (!userToDelete.value) return;

  deleteLoading.value = true;
  try {
    const response = await apiClient.delete(`/users/${userToDelete.value.id}`);
    if (response.status === 200) {
      toast.add({
        severity: "success",
        summary: "Éxito",
        detail: "Usuario eliminado correctamente",
        life: 3000,
      });
      // Refresh the user list after successful deletion
      fetchUsers();
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.response?.data?.message || "No se pudo eliminar el usuario",
      life: 3000,
    });
  } finally {
    deleteLoading.value = false;
    closeDeleteDialog();
  }
};

// Save new password
const saveNewPassword = async () => {
  if (!userToReset.value || !newPassword.value) {
    toast.add({
      severity: "warn",
      summary: "Validación",
      detail: "Por favor ingrese una contraseña",
      life: 3000,
    });
    return;
  }

  resetLoading.value = true;
  try {
    const response = await apiClient.put(
      `/users/${userToReset.value.id}/reset-password`,
      {
        password: newPassword.value,
      }
    );

    if (response.status === 200) {
      toast.add({
        severity: "success",
        summary: "Éxito",
        detail: "Contraseña restablecida correctamente",
        life: 3000,
      });
      closeResetDialog();
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail:
        error.response?.data?.message || "No se pudo restablecer la contraseña",
      life: 3000,
    });
  } finally {
    resetLoading.value = false;
  }
};

// Filter methods
const onGlobalFilterChange = () => {
  filters.value.global.value = globalFilterValue.value;
  applyFilters();
};

const applyFilters = () => {
  console.log("aca entra");

  let result = [...users.value];

  console.log({ result });

  // Apply global filter
  if (filters.value.global.value) {
    const searchTerm = filters.value.global.value.toLowerCase();
    console.log("b");

    result = result.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm) ||
        user.typeUser.value.toLowerCase().includes(searchTerm)
    );
  }
  // Apply status filter
  if (selectedStatus.value !== null) {
    console.log("c");

    result = result.filter((user) => user.status === selectedStatus.value);
  }
  // Apply type filter
  if (selectedType.value !== null) {
    console.log("D select", selectedType.value);
    console.log("D result", result);

    result = result.filter(
      (user) => user.typeUser.value === selectedType.value
    );

    console.log("D result2", result);
  }
  filteredUsers.value = result;
};

// Get the severity class for user types
const getSeverityForUserType = (type) => {
  switch (type.toLowerCase()) {
    case "admin":
      return "primary";
    case "administrador":
      return "primary";
    case "vendedor":
      return "info";
    case "supervisor":
      return "warning";
    default:
      return "secondary";
  }
};

// Row class based on user status
const rowClass = (data) => {
  return {
    "opacity-60": !data.status,
  };
};

onMounted(() => {
  fetchUsers();
});
</script>

<style>
.p-datatable .p-datatable-thead > tr > th {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
}

.p-datatable.p-datatable-sm .p-datatable-header {
  padding: 0.5rem;
}

.p-datatable.p-datatable-sm .p-datatable-thead > tr > th {
  padding: 0.5rem 0.5rem;
}

.p-datatable.p-datatable-sm .p-datatable-tbody > tr > td {
  padding: 0.5rem 0.5rem;
}

.p-datatable .p-datatable-tbody > tr:nth-child(even) {
  background-color: #f8f9fa;
}

.p-dialog-delete .p-dialog-content {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
</style>

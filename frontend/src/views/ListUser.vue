<template>
  <div class="p-3">
    <Toast />
    <h1>Lista de Usuarios</h1>
    <DataTable
      :value="users"
      :paginator="true"
      :rows="10"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 20]"
      responsiveLayout="scroll"
    >
      <Column field="username" header="Username"></Column>
      <Column field="status" header="Estado">
        <template #body="{ data }">
          <Tag
            :value="data.status === true ? 'Activo' : 'Inactivo'"
            :severity="data.status === true ? 'success' : 'danger'"
          />
        </template>
      </Column>
      <Column field="typeUserId" header="Tipo usuario">
        <template #body="{ data }">
          <Tag :value="data.UserType.type" />
        </template>
      </Column>
      <Column header="Actions">
        <template #body="{ data }">
          <Button
            label="Edit"
            @click="editUser(data)"
            class="p-button-rounded p-button-secondary mr-2"
          />
          <Button
            label="Delete"
            @click="confirmDelete(data)"
            class="p-button-rounded p-button-danger"
          />
        </template>
      </Column>
    </DataTable>

    <!-- Confirmation Dialog -->
    <Dialog
      :visible="deleteUserDialog"
      :style="{ width: '300px' }"
      header="Confirmación"
      :modal="true"
    >
      <p>¿Está seguro de que desea eliminar el usuario?</p>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          @click="deleteUserDialog = false"
          class="p-button-text"
        />
        <Button
          label="Sí"
          icon="pi pi-check"
          @click="deleteUser(deleteUserId)"
          class="p-button-text"
          autofocus
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Tag from "primevue/tag";
import Toast from "primevue/toast";
import Dialog from "primevue/dialog";
import apiClient from "../axios-config";

// State to hold the list of users
const users = ref([]);
const router = useRouter();
const toast = useToast();

// Confirmation dialog state
const deleteUserDialog = ref(false);
let deleteUserId;

// Function to fetch users
const fetchUsers = async () => {
  try {
    const response = await apiClient.get("/users");

    if (response.status === 200) {
      users.value = response.data.users;
    }
  } catch (error) {
    console.error(error);

    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.response.data.message || "Algo fallo",
      life: 3000,
    });
  }
};

const editUser = async (user_) => {
  try {
    console.log("enviando", user_.id);

    router.push({ name: "Crear usuario", params: { id: user_.id } });
  } catch (error) {
    console.log("edit error", error);
  }
};

// Confirm delete
const confirmDelete = (user) => {
  deleteUserId = user.id;
  deleteUserDialog.value = true;
};

// Complete the deleteUser method
const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/users/${userId}`);
    if (response.status === 200) {
      toast.add({
        severity: "success",
        summary: "Exito",
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
      detail: error.response.data.message || "No se pudo eliminar el usuario",
      life: 3000,
    });
  } finally {
    deleteUserDialog.value = false;
  }
};

const getSeverity = (status) => {
  switch (status) {
    case "Admin":
      return "info";

    case "Vendedor":
      return "warn";

    case "true":
      return "success";

    case "false":
      return "danger";
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.page-container {
  padding: 1rem;
}

.card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.field {
  margin-bottom: 1rem;
}

.w-100 {
  width: 100%;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}
</style>
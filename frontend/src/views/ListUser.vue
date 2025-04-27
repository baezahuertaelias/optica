<template>
  <div class="p-3">
    <Toast/>
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
          <Tag
            :value="data.userType.type"
            :severity="getSeverity(data.userType.type)"
          />
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
            @click="deleteUser(data)"
            class="p-button-rounded p-button-danger"
          />
        </template>
      </Column>
    </DataTable>
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
import apiClient from "../axios-config";

// State to hold the list of users
const users = ref([]);
const router = useRouter();
const toast = useToast();
// Function to fetch users
const fetchUsers = async () => {
  try {
    const response = await apiClient.get("/users");

    if (response.status === 200) {
      users.value = response.data.users;
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.response.data.message || "Algo fallo",
      life: 3000,
    });
  }
  console.log("value", users.value);
};

const editUser = async (user_) => {
  try {
    router.push({ name: "Crear usuario", params: { id: user_.id } });
  } catch (error) {
    console.log("edit error", error);
  }
};

const deleteUser = async () => {
  try {
    console.log("has to delete");
  } catch (error) {
    console.log("deleteuser error");
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

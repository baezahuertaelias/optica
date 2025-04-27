<template>
  <div class="p-3">
    <Toast />
    <h1>Lista de pacientes</h1>
    <DataTable
      :value="clients"
      :paginator="true"
      :rows="10"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 20]"
      responsiveLayout="scroll"
    >
      <Column field="name" header="Nombre"></Column>
      <Column field="tel" header="Telefono"></Column>
      <Column field="mail" header="Email"></Column>
      <Column field="isapre" header="Isapre">
        <template #body="{ data }">
          <Tag severity="secondary" :value="data.isapre.value"></Tag>
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
import { ref } from "vue";
import apiClient from "../axios-config";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Tag from "primevue/tag";
import { useRouter } from "vue-router";
import Toast from "primevue/toast";

// State to hold the list of users
const clients = ref([]);
const router = useRouter();
const toast = useToast();

// Function to fetch users
const fetchClients = async () => {
  try {
    const response = await apiClient.get("/patients");

    if (response.status === 200) {
      clients.value = response.data.patients;
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

const editUser = async (user_) => {
  try {
    router.push({ name: "Crear paciente", params: { id: user_.id } });
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

// Fetch users on component mount
import { onMounted } from "vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
onMounted(() => {
  fetchClients();
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
  
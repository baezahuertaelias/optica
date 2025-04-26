<template>
  <div class="p-3">
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
      <Column field="status" header="Estado"></Column>
      <Column field="typeUserId" header="Tipo usuario"></Column>
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
import { ref } from 'vue'
import apiClient from '../axios-config'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'

// State to hold the list of users
const users = ref([]);
const router = useRouter()

// Function to fetch users
const fetchUsers = async () => {
  try {
    const response = await apiClient.get("/users");

    if (response.status === 200) {
      users.value = response.data.users;
    }
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
  console.log('value', users.value) 
};

const editUser = async(user_) => {
  try {
    
    router.push({ name: 'Crear usuario', params: { id: user_.id } });
  } catch (error) {
    console.log('edit error', error);
    
  }
};

const deleteUser = async() => {
    try {
        console.log('has to delete')
    }catch (error){
        console.log('deleteuser error')
    }
}

// Fetch users on component mount
import { onMounted } from "vue";
onMounted(() => {
    console.log('ON MOUNTED')
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

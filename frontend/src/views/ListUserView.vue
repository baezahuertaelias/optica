<template>
  <div class="p-3">
    <h1>Lista de Usuarios</h1>
    <DataTable :value="users" :paginator="true" :rows="10" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 20]" responsiveLayout="scroll">
      <Column field="username" header="Username"></Column>
      <Column field="email" header="Email"></Column>
      <Column header="Actions">
        <template #body="{ data }">
          <Button label="Edit" @click="editUser(data)" class="p-button-rounded p-button-secondary mr-2"/>
          <Button label="Delete" @click="deleteUser(data)" class="p-button-rounded p-button-danger"/>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import apiClient from '../axios-config' // Import the configured axios instance
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

// State to hold the list of users
const users = ref([])

// Function to fetch users
const fetchUsers = async () => {
  try {
    const response = await apiClient.get('/auth/users')

    if (response.status === 200) {
      users.value = response.data // Update the state with the fetched users
    }
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

// Fetch users on component mount
import { onMounted } from 'vue'
onMounted(() => {
  fetchUsers()
})

const editUser = (user) => {
  // Logic to navigate to the Edit User form with user data
}

const deleteUser = async (user) => {
  try {
    const response = await apiClient.delete(`/auth/users/${user.id}`)

    if (response.status === 200) {
      fetchUsers() // Refresh the list after deletion
    }
  } catch (error) {
    console.error('Failed to delete user:', error)
  }
}
</script>

<style scoped>
/* Add any specific styles for this page here */
</style>

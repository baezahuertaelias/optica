<template>
  <div class="p-3">
    <h1>Lista de Usuarios</h1>
    <ul v-if="users.length > 0">
      <li v-for="user in users" :key="user.id">{{ user.username }} - {{ user.email }}</li>
    </ul>
    <div v-else>No hay usuarios disponibles.</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import apiClient from '../axios-config' // Import the configured axios instance

// State to hold the list of users
const users = ref([])

// Function to fetch users
const fetchUsers = async () => {
  try {
    const response = await apiClient.get('/auth/users')

    if (response.status === 200) {
      users.value = response.data.users // Update the state with the fetched users
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
</script>

<style scoped>
/* Add any specific styles for this page here */
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 5px 0;
}
</style>

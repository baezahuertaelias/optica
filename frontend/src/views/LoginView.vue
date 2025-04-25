<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth' // Import the specific store
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import apiClient from '../axios-config'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false);

// Use the useToast hook to create a toast object
const toast = useToast()

const login = async () => {
  try {
    loading.value = true;
    const response = await apiClient.post('/auth/login', {
      username: username.value,
      password: password.value,
    })

    if (response.status === 200) {
      // Assuming the backend returns a token and user information
      const { token, user } = response.data

      // Store token in localStorage
      localStorage.setItem('token', token)

      // Set user information in auth store
      authStore.setUser(user)

      // Redirect to main page
      router.push({ name: 'main' })
    } else {
      // Show error message using toast when the response is not 200
      showErrorMessage(response.data.message || 'Login failed')

    }

  } catch (error) {
    console.error('Login failed:', error)
    // Show generic error message using toast if an exception occurs
    showErrorMessage(error.response?.data.message || 'An error occurred during login.')
  }
  loading.value = false;
}

const showErrorMessage = (message) => {
  toast.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 })
}
</script>

<template>
  <div class="p-3">
    <h1>Login</h1>
    <Toast />
    <div>
      <label for="username">Username:</label>
      <InputText id="username" v-model="username" />
    </div>
    <div>
      <label for="password">Password:</label>
      <Password id="password" v-model="password" toggleMask feedback="false" />
    </div>
    <Button label="Login" @click="login" class="mt-3" :loading="loading"/>
  </div>
</template>

<style scoped>
/* Add any specific styles for this page here */
</style>

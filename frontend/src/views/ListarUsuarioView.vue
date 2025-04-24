<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth' // Import the specific store
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')

const login = async () => {
  try {
    //TODO ARREGLAR EL URL BASE
    console.log(import.meta.env.VITE_URL_BACKEND)

    const response = await axios.post(import.meta.env.VITE_URL_BACKEND + '/auth/login', {
      username: username.value,
      password: password.value,
    })

    if (response.status === 200) {
      // Assuming the backend returns a token or sets session storage upon successful login
      authStore.setUser(response.data.user)
      router.push({ name: 'main' }) // Redirect to the AboutView after successful login
    }
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>

<template>
  <div class="p-3">
    <h1>Login</h1>
    <div>
      <label for="username">Username:</label>
      <InputText id="username" v-model="username" />
    </div>
    <div>
      <label for="password">Password:</label>
      <Password id="password" v-model="password" toggleMask feedback="false" />
    </div>
    <Button label="Login" @click="login" class="mt-3" />
  </div>
</template>

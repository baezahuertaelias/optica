<template>
  <div class="p-3">
    <h1>{{ isNew ? 'Crear Usuario' : 'Modificar Usuario' }}</h1>
    <form @submit.prevent="saveUser">
      <InputText v-model="user.username" placeholder="Username" required />
      <InputText v-model="user.email" placeholder="Email" required />
      <Password v-model="user.password" placeholder="Password" v-if="isNew" required />
      <Button label="Guardar" class="mt-3" />
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import apiClient from '../axios-config'

const router = useRouter()
const route = useRoute()

// State to hold user data
const user = ref({
  username: '',
  email: '',
  password: ''
})

const isNew = ref(true)

onMounted(() => {
  const userId = route.params.id
  if (userId) {
    isNew.value = false
    fetchUser(userId)
  }
})

const fetchUser = async (id) => {
  try {
    const response = await apiClient.get(`/auth/users/${id}`)

    if (response.status === 200) {
      user.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch user:', error)
  }
}

const saveUser = async () => {
  try {
    const userData = { ...user.value }

    // Hash the password before saving if it's a new user or password is changed
    if (isNew.value || user.value.password) {
      userData.password = await bcrypt.hash(user.value.password, 10)
    } else {
      delete userData.password // Remove password field for update if not changed
    }

    if (isNew.value) {
      const response = await apiClient.post('/auth/users', userData)

      if (response.status === 201) {
        router.push({ name: 'listUser' })
      }
    } else {
      const response = await apiClient.put(`/auth/users/${user.value.id}`, userData)

      if (response.status === 200) {
        router.push({ name: 'listUser' })
      }
    }
  } catch (error) {
    console.error('Failed to save user:', error)
  }
}
</script>

<style scoped>
/* Add any specific styles for this page here */
</style>

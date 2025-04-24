<template>
  <div class="crear-usuario">
    <h1>Crear Usuario</h1>
    <form @submit.prevent="createUser">
      <div>
        <label for="username">Username:</label>
        <InputText id="username" v-model="username" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <InputText type="password" id="password" v-model="password" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <InputText type="email" id="email" v-model="email" required />
      </div>
      <Button label="Crear Usuario" type="submit" class="mt-3" />
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const username = ref('')
const password = ref('')
const email = ref('')

const createUser = async () => {
  try {
    const response = await axios.post('/api/user/create', {
      username: username.value,
      password: password.value,
      email: email.value,
    })
    console.log(response.data)
  } catch (error) {
    console.error('Error creating user:', error)
  }
}
</script>

<style scoped>
/* Add any specific styles for this page here */
.crear-usuario {
  margin: 20px;
}
</style>

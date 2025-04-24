<template>
  <div class="create-patient">
    <h1>Crear paciente</h1>
    <form @submit.prevent="createPatient">
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
      <Button label="Crear paciente" type="submit" class="mt-3" />
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

const createPatient = async () => {
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
.create-patient {
  margin: 20px;
}
</style>

<!-- src/views/Login.vue -->
<template>
  <div class="login-container">
    <Toast/>
    <div class="login-card">
      <h2>Iniciar sesion</h2>
      <div class="field">
        <label for="username">Usuario</label>
        <InputText id="username" v-model="username" class="w-100" />
      </div>
      <div class="field">
        <label for="password">Clave</label>
        <Password id="password" v-model="password" toggleMask class="w-100" />
      </div>
      <div class="field">
        <Button label="Login" @click="login" class="w-100" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Toast from 'primevue/toast';

//nuevos
import apiClient from '../axios-config'

const router = useRouter()
const toast = useToast();
const username = ref('')
const password = ref('')

const login = async () => {

  await localStorage.setItem('token', '');

  try {
    const response = await apiClient.post('/auth/login', {
      username: username.value,
      password: password.value,
    })

    if (response.status === 200) {
      // Assuming the backend returns a token and user information
      const { token } = response.data

      // Store token in localStorage
      await localStorage.setItem('isLoggedIn', 'true')
      await localStorage.setItem('username', username.value)
      await localStorage.setItem('token', token);
      

      // Redirect to main page
      router.push('/app/dashboard')
    } else {
      // Show error message using toast when the response is not 200
      //showErrorMessage(response.data.message || 'Login failed')
      toast.add({ severity: 'error', summary: 'Error', detail: response.data.message || 'Login fallo', life: 3000 });
    }
  } catch (error) {
    
    toast.add({ severity: 'error', summary: 'Error', detail: error.response.data.message || 'Login fallo', life: 3000 });
  }


}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f5f5f5;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.field {
  margin-bottom: 1.5rem;
}

.w-100 {
  width: 100%;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
</style>

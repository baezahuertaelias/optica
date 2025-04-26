<!-- src/views/Login.vue -->
<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Login</h2>
      <div class="field">
        <label for="username">Username</label>
        <InputText id="username" v-model="username" class="w-100" />
      </div>
      <div class="field">
        <label for="password">Password</label>
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
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

//nuevos
import apiClient from '../axios-config'

const router = useRouter()
const username = ref('')
const password = ref('')

const login = async () => {
  // Simple login without actual authentication
  /* if (username.value && password.value) {
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('username', username.value)
    router.push('/app/dashboard')
  } */
  try {
    const response = await apiClient.post('/auth/login', {
      username: username.value,
      password: password.value,
    })

    if (response.status === 200) {
      // Assuming the backend returns a token and user information
      const { token, user } = response.data

      // Store token in localStorage
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', username.value)

      // Redirect to main page
      router.push('/app/dashboard')
    } else {
      // Show error message using toast when the response is not 200
      //showErrorMessage(response.data.message || 'Login failed')
      alert('login malo')
    }
  } catch (error) {
    console.log('[Login] error', error);
    
    alert('login error')
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

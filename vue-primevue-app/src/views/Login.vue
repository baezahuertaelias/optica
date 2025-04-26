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

<script>
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

export default {
  name: 'Login',
  components: {
    InputText,
    Password,
    Button
  },
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login() {
      // Simple login without actual authentication
      if (this.username && this.password) {
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('username', this.username)
        this.$router.push('/app/dashboard')
      }
    }
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

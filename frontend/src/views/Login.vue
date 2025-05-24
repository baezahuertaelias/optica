<template>
  <div class="login-container">
    <Toast />
    <div class="login-wrapper">
      <!-- Background decoration -->
      <div class="bg-decoration"></div>
      
      <div class="login-card">
        <form @submit.prevent="login" class="login-form">
          <!-- Logo and Header -->
          <div class="header-section">
            <div class="logo-container">
              <img 
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%234F46E5;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%237C3AED;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='45' fill='url(%23grad1)'/%3E%3Cpath d='M30 35 Q50 20 70 35 Q50 50 30 35' fill='white' opacity='0.9'/%3E%3Cpath d='M30 65 Q50 50 70 65 Q50 80 30 65' fill='white' opacity='0.7'/%3E%3Ccircle cx='50' cy='50' r='8' fill='white'/%3E%3C/svg%3E" 
                alt="Optica Logo" 
                class="logo"
              />
            </div>
            <h1 class="app-title">Optica</h1>
            <p class="welcome-text">Bienvenido de vuelta</p>
          </div>

          <!-- Form Fields -->
          <div class="form-fields">
            <div class="field-group">
              <FloatLabel variant="on">
                <InputText
                  id="username"
                  v-model.trim="username"
                  class="modern-input"
                  aria-label="Username"
                />
                <label for="username" class="modern-label">
                  <i class="pi pi-user"></i>
                  Nombre de usuario
                </label>
              </FloatLabel>
            </div>

            <div class="field-group">
              <FloatLabel variant="on">
                <Password
                  id="password"
                  v-model.trim="password"
                  toggleMask
                  :class="{ 'p-error': 'invalidLogin' }"
                  aria-label="Password"
                  @keyup.enter="login"
                  :feedback="false"
                />
                <label for="password" class="modern-label">
                  <i class="pi pi-lock"></i>
                  Contraseña
                </label>
              </FloatLabel>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-section">
            <Button
              v-if="!loading"
              label="Iniciar sesión"
              @click="login"
              icon="pi pi-sign-in"
              class="login-button"
              data-cy="login-button"
            />
            
            <Button
              v-if="loading"
              label="Iniciando sesión..."
              icon="pi pi-spin pi-spinner"
              class="login-button loading"
              disabled
            />
          </div>

          <!-- Footer -->
          <!--c<div class="form-footer">
            <p class="footer-text">¿Olvidaste tu contraseña?</p>
          </div>-->
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import Toast from "primevue/toast";
import FloatLabel from "primevue/floatlabel";
import apiClient from "../axios-config";

const router = useRouter();
const toast = useToast();
const username = ref("");
const password = ref("");
const loading = ref(false);

const login = async () => {
  if (!username.value || !password.value) {
    toast.add({
      severity: "warn",
      summary: "Advertencia",
      detail: "Por favor, completa todos los campos",
      life: 3000,
    });
    return;
  }

  loading.value = true;

  // Clear previous data
  await localStorage.setItem("token", "");
  await localStorage.setItem("username", "");
  await localStorage.setItem("iduser", "");

  try {
    const response = await apiClient.post("/auth/login", {
      username: username.value,
      password: password.value,
    });

    if (response.status === 200) {
      const { token, user } = response.data;

      // Store token in localStorage
      await localStorage.setItem("isLoggedIn", "true");
      await localStorage.setItem("username", username.value);
      await localStorage.setItem("token", token);
      await localStorage.setItem("iduser", user.id);

      toast.add({
        severity: "success",
        summary: "Éxito",
        detail: "Inicio de sesión exitoso",
        life: 2000,
      });

      // Redirect to main page
      setTimeout(() => {
        router.push("/app/dashboard");
      }, 1000);
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: response.data.message || "Login falló",
        life: 3000,
      });
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.response?.data?.message || "Login falló",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.login-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 420px;
  padding: 2rem;
}

.bg-decoration {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%);
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.login-form {
  padding: 3rem 2.5rem;
}

.header-section {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo-container {
  margin-bottom: 1rem;
}

.logo {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  display: block;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.app-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #4F46E5, #7C3AED);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-text {
  color: #6B7280;
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
}

.form-fields {
  margin-bottom: 2rem;
}

.field-group {
  margin-bottom: 1.5rem;
}

.modern-input {
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 2px solid #E5E7EB;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #F9FAFB;
}

.modern-input:focus {
  border-color: #4F46E5;
  background: white;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  outline: none;
}

.modern-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.modern-label i {
  color: #6B7280;
}

.action-section {
  margin-bottom: 1.5rem;
}

.login-button {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #4F46E5, #7C3AED);
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
  background: linear-gradient(135deg, #3730A3, #6D28D9);
}

.login-button.loading {
  background: #9CA3AF;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.form-footer {
  text-align: center;
}

.footer-text {
  color: #6B7280;
  font-size: 0.9rem;
  margin: 0;
  cursor: pointer;
  transition: color 0.3s ease;
}

.footer-text:hover {
  color: #4F46E5;
}

/* PrimeVue component overrides */
:deep(.p-card-body) {
  padding: 0;
}

:deep(.p-float-label > label) {
  left: 1.5rem;
  color: #6B7280;
  transition: all 0.3s ease;
}

:deep(.p-float-label .p-inputtext:focus ~ label),
:deep(.p-float-label .p-inputtext.p-filled ~ label) {
  top: -0.75rem;
  font-size: 0.875rem;
  color: #4F46E5;
  background: white;
  padding: 0 0.5rem;
}

:deep(.p-password .p-inputtext) {
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 2px solid #E5E7EB;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #F9FAFB;
}

:deep(.p-password .p-inputtext:focus) {
  border-color: #4F46E5;
  background: white;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

:deep(.p-password-toggle-mask) {
  color: #6B7280;
  right: 1.5rem;
}

:deep(.p-toast) {
  z-index: 9999;
}

/* Responsive design */
@media (max-width: 480px) {
  .login-wrapper {
    padding: 1rem;
  }
  
  .login-form {
    padding: 2rem 1.5rem;
  }
  
  .app-title {
    font-size: 2rem;
  }
  
  .logo {
    width: 60px;
    height: 60px;
  }
}
</style>
<template>
  <div class="login-container">
    <Toast />
    <Card class="shadow-xl">
      <form @submit.prevent="login" class="p-6">
        <h2 class="text-xl font-bold mb-5">Optica</h2>
        <FloatLabel variant="on">
          <InputText
            id="username"
            v-model.trim="username"
            class="w-full p-input text-sm"
            aria-label="Username"
          />
          <label for="password">Nombre de usuario</label>
        </FloatLabel>
        <FloatLabel  class="mt-4" variant="on">
          <Password
            id="password"
            v-model.trim="password"
            toggleMask
            class="w-full  p-password-text text-sm"
            :class="{ 'p-error': 'invalidLogin' }"
            aria-label="Password"
            @keyup.enter="login"
            :feedback="false"
          />
          <label for="password">Contraseña</label>
        </FloatLabel>

        <Button
          label="Iniciar sesion"
          @click="login"
          icon="pi pi-sign-in"
          class="w-full p-button-login mt-6"
          data-cy="login-button"
        />

        <!-- Optional: Add loading state -->
        <Button
          v-if="loading"
          icon="pi pi-spin-pi pi-spinner"
          aria-label="Loading..."
          disabled
        />
      </form>
    </Card>
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

//nuevos
import apiClient from "../axios-config";
import FloatLabel from "primevue/floatlabel";

const router = useRouter();
const toast = useToast();
const username = ref("");
const password = ref("");

const login = async () => {
  await localStorage.setItem("token", "");
  await localStorage.setItem("username", "");
  await localStorage.setItem("iduser", "");

  try {
    const response = await apiClient.post("/auth/login", {
      username: username.value,
      password: password.value,
    });

    if (response.status === 200) {
      // Assuming the backend returns a token and user information
      const { token, user } = response.data;

      // Store token in localStorage
      await localStorage.setItem("isLoggedIn", "true");
      await localStorage.setItem("username", username.value);
      await localStorage.setItem("token", token);
      await localStorage.setItem("iduser", user.id);

      // Redirect to main page
      router.push("/app/dashboard");
    } else {
      // Show error message using toast when the response is not 200
      //showErrorMessage(response.data.message || 'Login failed')
      toast.add({
        severity: "error",
        summary: "Error",
        detail: response.data.message || "Login fallo",
        life: 3000,
      });
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.response.data.message || "Login fallo",
      life: 3000,
    });
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 8px;
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

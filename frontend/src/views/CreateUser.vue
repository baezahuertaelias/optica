<template>
  <div class="min-h-screen">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="mb-6 pb-4">
        <h1 class="text-3xl font-bold">
          {{ isNew ? "Crear Usuario" : "Modificar Usuario" }}
        </h1>
        <p class="text-gray-600 mt-1">
          {{
            isNew
              ? "Ingrese la información para crear un usuario nuevo"
              : "Actualice la información del usuario existente"
          }}
        </p>
      </div>

      <form @submit.prevent="saveUser" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="field">
            <label for="username" class="block mb-1 font-medium text-gray-700"
              >Usuario</label
            >
            <InputText
              id="username"
              v-model="user.username"
              class="w-full p-inputtext-sm"
              placeholder="Ingrese nombre de usuario"
              :class="{ 'p-invalid': submitted && !user.username }"
              required
            />
            <small v-if="submitted && !user.username" class="p-error"
              >El nombre de usuario es requerido</small
            >
          </div>

          <div class="field">
            <label for="name" class="block mb-1 font-medium text-gray-700"
              >Nombre Completo</label
            >
            <InputText
              id="name"
              v-model="user.name"
              class="w-full p-inputtext-sm"
              placeholder="Ingrese nombre completo"
              :class="{ 'p-invalid': submitted && !user.name }"
              required
            />
            <small v-if="submitted && !user.name" class="p-error"
              >El nombre es requerido</small
            >
          </div>

          <div class="field">
            <label for="password" class="block mb-1 font-medium text-gray-700"
              >Contraseña</label
            >
            <Password
              id="password"
              v-model="user.password"
              class="w-full"
              :feedback="isNew"
              :toggleMask="true"
              :class="{ 'p-invalid': submitted && isNew && !user.password }"
              placeholder="Ingrese contraseña"
              :required="isNew"
              fluid
            />
            <small v-if="!isNew" class="text-gray-500 text-xs"
              >Deje en blanco para mantener la contraseña actual</small
            >
            <small v-if="submitted && isNew && !user.password" class="p-error"
              >La contraseña es requerida</small
            >
          </div>

          <div class="field">
            <label for="typeUser" class="">Tipo de Usuario</label>
            <Dropdown
              id="typeUser"
              v-model="user.typeUserId"
              :options="typeUsers"
              optionLabel="value"
              optionValue="id"
              placeholder="Seleccione un tipo"
              class="w-full"
              :class="{ 'p-invalid': submitted && !user.typeUserId }"
              required
            />
            <small v-if="submitted && !user.typeUserId" class="p-error"
              >El tipo de usuario es requerido</small
            >
          </div>
        </div>

        <div class="field flex align-items-center mt-4">
          <div class="mt-3 mr-2 font-medium text-gray-700">
            Estado del usuario:
          </div>
          <ToggleButton
            v-model="user.status"
            onLabel="Activo"
            offLabel="Inactivo"
            onIcon="pi pi-check"
            offIcon="pi pi-times"
            class=""
          />
        </div>

        <div class="flex justify-between mt-6">
          <Button
            type="button"
            label="Cancelar"
            class="p-button-outlined p-button-secondary"
            icon="pi pi-times"
            @click="goBack"
          />
          <Button
            type="submit"
            label="Guardar"
            icon="pi pi-save"
            class="p-button-primary"
            :loading="loading"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import ToggleButton from "primevue/togglebutton";
import Toast from "primevue/toast";
import apiClient from "../axios-config";

const router = useRouter();
const route = useRoute();
const toast = useToast();

// State to hold user data
const user = ref({
  username: "",
  password: "",
  name: "",
  typeUserId: null,
  status: true,
});

const isNew = ref(true);
const typeUsers = ref([]);
const loading = ref(false);
const submitted = ref(false);

onMounted(() => {
  const userId = route.query.id || route.params.id;

  if (userId) {
    isNew.value = false;
    fetchUser(userId);
  }
  fetchTypeUsers();
});

const fetchUser = async (id) => {
  loading.value = true;
  try {
    const response = await apiClient.get(`/users/${id}`);

    if (response.status === 200) {
      console.log(`fetchUser with ID=${id}`, response.data.user);
      // Clear password for security
      response.data.user.password = "";
      user.value = response.data.user;
    }
  } catch (error) {
    console.error("Failed to fetch user:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No se pudo cargar la información del usuario",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const fetchTypeUsers = async () => {
  try {
    const response = await apiClient.get("users/types/typeusers");

    if (response.status === 200) {
      typeUsers.value = response.data.typeUsers;
    }
  } catch (error) {
    console.error("Failed to fetch user types:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No se pudo cargar los tipos de usuario",
      life: 3000,
    });
  }
};

const saveUser = async () => {
  try {
    submitted.value = true;

    // Form validation
    if (
      !user.value.username ||
      !user.value.name ||
      !user.value.typeUserId ||
      (isNew.value && !user.value.password)
    ) {
      toast.add({
        severity: "warn",
        summary: "Validación",
        detail: "Por favor complete todos los campos requeridos",
        life: 3000,
      });
      return;
    }

    loading.value = true;
    const userData = { ...user.value };

    let response;
    if (isNew.value) {
      response = await apiClient.post("/users", userData);
    } else {
      response = await apiClient.put(`/users/${user.value.id}`, userData);
    }

    if (response.status === 200 || response.status === 201) {
      toast.add({
        severity: "success",
        summary: "Éxito",
        detail: isNew.value
          ? "Usuario creado correctamente"
          : "Usuario actualizado correctamente",
        life: 3000,
      });
      router.push("/app/listUser");
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail:
        error.response?.data?.message ||
        "Ocurrió un error al guardar los datos",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};


const goBack = () => {
  router.push("/app/listUser");
};
</script>

<style scoped>
.page-container {
  padding: 1rem;
}

.card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.field {
  margin-bottom: 1rem;
}

.w-100 {
  width: 100%;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}
</style>

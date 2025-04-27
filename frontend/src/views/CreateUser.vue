<template>
  <div class="p-3">
    <h1>{{ isNew ? "Crear Usuario" : "Modificar Usuario" }}</h1>
    <form @submit.prevent="saveUser">
      <InputText v-model="user.username" placeholder="Username" required />
      <Password v-model="user.password" placeholder="Password" />
      <Dropdown
        v-model="user.userTypeId"
        :options="userTypes"
        optionLabel="type"
        optionValue="id"
        placeholder="Select User Type"
        required
      />
      <ToggleSwitch v-model="user.status" />
      <Button label="Guardar" class="mt-3" type="submit" />
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import ToggleSwitch from "primevue/toggleswitch";
import apiClient from "../axios-config";

const router = useRouter();
const route = useRoute();

// State to hold user data
const user = ref({
  username: "",
  password: "",
  userTypeId: null,
  status: true,
});

const isNew = ref(true);
const userTypes = ref([]);


onMounted(() => {
  const userId = route.query.id || route.params.id; // Use query or params to get the ID
  console.log("onmounted userid", userId);

  if (userId) {
    isNew.value = false;
    fetchUser(userId);
  }
  fetchUserTypes();
});

const fetchUser = async (id) => {
  try {
    const response = await apiClient.get(`/users/${id}`);

    if (response.status === 200) {
      console.log(`fetchUser with ID=${id}`, response.data.user);

      response.data.user.password = "";

      user.value = response.data.user;
    }
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
};

const fetchUserTypes = async () => {
  try {
    const response = await apiClient.get("users/types/usertypes");

    if (response.status === 200) {
      userTypes.value = response.data.userTypes;
    }
  } catch (error) {
    console.error("Failed to fetch user types:", error);
  }
};

const saveUser = async () => {
  try {
    const userData = { ...user.value };

    

    //TODO: Tomar la respuesta cuando es status=400 y mostrar msj error
    //basarse en el login. quedo resuelto

    if (!isNew && userData.password.length < 8) {
      alert("passwd debe ser mayor a 8");
      return null;
    }
    if (!isNew && userData.userTypeId === null) {
      alert("elegir tipo de usuario");
      return null;
    }

    let response;
    if (isNew.value) {
      response = await apiClient.post("/users", userData);
    } else {
      response = await apiClient.put(`/users/${user.value.id}`, userData);
    }

    if (response.status === 200 || response.status === 201) {
      router.push({ name: "Listado usuarios" });
    }
  } catch (error) {
    console.error("Failed to save user:", error);
  }
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
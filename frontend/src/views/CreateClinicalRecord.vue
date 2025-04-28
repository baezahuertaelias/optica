
<template>
    <div class="p-3">
      <Toast/>
      <h1>Crear Nueva Ficha Clínica</h1>
      <form @submit.prevent="createClinicalRecord">
        <div class="mb-3">
          <label for="patient" class="form-label">Paciente:</label>
          <Dropdown v-model="selectedPatient" :options="patients" optionLabel="name" optionValue="id" @change="loadUserOptions"/>
        </div>
        <div class="mb-3">
          <label for="user" class="form-label">Usuario:</label>
          <Dropdown v-model="selectedUser" :options="users" optionLabel="username" optionValue="id"/>
        </div>
        <!-- Add more fields as necessary -->
        <button type="submit" class="btn btn-primary">Crear Ficha Clínica</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import Tag from "primevue/tag";

  import apiClient from '../axios-config.js'; // Adjust the import according to your file structure
  
  const toast = useToast();
  const patients = ref([]);
  const users = ref([]);
  const selectedPatient = ref(null);
  const selectedUser = ref(null);
  
  const loadUserOptions = async () => {
    try {
      if (selectedPatient.value) {
        const response = await apiClient.get(`/patients/${selectedPatient.value}/users`);
        users.value = response.data;
      } else {
        users.value = [];
      }
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: error.response.data.message || "Algo fallo",
        life: 3000,
      });
    }
  };
  
  const createClinicalRecord = async () => {
    try {
      const recordData = {
        patientId: selectedPatient.value,
        userId: selectedUser.value,
        // Add other required fields here...
      };
      await apiClient.post('/clinical-records', recordData);
      toast.add({
        severity: "success",
        summary: "Éxito",
        detail: "Ficha Clínica Creada Exitosamente",
        life: 3000,
      });
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: error.response.data.message || "Algo fallo",
        life: 3000,
      });
    }
  };
  
  const fetchPatients = async () => {
    try {
      const response = await apiClient.get('/patients');
      patients.value = response.data;
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: error.response.data.message || "Algo fallo",
        life: 3000,
      });
    }
  };
  
  onMounted(() => {
    fetchPatients();
  });
  </script>
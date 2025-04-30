<template>
  <div class="p-3">
    <h1>{{ isNew ? "Crear Paciente" : "Modificar Paciente" }}</h1>
    <form @submit.prevent="savePatient">
      <InputText v-model="patient.name" placeholder="Nombre" required />
      <InputText v-model="patient.passport" placeholder="Pasaporte" />
      <Dropdown
        v-model="patient.genderId"
        :options="genders"
        optionLabel="value"
        optionValue="id"
        placeholder="Sexo"
        required
      />
      <InputText v-model="patient.tel" placeholder="Telefono" />
      <InputText v-model="patient.homeAddress" placeholder="Direccion" />
      <InputText v-model="patient.mail" placeholder="Email" />
      <InputText v-model="patient.occupation" placeholder="Ocupacion" />
      <InputText
        v-model="patient.legalrepresentative"
        placeholder="Representante legal"
      />
      <Dropdown
        v-model="patient.idIsapre"
        :options="isapres"
        optionLabel="value"
        optionValue="id"
        placeholder="Isapre"
        required
      />

      <FloatLabel variant="on">
        <DatePicker
          v-model="patient.birthday"
          inputId="on_label"
          showIcon
          iconDisplay="input"
          dateFormat="dd/mm/yy"
        />
        <label for="on_label">Fecha nacimiento</label>
      </FloatLabel>
      <Button label="Guardar" class="mt-3" type="submit" />
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import DatePicker from "primevue/datepicker";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import apiClient from "../axios-config";

const router = useRouter();
const route = useRoute();

// State to hold patient data
const patient = ref({
  name: "",
  passport: "",
  genderId: "",
  birthday: "",
  homeAddress: "",
  mail: "",
  occupation: "",
  legalrepresentative: "",
  idIsapre: "",
  // Add other fields as needed
});

const isNew = ref(true);
const genders = ref([]);
const isapres = ref([]);

onMounted(async () => {
  const patientId = route.query.id || route.params.id; // Use query or params to get the ID
  if (patientId) {
    isNew.value = false;
    fetchPatientDetails(patientId);
  }
  await fetchGenders();
  await fetchIsapres();
});

const fetchPatientDetails = async (id) => {
  try {
    const response = await apiClient.get(`/patients/${id}`);
    if (response.status === 200) {
      console.log("[fetchPatientDetails]", response.data);

      patient.value = response.data.patient;
    }
  } catch (error) {
    console.error("Error fetching patient details:", error);
  }
};

const savePatient = async () => {
  const patientData = { ...patient.value };
  console.log("[savePatient]", patientData);

  try {
    if (isNew.value) {
      await apiClient.post("/patients", patient.value);
    } else {
      await apiClient.put(`/patients/${patient.value.id}`, patient.value);
    }
    router.push("/app/listPatient");
  } catch (error) {
    console.error("Error saving patient:", error);
  }
};

const fetchIsapres = async () => {
  try {
    const response = await apiClient.get("patients/isapres");
    console.log("[fetchIsapres]", response.data);

    if (response.status === 200) {
      isapres.value = response.data.isapres;
    }
  } catch (error) {
    console.error("Failed to fetch user types:", error);
  }
};

const fetchGenders = async () => {
  try {
    const response = await apiClient.get("patients/genders");
    console.log("[fetchGenders]", response.data.genders);

    if (response.status === 200) {
      genders.value = response.data.genders;
    }
  } catch (error) {
    console.error("Failed to fetch user types:", error);
  }
};
</script>
<template>
  <div class="min-h-screen">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="">
        <h1 class="text-3xl font-bold">
          {{ isNew ? "Crear Paciente" : "Modificar Paciente" }}
        </h1>
        <p class="text-gray-600 mt-1">
          {{
            isNew
              ? "Ingrese la información del paciente para crear un nuevo paciente"
              : "Actualice la información del paciente existente"
          }}
        </p>
      </div>
    </div>

    <form @submit.prevent="savePatient" class="p-fluid">
      <div class="">
        <div class="shadow-2 card p-3 mb-3 mt-5">
          <h2 class="text-lg font-medium mb-3">Información Personal</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field">
              <label for="name">Nombre Completo*</label>
              <InputText
                id="name"
                v-model.trim="patient.name"
                class="w-full"
                aria-describedby="name-error"
              />
            </div>

            <div class="field">
              <label for="gender">Sexo*</label>
              <Dropdown
                id="gender"
                v-model="patient.genderId"
                :options="genders"
                optionLabel="value"
                optionValue="id"
                class="w-full"
                aria-describedby="gender-error"
              />
            </div>

            <div class="field">
              <label for="country">Pais</label>
              <Dropdown
                id="country"
                v-model="patient.countryId"
                :options="countries"
                optionLabel="name"
                optionValue="id"
                class="w-full"
                aria-describedby="country-error"
              />
            </div>

            <!-- Updated template code for the passport/RUT input field -->
            <div class="field">
              <label for="passport">Pasaporte / DNI</label>
              <InputText
                class="w-full"
                id="passport"
                placeholder="12345678-9"
                v-model.trim="patient.passport"
                @input="formatRut"
                @blur="validateRut"
                :class="{
                  'p-invalid': submitted && !isValidRut && patient.passport,
                }"
              />
              <small
                v-if="submitted && !isValidRut && patient.passport"
                class="p-error"
              >
                RUT no válido. Verifique el formato y dígito verificador.
              </small>
              <small
                v-else-if="isValidRut && patient.passport"
                class="p-success"
              >
                RUT válido
              </small>
            </div>

            <div class="field">
              <label for="birthday">Fecha de Nacimiento*</label>
              <Calendar
                id="birthday"
                v-model="patient.birthday"
                :showIcon="true"
                dateFormat="dd/mm/yy"
                class="w-full"
                aria-describedby="birthday-error"
              />
            </div>
          </div>
        </div>

        <div class="p-card p-3 mb-3">
          <h2 class="text-lg font-medium mb-3">Información de Contacto</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field">
              <label for="tel">Teléfono</label>
              <InputText
                id="tel"
                v-model.trim="patient.tel"
                keyfilter="int"
                class="w-full"
              />
            </div>

            <div class="field">
              <label for="mail">Correo Electrónico</label>
              <InputText
                id="mail"
                v-model.trim="patient.mail"
                class="w-full"
                aria-describedby="email-error"
              />
            </div>

            <div class="field">
              <label for="homeAddress">Dirección</label>
              <InputText
                id="homeAddress"
                v-model.trim="patient.homeAddress"
                class="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="p-card p-3 mb-3">
        <h2 class="text-lg font-medium mb-3">Información Adicional</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="field">
            <label for="occupation">Ocupación</label>
            <InputText
              id="occupation"
              class="w-full"
              v-model.trim="patient.occupation"
            />
          </div>

          <!-- <div class="field">
            <label for="isapre">Isapre / Seguro Médico*</label>
            <Dropdown
              id="isapre"
              v-model="patient.isapreId"
              :options="isapres"
              optionLabel="value"
              optionValue="id"
              class="w-full"
              aria-describedby="isapre-error"
            />
          </div> -->

          <div class="field">
            <label for="legalRepresentative">Tutor (Adulto responsable)</label>
            <InputText
              id="legalRepresentative"
              v-model.trim="patient.legalRepresentative"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-content-end gap-2 mt-4">
        <Button
          type="button"
          label="Cancelar"
          class="p-button-outlined"
          @click="router.push('/app/listPatient')"
        />
        <Button
          type="submit"
          label="Guardar"
          icon="pi pi-save"
          :loading="loading"
        />
      </div>
    </form>
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar";
import Button from "primevue/button";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import apiClient from "../axios-config";
import FloatLabel from "primevue/floatlabel";

const router = useRouter();
const route = useRoute();
const toast = useToast();
const loading = ref(false);
const submitted = ref(false);

// State to hold patient data
const patient = ref({
  name: "",
  passport: "",
  genderId: "",
  birthday: null,
  tel: "",
  homeAddress: "",
  mail: "",
  occupation: "",
  legalRepresentative: "",
  /* isapreId: "", */
  countryId: "",
});

const isNew = ref(true);
const genders = ref([]);
/* const isapres = ref([]); */
const countries = ref([]);
const isValidRut = ref(false);

onMounted(async () => {
  try {
    // Load reference data
    await Promise.all([
      fetchGenders() /* fetchIsapres() */,
      ,
      fetchCountries(),
    ]);

    // Check if we're editing an existing patient
    const patientId = route.query.id || route.params.id;
    if (patientId) {
      isNew.value = false;
      await fetchPatientDetails(patientId);
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Hubo un problema al cargar los datos",
      life: 3000,
    });
  }
});

const fetchPatientDetails = async (id) => {
  loading.value = true;
  try {
    const response = await apiClient.get(`/patients/${id}`);
    if (response.status === 200) {
      patient.value = response.data.patient;

      // Convert string date to Date object if needed
      if (typeof patient.value.birthday === "string") {
        patient.value.birthday = new Date(patient.value.birthday);
      }
    }
  } catch (error) {
    console.error("Error fetching patient details:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No se pudo obtener los datos del paciente",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const savePatient = async () => {
  submitted.value = true;
  loading.value = true;
  try {
    const patientData = { ...patient.value };

    if (isNew.value) {
      await apiClient.post("/patients", patientData);
      toast.add({
        severity: "success",
        summary: "Éxito",
        detail: "Paciente creado correctamente",
        life: 3000,
      });
    } else {
      await apiClient.put(`/patients/${patientData.id}`, patientData);
      toast.add({
        severity: "success",
        summary: "Éxito",
        detail: "Paciente actualizado correctamente",
        life: 3000,
      });
    }

    router.push("/app/listPatient");
  } catch (error) {
    console.error("Error saving patient:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail:
        error.response?.data?.message ||
        "Ocurrió un error al guardar el paciente",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

/* const fetchIsapres = async () => {
  try {
    const response = await apiClient.get("patients/isapres");
    if (response.status === 200) {
      isapres.value = response.data.isapres;
    }
  } catch (error) {
    console.error("Failed to fetch isapres:", error);
  }
}; */

const fetchGenders = async () => {
  try {
    const response = await apiClient.get("patients/genders");
    if (response.status === 200) {
      genders.value = response.data.genders;
    }
  } catch (error) {
    console.error("Failed to fetch genders:", error);
  }
};

const fetchCountries = async () => {
  try {
    const response = await apiClient.get("patients/countries");
    if (response.status === 200) {
      countries.value = response.data.countries;
    }
  } catch (error) {
    console.error("Failed to fetch genders:", error);
  }
};

/**
 * Format RUT as the user types (XX.XXX.XXX-X)
 */
const formatRut = (event) => {
  let value = event.target.value;

  // Remove all non-alphanumeric characters
  value = value.replace(/[^0-9kK]/g, "");

  if (value.length > 1) {
    // Insert dash before the verification digit
    const body = value.slice(0, -1);
    const dv = value.slice(-1);
    value = body + "-" + dv;

    // Add thousand separators if desired (optional)
    // Uncomment the next line to format with dots as thousand separators
    // value = body.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + '-' + dv;
  }

  // Correct the way we're updating the passport value
  patient.value.passport = value;

  // Optional: validate on input for immediate feedback
  validateRut();
};

/**
 * Calculate the expected verification digit for a given RUT
 */
const calculateDv = (rutBody) => {
  const reversed = rutBody.split("").reverse().join("");
  let sum = 0;
  let multiplier = 0;

  for (let i = 0; i < reversed.length; i++) {
    multiplier = (i % 6) + 2;
    sum += parseInt(reversed.charAt(i)) * multiplier;
  }

  const remainder = sum % 11;
  const dv = 11 - remainder;

  if (dv === 11) return "0";
  if (dv === 10) return "K";
  return dv.toString();
};

/**
 * Validate the RUT using the verification digit
 */
const validateRut = () => {
  if (!patient.value.passport) {
    isValidRut.value = false;
    return;
  }

  // Clean the RUT string (remove dots and dash)
  const cleanRut = patient.value.passport.replace(/[.-]/g, "");

  // RUT should have at least 2 characters (1 digit and verification digit)
  if (cleanRut.length < 2) {
    isValidRut.value = false;
    return;
  }

  // Extract body and verification digit
  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1).toUpperCase();

  // Calculate expected verification digit and compare
  const expectedDv = calculateDv(body);
  isValidRut.value = dv === expectedDv;
};
</script>

<style scoped>
.card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>

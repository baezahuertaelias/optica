<template>
  <div class="min-h-screen">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="mb-6 pb-4">
        <h1 class="text-3xl font-bold">
          {{ isNew ? "Crear Ficha Clínica" : "Modificar Ficha Clínica" }}
        </h1>
        <p class="text-gray-600 mt-1">
          {{ isNew ? "Ingrese la información del paciente para crear una nueva ficha clínica" : "Actualice la información de la ficha clínica existente" }}
        </p>
      </div>

      <form @submit.prevent="saveClinicalRecord" class="space-y-6">

        <Card class="shadow-sm">
          <template #title>
            <div class="flex items-center">
              <i class="pi pi-user mr-2"></i>
              <span class="text-xl font-semibold">Información del Paciente</span>
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-1 gap-6">
              <!-- Patient Selection -->
              <div>
                <label for="patient" class="block text-sm font-medium text-gray-700 mb-1">Paciente *</label>
                <Dropdown
                  id="patient"
                  v-model="clinicalRecord.patientId"
                  :options="patients"
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Seleccione un paciente"
                  class="w-full"
                  :class="{'p-invalid': submitted && !clinicalRecord.patientId}"
                />
                <small v-if="submitted && !clinicalRecord.patientId" class="p-error">El paciente es requerido.</small>
              </div>
              
              <!-- Anamnesis -->
              <div>
                <label for="anamnesis" class="block text-sm font-medium text-gray-700 mb-1">Anamnesis</label>
                <Textarea
                  id="anamnesis"
                  v-model="clinicalRecord.anamnesis"
                  rows="4"
                  autoResize
                  class="w-full"
                  placeholder="Ingrese la anamnesis del paciente"
                />
              </div>
              
              <!-- Other Details -->
              <div>
                <label for="othersDetails" class="block text-sm font-medium text-gray-700 mb-1">Otros Detalles</label>
                <Textarea
                  id="othersDetails"
                  v-model="clinicalRecord.othersDetails"
                  rows="4"
                  autoResize
                  class="w-full"
                  placeholder="Ingrese otros detalles relevantes"
                />
              </div>
            </div>
          </template>
        </Card>


        <!-- Visual Acuity Section using the component -->
        <VisualAcuity v-model="clinicalRecord.visualAcuity" />
        
        <!-- Subjective Refraction Section using the component -->
        <SubjectiveRefraction
          v-model:subjectiveRefractionFar="clinicalRecord.subjectiveRefractionFar"
          v-model:subjectiveRefractionNear="clinicalRecord.subjectiveRefractionNear"
          v-model:diagnosis="clinicalRecord.diagnosis"
        />
        
        <!-- Tonometry Section -->
        <Card class="shadow-sm">
          <template #title>
            <div class="flex items-center">
              <i class="pi pi-chart-line mr-2"></i>
              <span class="text-xl font-semibold">Tonometría Aplanática</span>
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Ojo Derecho (OD)</label>
                <InputNumber
                  v-model="clinicalRecord.applanationTonometry.rightEye"
                  mode="decimal"
                  :minFractionDigits="0"
                  :maxFractionDigits="0"
                  locale="en-US"
                  class="w-full"
                  placeholder="OD"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Ojo Izquierdo (OI)</label>
                <InputNumber
                  v-model="clinicalRecord.applanationTonometry.leftEye"
                  mode="decimal"
                  :minFractionDigits="0"
                  :maxFractionDigits="0"
                  locale="en-US"
                  class="w-full"
                  placeholder="OI"
                />
              </div>
            </div>
          </template>
        </Card>

        <!-- Diagnosis Section -->
        <Card class="shadow-sm">
          <template #title>
            <div class="flex items-center">
              <i class="pi pi-file-o mr-2"></i>
              <span class="text-xl font-semibold">Diagnóstico Final</span>
            </div>
          </template>
          <template #content>
            <div>
              <label for="finalDiagnosis" class="block text-sm font-medium text-gray-700 mb-1">Diagnóstico</label>
              <Textarea
                id="finalDiagnosis"
                v-model="clinicalRecord.finalDiagnosis"
                rows="4"
                autoResize
                class="w-full"
                placeholder="Ingrese el diagnóstico del paciente"
              />
            </div>
          </template>
        </Card>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-3">
          <Button 
            label="Cancelar" 
            icon="pi pi-times" 
            class="p-button-secondary" 
            @click="router.push('/app/listClinicalRecord')" 
          />
          <Button 
            label="Guardar" 
            icon="pi pi-save" 
            type="submit" 
            class="p-button-primary" 
          />
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import InputNumber from "primevue/inputnumber"
import Card from "primevue/card";
import Button from "primevue/button"
import Textarea from "primevue/textarea"
import Dropdown from "primevue/dropdown"
import apiClient from "../axios-config";
import VisualAcuity from "../components/clinicalRecord/VisualAcuity.vue";
import SubjectiveRefraction from "../components/clinicalRecord/SubjetiveRefraction.vue";

const router = useRouter();
const route = useRoute();

// Form submission state
const submitted = ref(false);

// State to hold clinical record data
const clinicalRecord = ref({
  patientId: null,
  userId: parseInt(localStorage.getItem("iduser")),
  anamnesis: null,
  othersDetails: null,
  diagnosis: {
    conditions: []
  },
  finalDiagnosis: null,
  visualAcuity: {
    withoutCorrectionLE: null,
    withoutCorrectionRE: null,
    withoutCorrectionBI: null,
    laserCorrectionLE: null,
    laserCorrectionRE: null,
    laserCorrectionBI: null,
    pinholeLE: null,
    pinholeRE: null,
    pinholeBI: null,
    pupilRedLE: null,
    pupilRedRE: null,
  },
  subjectiveRefractionFar: {
    sphereLE: null,
    sphereRE: null,
    cylinderLE: null,
    cylinderRE: null,
    axisLE: null,
    axisRE: null,
    vareachedLE: null,
    vareachedRE: null,
    pupilarDistance: null,
  },
  subjectiveRefractionNear: {
    sphereLE: null,
    sphereRE: null,
    cylinderLE: null,
    cylinderRE: null,
    axisLE: null,
    axisRE: null,
    vareachedLE: null,
    vareachedRE: null,
    pupilarDistance: null,
    add: null,
  },
  applanationTonometry: {
    leftEye: null,
    rightEye: null,
  },
});

const isNew = ref(true);
const patients = ref([]);

onMounted(async () => {
  const patientId = route.query.id || route.params.id; // Use query or params to get the ID
  if (patientId) {
    isNew.value = false;
    fetchClinicalRecordDetails(patientId);
  }
  fetchPatients();
});

const fetchClinicalRecordDetails = async (id) => {
  try {
    const response = await apiClient.get(`/clinicalRecords/${id}`);
    if (response.status === 200) {
      console.log("[fetchClinicalRecordDetails]", response.data);
      clinicalRecord.value = response.data.clinicalRecord;
    }
  } catch (error) {
    console.error("Error fetching clinical record details:", error);
  }
};

const saveClinicalRecord = async () => {
  submitted.value = true;
  
  // Validate required fields
  if (!clinicalRecord.value.patientId) {
    return;
  }
  
  try {
    if (isNew.value) {
      await apiClient.post("/clinicalRecords", clinicalRecord.value);
    } else {
      await apiClient.put(
        `/clinicalRecords/${clinicalRecord.value.id}`,
        clinicalRecord.value
      );
    }
    router.push("/app/listClinicalRecord");
  } catch (error) {
    console.error("Error saving clinical record:", error);
  }
};

const fetchPatients = async () => {
  try {
    const response = await apiClient.get("clinicalRecords/patients/name");
    if (response.status === 200) {
      console.log("[fetchPatients]", response.data.patients);
      patients.value = response.data.patients;
    }
  } catch (error) {
    console.error("Failed to fetch patients:", error);
  }
};
</script>

<style scoped>
/* Additional custom styles can be added here */
:deep(.p-dropdown) {
  width: 100%;
}

:deep(.p-card) {
  border-radius: 0.5rem;
}

:deep(.p-tabview .p-tabview-nav) {
  border-bottom: 2px solid #e2e8f0;
}

:deep(.p-tabview .p-tabview-nav li .p-tabview-nav-link) {
  border: none;
  color: #64748b;
  padding: 1rem 1.5rem;
}

:deep(.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link) {
  color: #3b82f6;
  border-bottom: 2px solid #3b82f6;
}
</style>
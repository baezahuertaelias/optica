<template>
  <div class="min-h-screen">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="mb-6 pb-4">
        <h1 class="text-3xl font-bold">
          {{ isNew ? "Crear Ficha Clínica" : "Modificar Ficha Clínica" }}
        </h1>
        <p class="text-gray-600 mt-1">
          {{
            isNew
              ? "Ingrese la información del paciente para crear una nueva ficha clínica"
              : "Actualice la información de la ficha clínica existente"
          }}
        </p>
      </div>

      <form @submit.prevent="saveClinicalRecord" class="space-y-6">
        <PatientInfo
          :clinicalRecord="clinicalRecord"
          :submitted="submitted"
          :patients="patients"
        />

        <VisualAcuity
          :modelValue="clinicalRecord.visualAcuity"
          @update:modelValue="clinicalRecord.visualAcuity = $event"
          :submitted="submitted"
        />

        <SubjectiveRefraction
          v-model:subjectiveRefractionFar="
            clinicalRecord.subjectiveRefractionFar
          "
          v-model:subjectiveRefractionNear="
            clinicalRecord.subjectiveRefractionNear
          "
          v-model:diagnosis="clinicalRecord.diagnosis"
          :submitted="submitted"
        />

        <!-- Tonometry Component -->
        <Tonometry :clinicalRecord="clinicalRecord" :submitted="submitted"/>

        <Lensometry
          :modelValue="clinicalRecord.lensometry"
          @update:modelValue="clinicalRecord.lensometry = $event"
          :submitted="submitted"
        />

        <Autorefractometria
          :modelValue="clinicalRecord.autorefractometry"
          @update:modelValue="clinicalRecord.autorefractometry = $event"
          :submitted="submitted"
        />

        <!-- Diagnosis Component -->
        <Diagnosis
          :clinicalRecord="clinicalRecord"
          :indications="indications"
          :controls="controls"
          :typeDiagnosis="clinicalRecord.typeDiagnosis"
          :submitted="submitted"
        />

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
import Card from "primevue/card";
import Button from "primevue/button";
import VisualAcuity from "../components/clinicalRecord/VisualAcuity.vue";
import SubjectiveRefraction from "../components/clinicalRecord/SubjetiveRefraction.vue";
import PatientInfo from "../components/clinicalRecord/PatientInfo.vue";
import Tonometry from "../components/clinicalRecord/Tonometry.vue";
import Diagnosis from "../components/clinicalRecord/Diagnosis.vue";
import Lensometry from "../components/clinicalRecord/Lensometry.vue";
import Autorefractometria from "../components/clinicalRecord/Autorefractometria.vue";
import apiClient from "../axios-config";

const router = useRouter();
const route = useRoute();

// Form submission state
const submitted = ref(false);

const clinicalRecord = ref({
  // Basic fields
  id: null,
  patientId: null,
  userId: parseInt(localStorage.getItem("iduser")),
  anamnesis: null,
  otherExam: null,
  observations: null,
  indicationId: null,
  controlId: null,
  latestClinicalDate: null,
  ophthalmologicalMedicalHistory: null,
  familyMedicalHistory: null,
  generalMedicalHistory: null,

  // Visual Acuity - handle both null and existing data
  visualAcuity: {
    withoutCorrectionRE: null,
    laserCorrectionRE: null,
    pinholeRE: null,
    withoutCorrectionLE: null,
    laserCorrectionLE: null,
    pinholeLE: null,
    withoutCorrectionBI: null,
    laserCorrectionBI: null,
    pinholeBI: null,
    pupilRedRE: null,
    pupilRedLE: null,
  },

  // Lensometry
  lensometry: {
    sphereLE: null,
    sphereRE: null,
    cylinderLE: null,
    cylinderRE: null,
    axisLE: null,
    axisRE: null,
    add: null,
  },

  // Autorefractometry
  autorefractometry: {
    sphereLE: null,
    sphereRE: null,
    cylinderLE: null,
    cylinderRE: null,
    axisLE: null,
    axisRE: null
  },

  // Subjective Refraction Far
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

  // Subjective Refraction Near
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

  // Applanation Tonometry
  applanationTonometry: {
    leftEye: null,
    rightEye: null,
  },

  // Type Diagnosis
  typeDiagnosis: {
    myopia: null,
    hyperopia: null,
    astigmatism: null,
    presbyopia: null,
    emmetrope: null,
    derived: null,
    artificialTear: null,
  },
});
const isNew = ref(true);
const patients = ref([]);
const indications = ref([]);
const controls = ref([]);

onMounted(async () => {
  const patientId = route.query.id || route.params.id;
  if (patientId) {
    isNew.value = false;
    await fetchClinicalRecordDetails(patientId);
  }
  await fetchPatients();
  await fetchIndications();
  await fetchControls();
});

const fetchClinicalRecordDetails = async (id) => {
  try {
    const response = await apiClient.get(`/clinicalRecords/${id}`);
    if (response.status === 200) {
      console.log("[fetchClinicalRecordDetails]", response.data);

      const data = response.data.data || response.data.clinicalRecord;

      // Map the response data to the form structure
      //clinicalRecord.value = ;

      console.log("[Mapped Clinical Record]", clinicalRecord.value);
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
    console.log("[Saving Clinical Record]", clinicalRecord.value);

    if (isNew.value) {
      const response = await apiClient.post(
        "/clinicalRecords",
        clinicalRecord.value
      );
      console.log("[Created Clinical Record]", response.data);
    } else {
      const response = await apiClient.put(
        `/clinicalRecords/${clinicalRecord.value.id}`,
        clinicalRecord.value
      );
      console.log("[Updated Clinical Record]", response.data);
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

const fetchIndications = async () => {
  try {
    const response = await apiClient.get("clinicalRecords/indications");
    if (response.status === 200) {
      console.log("[fetchIndications]", response.data.indications);
      indications.value = response.data.indications;
    }
  } catch (error) {
    console.error("Failed to fetch indications:", error);
  }
};

const fetchControls = async () => {
  try {
    const response = await apiClient.get("clinicalRecords/controls");
    if (response.status === 200) {
      console.log("[fetchControls]", response.data.controls);
      controls.value = response.data.controls;
    }
  } catch (error) {
    console.error("Failed to fetch controls:", error);
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
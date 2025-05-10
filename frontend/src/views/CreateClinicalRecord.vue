<template>
  <div class=" min-h-screen">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="mb-6  pb-4">
        <h1 class="text-3xl font-bold ">
          {{ isNew ? "Crear Ficha Clínica" : "Modificar Ficha Clínica" }}
        </h1>
        <p class="text-gray-600 mt-1">
          {{ isNew ? "Ingrese la información del paciente para crear una nueva ficha clínica" : "Actualice la información de la ficha clínica existente" }}
        </p>
      </div>

      <form @submit.prevent="saveClinicalRecord" class="space-y-6">
        <!-- Patient Information Section -->
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

        <!-- Visual Acuity Section -->
        <Card class="shadow-sm">
          <template #title>
            <div class="flex items-center">
              <i class="pi pi-eye mr-2"></i>
              <span class="text-xl font-semibold">Agudeza Visual</span>
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Column headers -->
              <div class="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                <div class="text-center font-medium text-gray-600">Ojo Izquierdo (OI)</div>
                <div class="text-center font-medium text-gray-600">Ojo Derecho (OD)</div>
                <div class="text-center font-medium text-gray-600">Binocular</div>
              </div>
              
              <!-- Without Correction -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Sin Corrección</label>
                <InputNumber
                  v-model="clinicalRecord.visualAcuity.withoutCorrectionLE"
                  mode="decimal"
                  :minFractionDigits="2"
                  class="w-full"
                  placeholder="OI"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-transparent">Sin Corrección</label>
                <InputNumber
                  v-model="clinicalRecord.visualAcuity.withoutCorrectionRE"
                  mode="decimal"
                  :minFractionDigits="2"
                  class="w-full"
                  placeholder="OD"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-transparent">Sin Corrección</label>
                <InputNumber
                  v-model="clinicalRecord.visualAcuity.withoutCorrectionBI"
                  mode="decimal"
                  :minFractionDigits="2"
                  class="w-full"
                  placeholder="Binocular"
                />
              </div>

              <!-- With Laser Correction -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Con Corrección Láser</label>
                <InputNumber
                  v-model="clinicalRecord.visualAcuity.laserCorrectionLE"
                  mode="decimal"
                  :minFractionDigits="2"
                  class="w-full"
                  placeholder="OI"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-transparent">Con Corrección Láser</label>
                <InputNumber
                  v-model="clinicalRecord.visualAcuity.laserCorrectionRE"
                  mode="decimal"
                  :minFractionDigits="2"
                  class="w-full"
                  placeholder="OD"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-transparent">Con Corrección Láser</label>
                <InputNumber
                  v-model="clinicalRecord.visualAcuity.laserCorrectionBI"
                  mode="decimal"
                  :minFractionDigits="2"
                  class="w-full"
                  placeholder="Binocular"
                />
              </div>

              <!-- Pinhole (CAE) -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">CAE</label>
                <InputNumber
                  v-model="clinicalRecord.visualAcuity.pinholeLE"
                  mode="decimal"
                  :minFractionDigits="2"
                  class="w-full"
                  placeholder="OI"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-transparent">CAE</label>
                <InputNumber
                  v-model="clinicalRecord.visualAcuity.pinholeRE"
                  mode="decimal"
                  :minFractionDigits="2"
                  class="w-full"
                  placeholder="OD"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-transparent">CAE</label>
                <InputNumber
                  v-model="clinicalRecord.visualAcuity.pinholeBI"
                  mode="decimal"
                  :minFractionDigits="2"
                  class="w-full"
                  placeholder="Binocular"
                />
              </div>

              <!-- Pupil Red -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Pupila Roja</label>
                <InputNumber
                  v-model="clinicalRecord.visualAcuity.pupilRedLE"
                  mode="decimal"
                  :minFractionDigits="2"
                  class="w-full"
                  placeholder="OI"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-transparent">Pupila Roja</label>
                <InputNumber
                  v-model="clinicalRecord.visualAcuity.pupilRedRE"
                  mode="decimal"
                  :minFractionDigits="2"
                  class="w-full"
                  placeholder="OD"
                />
              </div>
            </div>
          </template>
        </Card>

        <!-- Subjective Refraction Section -->
        <Card class="shadow-sm">
          <template #title>
            <div class="flex items-center">
              <i class="pi pi-sliders-h mr-2"></i>
              <span class="text-xl font-semibold">Refracción Subjetiva</span>
            </div>
          </template>
          <template #content>
            <TabView>
              <!-- Far Vision Tab -->
              <TabPanel header="Visión de Lejos">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <!-- Column Headers -->
                  <div class="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 mb-2">
                    <div class="text-center font-medium text-gray-600">Ojo Izquierdo (OI)</div>
                    <div class="text-center font-medium text-gray-600">Ojo Derecho (OD)</div>
                  </div>
                  
                  <!-- Sphere -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Esfera OI</label>
                    <InputNumber
                      v-model="clinicalRecord.subjectiveRefractionFar.sphereLE"
                      mode="decimal"
                      :minFractionDigits="2"
                      class="w-full"
                      placeholder="Esfera OI"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Esfera OD</label>
                    <InputNumber
                      v-model="clinicalRecord.subjectiveRefractionFar.sphereRE"
                      mode="decimal"
                      :minFractionDigits="2"
                      class="w-full"
                      placeholder="Esfera OD"
                    />
                  </div>
                  
                  <!-- Cylinder -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Cilindro OI</label>
                    <InputNumber
                      v-model="clinicalRecord.subjectiveRefractionFar.cylinderLE"
                      mode="decimal"
                      :minFractionDigits="2"
                      class="w-full"
                      placeholder="Cilindro OI"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Cilindro OD</label>
                    <InputNumber
                      v-model="clinicalRecord.subjectiveRefractionFar.cylinderRE"
                      mode="decimal"
                      :minFractionDigits="2"
                      class="w-full"
                      placeholder="Cilindro OD"
                    />
                  </div>
                  
                  <!-- Axis -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Eje OI</label>
                    <InputNumber
                      v-model="clinicalRecord.subjectiveRefractionFar.axisLE"
                      mode="decimal"
                      :minFractionDigits="2"
                      class="w-full"
                      placeholder="Eje OI"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Eje OD</label>
                    <InputNumber
                      v-model="clinicalRecord.subjectiveRefractionFar.axisRE"
                      mode="decimal"
                      :minFractionDigits="2"
                      class="w-full"
                      placeholder="Eje OD"
                    />
                  </div>
                  
                  <!-- Visual Acuity Reached -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">AV Alcanzada OI</label>
                    <InputNumber
                      v-model="clinicalRecord.subjectiveRefractionFar.vareachedLE"
                      mode="decimal"
                      :minFractionDigits="2"
                      class="w-full"
                      placeholder="AV alcanzada OI"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">AV Alcanzada OD</label>
                    <InputNumber
                      v-model="clinicalRecord.subjectiveRefractionFar.vareachedRE"
                      mode="decimal"
                      :minFractionDigits="2"
                      class="w-full"
                      placeholder="AV alcanzada OD"
                    />
                  </div>
                  
                  <!-- Pupillary Distance -->
                  <div class="space-y-2 col-span-1 md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700">Distancia Pupilar</label>
                    <InputNumber
                      v-model="clinicalRecord.subjectiveRefractionFar.pupilarDistance"
                      mode="decimal"
                      :minFractionDigits="2"
                      class="w-full md:w-1/2"
                      placeholder="Distancia pupilar"
                    />
                  </div>
                </div>
              </TabPanel>
              
              <!-- Near Vision Tab -->
              <TabPanel header="Visión de Cerca">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <!-- Column Headers -->
                  <div class="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 mb-2">
                    <div class="text-center font-medium text-gray-600">Ojo Izquierdo (OI)</div>
                    <div class="text-center font-medium text-gray-600">Ojo Derecho (OD)</div>
                  </div>
                  
                  <!-- Sphere -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Esfera OI</label>
                    <InputNumber
                      v-model="clinicalRecord.subjectiveRefractionNear.sphereLE"
                      mode="decimal"
                      :minFractionDigits="2"
                      class="w-full"
                      placeholder="Esfera OI"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Esfera OD</label>
                    <InputNumber
                      v-model="clinicalRecord.subjectiveRefractionNear.sphereRE"
                      mode="decimal"
                      :minFractionDigits="2"
                      class="w-full"
                      placeholder="Esfera OD"
                    />
                  </div>
                  
                  <!-- Cylinder -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Cilindro OI</label>
                    <InputNumber
                      v-model="clinicalRecord.subjectiveRefractionNear.cylinderLE"
                      mode="decimal"
                      :minFractionDigits="2"
                      class="w-full"
                      placeholder="Cilindro OI"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Cilindro OD</label>
                    <InputNumber
                      v-model="clinicalRecord.subjectiveRefractionNear.cylinderRE"
                      mode="decimal"
                      :minFractionDigits="2"
                      class="w-full"
                      placeholder="Cilindro OD"
                    />
                  </div>
                  
                  <!-- Axis -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Eje OI</label>
                    <InputNumber
                      v-model="clinicalRecord.subjectiveRefractionNear.axisLE"
                      mode="decimal"
                      :minFractionDigits="2"
                      class="w-full"
                      placeholder="Eje OI"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Eje OD</label>
                    <InputNumber
                      v-model="clinicalRecord.subjectiveRefractionNear.axisRE"
                      mode="decimal"
                      :minFractionDigits="2"
                      class="w-full"
                      placeholder="Eje OD"
                    />
                  </div>
                  
                  <!-- Visual Acuity Reached -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">AV Alcanzada OI</label>
                    <InputNumber
                      v-model="clinicalRecord.subjectiveRefractionNear.vareachedLE"
                      mode="decimal"
                      :minFractionDigits="2"
                      class="w-full"
                      placeholder="AV alcanzada OI"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">AV Alcanzada OD</label>
                    <InputNumber
                      v-model="clinicalRecord.subjectiveRefractionNear.vareachedRE"
                      mode="decimal"
                      :minFractionDigits="2"
                      class="w-full"
                      placeholder="AV alcanzada OD"
                    />
                  </div>
                  
                  <!-- Pupillary Distance -->
                  <div class="space-y-2 col-span-1 md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700">Distancia Pupilar</label>
                    <InputNumber
                      v-model="clinicalRecord.subjectiveRefractionNear.pupilarDistance"
                      mode="decimal"
                      :minFractionDigits="2"
                      class="w-full md:w-1/2"
                      placeholder="Distancia pupilar"
                    />
                  </div>
                </div>
              </TabPanel>
            </TabView>
          </template>
        </Card>

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
                <label class="block text-sm font-medium text-gray-700">Ojo Izquierdo (OI)</label>
                <InputNumber
                  v-model="clinicalRecord.applanationTonometry.leftEye"
                  mode="decimal"
                  :minFractionDigits="2"
                  class="w-full"
                  placeholder="OI"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Ojo Derecho (OD)</label>
                <InputNumber
                  v-model="clinicalRecord.applanationTonometry.rightEye"
                  mode="decimal"
                  :minFractionDigits="2"
                  class="w-full"
                  placeholder="OD"
                />
              </div>
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
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Card from "primevue/card";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import apiClient from "../axios-config";

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
<template>
  <Card class="shadow-sm">
    <template #title>
      <div class="flex items-center">
        <i class="pi pi-sliders-h mr-2"></i>
        <span class="text-xl font-semibold">Refracción Subjetiva</span>
      </div>
    </template>
    <template #content>
      <!-- Refraction Defects Checkboxes -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Diagnóstico</label>
        <div class="flex flex-wrap gap-4">
          <div v-for="key in defectKeys" :key="key" class="flex items-center">
            <Checkbox 
              :binary="true"
              :modelValue="getDefectValue(key)"
              :inputId="key" 
            />
            <label :for="key" class="ml-2">{{ defectLabels[key] }}</label>
          </div>
        </div>
      </div>

      <TabView>
        <!-- Far Vision Tab using the FarVisionTab component -->
        <TabPanel header="Visión de Lejos">
          <FarVisionTab v-model="refractionFar" />
        </TabPanel>
        
        <!-- Near Vision Tab using the NearVisionTab component -->
        <TabPanel header="Visión de Cerca">
          <NearVisionTab v-model="refractionNear" />
        </TabPanel>
      </TabView>
    </template>
  </Card>
</template>

<script setup>
import { computed, ref } from 'vue';
import Card from "primevue/card";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Checkbox from "primevue/checkbox";
import FarVisionTab from "./FarVisionTab.vue";
import NearVisionTab from "./NearVisionTab.vue";

const props = defineProps({
  subjectiveRefractionFar: {
    type: Object,
    required: true,
    default: () => ({
      sphereLE: null,
      sphereRE: null,
      cylinderLE: null,
      cylinderRE: null,
      axisLE: null,
      axisRE: null,
      vareachedLE: null,
      vareachedRE: null,
      pupilarDistance: null
    })
  },
  subjectiveRefractionNear: {
    type: Object,
    required: true,
    default: () => ({
      sphereLE: null,
      sphereRE: null,
      cylinderLE: null,
      cylinderRE: null,
      axisLE: null,
      axisRE: null,
      vareachedLE: null,
      vareachedRE: null,
      pupilarDistance: null,
      add: null
    })
  },
  subjectiveRefractionDefects: {
    type: Object,
    required: false,
    default: () => ({
      myopia: null,
      hyperopia: null,
      astigmatism: null,
      presbyopia: null,
      anisometropia: null
    })
  }
});

const emit = defineEmits([
  'update:subjectiveRefractionFar', 
  'update:subjectiveRefractionNear', 
  'update:subjectiveRefractionDefects'
]);

// Create computed properties for two-way binding
const refractionFar = computed({
  get: () => props.subjectiveRefractionFar || { 
    sphereLE: null, 
    sphereRE: null, 
    cylinderLE: null, 
    cylinderRE: null, 
    axisLE: null, 
    axisRE: null, 
    vareachedLE: null, 
    vareachedRE: null, 
    pupilarDistance: null 
  },
  set: (value) => emit('update:subjectiveRefractionFar', value)
});

const refractionNear = computed({
  get: () => props.subjectiveRefractionNear || { 
    sphereLE: null, 
    sphereRE: null, 
    cylinderLE: null, 
    cylinderRE: null, 
    axisLE: null, 
    axisRE: null, 
    vareachedLE: null, 
    vareachedRE: null, 
    pupilarDistance: null, 
    add: null 
  },
  set: (value) => emit('update:subjectiveRefractionNear', value)
});

// Define the keys that represent boolean defects
const defectKeys = ['myopia', 'hyperopia', 'astigmatism', 'presbyopia', 'anisometropia'];

// Define human-friendly labels for the defects
const defectLabels = {
  myopia: 'Miopía',
  hyperopia: 'Hipermetropía',
  astigmatism: 'Astigmatismo',
  presbyopia: 'Presbicia',
  anisometropia: 'Anisometropía'
};

// Helper function to safely get defect values
const getDefectValue = (key) => {
  if (!props.subjectiveRefractionDefects) return false;
  const value = props.subjectiveRefractionDefects[key];
  return value === true; // Ensure it's a boolean true
};
</script>

<style scoped>
/* Additional custom styles can be added here */
</style>
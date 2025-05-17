<template>
  <Card class="shadow-sm">
    <template #title>
      <div class="flex items-center">
        <i class="pi pi-sliders-h mr-2"></i>
        <span class="text-xl font-semibold">Refracción Subjetiva</span>
      </div>
    </template>
    <template #content>
      <!-- Diagnosis Checkboxes -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Diagnóstico</label>
        <div class="flex flex-wrap gap-4">
          <div v-for="option in diagnosisOptions" :key="option.value" class="flex items-center">
            <Checkbox 
              v-model="diagnosis.conditions" 
              :value="option.value" 
              :inputId="option.value" 
            />
            <label :for="option.value" class="ml-2">{{ option.label }}</label>
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
    required: true
  },
  subjectiveRefractionNear: {
    type: Object,
    required: true
  },
  diagnosis: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:subjectiveRefractionFar', 'update:subjectiveRefractionNear', 'update:diagnosis']);

// Create computed properties for two-way binding
const refractionFar = computed({
  get: () => props.subjectiveRefractionFar,
  set: (value) => emit('update:subjectiveRefractionFar', value)
});

const refractionNear = computed({
  get: () => props.subjectiveRefractionNear,
  set: (value) => emit('update:subjectiveRefractionNear', value)
});

const diagnosis = computed({
  get: () => props.diagnosis,
  set: (value) => emit('update:diagnosis', value)
});

// Sample diagnosis options - these should come from your data store or API
const diagnosisOptions = ref([
  { label: 'Miopía', value: 'myopia' },
  { label: 'Hipermetropía', value: 'hyperopia' },
  { label: 'Astigmatismo', value: 'astigmatism' },
  { label: 'Presbicia', value: 'presbyopia' },
  { label: 'Anisometropía', value: 'anisometropia' }
]);
</script>

<style scoped>
/* Additional custom styles can be added here */
</style>
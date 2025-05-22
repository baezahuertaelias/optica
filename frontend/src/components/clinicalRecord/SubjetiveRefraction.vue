<template>
  <Card class="shadow-sm">
    <template #title>
      <div class="flex items-center">
        <i class="pi pi-sliders-h mr-2"></i>
        <span class="text-xl font-semibold">Refracción Subjetiva</span>
      </div>
    </template>
    <template #content>
      <!-- Refraction Defects Checkboxes moved to another component -->
      
      <TabView :activeIndex="0">
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
import { computed, ref, onMounted } from 'vue';
import Card from "primevue/card";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
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
  }
});

const emit = defineEmits([
  'update:subjectiveRefractionFar', 
  'update:subjectiveRefractionNear'
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
</script>
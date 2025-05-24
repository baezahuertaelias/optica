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
          <FarVisionTab v-model="refractionFar" :submitted="submitted" :disabled="disabled"/>
        </TabPanel>

        <!-- Near Vision Tab using the NearVisionTab component -->
        <TabPanel header="Visión de Cerca">
          <NearVisionTab v-model="refractionNear" :submitted="submitted" :disabled="disabled"/>
        </TabPanel>
      </TabView>
    </template>
  </Card>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import Card from "primevue/card";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import FarVisionTab from "./FarVisionTab.vue";
import NearVisionTab from "./NearVisionTab.vue";

const props = defineProps({
  subjectiveRefractionFar: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  subjectiveRefractionNear: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  submitted: { type: Boolean, required: true },
  disabled: { type: Boolean, required: true },
});

const emit = defineEmits([
  "update:subjectiveRefractionFar",
  "update:subjectiveRefractionNear",
]);

// Create computed properties for two-way binding
const refractionFar = computed({
  get: () => props.subjectiveRefractionFar || {},
  set: (value) => emit("update:subjectiveRefractionFar", value),
});

const refractionNear = computed({
  get: () => props.subjectiveRefractionNear || {},
  set: (value) => emit("update:subjectiveRefractionNear", value),
});
</script>
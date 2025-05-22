<template>
  <Card>
    <template #title>
      <div class="flex items-center">
        <i class="pi pi-chart-line mr-2"></i>
        <span class="text-xl font-semibold">Diagnosis</span>
      </div>
    </template>
    <template #content>
      <div class="field">
        <label
          class="block text-sm font-medium text-gray-700 mb-1"
          for="otherExam"
          >Other Exam</label
        >
        <Textarea
          id="otherExam"
          v-model="clinicalRecord.otherExam"
          rows="4"
          autoResize
          class="w-full"
        />
      </div>

      <div class="field">
        <label
          class="block text-sm font-medium text-gray-700 mb-1"
          for="observations"
          >Observations</label
        >
        <Textarea
          id="observations"
          v-model="clinicalRecord.observations"
          rows="4"
          autoResize
          class="w-full"
        />
      </div>

      <!-- Refraction Defects Checkboxes moved from SubjetiveRefraction.vue -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Diagnóstico</label
        >
        <div class="flex flex-wrap gap-4">
          <div v-for="key in defectKeys" :key="key" class="flex items-center">
            <Checkbox
              :binary="true"
              :modelValue="getDefectValue(key)"
              :inputId="key"
              @update:modelValue="updateDefectValue(key, $event)"
            />
            <label :for="key" class="ml-2">{{ defectLabels[key] }}</label>
          </div>
        </div>
      </div>

      <!-- 50/50 Grid for Artificial Tear and Control -->
      <div class="grid grid-cols-2 gap-4">
        <div class="field">
          <label for="indication">Indicación</label>
          <Dropdown
            id="indication"
            v-model="clinicalRecord.indicationId"
            :options="indications"
            optionLabel="value"
            optionValue="id"
            placeholder="Seleccione una indicación"
            class="w-full"
          />
        </div>

        <div class="field flex items-center pt-4">
          <Checkbox
            v-model="typeDiagnosis.artificialTear"
            inputId="artificialTear"
            name="artificialTear"
            :binary="true"
          />
          <label for="artificialTear" class="ml-2">
            Lagrimas artificiales
          </label>
        </div>
      </div>

      <div class="field">
        <label
          for="control"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Control</label
        >
        <Dropdown
          id="control"
          v-model="clinicalRecord.controlId"
          :options="controls"
          optionLabel="value"
          optionValue="id"
          placeholder="Seleccione un control"
          class="w-full"
        />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { defineProps } from "vue";
import Card from "primevue/card";
import Textarea from "primevue/textarea";
import Checkbox from "primevue/checkbox";
import Dropdown from "primevue/dropdown";

const props = defineProps({
  clinicalRecord: Object,
  indications: Array,
  controls: Array,
  typeDiagnosis: {
    // Define the typeDiagnosis prop
    type: Object,
    required: false,
    default: () => ({
      myopia: null,
      hyperopia: null,
      astigmatism: null,
      presbyopia: null,
      emmetrope: null,
      derived: null,
      artificialTear: null,
    }),
  },
});

// Define the keys that represent boolean defects
const defectKeys = [
  "myopia",
  "hyperopia",
  "astigmatism",
  "presbyopia",
  "emmetrope",
  "derived",
];

// Define human-friendly labels for the defects
const defectLabels = {
  myopia: "Miopía",
  hyperopia: "Hipermetropía",
  astigmatism: "Astigmatismo",
  presbyopia: "Presbicia",
  emmetrope: "Emetrope",
  derived: "Derivado",
};

// Helper function to safely get defect values
const getDefectValue = (key) => {
  if (!props.typeDiagnosis) return false;
  const value = props.typeDiagnosis[key];
  return value === true; // Ensure it's a boolean true
};

// Function to update the defect value in typeDiagnosis
const updateDefectValue = (key, value) => {
  if (props.typeDiagnosis) {
    props.typeDiagnosis[key] = value;
  }
};
</script>
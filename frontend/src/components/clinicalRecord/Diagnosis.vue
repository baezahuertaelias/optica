<template>
  <Card class="shadow-sm">
    <template #title>
      <div class="flex items-center">
        <i class="pi pi-chart-line mr-2"></i>
        <span class="text-xl font-semibold">Diagnostico</span>
      </div>
    </template>
    <template #content>
      <div class="field pt-5">
        <FloatLabel>
          <label
            class="block text-sm font-medium text-gray-700 mb-1"
            for="otherExam"
            >Otros examenes</label
          >
          <Textarea
            id="otherExam"
            v-model="clinicalRecord.otherExam"
            rows="4"
            autoResize
            class="w-full"
            :disabled="disabled"
          />
        </FloatLabel>
      </div>

      <div class="field pt-8">
        <FloatLabel>
          <label
            class="block text-sm font-medium text-gray-700 mb-1"
            for="observations"
            >Observaciones</label
          >
          <Textarea
            id="observations"
            v-model="clinicalRecord.observations"
            rows="4"
            autoResize
            class="w-full"
            :disabled="disabled"
          />
        </FloatLabel>
      </div>

      <!-- Refraction Defects Checkboxes moved from SubjetiveRefraction.vue -->
      <div class="pt-3 space-y-2">
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Diagnóstico *</label
        >
        <div class="flex flex-wrap gap-4">
          <div v-for="key in defectKeys" :key="key" class="flex items-center">
            <Checkbox
              :binary="true"
              :modelValue="getDefectValue(key)"
              :inputId="key"
              :class="{ 'p-invalid': submitted && !isAtLeastOneDiagnosisSelected }"
              @update:modelValue="updateDefectValue(key, $event)"
              :disabled="disabled"
            />
            <label :for="key" class="ml-2">{{ defectLabels[key] }}</label>
          </div>
        </div>
        <!-- Validation message for diagnosis -->
        <small 
          v-if="submitted && !isAtLeastOneDiagnosisSelected" 
          class="p-error"
          id="diagnosis-error"
        >
          Debe seleccionar al menos un diagnóstico
        </small>
      </div>

      <!-- 50/50 Grid for Artificial Tear and Control -->
      <div class="grid grid-cols-2 gap-4 pt-12">
        <div class="field space-y-2">
          <FloatLabel>
            <label for="indication">Indicación *</label>
            <Dropdown
              id="indication"
              v-model="clinicalRecord.indicationId"
              :options="indications"
              optionLabel="value"
              optionValue="id"
              placeholder="Seleccione una indicación"
              :class="{ 'p-invalid': submitted && (clinicalRecord.indicationId === null || clinicalRecord.indicationId === '') }"
              class="w-full"
              :disabled="disabled"
              aria-describedby="indication-error"
              fluid
            />
          </FloatLabel>
          <!-- Validation message for indication -->
          <small 
            v-if="submitted && (clinicalRecord.indicationId === null || clinicalRecord.indicationId === '')" 
            class="p-error"
            id="indication-error"
          >
            La indicación es requerida
          </small>
        </div>

        <div class="field flex items-center">
          <Checkbox
            v-model="typeDiagnosis.artificialTear"
            inputId="artificialTear"
            name="artificialTear"
            :binary="true"
            :disabled="disabled"
          />
          <label for="artificialTear" class="ml-2">
            Lagrimas artificiales
          </label>
        </div>
      </div>

      <div class="field pt-7 space-y-2">
        <FloatLabel>
          <label
            for="control"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Control *</label
          >
          <Dropdown
            id="control"
            v-model="clinicalRecord.controlId"
            :options="controls"
            optionLabel="value"
            optionValue="id"
            placeholder="Seleccione un control"
            :class="{ 'p-invalid': submitted && (clinicalRecord.controlId === null || clinicalRecord.controlId === '') }"
            class="w-full"
            :disabled="disabled"
            aria-describedby="control-error"
            fluid
          />
        </FloatLabel>
        <!-- Validation message for control -->
        <small 
          v-if="submitted && (clinicalRecord.controlId === null || clinicalRecord.controlId === '')" 
          class="p-error"
          id="control-error"
        >
          El control es requerido
        </small>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed, watch } from "vue";
import Card from "primevue/card";
import Textarea from "primevue/textarea";
import Checkbox from "primevue/checkbox";
import Dropdown from "primevue/dropdown";
import FloatLabel from "primevue/floatlabel";

const props = defineProps({
  clinicalRecord: {
    type: Object,
    required: true,
  },
  indications: {
    type: Array,
    required: true,
  },
  controls: {
    type: Array,
    required: true,
  },
  typeDiagnosis: {
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
  disabled: {
    type: Boolean,
    default: false,
  },

});

const emit = defineEmits(['validation-change']);

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

// Validation computed properties
const isAtLeastOneDiagnosisSelected = computed(() => {
  if (!props.typeDiagnosis) return false;
  return defectKeys.some(key => props.typeDiagnosis[key] === true);
});

// Validation function for the entire diagnosis form
const validateDiagnosis = () => {
  let isValid = true;
  const errors = [];

  // Check if at least one diagnosis is selected
  if (!isAtLeastOneDiagnosisSelected.value) {
    isValid = false;
    errors.push('At least one diagnosis must be selected');
  }

  // Check indication selection
  if (props.clinicalRecord.indicationId === null || props.clinicalRecord.indicationId === '') {
    isValid = false;
    errors.push('Indication is required');
  }

  // Check control selection
  if (props.clinicalRecord.controlId === null || props.clinicalRecord.controlId === '') {
    isValid = false;
    errors.push('Control is required');
  }

  return { isValid, errors };
};

// Watch for changes and emit validation status
watch(
  [() => props.typeDiagnosis, () => props.clinicalRecord.indicationId, () => props.clinicalRecord.controlId],
  () => {
    const validation = validateDiagnosis();
    emit('validation-change', validation);
  },
  { deep: true }
);

// Helper function to safely get defect values
const getDefectValue = (key) => {
  if (!props.typeDiagnosis) return false;
  const value = props.typeDiagnosis[key];
  return value === true;
};

// Function to update the defect value in typeDiagnosis
const updateDefectValue = (key, value) => {
  if (props.typeDiagnosis) {
    props.typeDiagnosis[key] = value;
  }
};

// Expose validation function for parent component
defineExpose({
  validateDiagnosis
});
</script>
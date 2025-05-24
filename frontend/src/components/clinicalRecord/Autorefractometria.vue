<template>
  <Card class="shadow-sm">
    <template #title>
      <div class="flex items-center">
        <i class="pi pi-eye mr-2"></i>
        <span class="text-xl font-semibold">Autorefractometria</span>
      </div>
    </template>
    <template #content>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Column headers -->
        <div
          class="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mb-2"
        >
          <div class="text-center font-medium text-gray-600">Esfera</div>
          <div class="text-center font-medium text-gray-600">Cilindro</div>
          <div class="text-center font-medium text-gray-600">Eje</div>
        </div>

        <!-- OD (Right Eye) Row -->
        <div class="space-y-2">
          <FloatLabel>
            <label class="block text-sm font-medium text-gray-700"
              >Esfera OD *</label
            >
            <InputNumber
              v-model="autorefractometry.sphereRE"
              mode="decimal"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              locale="en-US"
              class="w-full"
              :disabled="disabled"
              :class="{
                'p-invalid': submitted && autorefractometry.sphereRE === null,
              }"
              placeholder="OD"
              aria-describedby="sphereRE-error"
              fluid
            />
          </FloatLabel>
          <small
            v-if="submitted && autorefractometry.sphereRE === null"
            class="p-error"
            id="sphereRE-error"
          >
            La esfera OD es requerida
          </small>
        </div>

        <div class="space-y-2">
          <FloatLabel>
            <label class="block text-sm font-medium text-gray-700"
              >Cilindro OD *</label
            >
            <InputNumber
              v-model="autorefractometry.cylinderRE"
              mode="decimal"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              locale="en-US"
              class="w-full"
              :disabled="disabled"
              :class="{
                'p-invalid': submitted && autorefractometry.cylinderRE === null,
              }"
              placeholder="OD"
              aria-describedby="cylinderRE-error"
              fluid
            />
          </FloatLabel>
          <small
            v-if="submitted && autorefractometry.cylinderRE === null"
            class="p-error"
            id="cylinderRE-error"
          >
            El cilindro OD es requerido
          </small>
        </div>

        <div class="space-y-2">
          <FloatLabel>
            <label class="block text-sm font-medium text-gray-700"
              >Eje OD *</label
            >
            <InputNumber
              v-model="autorefractometry.axisRE"
              mode="decimal"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              :min="0"
              :max="180"
              locale="en-US"
              class="w-full"
              :disabled="disabled"
              :class="{
                'p-invalid':
                  submitted &&
                  (autorefractometry.axisRE === null ||
                    !isValidAxis(autorefractometry.axisRE)),
              }"
              placeholder="OD"
              aria-describedby="axisRE-error"
              fluid
            />
          </FloatLabel>
          <small
            v-if="submitted && autorefractometry.axisRE === null"
            class="p-error"
            id="axisRE-error"
          >
            El eje OD es requerido
          </small>
          <small
            v-else-if="
              submitted &&
              autorefractometry.axisRE !== null &&
              !isValidAxis(autorefractometry.axisRE)
            "
            class="p-error"
          >
            El eje debe estar entre 0° y 180°
          </small>
        </div>

        <!-- OI (Left Eye) Row -->
        <div class="space-y-2">
          <FloatLabel>
            <label class="block text-sm font-medium text-gray-700"
              >Esfera OI *</label
            >
            <InputNumber
              v-model="autorefractometry.sphereLE"
              mode="decimal"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              locale="en-US"
              class="w-full"
              :disabled="disabled"
              :class="{
                'p-invalid': submitted && autorefractometry.sphereLE === null,
              }"
              placeholder="OI"
              aria-describedby="sphereLE-error"
              fluid
            />
          </FloatLabel>
          <small
            v-if="submitted && autorefractometry.sphereLE === null"
            class="p-error"
            id="sphereLE-error"
          >
            La esfera OI es requerida
          </small>
        </div>

        <div class="space-y-2">
          <FloatLabel>
            <label class="block text-sm font-medium text-gray-700"
              >Cilindro OI *</label
            >
            <InputNumber
              v-model="autorefractometry.cylinderLE"
              mode="decimal"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              locale="en-US"
              class="w-full"
              :disabled="disabled"
              :class="{
                'p-invalid': submitted && autorefractometry.cylinderLE === null,
              }"
              placeholder="OI"
              aria-describedby="cylinderLE-error"
              fluid
            />
          </FloatLabel>
          <small
            v-if="submitted && autorefractometry.cylinderLE === null"
            class="p-error"
            id="cylinderLE-error"
          >
            El cilindro OI es requerido
          </small>
        </div>

        <div class="space-y-2">
          <FloatLabel>
            <label class="block text-sm font-medium text-gray-700"
              >Eje OI *</label
            >
            <InputNumber
              v-model="autorefractometry.axisLE"
              mode="decimal"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              :min="0"
              :max="180"
              locale="en-US"
              class="w-full"
              :disabled="disabled"
              :class="{
                'p-invalid':
                  submitted &&
                  (autorefractometry.axisLE === null ||
                    !isValidAxis(autorefractometry.axisLE)),
              }"
              placeholder="OI"
              aria-describedby="axisLE-error"
              fluid
            />
          </FloatLabel>
          <small
            v-if="submitted && autorefractometry.axisLE === null"
            class="p-error"
            id="axisLE-error"
          >
            El eje OI es requerido
          </small>
          <small
            v-else-if="
              submitted &&
              autorefractometry.axisLE !== null &&
              !isValidAxis(autorefractometry.axisLE)
            "
            class="p-error"
          >
            El eje debe estar entre 0° y 180°
          </small>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref, computed, watch, reactive } from "vue";
import Card from "primevue/card";
import InputNumber from "primevue/inputnumber";
import Checkbox from "primevue/checkbox";
import FloatLabel from "primevue/floatlabel";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  submitted: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "validation-change"]);

// Create a computed property for two-way binding
const autorefractometry = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// Validation function for axis values (should be between 0 and 180 degrees)
const isValidAxis = (value) => {
  if (value === null || value === undefined) return false;
  return value >= 0 && value <= 180;
};

// Validation function for the entire autorefractometry form
const validateAutorefractometry = () => {
  const requiredFields = [
    "sphereRE",
    "cylinderRE",
    "axisRE",
    "sphereLE",
    "cylinderLE",
    "axisLE",
  ];

  let isValid = true;
  const errors = [];

  // Check required fields
  for (const field of requiredFields) {
    if (
      autorefractometry.value[field] === null ||
      autorefractometry.value[field] === undefined
    ) {
      isValid = false;
      errors.push(`${field} is required`);
    }
  }

  // Check axis range validation
  if (
    autorefractometry.value.axisRE !== null &&
    !isValidAxis(autorefractometry.value.axisRE)
  ) {
    isValid = false;
    errors.push("axisRE must be between 0 and 180");
  }

  if (
    autorefractometry.value.axisLE !== null &&
    !isValidAxis(autorefractometry.value.axisLE)
  ) {
    isValid = false;
    errors.push("axisLE must be between 0 and 180");
  }

  return { isValid, errors };
};

// Watch for changes and emit validation status
watch(
  () => autorefractometry.value,
  () => {
    const validation = validateAutorefractometry();
    emit("validation-change", validation);
  },
  { deep: true }
);

// Expose validation function for parent component
defineExpose({
  validateAutorefractometry,
});
</script>

<style scoped>
/* Additional custom styles can be added here */
</style>
<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-4">
    <!-- Column Headers -->
    <div
      class="col-span-1 md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4 mb-2"
    >
      <div class="text-center font-medium text-gray-600">Esfera</div>
      <div class="text-center font-medium text-gray-600">Cilindro</div>
      <div class="text-center font-medium text-gray-600">Eje</div>
      <div class="text-center font-medium text-gray-600">AV Alcanzada</div>
    </div>

    <div class="space-y-2 pt-3">
      <FloatLabel>
        <label class="block text-sm font-medium text-gray-700">Esfera OD</label>
        <InputNumber
          v-model="refractionData.sphereRE"
          mode="decimal"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          locale="en-US"
          class="w-full"
          placeholder="Esfera OD"
          fluid
          :class="{ 'p-invalid': submitted && !refractionData.sphereRE }"
          :disabled="disabled"
        />
      </FloatLabel>
      <small v-if="submitted && !refractionData.sphereRE" class="p-error"
        >OD Esfera es requerido.</small
      >
    </div>

    <div class="space-y-2 pt-3">
      <FloatLabel>
        <label class="block text-sm font-medium text-gray-700"
          >Cilindro OD</label
        >
        <InputNumber
          v-model="refractionData.cylinderRE"
          mode="decimal"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          locale="en-US"
          class="w-full"
          placeholder="Cilindro OD"
          fluid
          :class="{ 'p-invalid': submitted && !refractionData.cylinderRE }"
          :disabled="disabled"
        />
      </FloatLabel>
      <small v-if="submitted && !refractionData.cylinderRE" class="p-error"
        >OD Cilindro es requerido.</small
      >
    </div>

    <div class="space-y-2 pt-3">
      <FloatLabel>
        <label class="block text-sm font-medium text-gray-700">Eje OD</label>
        <InputNumber
          v-model="refractionData.axisRE"
          mode="decimal"
          :minFractionDigits="0"
          :maxFractionDigits="0"
          locale="en-US"
          class="w-full"
          placeholder="Eje OD"
          fluid
          :class="{ 'p-invalid': submitted && !refractionData.axisRE }"
          :disabled="disabled"
        />
      </FloatLabel>
      <small v-if="submitted && !refractionData.axisRE" class="p-error"
        >OD Eje es requerido.</small
      >
    </div>

    <div class="space-y-2 pt-3">
      <FloatLabel>
        <label class="block text-sm font-medium text-gray-700"
          >AV Alcanzada OD</label
        >
        <InputNumber
          v-model="refractionData.vareachedRE"
          mode="decimal"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          locale="en-US"
          class="w-full"
          placeholder="AV alcanzada OD"
          fluid
          :class="{ 'p-invalid': submitted && !refractionData.vareachedRE }"
          :disabled="disabled"
        />
      </FloatLabel>
      <small v-if="submitted && !refractionData.vareachedRE" class="p-error"
        >OD AV Alcanzada es requerido.</small
      >
    </div>

    <div class="space-y-2 pt-3">
      <FloatLabel>
        <label class="block text-sm font-medium text-gray-700">Esfera OI</label>
        <InputNumber
          v-model="refractionData.sphereLE"
          mode="decimal"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          locale="en-US"
          class="w-full"
          placeholder="Esfera OI"
          fluid
          :class="{ 'p-invalid': submitted && !refractionData.sphereLE }"
          :disabled="disabled"
        />
      </FloatLabel>
      <small v-if="submitted && !refractionData.sphereLE" class="p-error"
        >OI Esfera es requerido.</small
      >
    </div>

    <div class="space-y-2 pt-3">
      <FloatLabel>
        <label class="block text-sm font-medium text-gray-700"
          >Cilindro OI</label
        >
        <InputNumber
          v-model="refractionData.cylinderLE"
          mode="decimal"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          locale="en-US"
          class="w-full"
          placeholder="Cilindro OI"
          fluid
          :class="{ 'p-invalid': submitted && !refractionData.cylinderLE }"
          :disabled="disabled"
        />
      </FloatLabel>
      <small v-if="submitted && !refractionData.cylinderLE" class="p-error"
        >OI Cilindro es requerido.</small
      >
    </div>

    <div class="space-y-2 pt-3">
      <FloatLabel>
        <label class="block text-sm font-medium text-gray-700">Eje OI</label>
        <InputNumber
          v-model="refractionData.axisLE"
          mode="decimal"
          :minFractionDigits="0"
          :maxFractionDigits="0"
          locale="en-US"
          class="w-full"
          placeholder="Eje OI"
          fluid
          :class="{ 'p-invalid': submitted && !refractionData.axisLE }"
          :disabled="disabled"
        />
      </FloatLabel>
      <small v-if="submitted && !refractionData.axisLE" class="p-error"
        >OI Eje es requerido.</small
      >
    </div>

    <div class="space-y-2 pt-3">
      <FloatLabel>
        <label class="block text-sm font-medium text-gray-700"
          >AV Alcanzada OI</label
        >
        <InputNumber
          v-model="refractionData.vareachedLE"
          mode="decimal"
          :minFractionDigits="2"
          :maxFractionDigits="2"
          locale="en-US"
          class="w-full"
          placeholder="AV alcanzada OI"
          fluid
          :class="{ 'p-invalid': submitted && !refractionData.vareachedLE }"
          :disabled="disabled"
        />
      </FloatLabel>
      <small v-if="submitted && !refractionData.vareachedLE" class="p-error"
        >OI AV Alcanzada es requerido.</small
      >
    </div>

    <div class="space-y-2 pt-3">
      <FloatLabel>
        <label class="block text-sm font-medium text-gray-700"
          >Distancia Pupilar</label
        >
        <InputNumber
          v-model="refractionData.pupilarDistance"
          mode="decimal"
          :minFractionDigits="0"
          :maxFractionDigits="0"
          locale="en-US"
          class="w-full"
          placeholder="Distancia pupilar"
          fluid
          :class="{ 'p-invalid': submitted && !refractionData.pupilarDistance }"
          :disabled="disabled"
        />
      </FloatLabel>
      <small v-if="submitted && !refractionData.pupilarDistance" class="p-error">Distancia pupilar es requerido.</small>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import InputNumber from "primevue/inputnumber";
import FloatLabel from "primevue/floatlabel";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  submitted: {
    type: Boolean,
    required: false
  },
  disabled: {
    type: Boolean,
    required: false
  }
});

const emit = defineEmits(["update:modelValue"]);

// Create a computed property for two-way binding
const refractionData = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<style scoped>
/* Additional custom styles can be added here */
</style>
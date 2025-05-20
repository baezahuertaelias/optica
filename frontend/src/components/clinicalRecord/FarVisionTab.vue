<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
    <!-- Column Headers -->
    <div class="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 mb-2">
      <div class="text-center font-medium text-gray-600">Ojo Derecho (OD)</div>
      <div class="text-center font-medium text-gray-600">Ojo Izquierdo (OI)</div>
    </div>
    
    <!-- Sphere -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Esfera OD</label>
      <InputNumber
        v-model="refractionData.sphereRE"
        mode="decimal"
        :minFractionDigits="2"
        :maxFractionDigits="2"
        locale="en-US"
        class="w-full"
        placeholder="Esfera OD"
      />
    </div>
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Esfera OI</label>
      <InputNumber
        v-model="refractionData.sphereLE"
        mode="decimal"
        :minFractionDigits="2"
        :maxFractionDigits="2"
        locale="en-US"
        class="w-full"
        placeholder="Esfera OI"
      />
    </div>
    
    <!-- Cylinder -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Cilindro OD</label>
      <InputNumber
        v-model="refractionData.cylinderRE"
        mode="decimal"
        :minFractionDigits="2"
        :maxFractionDigits="2"
        locale="en-US"
        class="w-full"
        placeholder="Cilindro OD"
      />
    </div>
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Cilindro OI</label>
      <InputNumber
        v-model="refractionData.cylinderLE"
        mode="decimal"
        :minFractionDigits="2"
        :maxFractionDigits="2"
        locale="en-US"
        class="w-full"
        placeholder="Cilindro OI"
      />
    </div>
    
    <!-- Axis -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Eje OD</label>
      <InputNumber
        v-model="refractionData.axisRE"
        mode="decimal"
        :minFractionDigits="0"
        :maxFractionDigits="0"
        locale="en-US"
        class="w-full"
        placeholder="Eje OD"
      />
    </div>
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Eje OI</label>
      <InputNumber
        v-model="refractionData.axisLE"
        mode="decimal"
        :minFractionDigits="0"
        :maxFractionDigits="0"
        locale="en-US"
        class="w-full"
        placeholder="Eje OI"
      />
    </div>
    
    <!-- Visual Acuity Reached -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">AV Alcanzada OD</label>
      <InputNumber
        v-model="refractionData.vareachedRE"
        mode="decimal"
        :minFractionDigits="2"
        :maxFractionDigits="2"
        locale="en-US"
        class="w-full"
        placeholder="AV alcanzada OD"
      />
    </div>
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">AV Alcanzada OI</label>
      <InputNumber
        v-model="refractionData.vareachedLE"
        mode="decimal"
        :minFractionDigits="2"
        :maxFractionDigits="2"
        locale="en-US"
        class="w-full"
        placeholder="AV alcanzada OI"
      />
    </div>
    
    
    <!-- Pupillary Distance -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Distancia Pupilar</label>
      <InputNumber
        v-model="refractionData.pupilarDistance"
        mode="decimal"
        :minFractionDigits="0"
        :maxFractionDigits="0"
        locale="en-US"
        class="w-full"
        placeholder="Distancia pupilar"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import InputNumber from "primevue/inputnumber";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

// Create a computed property for two-way binding
const refractionData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
</script>

<style scoped>
/* Additional custom styles can be added here */
</style>
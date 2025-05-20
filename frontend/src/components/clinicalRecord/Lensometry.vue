<template>
  <Card class="shadow-sm">
    <template #title>
      <div class="flex items-center">
        <i class="pi pi-camera mr-2"></i>
        <span class="text-xl font-semibold">Lensometría</span>
      </div>
    </template>
    <template #content>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Column headers -->
        <div class="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
          <div class="text-center font-medium text-gray-600">Ojo Derecho (OD)</div>
          <div class="text-center font-medium text-gray-600">Ojo Izquierdo (OI)</div>
        </div>

        <!-- Sphere -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Esfera</label>
          <InputNumber
            v-model="lensometry.sphereRE"
            mode="decimal"
            :minFractionDigits="1"
            :maxFractionDigits="1"
            locale="en-US"
            class="w-full"
            placeholder="OD"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-transparent">Esfera</label>
          <InputNumber
            v-model="lensometry.sphereLE"
            mode="decimal"
            :minFractionDigits="1"
            :maxFractionDigits="1"
            locale="en-US"
            class="w-full"
            placeholder="OI"
          />
        </div>

        <!-- Cylinder -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Cilindro</label>
          <InputNumber
            v-model="lensometry.cylinderRE"
            mode="decimal"
            :minFractionDigits="1"
            :maxFractionDigits="1"
            locale="en-US"
            class="w-full"
            placeholder="OD"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-transparent">Cilindro</label>
          <InputNumber
            v-model="lensometry.cylinderLE"
            mode="decimal"
            :minFractionDigits="1"
            :maxFractionDigits="1"
            locale="en-US"
            class="w-full"
            placeholder="OI"
          />
        </div>

        <!-- Axis -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Eje</label>
          <InputNumber
            v-model="lensometry.axisRE"
            mode="decimal"
            :minFractionDigits="1"
            :maxFractionDigits="1"
            locale="en-US"
            class="w-full"
            placeholder="OD"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-transparent">Eje</label>
          <InputNumber
            v-model="lensometry.axisLE"
            mode="decimal"
            :minFractionDigits="1"
            :maxFractionDigits="1"
            locale="en-US"
            class="w-full"
            placeholder="OI"
          />
        </div>

        <!-- Var Reached -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Var Reached</label>
          <InputNumber
            v-model="lensometry.vareachedRE"
            mode="decimal"
            :minFractionDigits="1"
            :maxFractionDigits="1"
            locale="en-US"
            class="w-full"
            placeholder="OD"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-transparent">Var Reached</label>
          <InputNumber
            v-model="lensometry.vareachedLE"
            mode="decimal"
            :minFractionDigits="1"
            :maxFractionDigits="1"
            locale="en-US"
            class="w-full"
            placeholder="OI"
          />
        </div>

        <!-- Pupilar Distance -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Distancia Pupilar</label>
          <InputNumber
            v-model="lensometry.pupilarDistance"
            mode="decimal"
            :minFractionDigits="1"
            :maxFractionDigits="1"
            locale="en-US"
            class="w-full"
            placeholder="DP"
          />
        </div>

        <!-- ADD -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">ADD</label>
          <InputNumber
            v-model="lensometry.add"
            mode="decimal"
            :minFractionDigits="1"
            :maxFractionDigits="1"
            locale="en-US"
            class="w-full"
            placeholder="ADD"
          />
        </div>

      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed } from 'vue';
import Card from "primevue/card";
import InputNumber from "primevue/inputnumber";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

// Create a computed property for two-way binding
const lensometry = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
</script>

<style scoped>
/* Additional custom styles can be added here */
</style>
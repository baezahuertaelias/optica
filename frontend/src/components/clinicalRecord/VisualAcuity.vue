<template>
  <Card class="shadow-sm">
    <template #title>
      <div class="flex items-center">
        <i class="pi pi-eye mr-2"></i>
        <span class="text-xl font-semibold">Agudeza Visual</span>
      </div>
    </template>
    <template #content>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Column headers -->
        <div class="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
          <div class="text-center font-medium text-gray-600">Ojo Derecho (OD)</div>
          <div class="text-center font-medium text-gray-600">Ojo Izquierdo (OI)</div>
          <div class="text-center font-medium text-gray-600">Binocular</div>
        </div>
        
        <!-- Without Correction -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Sin Corrección</label>
          <InputNumber
            v-model="visualAcuity.withoutCorrectionRE"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            locale="en-US"
            class="w-full"
            placeholder="OD"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-transparent">Sin Corrección</label>
          <InputNumber
            v-model="visualAcuity.withoutCorrectionLE"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            locale="en-US"
            class="w-full"
            placeholder="OI"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-transparent">Sin Corrección</label>
          <InputNumber
            v-model="visualAcuity.withoutCorrectionBI"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            locale="en-US"
            class="w-full"
            placeholder="Binocular"
          />
        </div>

        <!-- With Laser Correction -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Con Corrección Láser</label>
          <InputNumber
            v-model="visualAcuity.laserCorrectionRE"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            locale="en-US"
            class="w-full"
            placeholder="OD"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-transparent">Con Corrección Láser</label>
          <InputNumber
            v-model="visualAcuity.laserCorrectionLE"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            locale="en-US"
            class="w-full"
            placeholder="OI"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-transparent">Con Corrección Láser</label>
          <InputNumber
            v-model="visualAcuity.laserCorrectionBI"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            locale="en-US"
            class="w-full"
            placeholder="Binocular"
          />
        </div>

        <!-- Pinhole (CAE) -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">CAE</label>
          <InputNumber
            v-model="visualAcuity.pinholeRE"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            locale="en-US"
            class="w-full"
            placeholder="OD"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-transparent">CAE</label>
          <InputNumber
            v-model="visualAcuity.pinholeLE"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            locale="en-US"
            class="w-full"
            placeholder="OI"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-transparent">CAE</label>
          <InputNumber
            v-model="visualAcuity.pinholeBI"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            locale="en-US"
            class="w-full"
            placeholder="Binocular"
          />
        </div>

        <!-- Pupil Red -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Pupila Roja</label>
          <InputNumber
            v-model="visualAcuity.pupilRedRE"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            locale="en-US"
            class="w-full"
            placeholder="OD"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-transparent">Pupila Roja</label>
          <InputNumber
            v-model="visualAcuity.pupilRedLE"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            locale="en-US"
            class="w-full"
            placeholder="OI"
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
const visualAcuity = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
</script>

<style scoped>
/* Additional custom styles can be added here */
</style>
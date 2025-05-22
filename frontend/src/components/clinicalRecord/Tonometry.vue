<template>
  <Card class="shadow-sm">
    <template #title>
      <div class="flex items-center">
        <i class="pi pi-chart-line mr-2"></i>
        <span class="text-xl font-semibold">Tonometría Aplanática</span>
      </div>
    </template>
    <template #content>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700"
            >Ojo Derecho (OD)</label
          >
          <InputNumber
            v-model="clinicalRecord.applanationTonometry.rightEye"
            mode="decimal"
            :minFractionDigits="0"
            :maxFractionDigits="0"
            locale="en-US"
            class="w-full"
            placeholder="OD"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700"
            >Ojo Izquierdo (OI)</label
          >
          <InputNumber
            v-model="clinicalRecord.applanationTonometry.leftEye"
            mode="decimal"
            :minFractionDigits="0"
            :maxFractionDigits="0"
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
import { defineProps } from "vue";
import InputNumber from "primevue/inputnumber";
import Card from "primevue/card";

const props = defineProps({
  clinicalRecord: Object,
});
</script>
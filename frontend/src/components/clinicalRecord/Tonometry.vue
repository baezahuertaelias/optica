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
        <div class="space-y-2 pt-3">
          <FloatLabel>
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
              :disabled="disabled"
              fluid
              placeholder="OD"
              :class="{
                'p-invalid':
                  submitted && !clinicalRecord.applanationTonometry.rightEye,
              }"
            />
          </FloatLabel>
          <small
            v-if="submitted && !clinicalRecord.applanationTonometry.rightEye"
            class="p-error"
            >OD es requerido.</small
          >
        </div>
        <div class="space-y-2 pt-3">
          <FloatLabel>
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
              :disabled="disabled"
              fluid
              placeholder="OI"
              :class="{
                'p-invalid':
                  submitted && !clinicalRecord.applanationTonometry.leftEye,
              }"
            />
          </FloatLabel>
          <small
            v-if="submitted && !clinicalRecord.applanationTonometry.leftEye"
            class="p-error"
            >OI es requerido.</small
          >
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { defineProps } from "vue";
import InputNumber from "primevue/inputnumber";
import Card from "primevue/card";
import FloatLabel from "primevue/floatlabel";

const props = defineProps({
  clinicalRecord: Object,
  submitted: Boolean,
  disabled: Boolean,
});
</script>
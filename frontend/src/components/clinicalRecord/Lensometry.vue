<template>
  <Card class="shadow-sm">
    <template #title>
      <div class="flex items-center">
        <i class="pi pi-eye mr-2"></i>
        <span class="text-xl font-semibold">Lensometria</span>
      </div>
    </template>
    <template #content>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Column headers -->
        <div
          class="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mb-2"
        >
          <div class="text-center font-medium text-gray-600">
            Esfera
          </div>
          <div class="text-center font-medium text-gray-600">
            Cilindro
          </div>
          <div class="text-center font-medium text-gray-600">Eje</div>
        </div>

        <!-- Without Correction -->
        <div class="space-y-2">
          <InputNumber
            v-model="lensometry.sphereRE"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            locale="en-US"
            class="w-full"
            placeholder="OD"
          />
        </div>

        <div class="space-y-2">
          <InputNumber
            v-model="lensometry.cylinderRE"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            locale="en-US"
            class="w-full"
            placeholder="OD"
          />
        </div>

        <div class="space-y-2">
          <InputNumber
            v-model="lensometry.axisRE"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            locale="en-US"
            class="w-full"
            placeholder="OD"
          />
        </div>

        <div class="space-y-2">
          <InputNumber
            v-model="lensometry.sphereLE"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            locale="en-US"
            class="w-full"
            placeholder="OI"
          />
        </div>

        <div class="space-y-2">
          <InputNumber
            v-model="lensometry.cylinderLE"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            locale="en-US"
            class="w-full"
            placeholder="OI"
          />
        </div>

        <div class="space-y-2">
          <InputNumber
            v-model="lensometry.axisLE"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            locale="en-US"
            class="w-full"
            placeholder="OI"
          />
        </div>

        <div class="space-y-2">
          <InputNumber
            v-model="lensometry.add"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            locale="en-US"
            class="w-full"
            placeholder="Add"
          />
        </div>

        
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed, watch } from "vue";
import Card from "primevue/card";
import InputNumber from "primevue/inputnumber";
import Checkbox from "primevue/checkbox";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  }
});

const emit = defineEmits(["update:modelValue"]);

// Create a computed property for two-way binding
const lensometry = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value)
});
</script>

<style scoped>
/* Additional custom styles can be added here */
</style>
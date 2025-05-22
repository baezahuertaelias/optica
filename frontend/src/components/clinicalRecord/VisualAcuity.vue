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
        <div
          class="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mb-2"
        >
          <div class="text-center font-medium text-gray-600">
            Sin Corrección
          </div>
          <div class="text-center font-medium text-gray-600">
            Con Corrección Láser
          </div>
          <div class="text-center font-medium text-gray-600">CAE</div>
        </div>

        <!-- Without Correction -->
        <div class="space-y-2">
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

        <div class="space-y-2">
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

        <div class="space-y-2">
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
        <div class="space-y-2 col-span-4 md:col-span-1">
          <div class="flex flex-wrap gap-4">
            <div class="flex items-center gap-2">
              <Checkbox
                inputId="odrp"
                v-model="visualAcuity.pupilRedRE"
                :binary="true"
              />
              <label for="odrp"> OD: Rojo Pupilar</label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox
                inputId="oirp"
                v-model="visualAcuity.pupilRedLE"
                :binary="true"
              />
              <label for="oirp"> OI: Rojo Pupilar</label>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed } from "vue";
import Card from "primevue/card";
import InputNumber from "primevue/inputnumber";
import Checkbox from "primevue/checkbox";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

// Create a computed property for two-way binding
const visualAcuity = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<style scoped>
/* Additional custom styles can be added here */
</style>
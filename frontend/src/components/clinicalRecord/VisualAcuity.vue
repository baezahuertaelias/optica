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
            Sin Correccion *
          </div>
          <div class="text-center font-medium text-gray-600">
            Con Correccion Láser
          </div>
          <div class="text-center font-medium text-gray-600">CAE</div>
        </div>

        <!-- Without Correction -->
        <div class="field space-y-2">
          <FloatLabel>
            <label
              for="withoutCorrectionRE"
              class="block text-sm font-medium text-gray-700 mb-1"
            >OD</label>
            <InputNumber
              id="withoutCorrectionRE"
              v-model="visualAcuity.withoutCorrectionRE"
              mode="decimal"
              class="w-full"
              locale="en-US"
              fluid
              placeholder="OD"
              :disabled="disabled"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              :class="{ 'p-invalid': submitted && !visualAcuity.withoutCorrectionRE }"
            />
          </FloatLabel>
          <small v-if="submitted && !visualAcuity.withoutCorrectionRE" class="p-error">
             OD sin correccion es requerida.
          </small>
        </div>

        <div class="field space-y-2">
          <FloatLabel>
            <label
              for="laserCorrectionRE"
              class="block text-sm font-medium text-gray-700 mb-1"
            >OD</label>
            <InputNumber
              id="laserCorrectionRE"
              v-model="visualAcuity.laserCorrectionRE"
              mode="decimal"
              class="w-full"
              fluid
              locale="en-US"
              placeholder="OD"
              :disabled="disabled"
              :class="{ 'p-invalid': submitted && !visualAcuity.withoutCorrectionRE }"
              :minFractionDigits="2"
              :maxFractionDigits="2"
            />
          </FloatLabel>
          <small v-if="submitted && !visualAcuity.withoutCorrectionRE" class="p-error">
            OD con correccion laser es requerida.
          </small>
        </div>

        <div class="field space-y-2">
          <FloatLabel>
            <label
              for="pinholeRE"
              class="block text-sm font-medium text-gray-700 mb-1"
            >OD</label>
            <InputNumber
              id="pinholeRE"
              v-model="visualAcuity.pinholeRE"
              mode="decimal"
              locale="en-US"
              class="w-full"
              placeholder="OD"
              fluid
              :minFractionDigits="2"
              :maxFractionDigits="2"
              :disabled="disabled"
              :class="{ 'p-invalid': submitted && !visualAcuity.withoutCorrectionRE }"
            />
          </FloatLabel>
          <small v-if="submitted && !visualAcuity.withoutCorrectionRE" class="p-error">
            OD CAE es requerida.
          </small>
        </div>

        <div class="field space-y-2">
          <FloatLabel>
            <label
              for="withoutCorrectionLE"
              class="block text-sm font-medium text-gray-700 mb-1"
            >OI</label>
            <InputNumber
              id="withoutCorrectionLE"
              v-model="visualAcuity.withoutCorrectionLE"
              mode="decimal"
              locale="en-US"
              class="w-full"
              placeholder="OI"
              fluid
              :minFractionDigits="2"
              :maxFractionDigits="2"
              :disabled="disabled"
              :class="{ 'p-invalid': submitted && !visualAcuity.withoutCorrectionLE }"
            />
          </FloatLabel>
          <small v-if="submitted && !visualAcuity.withoutCorrectionLE" class="p-error">
             OI sin correccion es requerida.
          </small>
        </div>

        <div class="field space-y-2">
          <FloatLabel>
            <label
              for="laserCorrectionLE"
              class="block text-sm font-medium text-gray-700 mb-1"
            >OI</label>
            <InputNumber
              id="laserCorrectionLE"
              v-model="visualAcuity.laserCorrectionLE"
              mode="decimal"
              class="w-full"
              fluid
              locale="en-US"
              placeholder="OI"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              :disabled="disabled"
              :class="{ 'p-invalid': submitted && !visualAcuity.withoutCorrectionRE }"
            />
          </FloatLabel>
          <small v-if="submitted && !visualAcuity.withoutCorrectionRE" class="p-error">
             OD con correccion laser es requerida.
          </small>
        </div>

        <div class="field space-y-2">
          <FloatLabel>
            <label
              for="pinholeLE"
              class="block text-sm font-medium text-gray-700 mb-1"
            >OI</label>
            <InputNumber
              id="pinholeLE"
              v-model="visualAcuity.pinholeLE"
              mode="decimal"
              locale="en-US"
              class="w-full"
              placeholder="OI"
              fluid
              :disabled="disabled"
              :class="{ 'p-invalid': submitted && !visualAcuity.withoutCorrectionRE }"
              :minFractionDigits="2"
              :maxFractionDigits="2"
            />
          </FloatLabel>
          <small v-if="submitted && !visualAcuity.withoutCorrectionRE" class="p-error">
            OI CAE es requerida.
          </small>
        </div>

        <div class="field space-y-2">
          <FloatLabel>
            <label
              for="withoutCorrectionBI"
              class="block text-sm font-medium text-gray-700 mb-1"
            >Binocular</label>
            <InputNumber
              id="withoutCorrectionBI"
              v-model="visualAcuity.withoutCorrectionBI"
              mode="decimal"
              locale="en-US"
              class="w-full"
              placeholder="Binocular"
              fluid
              :disabled="disabled"
              :minFractionDigits="2"
              :maxFractionDigits="2"
              :class="{ 'p-invalid': submitted && !visualAcuity.withoutCorrectionBI }"
            />
          </FloatLabel>
          <small v-if="submitted && !visualAcuity.withoutCorrectionBI" class="p-error">
            Binocular sin correccion es requerida.
          </small>
        </div>

        <div class="field space-y-2">
          <FloatLabel>
            <label
              for="laserCorrectionBI"
              class="block text-sm font-medium text-gray-700 mb-1"
            >Binocular</label>
            <InputNumber
              id="laserCorrectionBI"
              v-model="visualAcuity.laserCorrectionBI"
              mode="decimal"
              locale="en-US"
              class="w-full"
              placeholder="Binocular"
              fluid
              :minFractionDigits="2"
              :maxFractionDigits="2"
              :disabled="disabled"
              :class="{ 'p-invalid': submitted && !visualAcuity.withoutCorrectionRE }"
            />
          </FloatLabel>
          <small v-if="submitted && !visualAcuity.withoutCorrectionRE" class="p-error">
            Binocular con correccion laser es requerida.
          </small>
        </div>

        <div class="field space-y-2">
          <FloatLabel>
            <label
              for="pinholeBI"
              class="block text-sm font-medium text-gray-700 mb-1"
            >Binocular</label>
            <InputNumber
              id="pinholeBI"
              v-model="visualAcuity.pinholeBI"
              mode="decimal"
              locale="en-US"
              class="w-full"
              placeholder="Binocular"
              fluid
              :minFractionDigits="2"
              :maxFractionDigits="2"
              :disabled="disabled"
              :class="{ 'p-invalid': submitted && !visualAcuity.withoutCorrectionRE }"
            />
          </FloatLabel>
          <small v-if="submitted && !visualAcuity.withoutCorrectionRE" class="p-error">
            Binocular cae es requerida.
          </small>
        </div>

        <!-- Pupil Red -->
        <div class="space-y-2 col-span-4 md:col-span-1">
          <div class="flex flex-wrap gap-4">
            <div class="flex items-center gap-2">
              <Checkbox
                inputId="odrp"
                v-model="visualAcuity.pupilRedRE"
                :binary="true"
                :disabled="disabled"
              />
              <label for="odrp"> OD: Rojo Pupilar</label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox
                inputId="oirp"
                v-model="visualAcuity.pupilRedLE"
                :binary="true"
                :disabled="disabled"
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
    default: false
  }
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
<template>
  <div>
    <Card class="shadow-sm">
      <template #title>
        <div class="flex items-center">
          <i class="pi pi-user mr-2"></i>
          <span class="text-xl font-semibold">Información del Paciente</span>
        </div>
      </template>
      <template #content>
        <div class="grid grid-cols-1 gap-6 pt-4">
          <div class="field">
            <FloatLabel>
            <label
              for="patient"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Paciente *</label
            >
            <Dropdown
              id="patient"
              v-model="clinicalRecord.patientId"
              :options="patients"
              optionLabel="name"
              optionValue="id"
              placeholder="Seleccione un paciente"
              class="w-full"
              filter
              :disabled="disabled"
              :class="{ 'p-invalid': submitted && !clinicalRecord.patientId }"
            />
            </FloatLabel>
            <small v-if="submitted && !clinicalRecord.patientId" class="p-error"
              >El paciente es requerido.</small
            >
          </div>

          <div class="field">
            <FloatLabel>
            <label
              for="latestClinicalDate"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Ultima atencion oftamológica</label
            >
            <Calendar
              id="latestClinicalDate"
              v-model="clinicalRecord.latestClinicalDate"
              :showIcon="true"
              class="w-full"
              dateFormat="dd-mm-yy"
              :value="formattedDateValue"
              :disabled="disabled"
              :class="{ 'p-invalid': submitted && !clinicalRecord.latestClinicalDate }"
            />
            </FloatLabel>
            <small v-if="submitted && !clinicalRecord.latestClinicalDate" class="p-error"
              >latestClinicalDate es requerido.</small
            >
          </div>

          <!-- Anamnesis -->
          <!-- <FloatLabel></FloatLabel> -->
          <div>
            <FloatLabel>
            <label
              for="anamnesis"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Anamnesis</label
            >
            <Textarea
              id="anamnesis"
              v-model="clinicalRecord.anamnesis"
              rows="4"
              autoResize
              class="w-full"
              placeholder=""
              :disabled="disabled"
              :class="{ 'p-invalid': submitted && !clinicalRecord.anamnesis }"
            />
            </FloatLabel>
            <small v-if="submitted && !clinicalRecord.anamnesis" class="p-error"
              >anamnesis es requerido.</small
            >
          </div>

          <div class="field">
            <FloatLabel>
            <label
              for="ophthalmologicalMedicalHistory"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Historial medico oftamologico</label
            >
            <Textarea
              id="ophthalmologicalMedicalHistory"
              v-model="clinicalRecord.ophthalmologicalMedicalHistory"
              rows="4"
              autoResize
              class="w-full"
              :disabled="disabled"
              :class="{ 'p-invalid': submitted && !clinicalRecord.ophthalmologicalMedicalHistory }"
            />
            </FloatLabel>
            <small v-if="submitted && !clinicalRecord.ophthalmologicalMedicalHistory" class="p-error"
              >ophthalmologicalMedicalHistory es requerido.</small
            >
          </div>

          <div class="field">
            <FloatLabel>
            <label
              for="familyMedicalHistory"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Historial medico familiar</label
            >
            <Textarea
              id="familyMedicalHistory"
              v-model="clinicalRecord.familyMedicalHistory"
              rows="4"
              autoResize
              class="w-full"
              :disabled="disabled"
              :class="{ 'p-invalid': submitted && !clinicalRecord.familyMedicalHistory }"
            />
            </FloatLabel>
            <small v-if="submitted && !clinicalRecord.familyMedicalHistory" class="p-error"
              >familyMedicalHistory es requerido.</small
            >

          </div>

          <div class="field">
            <FloatLabel>
            <label
              for="generalMedicalHistory"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Historial medico familiar</label
            >
            <Textarea
              id="generalMedicalHistory"
              v-model="clinicalRecord.generalMedicalHistory"
              rows="4"
              autoResize
              class="w-full"
              :disabled="disabled"
              :class="{ 'p-invalid': submitted && !clinicalRecord.familyMedicalHistory }"
            />
            </FloatLabel>
            <small v-if="submitted && !clinicalRecord.familyMedicalHistory" class="p-error">familyMedicalHistory es requerido.</small>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Card from "primevue/card";
import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar";
import Textarea from "primevue/textarea";
import FloatLabel from "primevue/floatlabel";

const props = defineProps({
  clinicalRecord: Object,
  submitted: Boolean,
  patients: Array,
  disabled: Boolean
});

// Computed property to ensure the date is properly formatted as a Date object
const formattedDateValue = computed(() => {
  if (props.clinicalRecord.latestClinicalDate) {
    // If it's already a Date object, return it
    if (props.clinicalRecord.latestClinicalDate instanceof Date) {
      return props.clinicalRecord.latestClinicalDate;
    }
    // If it's a string, convert it to a Date object
    return new Date(props.clinicalRecord.latestClinicalDate);
  }
  return null;
});

// Computed property to format the latestClinicalDate for display (if needed elsewhere)
const formattedLatestClinicalDate = computed(() => {
  if (props.clinicalRecord.latestClinicalDate) {
    const date = formattedDateValue.value;
    if (date) {
      return date.toLocaleDateString("es-ES", { 
        year: "numeric", 
        month: "2-digit", 
        day: "2-digit" 
      });
    }
  }
  return "";
});
</script>

<style scoped>
/* Additional custom styles can be added here */
</style>
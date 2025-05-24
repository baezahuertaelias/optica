<template>
  <Dialog
    :visible="visible"
    @update:visible="(val) => emit('update:visible', val)"
    modal
    :header="'Registro Clínico ' + clinicalRecord.id"
  >
    <!-- Dialog content here -->
    <div>
      <form @submit.prevent="saveClinicalRecord" class="space-y-6">
        <PatientInfo
          :clinicalRecord="currentRecord"
          :submitted="submitted"
          :patients="patients"
          :disabled="visible"
        />

        <VisualAcuity
          :modelValue="currentRecord.visualAcuity"
          @update:modelValue="currentRecord.visualAcuity = $event"
          :disabled="visible"
        />

        <SubjectiveRefraction
          v-model:subjectiveRefractionFar="
            currentRecord.subjectiveRefractionsFar
          "
          v-model:subjectiveRefractionNear="
            currentRecord.subjectiveRefractionsNear
          "
          :submitted="submitted"
          :disabled="visible"
        />

        <!-- Tonometry Component -->
        <Tonometry :clinicalRecord="currentRecord" :submitted="submitted" :disabled="visible"/>

        <Lensometry
          :modelValue="currentRecord.lensometry"
          @update:modelValue="currentRecord.lensometry = $event"
          :submitted="submitted"
          :disabled="visible"
          
        />

        <Autorefractometria
          :modelValue="currentRecord.autorefractometry"
          @update:modelValue="currentRecord.autorefractometry = $event"
          :submitted="submitted"
          :disabled="visible"
        />

        <!-- Diagnosis Component with error handling -->
        <Diagnosis
          :clinicalRecord="currentRecord"
          :indications="indications"
          :controls="controls"
          :typeDiagnosis="currentRecord.typeDiagnosis"
          :submitted="submitted"
          :disabled="visible"
        />
      </form>
    </div>

    <template #footer>
      <Button
        label="Cerrar"
        icon="pi pi-times"
        class="p-button-secondary"
        @click="closeDialog"
      />
      <Button
        label="Imprimir"
        icon="pi pi-print"
        class="p-button-secondary ml-2"
        @click="printRecord"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import PatientInfo from "./PatientInfo.vue";
import VisualAcuity from "./VisualAcuity.vue";
import SubjectiveRefraction from "./SubjetiveRefraction.vue";
import Tonometry from "./Tonometry.vue";
import Autorefractometria from "./Autorefractometria.vue";
import Lensometry from "./Lensometry.vue";
import Diagnosis from "./Diagnosis.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  clinicalRecord: {
    type: Object,
    required: true,
  },
  patients: {
    type: Array,
    default: () => [],
  },
  indications: {
    type: Array,
    default: () => [],
  },
  controls: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:visible", "save", "print"]);

// Form submission state
const submitted = ref(false);

// Determine if this is a new record or existing one
const isNew = computed(() => {
  return !props.clinicalRecord?.id;
});

// Create a reactive copy of the clinical record
const currentRecord = ref({});

// Default structure for new records
const getDefaultRecord = () => ({
  patientId: null,
  userId: parseInt(localStorage.getItem("iduser")) || null,
  anamnesis: null,
  othersDetails: null,
  observations: null,
  indicationId: null,
  controlId: null,
  latestClinicalDate: null,
  ophthalmologicalMedicalHistory: "",
  familyMedicalHistory: "",
  generalMedicalHistory: "",
  visualAcuity: {
    
  },
  lensometry: {
    
  },
  autorefractometry: {
    
  },
  subjectiveRefractionsFar: {
    
  },
  subjectiveRefractionsNear: {
    
  },
  applanationTonometry: {
    
  },

  patient: {
    
  },
  user: {
    
  },
});

// Initialize currentRecord when component mounts or props change
const initializeRecord = () => {
  if (props.clinicalRecord && Object.keys(props.clinicalRecord).length > 0) {
    // Deep clone the existing record and ensure all required properties exist
    const defaultRecord = getDefaultRecord();

    currentRecord.value = {
      ...defaultRecord,
      ...props.clinicalRecord,
    };
  } else {
    // Initialize with default structure for new records
    currentRecord.value = getDefaultRecord();
  }
};

const closeDialog = () => {
  emit("update:visible", false);
};

const printRecord = () => {
  emit("print", currentRecord.value);
};

const saveClinicalRecord = () => {
  submitted.value = true;
  // Add validation and API calls here
  emit("save", currentRecord.value);
};

// Watch for changes in props to reinitialize the record
watch(
  () => props.clinicalRecord,
  () => {
    console.log("ClinicalDialog", props);

    if (props.visible) {
      initializeRecord();
    }
  },
  { deep: true, immediate: true }
);

// Watch for changes in visible prop to handle dialog state
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      console.log("Dialog opened with record:", props.clinicalRecord);
      console.log("Dialog opened with patients:", props.patients);
      console.log("Dialog opened with indications:", props.indications);
      console.log("Dialog opened with controls:", props.controls);
      initializeRecord();
    } else {
      // Reset submitted state when dialog closes
      submitted.value = false;
    }
  }
);
</script>

<style scoped>
/* Additional custom styles can be added here */
:deep(.p-dropdown) {
  width: 100%;
}

:deep(.p-card) {
  border-radius: 0.5rem;
}

:deep(.p-tabview .p-tabview-nav) {
  border-bottom: 2px solid #e2e8f0;
}

:deep(.p-tabview .p-tabview-nav li .p-tabview-nav-link) {
  border: none;
  color: #64748b;
  padding: 1rem 1.5rem;
}

:deep(.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link) {
  color: #3b82f6;
  border-bottom: 2px solid #3b82f6;
}
</style>
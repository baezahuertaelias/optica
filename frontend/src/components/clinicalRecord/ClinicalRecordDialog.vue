<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    :header="`Ficha clinica ${clinicalRecord?.id || ''}`"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <Card class="shadow-sm">
      <template #title>
        <div class="flex items-center">
          <i class="pi pi-user mr-2"></i>
          <span class="text-xl font-semibold">Información del Paciente</span>
        </div>
      </template>
      <template #content>
        <div class="grid grid-cols-1 gap-6">
          <div>
            <FloatLabel variant="on">
              <InputText
                id="on_label_nombre"
                v-model="safePatientName"
                class="w-full"
                style="resize: none"
                readonly
              />
              <label for="on_label_nombre">Nombre</label>
            </FloatLabel>
          </div>

          <div>
            <FloatLabel variant="on">
              <Textarea
                id="on_label_anamnsis"
                v-model="clinicalRecord.anamnesis"
                rows="3"
                style="resize: none"
                readonly
                fluid
              />
              <label for="on_label_anamnsis">Anamnesis</label>
            </FloatLabel>
          </div>

          <div>
            <FloatLabel variant="on">
              <Textarea
                id="othersDetails"
                v-model="clinicalRecord.othersDetails"
                rows="3"
                style="resize: none"
                readonly
                fluid
              />
              <label for="othersDetails">Otros Detalles</label>
            </FloatLabel>
          </div>
        </div>
      </template>
    </Card>

    <!-- Visual Acuity Section using the component -->
    <VisualAcuity v-model="safeVisualAcuity" />

    <SubjectiveRefraction
      v-model:subjectiveRefractionFar="safeSubjectiveRefractionFar"
      v-model:subjectiveRefractionNear="safeSubjectiveRefractionNear"
      v-model:subjectiveRefractionDefects="safeRefractionDefects"
    />

    <Card>
      <template #title>Tonometría de Aplanación</template>
      <template #content>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1"
              >Ojo Izquierdo (OI)</label
            >
            <InputNumber
              v-model="safeTonometryLeftEye"
              readonly
              mode="decimal"
              :minFractionDigits="0"
              :maxFractionDigits="0"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1"
              >Ojo Derecho (OD)</label
            >
            <InputNumber
              v-model="safeTonometryRightEye"
              readonly
              mode="decimal"
              :minFractionDigits="0"
              :maxFractionDigits="0"
            />
          </div>
        </div>
      </template>
    </Card>

    <template #footer>
      <Button
        label="Cerrar"
        icon="pi pi-times"
        text
        @click="closeDialog"
        class="p-button-secondary"
      />
      <Button
        label="Imprimir"
        icon="pi pi-print"
        outlined
        @click="printRecord"
        class="p-button-secondary ml-2"
      />
    </template>
  </Dialog>
</template>
  
<script setup>
import { defineProps, defineEmits, computed } from "vue";
import Dialog from "primevue/dialog";
import Card from "primevue/card";
import FloatLabel from "primevue/floatlabel";
import Textarea from "primevue/textarea";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import VisualAcuity from "../clinicalRecord/VisualAcuity.vue";
import SubjectiveRefraction from "../clinicalRecord/SubjetiveRefraction.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  clinicalRecord: {
    type: Object,
    required: true,
    default: () => ({
      id: null,
      patient: { name: null },
      anamnesis: null,
      othersDetails: null,
      subjectiveRefractionDefects: {
        myopia: null,
        hyperopia: null,
        astigmatism: null,
        presbyopia: null,
        anisometropia: null,
      },
      visualAcuity: {
        withoutCorrectionLE: null,
        withoutCorrectionRE: null,
        withoutCorrectionBI: null,
        laserCorrectionLE: null,
        laserCorrectionRE: null,
        laserCorrectionBI: null,
        pinholeLE: null,
        pinholeRE: null,
        pinholeBI: null,
        pupilRedLE: null,
        pupilRedRE: null,
      },
      subjectiveRefractionsFar: {
        sphereLE: null,
        sphereRE: null,
        cylinderLE: null,
        cylinderRE: null,
        axisLE: null,
        axisRE: null,
        vareachedLE: null,
        vareachedRE: null,
        pupilarDistance: null,
      },
      subjectiveRefractionsNear: {
        sphereLE: null,
        sphereRE: null,
        cylinderLE: null,
        cylinderRE: null,
        axisLE: null,
        axisRE: null,
        vareachedLE: null,
        vareachedRE: null,
        pupilarDistance: null,
        add: null,
      },
      applanationTonometry: {
        leftEye: null,
        rightEye: null,
      },
    }),
  },
});

const emit = defineEmits(["update:visible", "print"]);

// Add computed properties to ensure data safety
const safePatientName = computed(() => props.clinicalRecord?.patient?.name || "");

const safeVisualAcuity = computed(() => props.clinicalRecord?.visualAcuity || {
  withoutCorrectionLE: null,
  withoutCorrectionRE: null,
  withoutCorrectionBI: null,
  laserCorrectionLE: null,
  laserCorrectionRE: null,
  laserCorrectionBI: null,
  pinholeLE: null,
  pinholeRE: null,
  pinholeBI: null,
  pupilRedLE: null,
  pupilRedRE: null,
});

const safeSubjectiveRefractionFar = computed(() => props.clinicalRecord?.subjectiveRefractionsFar || {
  sphereLE: null,
  sphereRE: null,
  cylinderLE: null,
  cylinderRE: null,
  axisLE: null,
  axisRE: null,
  vareachedLE: null,
  vareachedRE: null,
  pupilarDistance: null,
});

const safeSubjectiveRefractionNear = computed(() => props.clinicalRecord?.subjectiveRefractionsNear || {
  sphereLE: null,
  sphereRE: null,
  cylinderLE: null,
  cylinderRE: null,
  axisLE: null,
  axisRE: null,
  vareachedLE: null,
  vareachedRE: null,
  pupilarDistance: null,
  add: null,
});

const safeRefractionDefects = computed(() => props.clinicalRecord?.subjectiveRefractionDefects || {
  myopia: null,
  hyperopia: null,
  astigmatism: null,
  presbyopia: null,
  anisometropia: null
});

const safeTonometryLeftEye = computed(() => props.clinicalRecord?.applanationTonometry?.leftEye || null);
const safeTonometryRightEye = computed(() => props.clinicalRecord?.applanationTonometry?.rightEye || null);

const closeDialog = () => {
  emit("update:visible", false);
};

const printRecord = () => {  
  emit("print", props.clinicalRecord);
};
</script>
  
<style scoped>
.p-card {
  margin-bottom: 1rem;
}

.p-card .p-card-content {
  padding-top: 0.5rem;
}

.p-inputnumber {
  width: 100%;
}

.p-float-label {
  margin-bottom: 1rem;
}

.grid {
  display: grid;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.gap-2 {
  gap: 0.5rem;
}

.gap-4 {
  gap: 1rem;
}

.col-span-1 {
  grid-column: span 1 / span 1;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-3 {
  margin-top: 0.75rem;
}

.mb-1 {
  margin-bottom: 0.25rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.ml-2 {
  margin-left: 0.5rem;
}

.block {
  display: block;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.font-medium {
  font-weight: 500;
}

.text-gray-500 {
  color: #6b7280;
}
</style>
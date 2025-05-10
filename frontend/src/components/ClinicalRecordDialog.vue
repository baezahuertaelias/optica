<template>
    <Dialog
      :visible="visible"
      @update:visible="$emit('update:visible', $event)"
      modal
      :header="`Ficha clinica ${clinicalRecord.id}`"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <Card>
        <template #title>Información de Paciente</template>
        <template #content>
          <FloatLabel variant="on">
            <Textarea
              id="on_label_nombre"
              v-model="clinicalRecord.patient.name"
              rows="3"
              cols="60"
              style="resize: none"
              readonly
            />
            <label for="on_label_nombre">Nombre</label>
          </FloatLabel>
  
          <FloatLabel variant="on">
            <Textarea
              id="on_label_anamnsis"
              v-model="clinicalRecord.anamnesis"
              rows="3"
              cols="60"
              style="resize: none"
              readonly
            />
            <label for="on_label_anamnsis">Anamnesis</label>
          </FloatLabel>
  
          <FloatLabel variant="on">
            <Textarea
              id="othersDetails"
              v-model="clinicalRecord.othersDetails"
              rows="3"
              cols="60"
              style="resize: none"
              readonly
            />
            <label for="othersDetails">Otros Detalles</label>
          </FloatLabel>
        </template>
      </Card>
  
      <Card>
        <template #title>Agudeza Visual</template>
        <template #content>
          <div class="grid grid-cols-3 gap-2">
            <div class="col-span-1 mt-5">
              <label class="block text-sm font-medium mb-1">Sin Corrección</label>
              <div class="grid">
                <div class="field">
                  <small class="block text-gray-500">OI</small>
                  <InputNumber
                    v-model="clinicalRecord.visualAcuity.withoutCorrectionLE"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
                <div class="field">
                  <small class="block text-gray-500">OD</small>
                  <InputNumber
                    v-model="clinicalRecord.visualAcuity.withoutCorrectionRE"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
                <div class="field">
                  <small class="block text-gray-500">AO</small>
                  <InputNumber
                    v-model="clinicalRecord.visualAcuity.withoutCorrectionBI"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
              </div>
            </div>
  
            <div class="col-span-1 mt-5">
              <label class="block text-sm font-medium mb-1">Con Corrección</label>
              <div class="grid">
                <div>
                  <small class="block text-gray-500">OI</small>
                  <InputNumber
                    v-model="clinicalRecord.visualAcuity.laserCorrectionLE"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
                <div>
                  <small class="block text-gray-500">OD</small>
                  <InputNumber
                    v-model="clinicalRecord.visualAcuity.laserCorrectionRE"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
                <div>
                  <small class="block text-gray-500">AO</small>
                  <InputNumber
                    v-model="clinicalRecord.visualAcuity.laserCorrectionBI"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
              </div>
            </div>
  
            <div class="col-span-1 mt-5">
              <label class="block text-sm font-medium mb-1">Agujero Estenopeico</label>
              <div class="grid">
                <div>
                  <small class="block text-gray-500">OI</small>
                  <InputNumber
                    v-model="clinicalRecord.visualAcuity.pinholeLE"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
                <div>
                  <small class="block text-gray-500">OD</small>
                  <InputNumber
                    v-model="clinicalRecord.visualAcuity.pinholeRE"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
                <div>
                  <small class="block text-gray-500">AO</small>
                  <InputNumber
                    v-model="clinicalRecord.visualAcuity.pinholeBI"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
              </div>
            </div>
          </div>
  
          <div class="grid grid-cols-2 gap-2 mt-2">
            <div>
              <label class="block text-sm font-medium mb-1">Pupila Roja OI</label>
              <InputNumber
                v-model="clinicalRecord.visualAcuity.pupilRedLE"
                readonly
                mode="decimal"
                :minFractionDigits="2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Pupila Roja OD</label>
              <InputNumber
                v-model="clinicalRecord.visualAcuity.pupilRedRE"
                readonly
                mode="decimal"
                :minFractionDigits="2"
              />
            </div>
          </div>
        </template>
      </Card>
  
      <Card>
        <template #title>Refracción Subjetiva (Lejos)</template>
        <template #content>
          <div class="grid ">
            <div>
              <h3 class="text-lg font-medium mb-2">Ojo Izquierdo (OI)</h3>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-sm font-medium mb-1">Esfera</label>
                  <InputNumber
                    v-model="clinicalRecord.subjectiveRefractionsFar.sphereLE"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Cilindro</label>
                  <InputNumber
                    v-model="clinicalRecord.subjectiveRefractionsFar.cylinderLE"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Eje</label>
                  <InputNumber
                    v-model="clinicalRecord.subjectiveRefractionsFar.axisLE"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">AV</label>
                  <InputNumber
                    v-model="clinicalRecord.subjectiveRefractionsFar.vareachedLE"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
              </div>
            </div>
  
            <div>
              <h3 class="text-lg font-medium mb-2">Ojo Derecho (OD)</h3>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-sm font-medium mb-1">Esfera</label>
                  <InputNumber
                    v-model="clinicalRecord.subjectiveRefractionsFar.sphereRE"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Cilindro</label>
                  <InputNumber
                    v-model="clinicalRecord.subjectiveRefractionsFar.cylinderRE"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Eje</label>
                  <InputNumber
                    v-model="clinicalRecord.subjectiveRefractionsFar.axisRE"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">AV</label>
                  <InputNumber
                    v-model="clinicalRecord.subjectiveRefractionsFar.vareachedRE"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
              </div>
            </div>
          </div>
  
          <div class="mt-3">
            <label class="block text-sm font-medium mb-1">Distancia Pupilar</label>
            <InputNumber
              v-model="clinicalRecord.subjectiveRefractionsFar.pupilarDistance"
              readonly
              mode="decimal"
              :minFractionDigits="2"
            />
          </div>
        </template>
      </Card>
  
      <Card>
        <template #title>Refracción Subjetiva (Cerca)</template>
        <template #content>
          <div class="grid">
            <div>
              <h3 class="text-lg font-medium mb-2">Ojo Izquierdo (OI)</h3>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-sm font-medium mb-1">Esfera</label>
                  <InputNumber
                    v-model="clinicalRecord.subjectiveRefractionsNear.sphereLE"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Cilindro</label>
                  <InputNumber
                    v-model="clinicalRecord.subjectiveRefractionsNear.cylinderLE"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Eje</label>
                  <InputNumber
                    v-model="clinicalRecord.subjectiveRefractionsNear.axisLE"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">AV</label>
                  <InputNumber
                    v-model="clinicalRecord.subjectiveRefractionsNear.vareachedLE"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
              </div>
            </div>
  
            <div>
              <h3 class="text-lg font-medium mb-2">Ojo Derecho (OD)</h3>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-sm font-medium mb-1">Esfera</label>
                  <InputNumber
                    v-model="clinicalRecord.subjectiveRefractionsNear.sphereRE"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Cilindro</label>
                  <InputNumber
                    v-model="clinicalRecord.subjectiveRefractionsNear.cylinderRE"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Eje</label>
                  <InputNumber
                    v-model="clinicalRecord.subjectiveRefractionsNear.axisRE"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">AV</label>
                  <InputNumber
                    v-model="clinicalRecord.subjectiveRefractionsNear.vareachedRE"
                    readonly
                    mode="decimal"
                    :minFractionDigits="2"
                  />
                </div>
              </div>
            </div>
          </div>
  
          <div class="mt-3">
            <label class="block text-sm font-medium mb-1">Distancia Pupilar</label>
            <InputNumber
              v-model="clinicalRecord.subjectiveRefractionsNear.pupilarDistance"
              readonly
              mode="decimal"
              :minFractionDigits="2"
            />
          </div>
        </template>
      </Card>
  
      <Card>
        <template #title>Tonometría de Aplanación</template>
        <template #content>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Ojo Izquierdo (OI)</label>
              <InputNumber
                v-model="clinicalRecord.applanationTonometry.leftEye"
                readonly
                mode="decimal"
                :minFractionDigits="2"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Ojo Derecho (OD)</label>
              <InputNumber
                v-model="clinicalRecord.applanationTonometry.rightEye"
                readonly
                mode="decimal"
                :minFractionDigits="2"
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
  import { defineProps, defineEmits } from "vue";
  import Dialog from "primevue/dialog";
  import Card from "primevue/card";
  import FloatLabel from "primevue/floatlabel";
  import Textarea from "primevue/textarea";
  import InputNumber from "primevue/inputnumber";
  import Button from "primevue/button";
  
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
        },
        applanationTonometry: {
          leftEye: null,
          rightEye: null,
        },
      }),
    },
  });
  
  const emit = defineEmits(["update:visible", "print"]);
  
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
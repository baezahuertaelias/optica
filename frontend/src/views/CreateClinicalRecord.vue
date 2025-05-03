<template>
  <div class="p-3">
    <h1>{{ isNew ? "Crear Ficha clinica" : "Modificar Ficha clinica" }}</h1>
    <form @submit.prevent="saveClinicalRecord">
      <Card>
        <template #title>Simple Card</template>
        <template #content>
          <Dropdown
            v-model="clinicalRecord.patientId"
            :options="patients"
            optionLabel="name"
            optionValue="id"
            placeholder="Nombre"
            required
          />
          <FloatLabel variant="on">
            <Textarea
              id="on_label"
              v-model="clinicalRecord.anamnesis"
              rows="5"
              cols="30"
              style="resize: none"
            />
            <label for="on_label">Anamnesis</label>
          </FloatLabel>

          <FloatLabel variant="on">
            <Textarea
              id="othersDetails"
              v-model="clinicalRecord.othersDetails"
              rows="5"
              cols="30"
              style="resize: none"
            />
            <label for="othersDetails">othersDetails</label>
          </FloatLabel>
        </template>
      </Card>

      <Card>
        <template #title>Simple Card</template>
        <template #content>
          <!-- visualAcuity -->
          <InputNumber
            v-model="clinicalRecord.visualAcuity.withoutCorrectionLE"
            :invalid="clinicalRecord.visualAcuity.withoutCorrectionLE === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="withoutCorrectionLE"
          />
          <InputNumber
            v-model="clinicalRecord.visualAcuity.withoutCorrectionRE"
            :invalid="clinicalRecord.visualAcuity.withoutCorrectionRE === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="withoutCorrectionRE"
          />
          <InputNumber
            v-model="clinicalRecord.visualAcuity.withoutCorrectionBI"
            :invalid="clinicalRecord.visualAcuity.withoutCorrectionBI === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="withoutCorrectionBI"
          />

          <InputNumber
            v-model="clinicalRecord.visualAcuity.laserCorrectionLE"
            :invalid="clinicalRecord.visualAcuity.laserCorrectionLE === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="laserCorrectionLE"
          />
          <InputNumber
            v-model="clinicalRecord.visualAcuity.laserCorrectionRE"
            :invalid="clinicalRecord.visualAcuity.laserCorrectionRE === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="laserCorrectionRE"
          />
          <InputNumber
            v-model="clinicalRecord.visualAcuity.laserCorrectionBI"
            :invalid="clinicalRecord.visualAcuity.laserCorrectionBI === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="laserCorrectionBI"
          />

          <InputNumber
            v-model="clinicalRecord.visualAcuity.pinholeLE"
            :invalid="clinicalRecord.visualAcuity.pinholeLE === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="pinholeLE"
          />
          <InputNumber
            v-model="clinicalRecord.visualAcuity.pinholeRE"
            :invalid="clinicalRecord.visualAcuity.pinholeRE === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="pinholeRE"
          />
          <InputNumber
            v-model="clinicalRecord.visualAcuity.pinholeBI"
            :invalid="clinicalRecord.visualAcuity.pinholeBI === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="pinholeBI"
          />

          <InputNumber
            v-model="clinicalRecord.visualAcuity.pupilRedLE"
            :invalid="clinicalRecord.visualAcuity.pupilRedLE === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="pupilRedLE"
          />
          <InputNumber
            v-model="clinicalRecord.visualAcuity.pupilRedRE"
            :invalid="clinicalRecord.visualAcuity.pupilRedRE === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="pupilRedRE"
          />
        </template>
      </Card>

      <Card>
        <template #title>Simple Card</template>
        <template #content>
          <!-- FAR -->
          <InputNumber
            v-model="clinicalRecord.subjectiveRefractionFar.sphereLE"
            :invalid="clinicalRecord.subjectiveRefractionFar.sphereLE === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionFar.sphereLE"
          />

          <InputNumber
            v-model="clinicalRecord.subjectiveRefractionFar.sphereRE"
            :invalid="clinicalRecord.subjectiveRefractionFar.sphereRE === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionFar.sphereRE"
          />

          <InputNumber
            v-model="clinicalRecord.subjectiveRefractionFar.cylinderLE"
            :invalid="
              clinicalRecord.subjectiveRefractionFar.cylinderLE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionFar.cylinderLE"
          />

          <InputNumber
            v-model="clinicalRecord.subjectiveRefractionFar.cylinderRE"
            :invalid="
              clinicalRecord.subjectiveRefractionFar.cylinderRE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionFar.cylinderRE"
          />

          <InputNumber
            v-model="clinicalRecord.subjectiveRefractionFar.axisLE"
            :invalid="clinicalRecord.subjectiveRefractionFar.axisLE === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionFar.axisLE"
          />

          <InputNumber
            v-model="clinicalRecord.subjectiveRefractionFar.axisRE"
            :invalid="clinicalRecord.subjectiveRefractionFar.axisRE === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionFar.axisRE"
          />

          <InputNumber
            v-model="clinicalRecord.subjectiveRefractionFar.vareachedLE"
            :invalid="
              clinicalRecord.subjectiveRefractionFar.vareachedLE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionFar.vareachedLE"
          />

          <InputNumber
            v-model="clinicalRecord.subjectiveRefractionFar.vareachedRE"
            :invalid="
              clinicalRecord.subjectiveRefractionFar.vareachedRE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionFar.vareachedRE"
          />

          <InputNumber
            v-model="clinicalRecord.subjectiveRefractionFar.pupilarDistance"
            :invalid="
              clinicalRecord.subjectiveRefractionFar.pupilarDistance === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionFar.pupilarDistance"
          />

          <!-- NEAR -->

          <InputNumber
            v-model="clinicalRecord.subjectiveRefractionNear.sphereLE"
            :invalid="clinicalRecord.subjectiveRefractionNear.sphereLE === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionNear.sphereLE"
          />

          <InputNumber
            v-model="clinicalRecord.subjectiveRefractionNear.sphereRE"
            :invalid="clinicalRecord.subjectiveRefractionNear.sphereRE === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionNear.sphereRE"
          />

          <InputNumber
            v-model="clinicalRecord.subjectiveRefractionNear.cylinderLE"
            :invalid="
              clinicalRecord.subjectiveRefractionNear.cylinderLE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionNear.cylinderLE"
          />

          <InputNumber
            v-model="clinicalRecord.subjectiveRefractionNear.cylinderRE"
            :invalid="
              clinicalRecord.subjectiveRefractionNear.cylinderRE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionNear.cylinderRE"
          />

          <InputNumber
            v-model="clinicalRecord.subjectiveRefractionNear.axisLE"
            :invalid="clinicalRecord.subjectiveRefractionNear.axisLE === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionNear.axisLE"
          />

          <InputNumber
            v-model="clinicalRecord.subjectiveRefractionNear.axisRE"
            :invalid="clinicalRecord.subjectiveRefractionNear.axisRE === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionNear.axisRE"
          />

          <InputNumber
            v-model="clinicalRecord.subjectiveRefractionNear.vareachedLE"
            :invalid="
              clinicalRecord.subjectiveRefractionNear.vareachedLE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionNear.vareachedLE"
          />

          <InputNumber
            v-model="clinicalRecord.subjectiveRefractionNear.vareachedRE"
            :invalid="
              clinicalRecord.subjectiveRefractionNear.vareachedRE === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionNear.vareachedRE"
          />

          <InputNumber
            v-model="clinicalRecord.subjectiveRefractionNear.pupilarDistance"
            :invalid="
              clinicalRecord.subjectiveRefractionNear.pupilarDistance === null
            "
            mode="decimal"
            :minFractionDigits="2"
            placeholder="subjectiveRefractionNear.pupilarDistance"
          />
        </template>
      </Card>

      <Card>
        <template #title>Simple Card</template>
        <template #content>
          <InputNumber
            v-model="clinicalRecord.applanationTonometry.leftEye"
            :invalid="clinicalRecord.applanationTonometry.leftEye === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="applanationTonometry.leftEye"
          />

          <InputNumber
            v-model="clinicalRecord.applanationTonometry.rightEye"
            :invalid="clinicalRecord.applanationTonometry.rightEye === null"
            mode="decimal"
            :minFractionDigits="2"
            placeholder="applanationTonometry.rightEye"
          />
        </template>
      </Card>

      <Button label="Guardar" class="mt-3" type="submit" />
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import Textarea from "primevue/textarea";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import apiClient from "../axios-config";
import Card from "primevue/card";

const router = useRouter();
const route = useRoute();

// State to hold patient data
const clinicalRecord = ref({
  patientId: null,
  userId: parseInt(localStorage.getItem("iduser")),
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
  subjectiveRefractionFar: {
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
  subjectiveRefractionNear: {
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
});

const isNew = ref(true);
const patients = ref([]);

onMounted(async () => {
  const patientId = route.query.id || route.params.id; // Use query or params to get the ID
  if (patientId) {
    isNew.value = false;
    fetchPatientDetails(patientId);
  }
  /* await fetchGenders(); */
  fetchPatients()
});

const fetchPatientDetails = async (id) => {
  try {
    const response = await apiClient.get(`/patients/${id}`);
    if (response.status === 200) {
      console.log("[fetchPatientDetails]", response.data);

      patient.value = response.data.patient;
    }
  } catch (error) {
    console.error("Error fetching patient details:", error);
  }
};

const saveClinicalRecord = async () => {
  const clinicalRecordData = { ...clinicalRecord.value };
  console.log("[saveClinicalRecord]", clinicalRecordData);

  //TODO recordar que el userID hay que enviarlo y deberia ser el usuario actual, no otro

  try {
    if (isNew.value) {
      await apiClient.post("/clinicalRecords", clinicalRecord.value);
    } else {
      await apiClient.put(
        `/clinicalRecords/${clinicalRecord.value.id}`,
        clinicalRecord.value
      );
    }
    router.push("/app/listClinicalRecord");
  } catch (error) {
    console.error("Error saving clinicalRecord:", error);
  }
};

const fetchPatients = async () => {
  try {
    const response = await apiClient.get("clinicalRecords/patients/list");
    console.log("[fetchPatients]", response.data.patients);

    if (response.status === 200) {
      patients.value = response.data.patients;
    }
  } catch (error) {
    console.error("Failed to fetch patients:", error);
  }
};
</script>
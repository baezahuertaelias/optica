<template>
  <div class="p-3">
    <Toast position="bottom-center" group="bc" @close="onClose">
      <template #message="slotProps">
        <div class="flex flex-col items-start flex-auto">
          <span class="font-bold">{{ slotProps.message.title }}</span>
          <div class="font-medium text-lg my-4">
            {{ slotProps.message.summary }}
          </div>
          <Button
            size="small"
            label="Cargar"
            severity="success"
            @click="onReply()"
          ></Button>
        </div>
      </template>
    </Toast>

    <h1>{{ isNew ? "Crear OT" : "Modificar OT" }}</h1>
    <form @submit.prevent="saveOT">
      <div class="mb-3">
        <label for="patient" class="block mb-2">Paciente</label>
        <AutoComplete
          id="patient"
          v-model="selectedPatient"
          v-model:suggestions="filteredPatients"
          optionLabel="name"
          placeholder="Buscar paciente por nombre"
          @complete="searchPatients"
          class="w-full"
          dropdown
          forceSelection
          @item-select="onPatientSelect"
        >
          <template #item="slotProps">
            <div class="flex items-center">
              <div>
                {{ slotProps.item.name }} - {{ slotProps.item.passport }}
              </div>
            </div>
          </template>
          <template #header>
            <div class="font-medium px-3 py-2">Pacientes creados</div>
          </template>
          <template #footer>
            <div class="px-3 py-3">
              <Button
                label="Agregar paciente"
                fluid
                severity="secondary"
                text
                size="small"
                icon="pi pi-plus"
                @click="showTemplate"
              />
            </div>
          </template>
        </AutoComplete>

        <Card>
          <template #title>Lentes</template>
          <template #content>
            <Card>
              <template #title>Cerca</template>
              <template #content>
                <InputNumber
                  v-model="clinicalRecord.subjectiveRefractionNear.sphereLE"
                  :invalid="
                    clinicalRecord.subjectiveRefractionNear.sphereLE === null
                  "
                  mode="decimal"
                  :minFractionDigits="2"
                  placeholder="subjectiveRefractionNear.sphereLE"
                />

                <InputNumber
                  v-model="clinicalRecord.subjectiveRefractionNear.sphereRE"
                  :invalid="
                    clinicalRecord.subjectiveRefractionNear.sphereRE === null
                  "
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
                  :invalid="
                    clinicalRecord.subjectiveRefractionNear.axisLE === null
                  "
                  mode="decimal"
                  :minFractionDigits="2"
                  placeholder="subjectiveRefractionNear.axisLE"
                />

                <InputNumber
                  v-model="clinicalRecord.subjectiveRefractionNear.axisRE"
                  :invalid="
                    clinicalRecord.subjectiveRefractionNear.axisRE === null
                  "
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
                  v-model="
                    clinicalRecord.subjectiveRefractionNear.pupilarDistance
                  "
                  :invalid="
                    clinicalRecord.subjectiveRefractionNear.pupilarDistance ===
                    null
                  "
                  mode="decimal"
                  :minFractionDigits="2"
                  placeholder="subjectiveRefractionNear.pupilarDistance"
                />
              </template>
            </Card>

            <Card>
              <template #title>Lejos</template>
              <template #content>
                <!-- FAR -->
                <InputNumber
                  v-model="clinicalRecord.subjectiveRefractionFar.sphereLE"
                  :invalid="
                    clinicalRecord.subjectiveRefractionFar.sphereLE === null
                  "
                  mode="decimal"
                  :minFractionDigits="2"
                  placeholder="subjectiveRefractionFar.sphereLE"
                />

                <InputNumber
                  v-model="clinicalRecord.subjectiveRefractionFar.sphereRE"
                  :invalid="
                    clinicalRecord.subjectiveRefractionFar.sphereRE === null
                  "
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
                  :invalid="
                    clinicalRecord.subjectiveRefractionFar.axisLE === null
                  "
                  mode="decimal"
                  :minFractionDigits="2"
                  placeholder="subjectiveRefractionFar.axisLE"
                />

                <InputNumber
                  v-model="clinicalRecord.subjectiveRefractionFar.axisRE"
                  :invalid="
                    clinicalRecord.subjectiveRefractionFar.axisRE === null
                  "
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
                  v-model="
                    clinicalRecord.subjectiveRefractionFar.pupilarDistance
                  "
                  :invalid="
                    clinicalRecord.subjectiveRefractionFar.pupilarDistance ===
                    null
                  "
                  mode="decimal"
                  :minFractionDigits="2"
                  placeholder="subjectiveRefractionFar.pupilarDistance"
                />
              </template>
            </Card>

            <Card>
              <template #title>Otros detalles</template>
              <template #content>
                <div class="card flex flex-wrap justify-center gap-4">
                  <div class="flex items-center gap-2">
                    <Checkbox
                      v-model="pizza"
                      inputId="ingredient1"
                      name="pizza"
                      value="Cheese"
                    />
                    <label for="ingredient1"> Bifocal </label>
                  </div>
                  <div class="flex items-center gap-2">
                    <Checkbox
                      v-model="pizza"
                      inputId="ingredient2"
                      name="pizza"
                      value="Mushroom"
                    />
                    <label for="ingredient2"> Monofocal </label>
                  </div>
                </div>
                <AutoComplete
                  id="patient"
                  v-model="selectedPatient"
                  v-model:suggestions="filteredPatients"
                  optionLabel="name"
                  placeholder="Buscar Lentes"
                  @complete="searchPatients"
                  class="w-full"
                  dropdown
                  forceSelection
                >
                  <template #item="slotProps">
                    <div class="flex items-center">
                      <div>
                        {{ slotProps.item.name }} -
                        {{ slotProps.item.passport }}
                      </div>
                    </div>
                  </template>
                  <template #header>
                    <div class="font-medium px-3 py-2">Pacientes creados</div>
                  </template>
                  <template #footer>
                    <div class="px-3 py-3">
                      <Button
                        label="Agregar paciente"
                        fluid
                        severity="secondary"
                        text
                        size="small"
                        icon="pi pi-plus"
                        @click="showTemplate"
                      />
                    </div>
                  </template>
                </AutoComplete>

                <AutoComplete
                  id="patient"
                  v-model="selectedPatient"
                  v-model:suggestions="filteredPatients"
                  optionLabel="name"
                  placeholder="Buscar modelo"
                  @complete="searchPatients"
                  class="w-full"
                  dropdown
                  forceSelection
                >
                  <template #item="slotProps">
                    <div class="flex items-center">
                      <div>
                        {{ slotProps.item.name }} -
                        {{ slotProps.item.passport }}
                      </div>
                    </div>
                  </template>
                  <template #header>
                    <div class="font-medium px-3 py-2">Pacientes creados</div>
                  </template>
                  <template #footer>
                    <div class="px-3 py-3">
                      <Button
                        label="Agregar paciente"
                        fluid
                        severity="secondary"
                        text
                        size="small"
                        icon="pi pi-plus"
                        @click="showTemplate"
                      />
                    </div>
                  </template>
                </AutoComplete>
              </template>
            </Card>
          </template>
        </Card>
      </div>

      <!-- Add other form fields here as needed -->

      <Button
        label="Guardar"
        class="mt-3"
        type="submit"
        @click="showTemplate"
      />
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import apiClient from "../axios-config";
import AutoComplete from "primevue/autocomplete";
import Toast from "primevue/toast";
import Card from "primevue/card";
import InputNumber from "primevue/inputnumber";
import Checkbox from "primevue/checkbox";

const router = useRouter();
const route = useRoute();
const toast = useToast();

// State to hold data
const patients = ref([]);
const filteredPatients = ref([]);
const selectedPatient = ref(null);
const isNew = ref(true);
const visible = ref(false);
const clinicalRecord = ref({
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
  anamnesis: "",
  gafas: {
    tipo: null,
    marca: null,
    lente: null,
  },
  pagos: {
    total: null,
    abono: null,
    diff: null,
  },
});

onMounted(() => {
  const otId = route.query.id || route.params.id;

  if (otId) {
    isNew.value = false;
    // If needed, fetch existing OT data here
  }

  fetchClients();
});

const onReply = () => {
  toast.removeGroup("bc");
  visible.value = false;
};

const onClose = () => {
  visible.value = false;
};

const searchPatients = (event) => {
  const query = event.query.toLowerCase();
  filteredPatients.value = patients.value.filter(
    (patient) =>
      patient.name.toLowerCase().includes(query) ||
      patient.passport.toLowerCase().includes(query)
  );
};

const fetchClients = async () => {
  try {
    const response = await apiClient.get("/patients");

    if (response.status === 200) {
      patients.value = response.data.patients;
    }
  } catch (error) {
    console.error("ERROR fetching patients:", error);

    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.response?.data?.message || "Error al cargar pacientes",
      life: 3000,
    });
  }
};

const onPatientSelect = (event) => {
  visible.value = true;

  toast.add({
    severity: "success",
    title: "Atencion",
    summary: ` Se encontro informacion ${event.value.name}`,
    group: "bc",
  });
  visible.value = true;
};

const saveOT = async () => {
  try {
    if (!selectedPatient.value) {
      toast.add({
        severity: "warn",
        summary: "Advertencia",
        detail: "Debe seleccionar un paciente",
        life: 3000,
      });
      return;
    }

    const otData = {
      patientId: selectedPatient.value.id,
      // Add other OT fields here
    };

    let response;
    if (isNew.value) {
      response = await apiClient.post("/ot", otData);
    } else {
      const otId = route.query.id || route.params.id;
      response = await apiClient.put(`/ot/${otId}`, otData);
    }

    if (response.status === 200 || response.status === 201) {
      toast.add({
        severity: "success",
        summary: "Éxito",
        detail: isNew.value
          ? "OT creada correctamente"
          : "OT actualizada correctamente",
        life: 3000,
      });
      router.push("/app/listOT"); // Adjust the route as needed
    }
  } catch (error) {
    console.error("Failed to save OT:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.response?.data?.message || "Error al guardar la OT",
      life: 3000,
    });
  }
};
</script>

<style scoped>
.page-container {
  padding: 1rem;
}

.card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.field {
  margin-bottom: 1rem;
}

.w-full {
  width: 100%;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}
</style>
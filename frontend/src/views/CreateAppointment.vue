<template>
  <div class="p-3">
    <Toast />
    <h1>{{ isNew ? "Crear Agendamiento" : "Modificar Agendamiento" }}</h1>

    <div class="grid">
      <div class="col-6 md:col-4">
        <Card>
          <template #header>Información del Agendamiento</template>
          <template #content>
            <div class="field mb-4">
              <label class="block mb-2">Paciente</label>
              <Dropdown
                v-model="appointmentData.patientId"
                :options="patients"
                optionLabel="name"
                optionValue="id"
                placeholder="Seleccionar Paciente"
                class="w-full"
                required
                @change="onPatientChange"
              />
              <small
                v-if="submitted && !appointmentData.patientId"
                class="p-error"
              >
                Paciente es requerido
              </small>
            </div>

            <div class="field mb-4">
              <label class="block mb-2">Doctor</label>
              <Dropdown
                v-model="appointmentData.userId"
                :options="doctors"
                optionLabel="name"
                optionValue="id"
                placeholder="Seleccionar Doctor"
                class="w-full"
                required
                :disabled="!appointmentData.patientId"
                @change="onDoctorChange"
              />
              <small
                v-if="submitted && !appointmentData.userId"
                class="p-error"
              >
                Doctor es requerido
              </small>
            </div>

            <div class="field mb-4">
              <label class="block mb-2">Tipo de Agendamiento</label>
              <Dropdown
                v-model="appointmentData.typeAppointmentId"
                :options="appointmentTypes"
                optionLabel="name"
                optionValue="id"
                placeholder="Seleccionar Tipo"
                class="w-full"
                required
                :disabled="!appointmentData.userId"
                @change="onTypeChange"
              />
              <small
                v-if="submitted && !appointmentData.typeAppointmentId"
                class="p-error"
              >
                Tipo de agendamiento es requerido
              </small>
              <small v-if="selectedType" class="p-info text-blue-500">
                Duración: {{ selectedType.duration }} minutos
              </small>
            </div>

            <div class="field mb-4">
              <label class="block mb-2">Fecha y Hora de atención</label>
              <Calendar
                v-model="appointmentData.start"
                showTime
                hourFormat="24"
                dateFormat="dd/mm/yy"
                placeholder="Seleccionar Fecha y Hora"
                class="w-full"
                :disabled="!appointmentData.typeAppointmentId"
                @date-select="calculateEndTime"
                @update:model-value="calculateEndTime"
              />
              <small v-if="submitted && !appointmentData.start" class="p-error">
                Fecha y hora de inicio es requerida
              </small>
            </div>

            <div class="field mb-4">
              <label class="block mb-2">Notas</label>
              <Textarea
                v-model="appointmentData.notes"
                rows="3"
                placeholder="Notas adicionales"
                class="w-full"
                :disabled="!appointmentData.start"
              />
            </div>

            <div class="flex justify-content-end">
              <Button
                label="Cancelar"
                icon="pi pi-times"
                class="p-button-secondary mr-2"
                @click="goBack"
              />
              <Button
                label="Guardar"
                icon="pi pi-check"
                @click="saveAppointment"
                :loading="loading"
                :disabled="!isFormValid || hasConflicts"
              />
            </div>
          </template>
        </Card>
      </div>

      <div class="col-6 md:col-6">
        <Card>
          <template #header>Calendario</template>
          <template #content>
            <div v-if="hasConflicts" class="p-3 bg-red-100 border-round mb-3">
              <i class="pi pi-exclamation-triangle text-red-700 mr-2"></i>
              <span class="font-bold text-red-700">Conflicto de horario detectado</span>
              <p class="text-red-700 mt-2 mb-0">
                El horario seleccionado se superpone con otra cita. Por favor seleccione otro horario.
              </p>
            </div>
            <vue-cal
              :time-from="8 * 60"
              :time-to="20 * 60"
              :time-step="30"
              :disable-views="['years', 'year', 'month']"
              :events="events"
              :on-event-click="onEventClick"
              style="height: 600px"
              locale="es"
            />
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import apiClient from "../axios-config";

// PrimeVue Components
import Toast from "primevue/toast";
import Card from "primevue/card";
import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";

const router = useRouter();
const route = useRoute();
const toast = useToast();

// State variables
const isNew = ref(true);
const submitted = ref(false);
const loading = ref(false);
const patients = ref([]);
const doctors = ref([]);
const appointmentTypes = ref([]);
const events = ref([]);
const appointmentId = ref(null);
const hasConflicts = ref(false);

// Form data
const appointmentData = reactive({
  patientId: null,
  userId: null,
  typeAppointmentId: null,
  start: null,
  end: null,
  notes: null,
  status: true,
});

// Computed properties
const selectedType = computed(() => {
  if (!appointmentData.typeAppointmentId) return null;
  return appointmentTypes.value.find(t => t.id === appointmentData.typeAppointmentId);
});

const isFormValid = computed(() => {
  return (
    appointmentData.patientId &&
    appointmentData.userId &&
    appointmentData.typeAppointmentId &&
    appointmentData.start &&
    appointmentData.end
  );
});

// Check if we're editing an existing appointment
onMounted(async () => {
  if (route.params.id) {
    appointmentId.value = route.params.id;
    isNew.value = false;
    await fetchAppointmentDetails();
  }

  await Promise.all([fetchPatients(), fetchDoctors(), fetchAppointmentTypes()]);

  if (appointmentData.userId) {
    await loadDoctorAppointments();
  }
});

// Fetch data functions
const fetchPatients = async () => {
  try {
    const response = await apiClient.get("appointments/patients/list");
    if (response.status === 200) {
      patients.value = response.data.patients;
    }
  } catch (error) {
    console.error("Failed to fetch patients:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No se pudieron cargar los pacientes",
      life: 3000,
    });
  }
};

const fetchDoctors = async () => {
  try {
    const response = await apiClient.get("appointments/doctors/list");
    if (response.status === 200) {
      // Filter for users with type=2 (doctors)
      doctors.value = response.data.doctors
    }
  } catch (error) {
    console.error("Failed to fetch doctors:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No se pudieron cargar los doctores",
      life: 3000,
    });
  }
};

const fetchAppointmentTypes = async () => {
  try {
    const response = await apiClient.get("appointments/typeappointments/list");
    if (response.status === 200) {
      appointmentTypes.value = response.data.typeAppointments;
    }
  } catch (error) {
    console.error("Failed to fetch appointment types:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No se pudieron cargar los tipos de agendamiento",
      life: 3000,
    });
  }
};

const fetchAppointmentDetails = async () => {
  try {
    const response = await apiClient.get(`appointments/appointment/${appointmentId.value}`);
    if (response.status === 200) {
      const appointment = response.data.data;
      appointmentData.patientId = appointment.patientId;
      appointmentData.userId = appointment.userId;
      appointmentData.typeAppointmentId = appointment.typeAppointmentId;
      appointmentData.start = new Date(appointment.start);
      appointmentData.end = new Date(appointment.end);
      appointmentData.notes = appointment.notes;
      appointmentData.status = appointment.status;
    }
  } catch (error) {
    console.error("Failed to fetch appointment details:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No se pudo cargar la información del agendamiento",
      life: 3000,
    });
  }
};

const loadDoctorAppointments = async () => {
  if (!appointmentData.userId) return;

  try {
    // Get all appointments for selected doctor
    const response = await apiClient.get("appointments", {
      params: {
        userId: appointmentData.userId,
        status: true,
      },
    });

    if (response.status === 200) {
      // Map API appointments to VueCal format
      
      events.value = response.data.appointments.map((apt) => ({
        id: apt.id,
        start: new Date(apt.start),
        end: new Date(apt.end),
        title: `${apt.patient.name} - ${apt.appointmentType.name}`,
        class: appointmentId.value === apt.id ? "editing" : "busy",
        content: apt.notes || "",
        patientId: apt.patientId,
        typeAppointmentId: apt.typeAppointmentId,
      }));

      // Add current appointment if it's new and has start/end dates
      if (isNew.value && appointmentData.start && appointmentData.end) {
        addTentativeAppointment();
      }
    }
  } catch (error) {
    console.error("Failed to load doctor appointments:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No se pudieron cargar los agendamientos del doctor",
      life: 3000,
    });
  }
};

const addTentativeAppointment = () => {
  if (
    !appointmentData.start ||
    !appointmentData.end ||
    !appointmentData.patientId ||
    !appointmentData.typeAppointmentId
  )
    return;

  const patientName =
    patients.value.find((p) => p.id === appointmentData.patientId)?.name ||
    "Paciente";
  const typeName =
    appointmentTypes.value.find(
      (t) => t.id === appointmentData.typeAppointmentId
    )?.name || "Consulta";

  // Check if we already have a tentative appointment
  const tentativeIndex = events.value.findIndex((e) => e.class === "tentative");
  if (tentativeIndex !== -1) {
    events.value.splice(tentativeIndex, 1);
  }

  // Add tentative appointment
  events.value.push({
    id: "tentative",
    start: new Date(appointmentData.start),
    end: new Date(appointmentData.end),
    title: `${patientName} - ${typeName} (Pendiente)`,
    class: "tentative",
    content: appointmentData.notes || "",
  });
  
  // Check for conflicts immediately after adding the tentative appointment
  checkForConflicts();
};

// Step handlers
const onPatientChange = () => {
  // Reset following fields when patient changes
  appointmentData.userId = null;
  appointmentData.typeAppointmentId = null;
  appointmentData.start = null;
  appointmentData.end = null;
  events.value = [];
  hasConflicts.value = false;
};

const onDoctorChange = async () => {
  // Reset following fields when doctor changes
  appointmentData.typeAppointmentId = null;
  appointmentData.start = null;
  appointmentData.end = null;
  
  // Load the doctor's existing appointments
  if (appointmentData.userId) {
    await loadDoctorAppointments();
  }
};

const onTypeChange = () => {
  // Reset appointment time when type changes
  appointmentData.start = null;
  appointmentData.end = null;
  
  // Remove tentative appointment from calendar
  const tentativeIndex = events.value.findIndex((e) => e.class === "tentative");
  if (tentativeIndex !== -1) {
    events.value.splice(tentativeIndex, 1);
  }
  
  hasConflicts.value = false;
};

// Utils
const calculateEndTime = () => {
  if (!appointmentData.start || !appointmentData.typeAppointmentId) return;

  const type = selectedType.value;
  if (!type) return;

  const startTime = new Date(appointmentData.start);
  const endTime = new Date(startTime);
  endTime.setMinutes(startTime.getMinutes() + (type.duration || 30));

  appointmentData.end = endTime;

  if (appointmentData.userId) {
    addTentativeAppointment();
  }
};

const checkForConflicts = () => {
  if (!appointmentData.start || !appointmentData.end) {
    hasConflicts.value = false;
    return false;
  }

  const start = new Date(appointmentData.start).getTime();
  const end = new Date(appointmentData.end).getTime();

  // Check if any existing appointments overlap with the new one
  const conflicts = events.value.filter((event) => {
    if (event.class === "tentative" || event.id === appointmentId.value)
      return false;

    const eventStart = new Date(event.start).getTime();
    const eventEnd = new Date(event.end).getTime();

    return start < eventEnd && end > eventStart;
  });

  if (conflicts.length > 0) {
    hasConflicts.value = true;
    
    toast.add({
      severity: "warn",
      summary: "Conflicto de horario",
      detail: "El horario seleccionado se superpone con otra cita. Por favor seleccione otro horario.",
      life: 5000,
    });
    return true;
  }

  hasConflicts.value = false;
  return false;
};

// Events
const onEventClick = (event) => {
  if (event.id === "tentative" || event.id === appointmentId.value) return;

  toast.add({
    severity: "info",
    summary: "Cita existente",
    detail: `${event.title} - ${new Date(
      event.start
    ).toLocaleTimeString()} a ${new Date(event.end).toLocaleTimeString()}`,
    life: 3000,
  });
};

const saveAppointment = async () => {
  submitted.value = true;

  // Validate required fields
  if (
    !appointmentData.patientId ||
    !appointmentData.userId ||
    !appointmentData.typeAppointmentId ||
    !appointmentData.start
  ) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Por favor complete todos los campos requeridos",
      life: 3000,
    });
    return;
  }

  // Check for appointment conflicts
  if (checkForConflicts()) {
    return;
  }

  loading.value = true;

  try {
    let response;
    const payload = { ...appointmentData };

    // Convert dates to ISO strings
    payload.start = new Date(payload.start).toISOString();
    payload.end = new Date(payload.end).toISOString();

    if (isNew.value) {
      response = await apiClient.post("appointments", payload);
    } else {
      response = await apiClient.put(
        `appointments/${appointmentId.value}`,
        payload
      );
    }

    if (response.status === 201 || response.status === 200) {
      toast.add({
        severity: "success",
        summary: "Éxito",
        detail: isNew.value
          ? "Agendamiento creado correctamente"
          : "Agendamiento actualizado correctamente",
        life: 3000,
      });
      goBack();
    }
  } catch (error) {
    console.error("Failed to save appointment:", error);
    let errorMessage = "No se pudo guardar el agendamiento";

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    toast.add({
      severity: "error",
      summary: "Error",
      detail: errorMessage,
      life: 5000,
    });
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push("/app/showAgenda")
};

// Watch for changes to recalculate and validate
watch(() => appointmentData.start, () => {
  if (appointmentData.start && appointmentData.typeAppointmentId) {
    calculateEndTime();
  }
});
</script>

<style>
/* VueCal custom styles */
.vuecal__event.busy {
  background-color: #ff5252 !important;
  color: white;
  border-left: 3px solid #d32f2f;
}

.vuecal__event.editing {
  background-color: #4caf50 !important;
  color: white;
  border-left: 3px solid #2e7d32;
}

.vuecal__event.tentative {
  background-color: #ffb74d !important;
  color: white;
  border-left: 3px solid #f57c00;
  opacity: 0.8;
}

.p-invalid {
  border-color: #f44336;
}

.p-error {
  color: #f44336;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* Visual indication for disabled state */
.p-dropdown.p-disabled,
.p-calendar.p-disabled,
.p-inputtextarea.p-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
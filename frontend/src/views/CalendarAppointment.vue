<template>
  <div class="calendar-container">
    <vue-cal
      :events="formattedEvents"
      :time-from="8 * 60"
      :time-to="18 * 60"
      :time-step="5"
      :disable-views="['years', 'year']"
      default-view="week"
      @event-click="onEventClick"
      style="height: 100%"
      :cell-height="500"
      hide-weekends
      locale="es"
    >
      <template #event="{ event }">
        <div class="card" :style="{ backgroundColor: event.backgroundColor }">
          <div><strong>{{ event.title }}</strong> </div>
            <div><strong>Paciente:</strong> {{ event.patient }}</div>
            <div><strong>Doctor:</strong> {{ event.doctor }}</div>
        </div>
      </template>
      
    </vue-cal>
    
    <div v-if="selectedEvent" class="event-details-modal">
      <h1>Detalles de cita</h1>
      <div><strong>Paciente:</strong> {{ selectedEvent.patient }}</div>
      <div><strong>Doctor:</strong> {{ selectedEvent.doctor }}</div>
      <div><strong>Tipo atencion:</strong> {{ selectedEvent.type }}</div>
      <div><strong>Fecha:</strong> {{ formatDate(selectedEvent.start) }}</div>
      <div><strong>Hora:</strong> {{ formatTime(selectedEvent.start) }} - {{ formatTime(selectedEvent.end) }}</div>
      <div><strong>Duracion:</strong> {{ selectedEvent.duration }} minutos</div>
      <div><strong>Notas:</strong> {{ selectedEvent.notes }}</div>
      <button @click="selectedEvent = null">Cerrar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import apiClient from '../axios-config'


// Raw appointment data from API
const rawEvents = ref([])
const selectedEvent = ref(null)


// Transform appointments into vue-cal event format
const formattedEvents = computed(() => {
  return rawEvents.value.map(appointment => ({
    id: appointment.id,
    start: new Date(appointment.start),
    end: new Date(appointment.end),
    title: appointment.appointmentType?.name || 'Appointment',
    patient: appointment.patient?.name || 'Unknown Patient',
    doctor: appointment.user?.name || 'Unknown Doctor',
    type: appointment.appointmentType?.name || 'Unknown Type',
    duration: appointment.appointmentType?.duration || 0,
    notes: appointment.notes || '',
    status: appointment.status,
    // Use the color from the API if available, otherwise fallback to status-based color
    backgroundColor: appointment.appointmentType.color || (appointment.status ? '#4CAF50' : '#F44336'),
    content: appointment.notes,
    // Store the original data for reference
    originalData: appointment
  }))
})

// Function to fetch appointments from API
const fetchAppointments = async () => {
  try {
    const response = await apiClient.get("appointments");
    console.log("[fetchAppointments]", response.data.appointments);
    if (response.status === 200) {
      // Store the raw data from API
      rawEvents.value = response.data.appointments;
    }
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
  }
}

// Function to handle event click
const onEventClick = (event) => {
  selectedEvent.value = event
}

// Format date for display
const formatDate = (date) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString('es-CL', options)
}

// Format time for display
const formatTime = (date) => {
  const options = { hour: '2-digit', minute: '2-digit' }
  return new Date(date).toLocaleTimeString('es-CL', options)
}

onMounted(() => {
  fetchAppointments()
})
</script>

<style scoped>
.vuecal__cell {
  padding: 5px;
  min-height: 100px !important;
}

.calendar-container {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.card {
  padding: 8px;
  border-radius: 4px;
  color: white;
  height: 100%;
}

.event-content {
  padding: 4px;
  height: 100%;
  overflow: hidden;
}

.event-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.event-details {
  font-size: 12px;
}

.event-details-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-width: 400px;
  width: 100%;
}

.event-details-modal button {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Custom styles for the appointment status - keeping these for reference */
:deep(.active-appointment) {
  border-left: 4px solid #4CAF50;
}

:deep(.inactive-appointment) {
  border-left: 4px solid #F44336;
  opacity: 0.7;
}

/* Set fixed height for month view cells */
.vuecal--month-view .vuecal__cell {
  height: 200px !important;
  width: 100px
}
</style>
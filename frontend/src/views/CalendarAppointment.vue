<template>
  <div class="calendar-container">
    <h1>Appointment Calendar</h1>
    <vue-cal
      :events="formattedEvents"
      :time-from="8 * 60"
      :time-to="18 * 60"
      :time-step="15"
      :disable-views="['years', 'year']"
      default-view="week"
      @event-click="onEventClick"
      style="height: 600px"
    >
      <template #event="{ event }">
        <div class="card">
          <div><strong>Title:</strong> {{ event.title }}</div>
            <div><strong>Patient:</strong> {{ event.patient }}</div>
            <div><strong>Doctor:</strong> {{ event.doctor }}</div>
            <div><strong>Type:</strong> {{ event.type }}</div>
        </div>
      </template>
    </vue-cal>
    
    <div v-if="selectedEvent" class="event-details-modal">
      <h2>Appointment Details</h2>
      <div><strong>Patient:</strong> {{ selectedEvent.patient }}</div>
      <div><strong>Doctor:</strong> {{ selectedEvent.doctor }}</div>
      <div><strong>Type:</strong> {{ selectedEvent.type }}</div>
      <div><strong>Date:</strong> {{ formatDate(selectedEvent.start) }}</div>
      <div><strong>Time:</strong> {{ formatTime(selectedEvent.start) }} - {{ formatTime(selectedEvent.end) }}</div>
      <div><strong>Duration:</strong> {{ selectedEvent.duration }} minutes</div>
      <div><strong>Notes:</strong> {{ selectedEvent.notes }}</div>
      <button @click="selectedEvent = null">Close</button>
    </div>
  </div>
</template>

<script setup>
import Card from 'primevue/card'
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
    // Class based on appointment status
    class: appointment.status ? 'active-appointment' : 'inactive-appointment',
    // Custom color for the event
    backgroundColor: appointment.status ? '#4CAF50' : '#F44336',
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
  return new Date(date).toLocaleDateString(undefined, options)
}

// Format time for display
const formatTime = (date) => {
  const options = { hour: '2-digit', minute: '2-digit' }
  return new Date(date).toLocaleTimeString(undefined, options)
}

onMounted(() => {
  fetchAppointments()
})
</script>

<style scoped>
.calendar-container {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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

/* Custom styles for the appointment status */
:deep(.active-appointment) {
  border-left: 4px solid #4CAF50;
}

:deep(.inactive-appointment) {
  border-left: 4px solid #F44336;
  opacity: 0.7;
}
</style>
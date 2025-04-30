<template>
  <div class="page-container">
    <Toast/>
    <h1>Dashboard</h1>
    <!-- <Button label="Show" @click="show()" /> -->
    <Card>
      <template #title></template>
      <template #content>
        <FullCalendar :options="calendarOptions" events="https://fullcalendar.io/api/demo-feeds/events.json"/>
      </template>
     </Card>
    
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'


import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Toast from 'primevue/toast';
import Button from 'primevue/button';
import Card from 'primevue/Card';


import { useToast } from 'primevue/usetoast';



const toast = useToast();


const show = () => {
    toast.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });
};

/////////////////////////////
const events = ref([
  {
    id: '1',
    title: 'Company Meeting',
    start: '2025-05-02',
    end: '2025-05-02',
    backgroundColor: '#3788d8',
    borderColor: '#3788d8',
    allDay: true
  },
  {
    id: '2',
    title: 'Product Launch',
    start: '2025-05-07',
    end: '2025-05-09',
    backgroundColor: '#28a745',
    borderColor: '#28a745',
    allDay: true
  },
  {
    id: '3',
    title: 'Conference Call',
    start: '2025-05-12T14:30:00',
    end: '2025-05-12T16:00:00',
    backgroundColor: '#dc3545',
    borderColor: '#dc3545'
  },
  {
    id: '4',
    title: 'Team Building',
    start: '2025-05-15',
    end: '2025-05-16',
    backgroundColor: '#fd7e14',
    borderColor: '#fd7e14',
    allDay: true
  },
  {
    id: '5',
    title: 'Project Deadline',
    start: '2025-05-22',
    backgroundColor: '#6f42c1',
    borderColor: '#6f42c1',
    allDay: true
  },
  {
    id: '6',
    title: 'Client Meeting',
    start: '2025-05-18T10:00:00',
    end: '2025-05-18T11:30:00',
    backgroundColor: '#20c997',
    borderColor: '#20c997'
  }
])

const handleEventClick = (clickInfo) => {
  if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
    clickInfo.event.remove()
  }
}

const handleDateClick = (arg) => {
  const title = prompt('Please enter a new event title:')
  const calendarApi = arg.view.calendar

  if (title) {
    calendarApi.addEvent({
      id: String(events.value.length + 1),
      title,
      start: arg.dateStr,
      allDay: arg.allDay
    })
  }
}

// Calendar options using the Composition API
const calendarOptions = reactive({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek,dayGridDay'
  },
  //editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  events: events.value,
  eventClick: handleEventClick,
  dateClick: handleDateClick,
  locale: 'es',
  buttonText: {
  today:    'Hoy',
  month:    'Mes',
  week:     'Semana',
  day:      'Dia',
  list:     'Lista'
}
})



onMounted(()=> {
  //calendar.updateSize()
})

</script>
<style scoped>

.card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>


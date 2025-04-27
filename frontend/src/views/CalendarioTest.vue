<template>
  <div class="page-container">
    <Toast/>
    <h1>Dashboard</h1>
    <Button label="Show" @click="show()" />
    <!-- <FullCalendar :options="calendarOptions" /> -->
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Toast from 'primevue/toast';
import Button from 'primevue/button';

import { useToast } from 'primevue/usetoast';
const toast = useToast();



const calendarOptions = {
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  updateSize: 100
};

const show = () => {
    toast.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });
};


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


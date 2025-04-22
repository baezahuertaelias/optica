<template>
  <div>
    <v-sheet class="d-flex" height="54" tile>
      <v-select
        v-model="type"
        :items="types"
        class="ma-2"
        density="compact"
        label="View Mode"
        variant="outlined"
        hide-details
      ></v-select>
    </v-sheet>
    <v-sheet>
      <v-calendar
        ref="calendar"
        v-model="value"
        :events="events"
        :view-mode="type"
        :weekdays="weekday"
        @change="getEvents"
      >
        <template v-slot:event="{ event }">
          <div class="d-flex justify-space-between align-center py-2">
            <v-chip
              closable
              :color="event.color"
              small
              @click:close="onDeleteChip(event)"
            >
              {{ event.title }}
            </v-chip>
          </div>
        </template>

        


      </v-calendar>
    </v-sheet>
  </div>

  <v-dialog v-model="deleteDialog" persistent max-width="290">
    <v-card>
      <v-card-title class="headline">Delete Event?</v-card-title>
      <v-card-text
        >Are you sure you want to delete the event "{{ eventToDelete.title }}"
        ?</v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="cancelDelete">Cancel</v-btn>
        <v-btn color="red darken-1" text @click="deleteEvent">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useDate } from "vuetify";

export default {
  data: () => ({
    type: "week",
    types: ["month", "week", "day"],
    weekday: [0, 1, 2, 3, 4, 5, 6],
    value: [new Date()],
    events: [
      {
        title: "Agendamiento1",
        start: new Date("2025-04-21T09:00:00Z"),
        end: new Date("2025-04-21T11:00:00Z"),
        color: "#4F81BD",
      },
    ],
    colors: ["blue", "indigo", "deep-purple", "cyan", "green"],
    titles: [
      "Receta de lentes",
      "Agudeza visual",
      "Tonometria",
      "Retinografia sin dilatación",
      "Retinografia con dilatacion",
    ],
    deleteDialog: false,
    eventToDelete: null,
  }),
  mounted() {
    const adapter = useDate();
    this.getEvents({
      start: adapter.startOfDay(adapter.startOfMonth(new Date())),
      end: adapter.endOfDay(adapter.endOfMonth(new Date())),
    });
  },
  methods: {
    getEvents({ start, end }) {
      // Clear previous events
      this.events = [];
      console.log({ start, end });

      

      for (let index = 10; index < 20; index++) {

        const rndTitle = Math.round(Math.random() * (this.titles.length - 0) + 0)
        const rndColor = Math.round(Math.random() * (this.colors.length - 0) + 0)
        const rndDias = Math.round(Math.random() * (26 - 20) + 20)

      
        this.events.push({
        title: `${this.titles[rndTitle]} ${new Date().toISOString().slice(11)}`,
        start: new Date(`2025-04-${rndDias}T${index}:00:00Z`),
        end: new Date(`2025-04-${rndDias}T${index+1}:00:00Z`),
        color: this.colors[rndColor],
        allDay: false,
      });
        
      }
    },
    onDeleteChip(event) {
      // Show a confirmation dialog
      this.eventToDelete = event;
      this.deleteDialog = true; // Set deleteDialog to true to open the dialog
    },
    cancelDelete() {
      this.deleteDialog = false;
    },
    deleteEvent() {
      const index = this.events.findIndex(
        (e) => e.title === this.eventToDelete.title
      );
      if (index > -1) {
        this.events.splice(index, 1); // Remove event from events array
        this.deleteDialog = false; // Close the dialog after deletion
      }
    },
  },
};
</script>

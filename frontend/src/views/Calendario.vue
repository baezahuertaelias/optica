<template >
  <!-- <v-select
        v-model="type"
        :items="types"
        class="ma-2"
        density="compact"
        label="View Mode"
        variant="outlined"
        hide-details
      ></v-select> -->
      <Qalendar :events="events" :config="config" v-bind="themeConfig"/>
</template>

<script>
import { Qalendar } from "qalendar";

export default {
  components: {
    Qalendar,
  },

  data() {
    return {
      events: [
        {
          title: "Advanced algebra",
          with: "Chandler Bing",
          time: { start: "2022-05-16 12:05", end: "2022-05-16 13:35" },
          color: "yellow",
          isEditable: true,
          id: "753944708f0f",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores assumenda corporis doloremque et expedita molestias necessitatibus quam quas temporibus veritatis. Deserunt excepturi illum nobis perferendis praesentium repudiandae saepe sapiente voluptatem!",
        },
        {
          title: "Ralph on holiday",
          with: "Rachel Greene",
          time: { start: "2025-04-21 12:00", end: "2025-04-21 13:00" },
          color: "green",
          isEditable: true,
          id: "5602b6f589fc",
        },
      ],
      config: {
        week: {
          // Takes the value 'sunday' or 'monday'
          // However, if startsOn is set to 'sunday' and nDays to 5, the week displayed will be Monday - Friday
          startsOn: "monday",
          // Takes the values 5 or 7.
          nDays: 7,
          // Scroll to a certain hour on mounting a week. Takes any value from 0 to 23.
          // This option is not compatible with the 'dayBoundaries'-option, and will simply be ignored if custom day boundaries are set.
          scrollToHour: 5,
        },
        month: {
          // Hide leading and trailing dates in the month view (defaults to true when not set)
          showTrailingAndLeadingDates: false,
        },
        // Takes any valid locale that the browser understands. However, not all locales have been thorougly tested in Qalendar
        // If no locale is set, the preferred browser locale will be used
        locale: "es-CL",
        style: {
          // When adding a custom font, please also set the fallback(s) yourself
          //fontFamily: 'Nunito', sans-serif,
        },
        // if not set, the mode defaults to 'week'. The three available options are 'month', 'week' and 'day'
        // Please note, that only day and month modes are available for the calendar in mobile-sized wrappers (~700px wide or less, depending on your root font-size)
        defaultMode: "week",
        // The silent flag can be added, to disable the development warnings. This will also bring a slight performance boost
        isSilent: true,
        showCurrentTime: true, // Display a line indicating the current time
        dayIntervals: {
          length: 15, // Length in minutes of each interval. Accepts values 15, 30 and 60 (the latter is the default)
          height: 50, // The height of each interval
          displayClickableInterval: true, // Needs to be set explicitly to true, if you want to display clickable intervals
          intervalStyles: {backgroundColor: 'black', color: 'white'},
        },
      },
    };
  },
};
</script>

<style>
@import "../../node_modules/qalendar/dist/style.css";
</style>

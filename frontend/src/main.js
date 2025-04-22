import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css';
import * as labsComponents from 'vuetify/labs/components'

/* import VCalendar from 'v-calendar';
App.component('VCalendar', VCalendar); */ // This registers the component globally


/* const vuetify = createVuetify({
  components,
  directives,
})
 */

const vuetify = createVuetify({
  components: {
    ...components,
    ...labsComponents,
  },
  directives,
  theme: {
    defaultTheme: 'dark'
  }
})

createApp(App)
  .use(store)
  .use(router)
  .use(vuetify) // Add the Vuetify instance to Vue app
  .mount('#app');
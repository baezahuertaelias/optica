<template>
  <v-app :theme="themeObject">
    <!-- App Bar with Hamburger Menu -->
    <v-app-bar app color="primary" :dark="darkMode">
      <v-btn prepend-icon="mdi-menu" @click="toggleDrawer"></v-btn> <!-- Toggles the drawer -->
      <v-toolbar-title>Optica</v-toolbar-title>
      <v-spacer></v-spacer>

      <div class="theme-toggle">
        <v-switch 
          :value="darkMode" 
          @change="toggleDarkMode" 
          :label="`toggle ${switchLabel} mode`"
        ></v-switch>
      </div>

      <v-btn v-if="!isLoggedIn" prepend-icon="mdi-login" to="/login">Login</v-btn>
      <v-btn v-if="!isLoggedIn" prepend-icon="mdi-account-plus" to="/register">Register</v-btn>
      <v-btn v-if="isLoggedIn" prepend-icon="mdi-logout" @click.prevent="logout">Logout</v-btn>
    </v-app-bar>

    <!-- Navigation -->
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list density="compact">
        

        <template v-if="isLoggedIn">
          <!-- Looping through the events array and displaying each event -->
          
            <v-list-item v-for="(event, index) in rutas" :key="index" :to="event.path" :prepend-icon="event.icon">
              <v-list-item-title>{{event.name}}</v-list-item-title>
            </v-list-item>
          

          



        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="mt-12">
      <div v-if="error" class="text-center text-red mt-4">{{ error }}</div>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify'

export default {
  name: 'App',
  setup() {
    const store = useStore();
    const router = useRouter();
    const theme = useTheme()

    const drawer = computed(() => store.getters.drawer);
    const isLoggedIn = computed(() => store.getters.isLoggedIn);
    const error = computed(() => store.getters.error);

    const logout = () => {
      store.dispatch('logout');
      router.push('/login');
    };

    const toggleDrawer = () => {
      store.commit('SET_DRAWER', !drawer.value);
    };

    const toggleDarkMode = () => {
      theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
      //this.darkMode = !this.darkMode;
    }

    const rutas = router.options.routes;
    console.log({rutas});
    

    
    

    

    return {
      drawer,
      isLoggedIn,
      error,
      logout,
      toggleDrawer,
      toggleDarkMode,
      rutas
    };
  },
  data: () => ({ 
      darkMode: false
    }),
    methods: {
      
      /* toggleDarkMode: function () {
        theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
        this.darkMode = !this.darkMode;
      } */
    },
    computed: {
      switchLabel: function () {
        return this.darkMode ? 'light' : 'dark';
      }
    }
};
</script>

<style>
body, html {
  /* Other styles */
}
</style>
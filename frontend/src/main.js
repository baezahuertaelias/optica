// src/main.js
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ToastService from 'primevue/toastservice';
import App from './App.vue'

//uncomment to use tailwindcss
//import './style.css'

// PrimeVue imports
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import Nora from '@primeuix/themes/nora'
import 'primeicons/primeicons.css' // icons

// Route components
import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'
import UserProfile from './views/UserProfile.vue'
import Settings from './views/Settings.vue'
//New
import ListUser from './views/ListUser.vue'
import CreateUser from './views/CreateUser.vue'
//

import MainLayout from './layout/MainLayout.vue'
import CreatePatient from './views/CreatePatient.vue';
import ListPatient from './views/ListPatient.vue';
import ListClinicalRecords from './views/ListClinicalRecords.vue'
import CreateClinicalRecord from './views/CreateClinicalRecord.vue'
import ListOT from './views/ListOT.vue'
import CreateOT from './views/CreateOT.vue'
import CalendarAppointment from './views/CalendarAppointment.vue'
import CreateAppointment from './views/CreateAppointment.vue'


// Router configuration
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/app',
    component: MainLayout,
    redirect: '/app/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'profile',
        name: 'Profile',
        component: UserProfile
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings
      }
      ,
      {
        path: 'listUser',
        name: 'Listado usuarios',
        component: ListUser
      },
      {
        path: 'createUser/:id?',
        name: 'Crear usuario',
        component: CreateUser
      },
      {
        path: 'listPatient',
        name: 'Listado paciente',
        component: ListPatient
      },
      {
        path: 'createPatient/:id?',
        name: 'Crear paciente',
        component: CreatePatient
      },
      {
        path: 'listClinicalRecord',
        name: "Listado Fichas clinicas",
        component: ListClinicalRecords
      },
      {
        path: 'createClinicalRecord',
        name: "Crear Ficha clinica",
        component: CreateClinicalRecord
      },
      {
        path: 'listOT',
        name: "Listado OT",
        component: ListOT
      },
      {
        path: 'createOT',
        name: "Crear OT",
        component: CreateOT
      },
      {
        path: 'showAgenda',
        name: "Mostrar agenda",
        component: CalendarAppointment
      },
      {
        path: 'createAppointment',
        name: "Agendar",
        component: CreateAppointment
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for login
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true'

  if (to.path !== '/' && !isAuthenticated) {
    next('/')
  } else if (to.path === '/' && isAuthenticated) {
    next('/app/dashboard')
  } else {
    next()
  }
})

// Create and mount the Vue application
const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false || 'none',
    }

  },
});
app.use(ToastService);
app.use(router);
app.mount('#app');
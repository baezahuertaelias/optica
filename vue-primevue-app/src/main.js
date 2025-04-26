// src/main.js
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

// PrimeVue imports
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-blue/theme.css' // theme
import 'primevue/resources/primevue.min.css' // core css
import 'primeicons/primeicons.css' // icons

// Route components
import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'
import UserProfile from './views/UserProfile.vue'
import Settings from './views/Settings.vue'
import MainLayout from './layouts/MainLayout.vue'

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
const app = createApp(App)
app.use(PrimeVue)
app.use(router)
app.mount('#app')
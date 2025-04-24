import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import Mainview from '../views/Mainview.vue' // Import the new layout view
import CrearPacienteView from '../views/CrearPacienteView.vue'
import CrearUsuarioView from '../views/CrearUsuarioView.vue' // Import the new view
import ListarPacienteView from '../views/ListarPacienteView.vue'
import ListarUsuarioView from '../views/ListarUsuarioView.vue'

import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/main',
      name: 'main',
      component: Mainview, // Use Mainview as the parent layout
      children: [
        {
          path: 'crear-paciente',
          name: 'crear-paciente',
          component: CrearPacienteView,
          meta: { requiresAuth: true },
        },
        {
          path: 'listar-paciente',
          name: 'listar-paciente',
          component: ListarPacienteView,
          meta: { requiresAuth: true },
        },
        {
          path: 'crear-usuario',
          name: 'crear-usuario',
          component: CrearUsuarioView,
          meta: { requiresAuth: true },
        },
        {
          path: 'listar-usuario',
          name: 'listar-usuario',
          component: ListarUsuarioView,
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !authStore.user) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router

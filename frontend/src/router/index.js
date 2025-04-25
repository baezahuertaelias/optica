import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import Mainview from '../views/MainView.vue' // Import the new layout view

import { useAuthStore } from '../stores/auth'
import ListUserView from '@/views/ListUserView.vue'
import CreateOrUpdateUserView from '@/views/CreateOrUpdateUserView.vue'

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
        { path: 'users', name: 'listUser', component: ListUserView,meta: { requiresAuth: true } },
        { path: 'users/:id?', name: 'editUser', component: CreateOrUpdateUserView, meta: { requiresAuth: true } }, // This route can handle both create and edit
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

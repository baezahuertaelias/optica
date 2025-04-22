import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import OrdenTrabajo from '../views/OrdenTrabajo.vue';
import Calendario from '../views/Calendario.vue';
import Reportes from '../views/Reportes.vue'
import FichaClinica from '../views/FichaClinica.vue';
import Agendamiento from '../views/Agendamiento.vue'
import PacienteCreate from '../views/PacienteCreate.vue';
/* import Register from '../views/Register.vue';
import ItemList from '../views/ItemList.vue';
import ItemCreate from '../views/ItemCreate.vue';
import ItemEdit from '../views/ItemEdit.vue'; */

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    icon: 'mdi-home'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true },
    icon: 'mdi-home'
  },
  {
    path: '/ordenTrabajo',
    name: 'OrdenTrabajo',
    component: OrdenTrabajo,
    meta: { requiresAuth: true },
    icon: 'mdi-note-multiple'
  },
  {
    path: '/fichaClinica',
    name: 'FichaClinica',
    component: FichaClinica,
    meta: { requiresAuth: true },
    icon: 'mdi-medical-bag'
  },
  {
    path: '/calendario',
    name: 'Calendario',
    component: Calendario,
    meta: { requiresAuth: true },
    icon: 'mdi-calendar-blank'
  },{
    path: '/agendamiento',
    name: 'Agendamiento',
    component: Agendamiento,
    meta: { requiresAuth: true },
    icon: 'mdi-pencil'
  },
  {
    path: '/reportes',
    name: 'Reportes',
    component: Reportes,
    meta: { requiresAuth: true },
    icon: 'mdi-format-list-numbered-rtl'
  },
  {
    path: '/pacientes/create',
    name: 'PacienteCreate',
    component: PacienteCreate,
    icon: 'mdi-person'
  },
  /* {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guest: true }
  }, */
  /* {
    path: '/items',
    name: 'ItemList',
    component: ItemList,
    meta: { requiresAuth: true }
  }, */
  /* {
    path: '/items/create',
    name: 'ItemCreate',
    component: ItemCreate,
    meta: { requiresAuth: true }
  }, */
  /* {
    path: '/items/:id/edit',
    name: 'ItemEdit',
    component: ItemEdit,
    meta: { requiresAuth: true }
  } */
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('token');
  
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      next({ name: 'Login', query: { redirect: to.fullPath } });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (isLoggedIn) {
      next({ name: 'OrdenTrabajo' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
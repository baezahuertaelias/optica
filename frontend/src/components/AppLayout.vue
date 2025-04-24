<template>
  <div class="p-3">
    <PanelMenu :model="menuItems" />
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PanelMenu from 'primevue/panelmenu'

const menuItems = [
  {
    label: 'Inicio',
    icon: 'pi pi-home',
    to: '/',
  },
  {
    label: 'Acerca de',
    icon: 'pi pi-info-circle',
    to: '/about',
  },
  {
    label: 'Crear Paciente',
    icon: 'pi pi-user-plus',
    to: '/crear-paciente',
  },
]
</script>

<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="layout-container">
    <div class="layout-sidebar">
      <div class="sidebar-header">
        <h3>Optica</h3>
        <div class="user-info">
          <span>{{ username }}</span>
          <Button icon="pi pi-sign-out" class="p-button-text p-button-sm" @click="logout" />
        </div>
      </div>
      <PanelMenu :model="menuItems" class="sidebar-menu" />
    </div>
    <div class="layout-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PanelMenu from 'primevue/panelmenu'
import Button from 'primevue/button'

const router = useRouter()
const username = ref('')

onMounted(() => {
  username.value = localStorage.getItem('username') || 'User'
})

const menuItems = [
  {
    label: 'Dashboard',
    icon: 'pi pi-fw pi-home',
    command: () => router.push('/app/dashboard')
  },
  {
    label: 'Usuarios',
    icon: 'pi pi-fw pi-user',
    items: [
    {
        label: 'Crear usuarios',
        icon: 'pi pi-fw pi-user-edit',
        command: () => router.push('/app/createuser')
      },
      {
        label: 'Listado usuarios',
        icon: 'pi pi-fw pi-user-edit',
        command: () => router.push('/app/listuser')
      }
    ]
  },
  {
    label: 'Pacientes',
    icon: 'pi pi-fw pi-user',
    items: [
    {
        label: 'Crear paciente',
        icon: 'pi pi-fw pi-user-edit',
        command: () => router.push('/app/createpatient')
      },
      {
        label: 'Listado pacientes',
        icon: 'pi pi-fw pi-user-edit',
        command: () => router.push('/app/listpatient')
      }
    ]
  },
  {
    label: 'Ficha clinica',
    icon: 'pi pi-fw pi-user',
    items: [
    {
        label: 'Crear Ficha clinica',
        icon: 'pi pi-fw pi-user-edit',
        command: () => router.push('/app/createclinicalrecord')
      },
      {
        label: 'Listado Ficha clinica',
        icon: 'pi pi-fw pi-user-edit',
        command: () => router.push('/app/listclinicalrecords')
      }
    ]
  },
]

const logout = () => {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('username')
  router.push('/')
}
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100%;
  width: 100%;
}

.layout-sidebar {
  width: 250px;
  background-color: #f8f9fa;
  border-right: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.sidebar-menu {
  flex-grow: 1;
  overflow-y: auto;
}

.layout-content {
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
}

h3 {
  margin: 0 0 0.5rem 0;
}
</style>
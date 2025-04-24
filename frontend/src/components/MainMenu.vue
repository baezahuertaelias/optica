<template>
  <div class="main-menu">
    <PanelMenu :model="menuItems" />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PanelMenu from 'primevue/panelmenu'

export default {
  components: {
    PanelMenu,
  },
  setup() {
    const router = useRouter()
    const menuItems = ref([
      {
        label: 'Pacientes',
        items: [
          {
            label: 'Listar Pacientes',
            icon: 'pi pi-fw pi-list',
            command: () => router.push({ name: 'listar-paciente' }),
          },
          {
            label: 'Crear Paciente',
            icon: 'pi pi-fw pi-plus',
            command: () => router.push({ name: 'crear-paciente' }),
          },
        ],
      },
      {
        label: 'Usuarios',
        items: [
          {
            label: 'Listar Usuarios',
            icon: 'pi pi-fw pi-list',
            command: () => router.push({ name: 'listar-usuario' }),
          },
          {
            label: 'Crear Usuario',
            icon: 'pi pi-fw pi-plus',
            command: () => router.push({ name: 'crear-usuario' }),
          },
        ],
      },
    ])

    return { menuItems }
  },
}
</script>

<style scoped>
/* Add any specific styles for your PanelMenu here */
.main-menu {
  margin: 20px;
}
</style>

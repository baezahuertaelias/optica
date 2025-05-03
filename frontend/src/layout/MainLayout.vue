<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="layout-container">
    <div class="layout-sidebar">
      <div class="sidebar-header">
        <h3>Optica</h3>
        <div class="user-info">
          <span>{{ username }}</span>
          <Button
            icon="pi pi-sign-out"
            class="p-button-text p-button-sm"
            @click="logout"
          />
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import PanelMenu from "primevue/panelmenu";
import Button from "primevue/button";

const router = useRouter();
const username = ref("");

onMounted(() => {
  username.value = localStorage.getItem("username") || "User";
});

const menuItems = [
  {
    label: "Dashboard",
    icon: "pi pi-fw pi-home",
    command: () => router.push("/app/dashboard"),
  },
  {
    label: "Usuarios",
    icon: "pi pi-fw pi-user",
    items: [
      {
        label: "Crear usuarios",
        icon: "pi pi-fw pi-user-edit",
        command: () => router.push("/app/createUser"),
      },
      {
        label: "Listado usuarios",
        icon: "pi pi-fw pi-user-edit",
        command: () => router.push("/app/listUser"),
      },
    ],
  },
  {
    label: "Pacientes",
    icon: "pi pi-fw pi-user",
    items: [
      {
        label: "Crear paciente",
        icon: "pi pi-fw pi-user-edit",
        command: () => router.push("/app/createPatient"),
      },
      {
        label: "Listado pacientes",
        icon: "pi pi-fw pi-user-edit",
        command: () => router.push("/app/listPatient"),
      },
    ],
  },
  {
    label: "Ficha clinica",
    icon: "pi pi-fw pi-user",
    items: [
      {
        label: "Crear Ficha clinica",
        icon: "pi pi-fw pi-user-edit",
        command: () => router.push("/app/createClinicalRecord"),
      },
      {
        label: "Listado Ficha clinica",
        icon: "pi pi-fw pi-user-edit",
        command: () => router.push("/app/listClinicalRecord"),
      },
    ],
  },
  {
    label: "Orden de trabajo",
    icon: "pi pi-fw pi-user",
    items: [
      {
        label: "Crear OT",
        icon: "pi pi-fw pi-user-edit",
        command: () => router.push("/app/createOT"),
      },
      {
        label: "Listado OT",
        icon: "pi pi-fw pi-user-edit",
        command: () => router.push("/app/listOT"),
      },
    ],
  },
  {
    label: "Agendamiento",
    icon: "pi pi-fw pi-user",
    items: [
      {
        label: "Crear Agendamiento",
        icon: "pi pi-fw pi-user-edit",
        command: () => router.push("/app/createAppointment"),
      },
      {
        label: "Calendario de Agenda",
        icon: "pi pi-fw pi-user-edit",
        command: () => router.push("/app/showAgenda"),
      },
    ],
  },
];

const logout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("username");
  router.push("/");
};
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100%;
  width: 100%;
}

.layout-sidebar {
  width: 250px;
  border-right: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 10px;
  margin-top: 10px;
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
  max-width: auto;
}

h3 {
  margin: 0 0 0.5rem 0;
}
</style>
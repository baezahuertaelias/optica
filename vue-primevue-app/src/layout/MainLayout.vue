<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="layout-container">
    <div class="layout-sidebar">
      <div class="sidebar-header">
        <h3>Admin Panel</h3>
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

<script>
import PanelMenu from 'primevue/panelmenu'
import Button from 'primevue/button'

export default {
  name: 'MainLayout',
  components: {
    PanelMenu,
    Button
  },
  data() {
    return {
      username: localStorage.getItem('username') || 'User',
      menuItems: [
        {
          label: 'Dashboard',
          icon: 'pi pi-fw pi-home',
          command: () => this.$router.push('/app/dashboard')
        },
        {
          label: 'User',
          icon: 'pi pi-fw pi-user',
          items: [
            {
              label: 'Profile',
              icon: 'pi pi-fw pi-user-edit',
              command: () => this.$router.push('/app/profile')
            },
            {
              label: 'Settings',
              icon: 'pi pi-fw pi-cog',
              command: () => this.$router.push('/app/settings')
            }
          ]
        }
      ]
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('username')
      this.$router.push('/')
    }
  }
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

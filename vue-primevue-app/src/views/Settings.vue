<!-- src/views/Settings.vue -->
<template>
  <div class="page-container">
    <h1>Settings</h1>
    <div class="card">
      <h3>Application Settings</h3>
      <div class="field">
        <label for="theme">Theme</label>
        <Dropdown id="theme" v-model="settings.theme" :options="themeOptions" optionLabel="name" class="w-100" />
      </div>
      <div class="field">
        <label for="notifications">Notifications</label>
        <ToggleButton v-model="settings.notifications" onLabel="Enabled" offLabel="Disabled" class="w-100" />
      </div>
      <Button label="Save Settings" />
    </div>
  </div>
</template>

<script>
import Dropdown from 'primevue/dropdown'
import ToggleButton from 'primevue/togglebutton'
import Button from 'primevue/button'

export default {
  components: {
    Dropdown,
    ToggleButton,
    Button
  },
  data() {
    return {
      settings: {
        theme: { name: 'Light', value: 'light' },
        notifications: true
      },
      themeOptions: [
        { name: 'Light', value: 'light' },
        { name: 'Dark', value: 'dark' }
      ]
    }
  }
}
</script>

<style scoped>
.page-container {
  padding: 1rem;
}

.card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.field {
  margin-bottom: 1rem;
}

.w-100 {
  width: 100%;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}
</style>

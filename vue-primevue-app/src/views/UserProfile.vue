<!-- src/views/UserProfile.vue -->
<template>
  <div class="page-container">
    <h1>User Profile</h1>
    <div class="card">
      <h3>Personal Information</h3>
      <div class="field">
        <label for="name">Full Name</label>
        <InputText id="name" v-model="profile.name" class="w-100" />
      </div>
      <div class="field">
        <label for="email">Email</label>
        <InputText id="email" v-model="profile.email" class="w-100" />
      </div>
      <Button label="Save Changes" />
    </div>
  </div>
</template>

<script>
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

export default {
  components: {
    InputText,
    Button
  },
  data() {
    return {
      profile: {
        name: 'John Doe',
        email: 'john.doe@example.com'
      }
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


<template>
  <v-app>
    <v-main class="d-flex justify-center align-center" style="height: 100vh">
      <v-card width="400px" elevation="6" rounded-lg>
        <v-card-title class="text-h5">Registration Form</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleSubmit">
            <v-text-field
              v-model="username"
              label="Username"
              :rules="[rules.required]"
              required
            ></v-text-field>
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="birthdayFormatted"
                  label="Birthday"
                  prepend-icon="mdi-calendar"
                  readonly
                  :rules="[rules.required]"
                  v-bind="attrs"
                  v-on="on"
                  required
                ></v-text-field>
              </template>
              <v-date-picker
                ref="picker"
                v-model="birthday"
                @change="saveDate"
              ></v-date-picker>
            </v-menu>
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              :rules="[rules.required, rules.password]"
              required
            ></v-text-field>
            <v-btn block color="primary" type="submit">Register</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      birthday: '',
      password: '',
      menu: false,
      rules: {
        required: value => !!value || 'This field is required.',
        password: value => (value && value.length >= 6) || 'Password must be at least 6 characters long',
      },
    };
  },
  computed: {
    birthdayFormatted() {
      return this.birthday ? new Date(this.birthday).toLocaleDateString() : '';
    },
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'), 300);
    },
  },
  methods: {
    saveDate(date) {
      this.$refs.menu.save(date);
    },
    handleSubmit() {
      console.log('Form Submitted:', { username: this.username, birthday: this.birthday, password: this.password });
      // Handle form submission here
    },
  },
};
</script>

<style>
/* Add any custom styles if needed */
</style>

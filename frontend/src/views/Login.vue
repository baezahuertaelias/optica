<template>
  <div class="login-container">
    <v-card class="mx-auto pa-4" elevation="12" max-width="400">
      <v-card-title class="text-h5 text-center">Login</v-card-title>

      <v-form ref="form" v-model="valid" @submit.prevent="onSubmit" lazy-validation>
        <v-text-field
          label="Email"
          name="email"
          prepend-icon="mdi-email"
          type="email"
          v-model="email"
          :rules="[rules.email, rules.required]"
        ></v-text-field>

        <v-text-field
          label="Password"
          name="password"
          prepend-icon="mdi-lock"
          type="password"
          v-model="password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="() => (showPassword = !showPassword)"
          :rules="[rules.required]"
        ></v-text-field>

        <v-btn class="mt-4" color="primary" type="submit">Login</v-btn>
      </v-form>

      <!-- Error Message -->
      <div v-if="error" class="text-center text-red mt-4">
        {{ error }}
      </div>
    </v-card>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const store = useStore();

    const valid = ref(false);
    const email = ref('');
    const password = ref('');
    const showPassword = ref(false);
    const error = ref('');

    // Validation rules
    const rules = {
      required: value => !!value || 'Required.',
      email: value =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        ) || 'Invalid e-mail.',
    };

    const onSubmit = async () => {
      try {
        // Create a shallow copy of the reactive state to avoid cyclic references
        const formData = { email: email.value, password: password.value };

        // Simple validation on client side (for demonstration)
        if (!valid.value) return;

        // Simulating an API call for login
        await store.dispatch('login', formData);

        // Redirect to the main page or dashboard after successful login
        router.push({ name: 'OrdenTrabajo' });
      } catch (err) {
        console.error(err);
        
        error.value = 'Login failed. Please try again.';
      }
    };

    return {
      valid,
      email,
      password,
      showPassword,
      rules,
      error,
      onSubmit,
    };
  },
};
</script>

<style>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.v-card {
  width: 100%;
}
</style>
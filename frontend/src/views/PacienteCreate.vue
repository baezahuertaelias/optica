<template>
  <div class="paciente-create-container">
    <v-card class="mx-auto pa-4" elevation="12" max-width="400">
      <v-card-title class="text-h5 text-center">Agregar Paciente</v-card-title>

      <v-form ref="form" v-model="valid" @submit.prevent="onSubmit" lazy-validation>
        <!-- Nombre -->
        <v-text-field
          label="Nombre"
          name="nombre"
          prepend-icon="mdi-account"
          type="text"
          v-model="paciente.nombre"
          :rules="[rules.required]"
        ></v-text-field>

        <!-- RUT -->
        <v-text-field
          label="RUT"
          name="rut"
          prepend-icon="mdi-ruler"
          type="string"
          v-model="paciente.rut"
          :rules="[rules.required, rules.uniquePaciente]"
        ></v-text-field>

        <!-- Pasaporte -->
        <v-text-field
          label="Pasaporte"
          name="pasaporte"
          prepend-icon="mdi-passport"
          type="string"
          v-model="paciente.pasaporte"
          :rules="[rules.optional]"
        ></v-text-field>

        <!-- Sexo -->
        <v-select
          label="Sexo"
          name="sexo"
          prepend-icon="mdi-gender-male-female"
          :items="['Masculino', 'Femenino', 'Otro']"
          v-model="paciente.sexo"
          :rules="[rules.required]"
        ></v-select>

        <!-- Fono -->
        <v-text-field
          label="Fono"
          name="fono"
          prepend-icon="mdi-phone"
          type="string"
          v-model="paciente.fono"
          :rules="[rules.optional]"
        ></v-text-field>

        <!-- Edad -->
        <v-text-field
          label="Edad"
          name="edad"
          prepend-icon="mdi-account-circle"
          type="number"
          v-model="paciente.edad"
          :rules="[rules.required, rules.minAge]"
        ></v-text-field>

        <!-- Fecha de Nacimiento -->
        <v-date-picker
          v-model="date"
          no-title
          scrollable
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="menu = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.menu.save(date)"
          >
            OK
          </v-btn>
        </v-date-picker>

        <!-- Domicilio -->
        <v-textarea
          label="Domicilio"
          name="domicilio"
          prepend-icon="mdi-home"
          type="text"
          rows="1"
          v-model="paciente.domicilio"
          :rules="[rules.optional]"
        ></v-textarea>

        <!-- Email -->
        <v-text-field
          label="Email"
          name="email"
          prepend-icon="mdi-email"
          type="email"
          v-model="paciente.email"
          :rules="[rules.email, rules.required, rules.uniquePaciente]"
        ></v-text-field>

        <!-- Ocupación -->
        <v-select
          label="Ocupación"
          name="ocupacion"
          prepend-icon="mdi-briefcase"
          :items="['Profesional', 'Estudiante', 'Desempleado', 'Otro']"
          v-model="paciente.ocupacion"
          :rules="[rules.required]"
        ></v-select>

        <!-- Representante Legal -->
        <v-text-field
          label="Representante Legal"
          name="representanteLegal"
          prepend-icon="mdi-account-parent"
          type="text"
          rows="1"
          v-model="paciente.representanteLegal"
          :rules="[rules.optional]"
        ></v-text-field>

        <!-- Previsión -->
        <v-select
          label="Previsión"
          name="prevision"
          prepend-icon="mdi-file-document-box-outline"
          :items="['ISAPRES', 'FONASA']"
          v-model="paciente.prevision"
          :rules="[rules.optional]"
        ></v-select>
      </v-form>

      <!-- Error Message -->
      <div v-if="error" class="text-center text-red mt-4">
        {{ error }}
      </div>

      <v-btn class="mt-4" color="primary" type="submit">Crear {{ valid }} </v-btn>
    </v-card>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  name: 'PacienteCreate',
  setup() {
    const paciente = ref({
      nombre: '',
      rut: '',
      pasaporte: null,
      sexo: '',
      fono: null,
      edad: 0,
      fechaNacimiento: new Date().toISOString().split('T')[0], // Initialize to today's date
      domicilio: null,
      email: null,
      ocupacion: '',
      representanteLegal: null,
      prevision: ''
    });

    const valid = ref(false);
    const error = ref(null);
    const menu0 = false;
    

    const rules = {
      required: value => !!value || 'Campo requerido',
      minAge: value => (parseInt(value) >= 0 && parseInt(value) <= 120) || 'Edad incorrecta',
      email: value =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        ) || 'Correo no válido',
      uniquePaciente: (value) => {
        const url = `http://localhost:5000/api/pacientes?rut=${value}`;
        return axios.get(url).then(response => {
          if (!response.data.length) {
            error.value = null;
            return true;
          } else {
            error.value = 'Este RUT ya está en uso.';
            return false;
          }
        }).catch(() => {
          error.value = 'No se pudo verificar el Rut. Inténtalo más tarde';
          return false;
        });
      },
      optional: value => !value || true,
      futuroOActual: value =>
        (new Date(value) >= new Date()) || 'La fecha debe ser futura o actual.'
    };

    const onSubmit = async () => {
      if (valid.value) {
        try {
          await axios.post('http://localhost:5000/api/pacientes', paciente.value);
          error.value = null;
          alert('Paciente creado exitosamente');
          // Optionally, you can reset the form or navigate to another page
        } catch (error) {
          console.error(error);
        }
      }
    };

    return {
      paciente,
      valid,
      error,
      //menu,
      rules,
      onSubmit,
      menu0,
      onInput: value => {
        paciente.value.fechaNacimiento = value;
      }
    };
  },
};
</script>

<style scoped>
.paciente-create-container {
  margin: 0 auto;
}
</style>
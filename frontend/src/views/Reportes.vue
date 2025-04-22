<template>
    <div class="home">
      <div class="jumbotron bg-light p-5 rounded-3">
        <h1>Welcome to Vue CRUD App</h1>
        <p class="lead">
          This is a simple CRUD application built with Vue.js, Express.js, and PostgreSQL.
        </p>
        <hr class="my-4">
        <p>Login or register to manage your items.</p>
        <div v-if="!isLoggedIn">
          <router-link to="/login" class="btn btn-primary me-2">Login</router-link>
          
        </div>
        <div v-else>
          <router-link to="/register" class="btn btn-outline-primary">Register</router-link>
          <router-link to="/items" class="btn btn-primary">View My Items</router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  
  export default {
    name: 'Home',
    setup() {
      const store = useStore();
      const isLoggedIn = computed(() => store.getters.isLoggedIn);
      
      return {
        isLoggedIn
      };
    }
  };
  </script>
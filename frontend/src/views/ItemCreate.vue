<template>
    <div class="item-create">
      <h2>Add New Item</h2>
      <form @submit.prevent="handleSubmit" class="mt-4">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input
            type="text"
            class="form-control"
            id="name"
            v-model="form.name"
            required
          >
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Description</label>
          <textarea
            class="form-control"
            id="description"
            v-model="form.description"
            rows="3"
          ></textarea>
        </div>
        <div class="mb-3">
          <label for="price" class="form-label">Price</label>
          <input
            type="number"
            class="form-control"
            id="price"
            v-model="form.price"
            step="0.01"
            min="0"
            required
          >
        </div>
        <div class="mb-3">
          <label for="quantity" class="form-label">Quantity</label>
          <input
            type="number"
            class="form-control"
            id="quantity"
            v-model="form.quantity"
            min="0"
            required
          >
        </div>
        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Saving...' : 'Save' }}
          </button>
          <router-link to="/items" class="btn btn-outline-secondary">Cancel</router-link>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import itemsService from '../services/items';
  
  export default {
    name: 'ItemCreate',
    setup() {
      const router = useRouter();
      const loading = ref(false);
      
      const form = ref({
        name: '',
        description: '',
        price: 0,
        quantity: 0
      });
      
      const handleSubmit = async () => {
        try {
          loading.value = true;
          await itemsService.create(form.value);
          router.push('/items');
        } catch (error) {
          console.error('Error creating item:', error);
        } finally {
          loading.value = false;
        }
      };
      
      return {
        form,
        loading,
        handleSubmit
      };
    }
  };
  </script>
<template>
    <div class="item-edit">
      <h2>Edit Item</h2>
      <div v-if="loading" class="text-center my-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <form v-else @submit.prevent="handleSubmit" class="mt-4">
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
          <button type="submit" class="btn btn-primary" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
          <router-link to="/items" class="btn btn-outline-secondary">Cancel</router-link>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import itemsService from '../services/items';
  
  export default {
    name: 'ItemEdit',
    setup() {
      const router = useRouter();
      const route = useRoute();
      const loading = ref(true);
      const saving = ref(false);
      
      const form = ref({
        name: '',
        description: '',
        price: 0,
        quantity: 0
      });
      
      const fetchItem = async () => {
        try {
          loading.value = true;
          const itemId = route.params.id;
          const response = await itemsService.getById(itemId);
          
          form.value = {
            name: response.data.name,
            description: response.data.description || '',
            price: parseFloat(response.data.price),
            quantity: response.data.quantity
          };
        } catch (error) {
          console.error('Error fetching item:', error);
          router.push('/items');
        } finally {
          loading.value = false;
        }
      };
      
      const handleSubmit = async () => {
        try {
          saving.value = true;
          const itemId = route.params.id;
          await itemsService.update(itemId, form.value);
          router.push('/items');
        } catch (error) {
          console.error('Error updating item:', error);
        } finally {
          saving.value = false;
        }
      };
      
      onMounted(fetchItem);
      
      return {
        form,
        loading,
        saving,
        handleSubmit
      };
    }
  };
  </script>
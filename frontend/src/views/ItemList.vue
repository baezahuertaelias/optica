<template>
    <div class="items">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>My Items</h2>
        <router-link to="/items/create" class="btn btn-primary">Add Item</router-link>
      </div>
      
      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      
      <div v-else-if="items.length === 0" class="alert alert-info">
        You don't have any items yet. Click the "Add Item" button to create one.
      </div>
      
      <div v-else class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.description || '-' }}</td>
              <td>${{ parseFloat(item.price).toFixed(2) }}</td>
            <td>{{ item.quantity }}</td>
            <td>
              <router-link :to="`/items/${item.id}/edit`" class="btn btn-sm btn-outline-primary me-2">
                Edit
              </router-link>
              <button @click="deleteItem(item.id)" class="btn btn-sm btn-outline-danger">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import itemsService from '../services/items';

export default {
  name: 'ItemList',
  setup() {
    const items = ref([]);
    const loading = ref(true);
    
    const fetchItems = async () => {
      try {
        loading.value = true;
        const response = await itemsService.getAll();
        items.value = response.data;
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const deleteItem = async (id) => {
      if (!confirm('Are you sure you want to delete this item?')) return;
      
      try {
        await itemsService.delete(id);
        items.value = items.value.filter(item => item.id !== id);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    };
    
    onMounted(fetchItems);
    
    return {
      items,
      loading,
      deleteItem
    };
  }
};
</script>
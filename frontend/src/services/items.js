import api from './api';

export default {
  getAll() {
    return api.get('api/items');
  },
  
  getById(id) {
    return api.get(`api/items/${id}`);
  },
  
  create(itemData) {
    return api.post('api/items', itemData);
  },
  
  update(id, itemData) {
    return api.put(`api/items/${id}`, itemData);
  },
  
  delete(id) {
    return api.delete(`api/items/${id}`);
  }
};
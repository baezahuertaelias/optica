import api from './api';

export default {
  getAll() {
    return api.get('/appointments');
  },
  
  getById(id) {
    return api.get(`/appointments/${id}`);
  },
  
  create(appointmentData) {
    return api.post('/appointments', appointmentData);
  },
  
  update(id, appointmentData) {
    return api.put(`/appointments/${id}`, appointmentData);
  },
  
  delete(id) {
    return api.delete(`/appointments/${id}`);
  }
};
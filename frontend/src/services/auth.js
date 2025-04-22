import api from './api';

export default {
  register(userData) {
    return api.post('/api/auth/register', userData);
  },
  
  login(credentials) {
    return api.post('/api/auth/login', credentials);
  },
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
import { createStore } from 'vuex';
import authService from '../services/auth';

export default createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
    isLoggedIn: false,
    drawer: false,
    darkMode: false,
  },
  getters: {
    isLoggedIn: state => !!state.token,
    currentUser: state => state.user,
    loading: state => state.loading,
    error: state => state.error,
    drawer: (state) => state.drawer,
    isDarkMode: state => state.darkMode
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_ERROR(state) {
      state.error = null;
    },
    SET_IS_LOGGED_IN(state, value) {
      state.isLoggedIn = value;
    },
    SET_DRAWER(state, value) {
      state.drawer = value;
    },
    SET_DARK_MODE(state, value) {
      state.darkMode = value;
    },
    TOGGLE_DARK_MODE(state) {
      state.darkMode = !state.darkMode;
    }
  
  },
  actions: {
    async register({ commit }, userData) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        const response = await authService.register(userData);
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        commit('SET_USER', response.data.user);
        commit('SET_TOKEN', response.data.token);
        
        return response;
      } catch (error) {
        commit('SET_ERROR', error.response ? error.response.data.message : error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async login({ commit }, credentials) {
      
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        const response = await authService.login(credentials);
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        commit('SET_IS_LOGGED_IN', true);

        
        commit('SET_USER', response.data.user);
        commit('SET_TOKEN', response.data.token);
        
        return response;
      } catch (error) {
        console.error('ERROR createStore actions login', error);
        
        commit('SET_ERROR', error.response ? error.response.data.message : error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    logout({ commit }) {
      authService.logout();
      commit('SET_USER', null);
      commit('SET_TOKEN', null);
      commit('SET_IS_LOGGED_IN', false);

    },
    
    setDrawer(open) {
      this.drawer = open;
    },

    setIsLoggedIn(loggedIn) {
      this.isLoggedIn = loggedIn;
    },

    setError(errorMessage) {
      this.error = errorMessage;
    },

    clearError() {
      this.error = null;
    }
  }
});
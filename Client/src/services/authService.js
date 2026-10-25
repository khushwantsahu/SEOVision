import api from './api';

export const authService = {
  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },

  getMe: async () => {
    return await api.get('/auth/me');
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore logout API failures
    } finally {
      localStorage.removeItem('seo_vision_token');
      localStorage.removeItem('seo_vision_user');
    }
  }
};

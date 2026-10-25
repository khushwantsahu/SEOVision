import axios from 'axios';

// Get base URL from environment variable or default to relative proxy /api
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization Bearer token to all outgoing requests if token exists in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('seo_vision_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Centralized Response Interceptor to handle session expiration (401)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('seo_vision_token');
      localStorage.removeItem('seo_vision_user');
      window.location.href = '/login';
    }
    return Promise.reject(new Error(message));
  }
);

export default api;

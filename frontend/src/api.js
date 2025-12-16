import axios from 'axios';

// Frontend should call your local backend. Use VITE_API_URL only if you want to override.
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // important for Sanctum cookie auth
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Attach Bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.warn('Unauthorized — token may be expired or invalid.');
      // optional: handle logout here
    }
    return Promise.reject(error);
  }
);

export default api;

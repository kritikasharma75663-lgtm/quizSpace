import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token if present in localStorage (fallback for cross-origin)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('qm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error formatting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 and not on login page, session might be invalid
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      // Allow caller to handle or trigger logout
    }
    return Promise.reject(error);
  }
);

export default api;

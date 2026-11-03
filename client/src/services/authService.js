import api from './api';

export const authService = {
  // Register new user
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('qm_token', response.data.token);
      localStorage.setItem('qm_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login user
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('qm_token', response.data.token);
      localStorage.setItem('qm_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout user
  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('qm_token');
      localStorage.removeItem('qm_user');
    }
  },

  // Get current authenticated user
  async getMe() {
    const response = await api.get('/auth/me');
    if (response.data.user) {
      localStorage.setItem('qm_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Update profile
  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData);
    if (response.data.user) {
      localStorage.setItem('qm_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
};

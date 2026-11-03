import api from './api';

export const quizService = {
  // Get published quizzes with filters and pagination
  async getQuizzes(params = {}) {
    const response = await api.get('/quizzes', { params });
    return response.data;
  },

  // Get single quiz details
  async getQuizById(id) {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },

  // Get categories
  async getCategories() {
    const response = await api.get('/categories');
    return response.data;
  },
};

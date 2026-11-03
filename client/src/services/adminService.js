import api from './api';

export const adminService = {
  // Dashboard statistics
  async getDashboard() {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Users management
  async getUsers(params = {}) {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  async updateUserStatus(id, status) {
    const response = await api.patch(`/admin/users/${id}/status`, { status });
    return response.data;
  },

  // Quiz management
  async getQuizzes(params = {}) {
    const response = await api.get('/quizzes/admin/all', { params });
    return response.data;
  },

  async createQuiz(quizData) {
    const response = await api.post('/quizzes', quizData);
    return response.data;
  },

  async updateQuiz(id, quizData) {
    const response = await api.put(`/quizzes/${id}`, quizData);
    return response.data;
  },

  async deleteQuiz(id) {
    const response = await api.delete(`/quizzes/${id}`);
    return response.data;
  },

  // Question management
  async getQuestions(quizId) {
    const response = await api.get(`/quizzes/${quizId}/questions`);
    return response.data;
  },

  async createQuestion(quizId, questionData) {
    const response = await api.post(`/quizzes/${quizId}/questions`, questionData);
    return response.data;
  },

  async updateQuestion(id, questionData) {
    const response = await api.put(`/questions/${id}`, questionData);
    return response.data;
  },

  async deleteQuestion(id) {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
  },

  // Category management
  async getCategories() {
    const response = await api.get('/categories');
    return response.data;
  },

  async createCategory(categoryData) {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  async updateCategory(id, categoryData) {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  async deleteCategory(id) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  // Quiz attempts & results
  async getAllAttempts(params = {}) {
    const response = await api.get('/admin/attempts', { params });
    return response.data;
  },

  async getAttemptDetail(id) {
    const response = await api.get(`/admin/attempts/${id}`);
    return response.data;
  },

  // Export CSV
  async exportAttemptsCSV() {
    const response = await api.get('/admin/reports/export', {
      responseType: 'blob',
    });
    return response.data;
  },
};

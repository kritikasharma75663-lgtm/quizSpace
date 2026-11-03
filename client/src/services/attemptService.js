import api from './api';

export const attemptService = {
  // Start or resume a quiz attempt
  async startAttempt(quizId) {
    const response = await api.post('/attempts/start', { quizId });
    return response.data;
  },

  // Save answer progressively
  async saveAnswer(attemptId, questionId, selectedOption) {
    const response = await api.put(`/attempts/${attemptId}/answer`, {
      questionId,
      selectedOption,
    });
    return response.data;
  },

  // Submit attempt for authoritative scoring
  async submitAttempt(attemptId, answers) {
    const response = await api.post(`/attempts/${attemptId}/submit`, { answers });
    return response.data;
  },

  // Get user attempt history
  async getMyHistory(params = {}) {
    const response = await api.get('/attempts/my-history', { params });
    return response.data;
  },

  // Get result of completed attempt
  async getAttemptResult(attemptId) {
    const response = await api.get(`/attempts/${attemptId}/result`);
    return response.data;
  },
};

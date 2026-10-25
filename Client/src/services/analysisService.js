import api from './api';

export const analysisService = {
  createAnalysis: async (url) => {
    return await api.post('/analysis', { url });
  },

  getAnalyses: async (search = '', sortBy = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (sortBy) params.append('sortBy', sortBy);
    return await api.get(`/analysis?${params.toString()}`);
  },

  getAnalysisById: async (id) => {
    return await api.get(`/analysis/${id}`);
  },

  deleteAnalysis: async (id) => {
    return await api.delete(`/analysis/${id}`);
  }
};

import api from './api';

export const rankService = {
  addKeyword: async (keywordData) => {
    return await api.post('/rank-tracker', keywordData);
  },

  getKeywords: async (search = '', status = 'all') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    return await api.get(`/rank-tracker?${params.toString()}`);
  },

  getKeywordById: async (id) => {
    return await api.get(`/rank-tracker/${id}`);
  },

  refreshRank: async (id) => {
    return await api.put(`/rank-tracker/${id}/refresh`);
  },

  deleteKeyword: async (id) => {
    return await api.delete(`/rank-tracker/${id}`);
  }
};

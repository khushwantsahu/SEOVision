import api from './api';

export const subscriptionService = {
  getSubscription: async () => {
    return await api.get('/subscription');
  },

  checkout: async (plan) => {
    return await api.post('/subscription/checkout', { plan });
  }
};

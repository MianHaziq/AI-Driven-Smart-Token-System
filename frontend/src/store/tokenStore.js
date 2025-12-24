import { create } from 'zustand';
import api from '../utils/api';

const useTokenStore = create((set, get) => ({
  tokens: [],
  myTokens: [],
  tokenHistory: [],
  currentToken: null,
  queueStats: null,
  dashboardStats: null,
  isLoading: false,
  error: null,

  // Get all tokens (admin)
  fetchTokens: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.service) params.append('service', filters.service);
      if (filters.date) params.append('date', filters.date);

      const response = await api.get(`/token/queue?${params.toString()}`);
      set({ tokens: response.data.tokens || [], isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch tokens';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Get my tokens (customer) - active tokens only
  fetchMyTokens: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/token/my-tokens');
      const allTokens = response.data.tokens || [];
      // Filter for active tokens only (waiting, called, serving)
      const activeTokens = allTokens.filter(t =>
        ['waiting', 'called', 'serving'].includes(t.status)
      );
      set({ myTokens: activeTokens, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch your tokens';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Get token history (customer) - completed, cancelled, no-show tokens
  fetchTokenHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/token/my-tokens');
      const allTokens = response.data.tokens || [];
      // Filter for completed/past tokens
      const historyTokens = allTokens.filter(t =>
        ['completed', 'cancelled', 'no-show'].includes(t.status)
      );
      set({ tokenHistory: historyTokens, isLoading: false });
      return { success: true, data: { tokens: historyTokens } };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch token history';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Get queue status (public)
  fetchQueueStats: async () => {
    try {
      const response = await api.get('/token/queue');
      set({ queueStats: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },

  // Get dashboard stats
  fetchDashboardStats: async () => {
    try {
      const response = await api.get('/token/stats');
      set({ dashboardStats: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },

  // Get token by ID
  fetchTokenById: async (tokenId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/token/${tokenId}`);
      set({ currentToken: response.data.token, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch token';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Get token by token number
  fetchTokenByNumber: async (tokenNumber) => {
    try {
      const response = await api.get(`/token/number/${tokenNumber}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },

  // Book a token
  bookToken: async (serviceId, priority = 'normal') => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/token/book', { serviceId, priority });
      const newToken = response.data.token;

      set((state) => ({
        myTokens: [newToken, ...state.myTokens],
        isLoading: false,
      }));

      return { success: true, data: response.data, token: newToken };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to book token';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Cancel a token
  cancelToken: async (tokenId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/token/cancel/${tokenId}`);

      set((state) => ({
        myTokens: state.myTokens.map((t) =>
          t._id === tokenId ? { ...t, status: 'cancelled' } : t
        ),
        tokens: state.tokens.map((t) =>
          t._id === tokenId ? { ...t, status: 'cancelled' } : t
        ),
        isLoading: false,
      }));

      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel token';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Call next token (admin)
  callNextToken: async (counterId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/token/call-next', { counterId });

      // Refresh tokens after calling
      get().fetchTokens();

      set({ isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to call next token';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Complete token (admin)
  completeToken: async (tokenId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/token/complete/${tokenId}`);

      set((state) => ({
        tokens: state.tokens.map((t) =>
          t._id === tokenId ? { ...t, status: 'completed' } : t
        ),
        isLoading: false,
      }));

      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to complete token';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Mark token as no-show (admin)
  markNoShow: async (tokenId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/token/no-show/${tokenId}`);

      set((state) => ({
        tokens: state.tokens.map((t) =>
          t._id === tokenId ? { ...t, status: 'no-show' } : t
        ),
        isLoading: false,
      }));

      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to mark as no-show';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useTokenStore;

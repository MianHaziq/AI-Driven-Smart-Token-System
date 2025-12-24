import { create } from 'zustand';
import api from '../utils/api';

const useCounterStore = create((set, get) => ({
  counters: [],
  currentCounter: null,
  stats: null,
  operators: [],
  isLoading: false,
  error: null,

  // Get all counters
  fetchCounters: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/counter/read');
      set({ counters: response.data.counters || response.data || [], isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch counters';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Get counter stats
  fetchCounterStats: async () => {
    try {
      const response = await api.get('/counter/stats');
      set({ stats: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },

  // Get operators
  fetchOperators: async () => {
    try {
      const response = await api.get('/counter/operators');
      set({ operators: response.data.operators || [] });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },

  // Get counter by ID
  fetchCounterById: async (counterId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/counter/read/${counterId}`);
      set({ currentCounter: response.data.counter || response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch counter';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Create counter
  createCounter: async (counterData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/counter/create', counterData);
      const newCounter = response.data.counter || response.data;

      set((state) => ({
        counters: [...state.counters, newCounter],
        isLoading: false,
      }));

      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create counter';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Update counter
  updateCounter: async (counterId, counterData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/counter/update/${counterId}`, counterData);

      set((state) => ({
        counters: state.counters.map((c) =>
          c._id === counterId ? { ...c, ...counterData } : c
        ),
        isLoading: false,
      }));

      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update counter';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Update counter status
  updateCounterStatus: async (counterId, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/counter/status/${counterId}`, { status });

      set((state) => ({
        counters: state.counters.map((c) =>
          c._id === counterId ? { ...c, status } : c
        ),
        isLoading: false,
      }));

      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update status';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Delete counter
  deleteCounter: async (counterId) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/counter/delete/${counterId}`);

      set((state) => ({
        counters: state.counters.filter((c) => c._id !== counterId),
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete counter';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useCounterStore;

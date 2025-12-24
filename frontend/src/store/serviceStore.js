import { create } from 'zustand';
import api from '../utils/api';

const useServiceStore = create((set, get) => ({
  services: [],
  currentService: null,
  stats: null,
  isLoading: false,
  error: null,

  // Get all services
  fetchServices: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive);

      const response = await api.get(`/service/read?${params.toString()}`);
      set({ services: response.data.services || response.data || [], isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch services';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Get service stats
  fetchServiceStats: async () => {
    try {
      const response = await api.get('/service/stats');
      set({ stats: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },

  // Get service by ID
  fetchServiceById: async (serviceId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/service/read/${serviceId}`);
      set({ currentService: response.data.service || response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch service';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Create service
  createService: async (serviceData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/service/create', serviceData);
      const newService = response.data.service || response.data;

      set((state) => ({
        services: [...state.services, newService],
        isLoading: false,
      }));

      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create service';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Update service
  updateService: async (serviceId, serviceData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/service/update/${serviceId}`, serviceData);

      set((state) => ({
        services: state.services.map((s) =>
          s._id === serviceId ? { ...s, ...serviceData } : s
        ),
        isLoading: false,
      }));

      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update service';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Toggle service active status
  toggleService: async (serviceId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/service/toggle/${serviceId}`);

      set((state) => ({
        services: state.services.map((s) =>
          s._id === serviceId ? { ...s, isActive: !s.isActive } : s
        ),
        isLoading: false,
      }));

      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to toggle service';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Delete service
  deleteService: async (serviceId) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/service/delete/${serviceId}`);

      set((state) => ({
        services: state.services.filter((s) => s._id !== serviceId),
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete service';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useServiceStore;

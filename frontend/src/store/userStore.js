import { create } from 'zustand';
import api from '../utils/api';

const useUserStore = create((set, get) => ({
  users: [],
  currentUser: null,
  stats: null,
  isLoading: false,
  error: null,

  // Get all users
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/user/read');
      set({ users: response.data.users || response.data || [], isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch users';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Get user by ID
  fetchUserById: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/user/read/${userId}`);
      set({ currentUser: response.data.user || response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch user';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Create user
  createUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/user/create', userData);
      const newUser = response.data.user || response.data;

      set((state) => ({
        users: [...state.users, newUser],
        isLoading: false,
      }));

      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create user';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/user/update/${userId}`, userData);

      set((state) => ({
        users: state.users.map((u) =>
          u._id === userId ? { ...u, ...userData } : u
        ),
        isLoading: false,
      }));

      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update user';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/user/delete/${userId}`);

      set((state) => ({
        users: state.users.filter((u) => u._id !== userId),
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete user';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useUserStore;

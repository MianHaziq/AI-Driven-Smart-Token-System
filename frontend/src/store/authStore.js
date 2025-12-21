import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import api from '../utils/api';
import { STORAGE_KEYS } from '../utils/constants';

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    // Initialize auth state from localStorage
    initialize: () => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (token && userData) {
            try {
                const decoded = jwtDecode(token);

                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    // Token expired
                    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
                    set({ user: null, isAuthenticated: false });
                } else {
                    set({
                        user: JSON.parse(userData),
                        isAuthenticated: true,
                    });
                }
            } catch (error) {
                console.error('Token validation failed:', error);
                localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.USER_DATA);
                set({ user: null, isAuthenticated: false });
            }
        }
    },

    // Login
    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/auth/login', { email, password });
            const { accessToken, message, user: userDataFromBackend } = response.data;

            // Decode token to get user info
            const decoded = jwtDecode(accessToken);

            const userData = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
                fullName: userDataFromBackend?.fullName || '',
                phoneNumber: userDataFromBackend?.phoneNumber || '',
            };

            // Store token and user data
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

            set({
                user: userData,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            return { success: true, message, user: userData };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            set({
                error: errorMessage,
                isLoading: false,
            });
            return { success: false, message: errorMessage };
        }
    },

    // Register
    register: async (fullName, phoneNumber, cnic, email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/auth/signup', {
                fullName,
                phoneNumber,
                cnic,
                email,
                password,
            });

            const { message } = response.data;

            set({
                isLoading: false,
                error: null,
            });

            return { success: true, message };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            set({
                error: errorMessage,
                isLoading: false,
            });
            return { success: false, message: errorMessage };
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        set({
            user: null,
            isAuthenticated: false,
            error: null,
        });
    },

    // Clear error
    clearError: () => set({ error: null }),
}));

export default useAuthStore;

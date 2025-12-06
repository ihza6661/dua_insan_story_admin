import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for auto-logout on 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Auto-logout on 401 Unauthorized (invalid/expired token)
        if (error.response?.status === 401) {
            const token = useAuthStore.getState().token;
            if (token) {
                // Clear auth state
                useAuthStore.getState().logout();
                
                // Redirect to login page
                if (typeof window !== 'undefined') {
                    window.location.href = '/';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
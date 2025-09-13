import axios from 'axios';
import { useAuthStore } from '@/store/auth.store'; 

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1',
    headers: {
        'Accept': 'application/json',
    },
});

api.interceptors.request.use(config => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add a subscription to update the default headers whenever the token changes
useAuthStore.subscribe(
    (state) => state.token,
    (token) => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    },
    {
        fireImmediately: true, // Ensure it runs immediately on subscription
    }
);

export default api;
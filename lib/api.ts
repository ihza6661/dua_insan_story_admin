/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

// Set the initial authorization header if a token exists
const initialToken = useAuthStore.getState().token;
if (initialToken) {
    api.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`;
}

// Subscribe to token changes and update the authorization header
(useAuthStore.subscribe as any)(
    (state: any) => state.token,
    (token: any) => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    }
);

export default api;
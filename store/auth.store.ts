import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { User } from '@/lib/types';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: (user, token) => {
                set({ user, token, isAuthenticated: true });
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });
            },

            initialize: () => {
                const { user, token } = get();
                if (user && token) {
                    set({ isAuthenticated: true });
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => ({
                setItem: (name, value) => {
                    Cookies.set(name, value, { expires: 7, path: '/' });
                },
                getItem: (name) => {
                    const value = Cookies.get(name);
                    return value ?? null;
                },
                removeItem: (name) => {
                    Cookies.remove(name, { path: '/' });
                },
            })),
        }
    )
);
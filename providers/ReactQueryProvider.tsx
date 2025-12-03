"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 min
        gcTime: 10 * 60 * 1000, // 10 minutes - cache garbage collection (previously cacheTime)
        refetchOnWindowFocus: false, // Don't refetch on window focus
        retry: 1, // Only retry failed requests once
        refetchOnMount: true, // Refetch on mount if data is stale
      },
      mutations: {
        retry: 0, // Don't retry mutations
      },
    },
  }));

  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
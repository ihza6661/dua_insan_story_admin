"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

export default function HomePage() {
  const router = useRouter();
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    if (isAuthenticated) {
      router.replace('/admin');
    } else {
      router.replace('/login');
    }
  }, [router, initialize]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <p className="text-muted-foreground">Mengarahkan...</p>
    </div>
  );
}
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/shared/Sidebar';
import { Header } from '@/components/shared/Header';
import { useAuthStore } from '@/store/auth.store';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, initialize } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initialize();
    setIsInitialized(true);
  }, [initialize]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized || !isAuthenticated) {
    return null;
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <Sidebar className="hidden border-r bg-muted/40 lg:block" />
      <div className="flex flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

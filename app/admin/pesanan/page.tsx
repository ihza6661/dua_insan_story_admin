"use client";

import { useAuthStore } from '@/store/auth.store';

export default function AdminDashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">
        Selamat Datang, {user?.full_name}!
      </h1>
      <p className="text-muted-foreground">
        Ini adalah halaman dashboard panel admin Anda.
      </p>
    </div>
  );
}
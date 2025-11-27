"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Shapes, LayoutDashboard, ShoppingBag, Wand2, Puzzle, Users, GalleryHorizontal, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/kategori', icon: Shapes, label: 'Kategori Produk' },
  { href: '/admin/atribut', icon: Wand2, label: 'Atribut' },
  { href: '/admin/item-tambahan', icon: Puzzle, label: 'Item Tambahan' },
  { href: '/admin/produk', icon: ShoppingBag, label: 'Produk' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Pesanan' },
  { href: '/admin/galeri', icon: GalleryHorizontal, label: 'Galeri' },
  { href: '/admin/pengguna/admin', icon: Users, label: 'Kelola Admin' },
  { href: '/admin/pengguna/customer', icon: Users, label: 'Kelola Pelanggan' },
  { href: '/admin/settings', icon: Settings, label: 'Pengaturan' },
];

type SidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full min-h-0 w-full flex-col border-r border-border/70 bg-background pb-10",
        className
      )}
    >
      <div className="px-4 pt-6">
        <Link href="/admin" className="flex items-center gap-3 rounded-lg px-2 py-3" onClick={onNavigate}>
          <Image
            src="/newlogo.png"
            alt="Dua Insan Story Logo"
            width={48}
            height={30}
            priority
          />
          <div>
            <h2 className="text-base font-semibold tracking-tight">Dua Insan Story</h2>
            <p className="text-xs text-muted-foreground">Panel Admin</p>
          </div>
        </Link>
      </div>

      <nav className="mt-2 flex-1 overflow-y-auto px-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                pathname.startsWith(item.href) && item.href !== '/admin' && 'bg-primary/10 text-primary',
                pathname === '/admin' && item.href === '/admin' && 'bg-primary/10 text-primary'
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}

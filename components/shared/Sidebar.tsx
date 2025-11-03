import Image from 'next/image';
import Link from 'next/link';
import { Shapes, LayoutDashboard, ShoppingBag, Wand2, Puzzle, Users, GalleryHorizontal } from 'lucide-react';
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
  { href: '/admin/pengguna/admin', icon: Users, label: 'Pengguna Admin' },
  { href: '/admin/pengguna/customer', icon: Users, label: 'Pengguna Customer' },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <Link href="/admin" className="cursor-pointer flex items-center gap-2 px-4 py-8">
            <Image
              src="/duainsan.png"
              alt="Dua Insan Story Logo"
              width={50}
              height={30}
              priority
            />
            <h2 className="text-lg font-semibold tracking-tight">
              Dua Insan Story
            </h2>
          </Link>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary cursor-pointer',
                  pathname.startsWith(item.href) && item.href !== '/admin' && 'bg-primary/10 text-primary',
                  pathname === '/admin' && item.href === '/admin' && 'bg-primary/10 text-primary'
                )}
              ><item.icon className="mr-2 h-4 w-4" />{item.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

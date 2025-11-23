"use client";

import { useRouter } from 'next/navigation';
import { LogOut, PanelLeft } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  AccessibleSheetContent as SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from './Sidebar';
import { ThemeToggler } from './ThemeToggler';

export function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
  <div className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="flex h-16 items-center px-4 md:px-8">
        {/* Tombol Sidebar untuk Mobile */}
        <div className="lg:hidden">
          <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Buka menu navigasi">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 max-w-[320px] p-0 pt-8 sm:w-80">
              <Sidebar onNavigate={() => setIsMobileNavOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Menu User di Kanan */}
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <ThemeToggler />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" alt={user?.full_name ?? ''} />
                  <AvatarFallback>{user ? getInitials(user.full_name) : 'A'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.full_name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {/* Opsi lain bisa ditambahkan di sini, misal: Profil, Pengaturan */}
              </DropdownMenuGroup>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}



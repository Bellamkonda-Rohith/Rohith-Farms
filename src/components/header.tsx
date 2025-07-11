
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Feather, LogOut, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/birds', label: 'Birds for Sale' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { user, signOutUser } = useAuth();

  const NavLink = ({ href, label, isMobile = false, onClick }: { href: string; label: string; isMobile?: boolean, onClick?: () => void }) => (
    <Link
      href={href}
      className={cn(
        "font-medium transition-colors",
        pathname === href
          ? "text-primary"
          : "text-muted-foreground hover:text-primary",
        isMobile ? "block text-lg py-2" : "text-sm"
      )}
      onClick={() => {
        setSheetOpen(false);
        onClick?.();
      }}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Feather className="h-6 w-6 text-primary" />
          <span className="font-bold font-serif text-xl">Rohith Game Farm</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
           {user ? (
            <>
              <NavLink href="/admin" label="Admin" />
              <Button variant="ghost" size="sm" onClick={signOutUser}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
             <Button asChild variant="outline" size="sm">
                <Link href="/admin/login">
                    <Shield className="mr-2 h-4 w-4"/>
                    Admin Login
                </Link>
            </Button>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="p-6 flex flex-col h-full">
                <Link href="/" className="flex items-center gap-2 mb-8" onClick={() => setSheetOpen(false)}>
                  <Feather className="h-6 w-6 text-primary" />
                  <span className="font-bold font-serif text-xl">Rohith Game Farm</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map(link => (
                    <NavLink key={link.href} href={link.href} label={link.label} isMobile />
                  ))}
                </nav>
                <div className="mt-auto">
                  {user ? (
                    <>
                      <NavLink href="/admin" label="Admin Dashboard" isMobile />
                      <Button variant="outline" className="w-full mt-4" onClick={() => { setSheetOpen(false); signOutUser(); }}>
                        <LogOut className="mr-2 h-5 w-5" /> Logout
                      </Button>
                    </>
                  ) : (
                    <NavLink href="/admin/login" label="Admin Login" isMobile />
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

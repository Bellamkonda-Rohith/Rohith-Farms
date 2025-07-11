
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Feather } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/birds', label: 'Birds for Sale' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const NavLink = ({ href, label, isMobile = false }: { href: string; label: string; isMobile?: boolean }) => (
    <Link
      href={href}
      className={cn(
        "font-medium transition-colors",
        pathname === href
          ? "text-primary"
          : "text-muted-foreground hover:text-primary",
        isMobile ? "block text-lg py-2" : "text-sm"
      )}
      onClick={() => setSheetOpen(false)}
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
              <div className="p-6">
                <Link href="/" className="flex items-center gap-2 mb-8" onClick={() => setSheetOpen(false)}>
                  <Feather className="h-6 w-6 text-primary" />
                  <span className="font-bold font-serif text-xl">Rohith Game Farm</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map(link => (
                    <NavLink key={link.href} href={link.href} label={link.label} isMobile />
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

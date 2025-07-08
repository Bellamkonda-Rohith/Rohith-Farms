"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, Feather } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/birds", label: "Birds For Sale" },
];

export default function Header() {
  const pathname = usePathname();

  const renderNavLinks = (isMobile = false) => (
    navLinks.map((link) => (
      <Button
        key={link.href}
        variant="ghost"
        asChild
        className={cn(
          "transition-colors",
          pathname === link.href
            ? "text-accent"
            : "text-foreground/80 hover:text-foreground",
          isMobile && "w-full justify-start text-lg"
        )}
      >
        <Link href={link.href}>{link.label}</Link>
      </Button>
    ))
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Feather className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold text-primary">
            Rohith Farms
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          {renderNavLinks()}
          <Button variant="outline" asChild>
            <Link href="/admin">Admin</Link>
          </Button>
        </nav>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {renderNavLinks(true)}
                 <Button variant="outline" asChild className="w-full justify-start text-lg">
                    <Link href="/admin">Admin</Link>
                 </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

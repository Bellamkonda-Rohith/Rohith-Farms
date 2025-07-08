"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, Feather } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/birds", label: "Birds For Sale" },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const closeSheet = () => setSheetOpen(false);


  const renderNavLinks = (isMobile = false) => (
    navLinks.map((link) => (
      <Button
        key={link.href}
        variant="ghost"
        asChild
        className={cn(
          "transition-colors duration-300 font-semibold",
          pathname === link.href
            ? "text-primary"
            : "text-foreground/80 hover:text-primary",
          isMobile && "w-full justify-start text-lg py-6"
        )}
        onClick={closeSheet}
      >
        <Link href={link.href}>{link.label}</Link>
      </Button>
    ))
  );

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "border-b border-border/50 bg-background/80 backdrop-blur-lg" : "border-b border-transparent"
    )}>
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Feather className="h-7 w-7 text-primary" />
          <span className="text-2xl font-bold text-foreground">
            Rohith Farms
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          {renderNavLinks()}
          <Button variant="outline" asChild className="rounded-full font-bold ml-2">
            <Link href="/admin">Admin</Link>
          </Button>
        </nav>
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw]">
               <div className="flex items-center gap-2 mb-8">
                <Feather className="h-7 w-7 text-primary" />
                <span className="text-2xl font-bold text-foreground">
                  Rohith Farms
                </span>
              </div>
              <nav className="flex flex-col gap-4">
                {renderNavLinks(true)}
                 <Button variant="outline" asChild className="w-full justify-start text-lg py-6 mt-4">
                    <Link href="/admin" onClick={closeSheet}>Admin</Link>
                 </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

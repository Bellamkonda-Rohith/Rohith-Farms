"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, Feather, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/birds", label: "Birds For Sale" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
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

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

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

  const renderAdminLink = (isMobile = false) => {
    if (loading) {
      return <Button variant="ghost" className="rounded-full font-bold ml-2" disabled>...</Button>;
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn("rounded-full p-0 w-10 h-10", isMobile ? "w-full justify-start text-lg py-8 mt-4 pl-4" : "ml-2")}>
               <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="h-5 w-5"/>
                  </AvatarFallback>
                </Avatar>
                {isMobile && <span className="ml-2">Profile</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p>My Account</p>
              <p className="text-xs text-muted-foreground font-normal">{user.phoneNumber}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
               <Link href="/admin"><User className="mr-2 h-4 w-4"/> Admin Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500 focus:bg-red-500/10">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
       <Button variant="outline" asChild className={cn("rounded-full font-bold", isMobile ? "w-full justify-start text-lg py-6 mt-4" : "ml-2")}>
          <Link href="/login" onClick={closeSheet}>Login</Link>
       </Button>
    );
  }

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
          {renderAdminLink()}
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
                {renderAdminLink(true)}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

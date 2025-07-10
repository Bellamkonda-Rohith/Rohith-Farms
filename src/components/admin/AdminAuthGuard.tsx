
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If authentication is finished and there's no user or the user is not an admin, redirect.
    if (!isAuthLoading && (!user || !isAdmin)) {
      router.replace("/");
    }
  }, [user, isAdmin, isAuthLoading, router]);

  // While loading or if the user is not an authenticated admin, show a loading screen.
  // This prevents flashing the admin content to unauthorized users.
  if (isAuthLoading || !user || !isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // If the user is authenticated and is an admin, render the children.
  return <>{children}</>;
}

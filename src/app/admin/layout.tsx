
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, LayoutDashboard } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="flex">
        <aside className="w-64 bg-card p-4 border-r hidden md:block">
          <nav className="flex flex-col gap-2">
             <Button variant="ghost" asChild className="justify-start">
                <Link href="/admin">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                </Link>
            </Button>
            <Button variant="ghost" asChild className="justify-start">
                <Link href="/admin/users">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                </Link>
            </Button>
          </nav>
        </aside>
        <div className="flex-1 p-6">{children}</div>
      </div>
    </AdminAuthGuard>
  );
}

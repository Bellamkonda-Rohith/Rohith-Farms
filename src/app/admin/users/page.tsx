
import { AddAdminForm } from "@/components/admin/AddAdminForm";
import { AdminList } from "@/components/admin/AdminList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdmins } from "@/lib/admin-actions";

export default async function AdminUsersPage() {
  const admins = await getAdmins();

  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Add New Admin</CardTitle>
                <CardDescription>Enter the User ID (UID) of the user you want to grant admin privileges to. You can find the UID in your Firebase Authentication console after the user has logged in at least once.</CardDescription>
            </CardHeader>
            <CardContent>
                <AddAdminForm />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Current Admins</CardTitle>
                <CardDescription>List of users with admin privileges.</CardDescription>
            </CardHeader>
            <CardContent>
                <AdminList admins={admins} />
            </CardContent>
        </Card>
    </div>
  );
}

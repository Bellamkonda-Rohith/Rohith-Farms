import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddBirdForm } from "@/components/admin/AddBirdForm";

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Admin Dashboard</CardTitle>
          <CardDescription>Add new gamefowl listings to your catalog.</CardDescription>
        </CardHeader>
        <CardContent>
          <AddBirdForm />
        </CardContent>
      </Card>
    </div>
  );
}

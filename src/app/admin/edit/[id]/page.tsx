import { getBird } from "@/lib/birds";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EditBirdForm } from "@/components/admin/EditBirdForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function EditBirdPage({ params }: { params: { id: string } }) {
  const bird = await getBird(params.id);

  if (!bird) {
    return (
      <div className="container mx-auto text-center py-20">
        <h2 className="text-2xl font-bold">Bird Not Found</h2>
        <p className="text-muted-foreground mt-2">
          Could not find a bird with ID: {params.id}
        </p>
        <Button asChild variant="outline" className="mt-4">
            <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
            <Button asChild variant="outline" size="sm">
                <Link href="/admin">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Edit Bird: {bird.name}</CardTitle>
                    <CardDescription>Update the details and media for this bird. Changes will be saved live.</CardDescription>
                </CardHeader>
                <CardContent>
                    <EditBirdForm bird={bird} />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

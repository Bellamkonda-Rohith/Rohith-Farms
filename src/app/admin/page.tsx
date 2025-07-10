import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddBirdForm } from "@/components/admin/AddBirdForm";
import { BirdList } from "@/components/admin/BirdList";
import { getBirds } from "@/lib/birds";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlusCircle } from "lucide-react";

export default async function AdminPage() {
  const birds = await getBirds();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Admin Dashboard</CardTitle>
            <CardDescription>Manage your gamefowl catalog.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="add-bird">
                <AccordionTrigger>
                  <span className="flex items-center gap-2 text-lg font-semibold text-primary">
                    <PlusCircle className="h-5 w-5" /> Add New Bird
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <AddBirdForm />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Current Listings</CardTitle>
            <CardDescription>View and manage all birds currently in your database.</CardDescription>
          </CardHeader>
          <CardContent>
            <BirdList birds={birds} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

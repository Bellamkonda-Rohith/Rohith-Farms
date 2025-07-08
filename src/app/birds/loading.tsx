import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
            <Skeleton className="h-12 w-3/4 md:w-1/2 mx-auto" />
            <Skeleton className="h-6 w-full max-w-xl mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="flex flex-col h-full overflow-hidden">
              <CardHeader className="p-0 relative">
                <Skeleton className="w-full aspect-[3/2]" />
              </CardHeader>
              <CardContent className="flex-grow p-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-full mt-4" />
                <Skeleton className="h-6 w-5/6 mt-2" />
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Skeleton className="h-12 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

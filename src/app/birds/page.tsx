import { BirdCard } from "@/components/BirdCard";
import { getBirds } from "@/lib/birds";

export default async function BirdsPage() {
  const birds = await getBirds();

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
            Birds For Sale
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of premium gamefowl, each bred for performance and heritage.
          </p>
        </div>

        {birds && birds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {birds.map((bird) => (
              <BirdCard key={bird.id} bird={bird} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground text-lg">No birds currently available. Please check back later!</p>
            <p className="text-muted-foreground text-sm mt-2">(Make sure your Firebase project is configured correctly and you have data in the 'birds' collection.)</p>
          </div>
        )}
      </div>
    </div>
  );
}

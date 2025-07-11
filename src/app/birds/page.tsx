import { BirdCard } from "@/components/bird-card";
import { getBirds } from "@/data/birds";

export default function BirdsForSalePage() {
  const birds = getBirds();

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight font-serif text-primary sm:text-5xl md:text-6xl">
          Birds for Sale
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Browse our collection of high-quality gamefowl.
        </p>
      </div>

      {/* TODO: Add filters and search bar here */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {birds.map((bird) => (
          <BirdCard key={bird.id} bird={bird} />
        ))}
      </div>

      {birds.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            No birds are currently listed for sale. Please check back later or contact us for inquiries.
          </p>
        </div>
      )}
    </div>
  );
}

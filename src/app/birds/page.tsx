import { BirdCard } from "@/components/BirdCard";
import type { Bird } from "@/lib/types";

// Mock data, to be replaced with Firebase data fetching
async function getBirds(): Promise<Bird[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: "1", name: "Sweater", bloodline: "Sweater", traits: "High-flying, fast, and powerful.", isAvailable: true, imageUrl: "https://placehold.co/600x400.png", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      father: { name: "Senior Sweats", imageUrl: "https://placehold.co/300x200.png", videoUrl: "" },
      mother: { name: "Golden Hen", imageUrl: "https://placehold.co/300x200.png", videoUrl: "" },
    },
    {
      id: "2", name: "Kelso", bloodline: "Kelso", traits: "Smart, agile, and a ground fighter.", isAvailable: true, imageUrl: "https://placehold.co/600x400.png", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      father: { name: "General Kelso", imageUrl: "https://placehold.co/300x200.png", videoUrl: "" },
      mother: { name: "Red Lady", imageUrl: "https://placehold.co/300x200.png", videoUrl: "" },
    },
    {
      id: "3", name: "Roundhead", bloodline: "Lacy Roundhead", traits: "Aggressive with deep-cutting ability.", isAvailable: false, imageUrl: "https://placehold.co/600x400.png", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      father: { name: "Lacy Senior", imageUrl: "https://placehold.co/300x200.png", videoUrl: "" },
      mother: { name: "Pure Roundhead Hen", imageUrl: "https://placehold.co/300x200.png", videoUrl: "" },
    },
    {
      id: "4", name: "Hatch", bloodline: "Leiper Hatch", traits: "Powerful leg kicks and high stamina.", isAvailable: true, imageUrl: "https://placehold.co/600x400.png", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      father: { name: "Leiper King", imageUrl: "https://placehold.co/300x200.png", videoUrl: "" },
      mother: { name: "Hatch Henny", imageUrl: "https://placehold.co/300x200.png", videoUrl: "" },
    },
    {
      id: "5", name: "Claret", bloodline: "Joe Goode Claret", traits: "Fast, shifty, and a great cutter.", isAvailable: true, imageUrl: "https://placehold.co/600x400.png", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      father: { name: "Goode's Best", imageUrl: "https://placehold.co/300x200.png", videoUrl: "" },
      mother: { name: "Claret Queen", imageUrl: "https://placehold.co/300x200.png", videoUrl: "" },
    },
     {
      id: "6", name: "Whitehackle", bloodline: "Morgan Whitehackle", traits: "Strong and intelligent, known for timing.", isAvailable: false, imageUrl: "https://placehold.co/600x400.png", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      father: { name: "Morgan's Pride", imageUrl: "https://placehold.co/300x200.png", videoUrl: "" },
      mother: { name: "White Hen", imageUrl: "https://placehold.co/300x200.png", videoUrl: "" },
    },
  ];
}


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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {birds.map((bird) => (
            <BirdCard key={bird.id} bird={bird} />
          ))}
        </div>
      </div>
    </div>
  );
}

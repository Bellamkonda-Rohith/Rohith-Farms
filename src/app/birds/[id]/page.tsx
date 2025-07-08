import Image from "next/image";
import type { Bird } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WhatsappButton } from "@/components/WhatsappButton";
import { cn } from "@/lib/utils";
import { Dna, ShieldCheck, Video } from "lucide-react";

// Mock data store
const birdsData: Bird[] = [
    { id: "1", name: "Sweater", bloodline: "Sweater", traits: "A high-flying, fast, and powerful fighter known for its relentless attacks and agility in the air. Exceptional stamina and a winning spirit.", isAvailable: true, imageUrl: "https://placehold.co/1200x800.png", videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
      father: { name: "Senior Sweats", imageUrl: "https://placehold.co/400x300.png", videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4" },
      mother: { name: "Golden Hen", imageUrl: "https://placehold.co/400x300.png", videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4" },
    },
    { id: "2", name: "Kelso", bloodline: "Kelso", traits: "A smart and agile ground fighter, famous for its side-stepping and weaving techniques. Kelsos are known for their cunning and ability to out-maneuver opponents.", isAvailable: true, imageUrl: "https://placehold.co/1200x800.png", videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
      father: { name: "General Kelso", imageUrl: "https://placehold.co/400x300.png", videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4" },
      mother: { name: "Red Lady", imageUrl: "https://placehold.co/400x300.png", videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4" },
    },
    { id: "3", name: "Roundhead", bloodline: "Lacy Roundhead", traits: "An aggressive bird with a reputation for deep-cutting ability. It is powerful and known for its timing and precision striking.", isAvailable: false, imageUrl: "https://placehold.co/1200x800.png", videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
      father: { name: "Lacy Senior", imageUrl: "https://placehold.co/400x300.png", videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4" },
      mother: { name: "Pure Roundhead Hen", imageUrl: "https://placehold.co/400x300.png", videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4" },
    },
    { id: "4", name: "Hatch", bloodline: "Leiper Hatch", traits: "Characterized by its powerful leg kicks and exceptional stamina. A tough and durable fighter that excels in long battles.", isAvailable: true, imageUrl: "https://placehold.co/1200x800.png", videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
      father: { name: "Leiper King", imageUrl: "https://placehold.co/400x300.png", videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4" },
      mother: { name: "Hatch Henny", imageUrl: "https://placehold.co/400x300.png", videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4" },
    },
    { id: "5", name: "Claret", bloodline: "Joe Goode Claret", traits: "Extremely fast and shifty, a great cutter that uses speed to its advantage. Known for its evasiveness and accurate striking.", isAvailable: true, imageUrl: "https://placehold.co/1200x800.png", videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
      father: { name: "Goode's Best", imageUrl: "https://placehold.co/400x300.png", videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4" },
      mother: { name: "Claret Queen", imageUrl: "https://placehold.co/400x300.png", videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4" },
    },
    { id: "6", name: "Whitehackle", bloodline: "Morgan Whitehackle", traits: "A strong and intelligent bird known for its superb timing and powerful blows. It is a strategic fighter that waits for the perfect moment to strike.", isAvailable: false, imageUrl: "https://placehold.co/1200x800.png", videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
      father: { name: "Morgan's Pride", imageUrl: "https://placehold.co/400x300.png", videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4" },
      mother: { name: "White Hen", imageUrl: "https://placehold.co/400x300.png", videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4" },
    },
];

// Mock data fetching function
async function getBird(id: string): Promise<Bird | undefined> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return birdsData.find(bird => bird.id === id);
}

export default async function BirdDetailPage({ params }: { params: { id: string } }) {
  const bird = await getBird(params.id);

  if (!bird) {
    return <div className="container mx-auto text-center py-20">Bird not found.</div>;
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left Column - Image */}
          <div className="lg:col-span-3">
            <div className="rounded-lg overflow-hidden shadow-2xl sticky top-24">
              <Image
                src={bird.imageUrl}
                alt={bird.name}
                width={1200}
                height={800}
                className="w-full h-auto object-cover"
                data-ai-hint="gamefowl portrait"
              />
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2">
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">{bird.bloodline}</h1>
            <div className="flex items-center gap-4 mt-4">
              <Badge className={cn("text-lg", bird.isAvailable ? "bg-green-600" : "bg-red-600")}>
                {bird.isAvailable ? "Available" : "Sold"}
              </Badge>
              <p className="text-lg text-muted-foreground">{bird.name}</p>
            </div>
            
            <Separator className="my-6" />

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-headline flex items-center gap-2"><ShieldCheck className="text-accent" /> Traits</h2>
                <p className="mt-2 text-lg text-muted-foreground leading-relaxed">{bird.traits}</p>
              </div>
            </div>
            
            <div className="mt-8">
              <WhatsappButton bird={bird} />
            </div>
          </div>
        </div>

        {/* Video Section */}
        {bird.videoUrl && (
          <div className="mt-16">
            <h2 className="text-3xl font-headline text-center mb-8 flex items-center justify-center gap-3"><Video className="text-primary"/> Fighting Video</h2>
            <div className="aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl">
              <iframe
                width="100%"
                height="100%"
                src={bird.videoUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* Pedigree Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-headline text-center mb-8 flex items-center justify-center gap-3"><Dna className="text-primary"/> Pedigree</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Father</CardTitle>
              </CardHeader>
              <CardContent>
                <Image src={bird.father.imageUrl} alt={bird.father.name} width={400} height={300} className="rounded-md w-full" data-ai-hint="rooster male"/>
                <p className="mt-4 text-xl font-semibold text-muted-foreground">{bird.father.name}</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Mother</CardTitle>
              </CardHeader>
              <CardContent>
                <Image src={bird.mother.imageUrl} alt={bird.mother.name} width={400} height={300} className="rounded-md w-full" data-ai-hint="hen female"/>
                <p className="mt-4 text-xl font-semibold text-muted-foreground">{bird.mother.name}</p>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}

import Image from "next/image";
import type { Bird } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WhatsappButton } from "@/components/WhatsappButton";
import { cn } from "@/lib/utils";
import { Dna, ShieldCheck, Video } from "lucide-react";
import { getBird } from "@/lib/birds";

const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => (
  <div className="aspect-video w-full rounded-lg overflow-hidden shadow-xl mt-4">
    <iframe
      width="100%"
      height="100%"
      src={videoUrl}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
);

export default async function BirdDetailPage({ params }: { params: { id: string } }) {
  const bird = await getBird(params.id);

  if (!bird) {
    return (
      <div className="container mx-auto text-center py-20">
        <h2 className="text-2xl font-bold">Bird Not Found</h2>
        <p className="text-muted-foreground mt-2">
          The bird you are looking for does not exist or may have been moved.
        </p>
        <p className="text-muted-foreground text-sm mt-1">
            (If you are the admin, please check your Firebase configuration and data.)
        </p>
      </div>
    );
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
            <div className="max-w-4xl mx-auto">
              <VideoPlayer videoUrl={bird.videoUrl} />
            </div>
          </div>
        )}

        {/* Pedigree Section */}
        {bird.father && bird.mother && (
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
                          {bird.father.videoUrl && <VideoPlayer videoUrl={bird.father.videoUrl} />}
                      </CardContent>
                    </Card>
                    <Card className="text-center">
                      <CardHeader>
                          <CardTitle className="font-headline text-2xl">Mother</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <Image src={bird.mother.imageUrl} alt={bird.mother.name} width={400} height={300} className="rounded-md w-full" data-ai-hint="hen female"/>
                          <p className="mt-4 text-xl font-semibold text-muted-foreground">{bird.mother.name}</p>
                          {bird.mother.videoUrl && <VideoPlayer videoUrl={bird.mother.videoUrl} />}
                      </CardContent>
                    </Card>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}

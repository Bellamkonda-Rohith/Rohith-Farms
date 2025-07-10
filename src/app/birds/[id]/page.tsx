import Image from "next/image";
import type { Bird } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WhatsappButton } from "@/components/WhatsappButton";
import { cn } from "@/lib/utils";
import { Dna, IndianRupee, Tag, ShieldCheck, Video, Calendar, Image as ImageIcon } from "lucide-react";
import { getBird } from "@/lib/birds";
import { MediaCarousel } from "@/components/MediaCarousel";

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
  <div className="flex items-start gap-3">
    <Icon className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
    <div>
      <p className="font-semibold text-primary">{label}</p>
      <p className="text-muted-foreground">{value}</p>
    </div>
  </div>
);

const ParentCard = ({ title, images, videos }: { title: string, images: string[], videos: string[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="font-headline text-2xl text-center">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {images.length > 0 ? (
        <MediaCarousel images={images} videos={[]} />
      ) : (
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
      {videos.length > 0 && (
        <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-center">Videos</h3>
            <MediaCarousel images={[]} videos={videos} />
        </div>
      )}
    </CardContent>
  </Card>
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
      </div>
    );
  }

  const allBirdMedia = [...bird.birdImages, ...bird.birdVideos];

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              {allBirdMedia.length > 0 ? (
                 <MediaCarousel images={bird.birdImages} videos={bird.birdVideos} />
              ) : (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">{bird.name}</h1>
            <div className="flex items-center gap-4 mt-4">
              <Badge variant={bird.isSold ? 'destructive' : 'default'} className={cn("text-lg", bird.isSold ? "bg-red-600" : "bg-green-600", "text-white")}>
                {bird.isSold ? "Sold" : "Available"}
              </Badge>
              {bird.isFeatured && <Badge className="bg-yellow-500 text-white text-lg">Featured</Badge>}
            </div>
            
            <Separator className="my-6" />

            <div className="space-y-6">
                <DetailItem icon={IndianRupee} label="Price" value={`₹${bird.price.toLocaleString('en-IN')}`} />
                <DetailItem icon={Calendar} label="Age" value={bird.age} />
                <DetailItem icon={ShieldCheck} label="Description" value={bird.description} />
            </div>
            
            {!bird.isSold && (
                <div className="mt-8">
                <WhatsappButton bird={bird} />
                </div>
            )}
          </div>
        </div>

        {(bird.fatherImages.length > 0 || bird.motherImages.length > 0) && (
            <div className="mt-24">
                <h2 className="text-3xl font-headline text-center mb-8 flex items-center justify-center gap-3"><Dna className="text-primary"/> Pedigree</h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <ParentCard title="Father" images={bird.fatherImages} videos={bird.fatherVideos} />
                    <ParentCard title="Mother" images={bird.motherImages} videos={bird.motherVideos} />
                </div>
            </div>
        )}

      </div>
    </div>
  );
}

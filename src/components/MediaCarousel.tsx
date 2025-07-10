'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface MediaCarouselProps {
  images: string[];
  videos: string[];
}

export function MediaCarousel({ images, videos }: MediaCarouselProps) {
    const mediaItems = [
        ...images.map(url => ({ type: 'image', url })),
        ...videos.map(url => ({ type: 'video', url }))
    ];

    if (mediaItems.length === 0) return null;

    return (
        <Carousel className="w-full">
            <CarouselContent>
                {mediaItems.map((item, index) => (
                    <CarouselItem key={index}>
                         <Card className="overflow-hidden">
                            <CardContent className="p-0">
                                <AspectRatio ratio={16 / 9}>
                                {item.type === 'image' ? (
                                    <Image
                                        src={item.url}
                                        alt={`Media ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                ) : (
                                    <video
                                        src={item.url}
                                        controls
                                        className="w-full h-full object-cover"
                                    />
                                )}
                                </AspectRatio>
                            </CardContent>
                         </Card>
                    </CarouselItem>
                ))}
            </CarouselContent>
            {mediaItems.length > 1 && (
                <>
                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                </>
            )}
        </Carousel>
    );
}

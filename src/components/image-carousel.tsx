
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface ImageCarouselProps {
  images?: string[];
  videos?: string[];
}

export function ImageCarousel({ images = [], videos = [] }: ImageCarouselProps) {
  const media = [
    ...images.map(src => ({ type: 'image', src })),
    ...videos.map(src => ({ type: 'video', src })),
  ];

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  if (media.length === 0) {
    return (
       <Card className="aspect-video flex items-center justify-center bg-muted">
         <p className="text-muted-foreground">No media available</p>
       </Card>
    );
  }
  
  return (
    <Carousel 
      className="w-full"
      plugins={[plugin.current]}
    >
      <CarouselContent>
        {media.map((item, index) => (
          <CarouselItem key={index}>
            <Card className="overflow-hidden">
              <CardContent className="flex aspect-video items-center justify-center p-0">
                {item.type === 'image' ? (
                  <Image
                    src={item.src}
                    alt={`Bird media ${index + 1}`}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                    data-ai-hint="gamefowl rooster"
                  />
                ) : (
                  <video
                    src={item.src}
                    controls
                    className="w-full h-full object-cover"
                    playsInline
                  />
                )}
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      {media.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-2" />
            <CarouselNext className="absolute right-2" />
          </>
      )}
    </Carousel>
  );
}

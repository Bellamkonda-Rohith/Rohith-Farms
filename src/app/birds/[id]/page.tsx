
'use client';

import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Loader2 } from 'lucide-react';
import { ImageCarousel } from '@/components/image-carousel';
import type { Bird } from '@/lib/types';
import { getBirdById } from '@/lib/birds';
import { useEffect, useState } from 'react';

export default function BirdDetailPage({ params }: { params: { id: string } }) {
  const [bird, setBird] = useState<Bird | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBird() {
      try {
        const fetchedBird = await getBirdById(params.id);
        if (fetchedBird) {
          setBird(fetchedBird);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Failed to fetch bird:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    }
    loadBird();
  }, [params.id]);
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!bird) {
    return notFound();
  }

  const whatsappMessage = `Hi, I’m interested in the bird ${bird.name} (${bird.id}).`;
  const whatsappUrl = `https://wa.me/+919876543210?text=${encodeURIComponent(whatsappMessage)}`;
  const callUrl = `tel:+919876543210`;

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image and Video Section */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold font-serif mb-2">{bird.name}</h1>
          <p className="text-sm text-muted-foreground mb-4">ID: {bird.id}</p>
          <ImageCarousel images={bird.images} videos={bird.videos} />
        </div>

        {/* Bird Details Section */}
        <div className="lg:mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Bird Details</span>
                <Badge variant={bird.availability === 'Available' ? 'default' : 'destructive'} className="text-sm">
                  {bird.availability}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-base">
                <div><strong>Age:</strong> {bird.age}</div>
                <div><strong>Weight:</strong> {bird.weight}</div>
                <div><strong>Color:</strong> {bird.color}</div>
                <div><strong>Line:</strong> {bird.line}</div>
              </div>
              <div>
                <strong>Price:</strong>
                <span className="text-primary font-bold text-lg ml-2">
                  {bird.price ? `₹${bird.price.toLocaleString()}` : 'Contact for price'}
                </span>
              </div>
              <div className="pt-4 space-y-3">
                 <Button asChild size="lg" className="w-full">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp Chat to Buy
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full">
                  <a href={callUrl}>
                    <Phone className="mr-2 h-5 w-5" /> Call Now
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Parents Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold font-serif text-center mb-8">Lineage Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Father */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Father (Sire)</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageCarousel images={bird.parents.father.images} videos={bird.parents.father.videos} />
            </CardContent>
          </Card>

          {/* Mother */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Mother (Dam)</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageCarousel images={bird.parents.mother.images} videos={bird.parents.mother.videos} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


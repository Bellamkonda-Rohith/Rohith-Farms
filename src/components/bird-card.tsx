
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Bird } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface BirdCardProps {
  bird: Bird;
}

export function BirdCard({ bird }: BirdCardProps) {
  const firstImage = bird.images && bird.images.length > 0 ? bird.images[0] : 'https://placehold.co/400x300.png';

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
      <CardHeader className="p-0 relative">
        <Link href={`/birds/${bird.id}`} className="block">
          <Image
            src={firstImage}
            alt={bird.name}
            width={400}
            height={300}
            className="w-full h-48 object-cover"
            data-ai-hint="game bird rooster"
          />
        </Link>
        {bird.availability === 'Sold' && (
          <Badge variant="destructive" className="absolute top-2 right-2">SOLD</Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-serif mb-2">
          <Link href={`/birds/${bird.id}`} className="hover:text-primary transition-colors">
            {bird.name}
          </Link>
        </CardTitle>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{bird.line}</span>
          <span>{bird.age}</span>
        </div>
        <p className="text-lg font-bold text-primary mt-2">
          {bird.price ? `₹${bird.price.toLocaleString()}` : 'Contact for Price'}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/birds/${bird.id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

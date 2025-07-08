import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Bird } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";

type BirdCardProps = {
  bird: Bird;
};

export function BirdCard({ bird }: BirdCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl group">
      <CardHeader className="p-0 relative">
        <Link href={`/birds/${bird.id}`} className="block">
          <Image
            src={bird.imageUrl}
            alt={bird.name}
            width={600}
            height={400}
            className="w-full h-auto aspect-[3/2] object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="gamefowl rooster"
          />
        </Link>
        <Badge
          className={cn(
            "absolute top-3 right-3 text-sm",
            bird.isAvailable ? "bg-green-600" : "bg-red-600"
          )}
        >
          {bird.isAvailable ? "Available" : "Sold"}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <CardTitle className="font-headline text-2xl text-primary">{bird.bloodline}</CardTitle>
        <CardDescription className="mt-2 text-base text-muted-foreground">{bird.traits}</CardDescription>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href={`/birds/${bird.id}`}>
            <Eye className="mr-2 h-4 w-4" /> View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

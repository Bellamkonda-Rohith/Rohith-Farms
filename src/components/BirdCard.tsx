'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Bird } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Eye, IndianRupee } from "lucide-react";

type BirdCardProps = {
  bird: Bird;
};

export function BirdCard({ bird }: BirdCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className="flex flex-col h-full overflow-hidden rounded-2xl bg-card border-2 border-transparent hover:border-primary transition-colors duration-300 shadow-lg">
        <CardHeader className="p-0 relative">
          <Link href={`/birds/${bird.id}`} className="block overflow-hidden">
            <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
                <Image
                    src={bird.birdImages[0] || "https://placehold.co/600x400.png"}
                    alt={bird.name}
                    width={600}
                    height={400}
                    className="w-full h-auto aspect-[4/3] object-cover"
                    data-ai-hint="gamefowl rooster"
                />
            </motion.div>
          </Link>
          <Badge
            variant={bird.isSold ? "destructive" : "default"}
            className={cn(
              "absolute top-4 right-4 text-sm font-bold rounded-full border-none",
              bird.isSold ? "bg-red-600 text-white" : "bg-green-600 text-white"
            )}
          >
            {bird.isSold ? "Sold" : "Available"}
          </Badge>
        </CardHeader>
        <CardContent className="flex-grow p-6">
          <CardTitle className="text-2xl font-bold text-primary">{bird.name}</CardTitle>
          <p className="mt-2 text-base text-muted-foreground line-clamp-2">{bird.description}</p>
        </CardContent>
        <CardFooter className="p-6 pt-0 flex flex-col items-start gap-4">
          <div className="flex items-center text-2xl font-bold text-accent">
            <IndianRupee className="h-6 w-6 mr-1" />
            <span>{bird.price.toLocaleString('en-IN')}</span>
          </div>
          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full text-base">
            <Link href={`/birds/${bird.id}`}>
              <Eye className="mr-2 h-4 w-4" /> View Details
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

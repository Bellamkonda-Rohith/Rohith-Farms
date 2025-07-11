
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BirdCard } from "@/components/bird-card";
import { ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Bird } from "@/lib/types";
import { getFeaturedBirds } from "@/lib/birds";

export default function Home() {
  const [featuredBirds, setFeaturedBirds] = useState<Bird[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBirds() {
      try {
        const birds = await getFeaturedBirds();
        setFeaturedBirds(birds);
      } catch (error) {
        console.error("Failed to fetch featured birds:", error);
      } finally {
        setLoading(false);
      }
    }
    loadBirds();
  }, []);

  const introVideoUrl = "https://firebasestorage.googleapis.com/v0/b/rohith-farms.firebasestorage.app/o/Rohith%20Farms%20intro%20vedio.mp4?alt=media&token=ed4919a8-3850-475f-af1d-d7cfd1d9c820";

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute z-0 w-full h-full object-cover"
        >
          <source src={introVideoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute z-10 inset-0 bg-black/50"></div>
        <div className="container mx-auto relative z-20 px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            Rohith Game Farm
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Breeding powerful, healthy, and honest bloodlines for the passionate fancier.
          </p>
        </div>
      </section>

      {/* Featured Birds Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Birds</h2>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBirds.map((bird) => (
                <BirdCard key={bird.id} bird={bird} />
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/birds">
                View All Birds for Sale <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Us Snippet */}
      <section className="bg-secondary/10 py-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Our Commitment</h2>
          <p className="text-muted-foreground mb-6">
            At Rohith Game Farm, we are dedicated to preserving and enhancing top-tier gamefowl bloodlines. With a focus on health, vitality, and honesty, we provide birds that meet the highest standards.
          </p>
          <Button variant="outline" asChild>
            <Link href="/about">Learn More About Our Farm</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

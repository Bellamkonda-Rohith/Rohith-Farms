
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BirdCard } from "@/components/bird-card";
import { ArrowRight, ChevronDown, Loader2, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import type { Bird } from "@/lib/types";
import { getFeaturedBirds } from "@/lib/birds";
import { db } from "@/lib/firebase";

export default function Home() {
  const [featuredBirds, setFeaturedBirds] = useState<Bird[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBirds() {
      if (!db) {
        setError("Firebase is not configured. Please add your project credentials in the Secrets tab to see your featured birds.");
        setLoading(false);
        return;
      }
      try {
        const birds = await getFeaturedBirds();
        setFeaturedBirds(birds);
      } catch (error) {
        console.error("Failed to fetch featured birds:", error);
        setError("Could not load featured birds. Please check your connection and try again.");
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
      <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden flex flex-col justify-end items-center pb-8">
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
        <div className="absolute z-10 inset-0 bg-black/40"></div>
        <div className="z-20 flex flex-col items-center gap-4">
           <Button asChild variant="outline" size="lg" className="bg-transparent border-white/80 text-white hover:bg-white hover:text-black">
              <Link href="/birds">
                View Our Collection
              </Link>
            </Button>
            <ChevronDown className="h-8 w-8 text-white/80 animate-bounce" />
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
          ) : error ? (
            <div className="text-center py-10 text-destructive-foreground bg-destructive/10 rounded-lg">
              <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
              <p className="font-semibold">Configuration Needed</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : (
            <>
              {featuredBirds.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredBirds.map((bird) => (
                    <BirdCard key={bird.id} bird={bird} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                   <p className="text-muted-foreground text-lg">No featured birds found.</p>
                   <p className="text-muted-foreground text-sm">Have you added any birds and marked them as 'featured' in the admin dashboard?</p>
                </div>
              )}
            </>
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
            At Rohith Farms, we are dedicated to preserving and enhancing top-tier game bird bloodlines. With a focus on health, vitality, and honesty, we provide birds that meet the highest standards.
          </p>
          <Button variant="outline" asChild>
            <Link href="/about">Learn More About Our Farm</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

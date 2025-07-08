'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BirdCard } from "@/components/BirdCard";
import { ArrowRight, ChevronDown } from "lucide-react";
import { getBirds } from "@/lib/birds";
import { useEffect, useState } from "react";
import type { Bird } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [featuredBirds, setFeaturedBirds] = useState<Bird[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBirds() {
      setIsLoading(true);
      const allBirds = await getBirds();
      const availableBirds = allBirds.filter(b => b.isAvailable).slice(0, 3);
      setFeaturedBirds(availableBirds);
      setIsLoading(false);
    }
    loadBirds();
  }, []);

  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  return (
    <motion.div 
      className="flex flex-col bg-background"
      initial="hidden"
      animate="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
    >
      {/* Hero Section */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center text-center text-white overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          variants={{
            hidden: { opacity: 0, scale: 1.2 },
            show: { opacity: 1, scale: 1, transition: { duration: 1.5, ease: "easeOut" }}
          }}
        >
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/rohith-farms.firebasestorage.app/o/hero%20section.jpg?alt=media&token=1474a0c4-6d4d-4e67-9486-3d853068d24a"
            alt="Rohith Farms Banner"
            fill
            className="object-cover object-center brightness-[0.4]"
            priority
            data-ai-hint="gamefowl farm landscape"
          />
        </motion.div>
        <div className="relative z-10 p-4 max-w-4xl">
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold font-headline tracking-tighter text-white [text-shadow:0_4px_12px_rgba(0,0,0,0.6)]"
            variants={FADE_DOWN_ANIMATION_VARIANTS}
          >
            Rohith Farms
          </motion.h1>
          <motion.p 
            className="mt-4 text-lg md:text-xl text-white/90 [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]"
            variants={FADE_DOWN_ANIMATION_VARIANTS}
          >
            Breeding World-Class Champions, One Generation at a Time.
          </motion.p>
          <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS}>
            <Button asChild size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-full text-base">
              <Link href="/birds">
                Explore The Lineage <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10"
        >
          <a href="#about" aria-label="Scroll to about section">
            <ChevronDown className="h-8 w-8 text-white/50" />
          </a>
        </motion.div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div 
              className="order-2 md:order-1"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold font-headline text-primary">Our Story</h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Welcome to Rohith Farms, where passion for gamefowl heritage meets modern breeding excellence. Founded on principles of integrity and dedication, our farm is committed to preserving and enhancing the finest bloodlines. We believe in raising strong, healthy, and high-quality birds that embody the spirit of their lineage.
              </p>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Each bird is a testament to our meticulous care, ensuring every generation is a step forward in quality and performance.
              </p>
            </motion.div>
            <motion.div 
              className="order-1 md:order-2 rounded-2xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/rohith-farms.firebasestorage.app/o/Stort%20section.jpg?alt=media&token=29ccab65-6a62-4bf2-bae6-02d3bf02258c"
                alt="A majestic rooster at Rohith Farms"
                width={800}
                height={800}
                className="w-full h-auto aspect-square object-cover"
                data-ai-hint="gamefowl rooster"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Featured Gamefowl Section */}
      <section className="py-24 lg:py-32 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-headline text-primary">Featured Gamefowl</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">A glimpse into the quality and power of our current champions available for sale.</p>
          </motion.div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                 <Card key={i} className="flex flex-col h-full overflow-hidden rounded-2xl">
                    <Skeleton className="w-full aspect-[4/3] rounded-b-none" />
                    <div className="p-6 flex-grow">
                      <Skeleton className="h-8 w-3/4 mb-4" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-5/6 mt-2" />
                    </div>
                    <div className="p-6 pt-0">
                      <Skeleton className="h-12 w-full rounded-full" />
                    </div>
                 </Card>
              ))}
            </div>
          ) : featuredBirds.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredBirds.map((bird, i) => (
                  <motion.div
                    key={bird.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <BirdCard bird={bird} />
                  </motion.div>
                ))}
              </div>
              <motion.div 
                className="text-center mt-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Button asChild variant="outline" size="lg" className="rounded-full text-base border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <Link href="/birds">See All Birds</Link>
                </Button>
              </motion.div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground text-lg">No featured birds at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}

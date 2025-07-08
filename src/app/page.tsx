import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BirdCard } from "@/components/BirdCard";
import { ArrowRight } from "lucide-react";
import { getBirds } from "@/lib/birds";

export default async function Home() {
  const allBirds = await getBirds();
  // We'll feature the first 3 available birds
  const featuredBirds = allBirds.filter(b => b.isAvailable).slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white">
        <Image
          src="https://placehold.co/1600x900.png"
          alt="Rohith Farms Banner"
          layout="fill"
          objectFit="cover"
          className="z-0 brightness-50"
          data-ai-hint="gamefowl farm"
        />
        <div className="relative z-10 p-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight">
            Rohith Farms
          </h1>
          <p className="mt-4 text-lg md:text-xl text-primary-foreground">
            Breeding Excellence, One Generation at a Time.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
            <Link href="/birds">
              View Birds For Sale <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-headline text-primary font-bold">Our Story</h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Welcome to Rohith Farms, where passion for gamefowl heritage meets modern breeding excellence. Founded on principles of integrity and dedication, our farm is committed to preserving and enhancing the finest bloodlines. We believe in raising strong, healthy, and high-quality birds that embody the spirit of their lineage.
              </p>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Each bird at Rohith Farms is a testament to our meticulous care and selective breeding process, ensuring that every generation is a step forward in quality and performance.
              </p>
            </div>
            <div className="order-1 md:order-2 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="https://placehold.co/800x600.png"
                alt="Our Farm"
                width={800}
                height={600}
                className="w-full h-auto transition-transform duration-300 hover:scale-105"
                data-ai-hint="farm landscape"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Gamefowl Section */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Featured Gamefowl</h2>
            <p className="mt-2 text-lg text-muted-foreground">A glimpse of our finest breeds.</p>
          </div>
          {featuredBirds.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredBirds.map((bird) => (
                  <BirdCard key={bird.id} bird={bird} />
                ))}
              </div>
              <div className="text-center mt-12">
                <Button asChild variant="outline" size="lg">
                  <Link href="/birds">See All Birds</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground text-lg">No featured birds at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

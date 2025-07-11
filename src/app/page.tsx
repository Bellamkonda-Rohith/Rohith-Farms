import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BirdCard } from "@/components/bird-card";
import { getFeaturedBirds } from "@/data/birds";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const featuredBirds = getFeaturedBirds();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary/10 text-center py-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-4">
            Rohith Game Farm
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
            Breeding powerful, healthy, and honest bloodlines for the passionate fancier.
          </p>
        </div>
      </section>

      {/* Featured Birds Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Birds</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBirds.map((bird) => (
              <BirdCard key={bird.id} bird={bird} />
            ))}
          </div>
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

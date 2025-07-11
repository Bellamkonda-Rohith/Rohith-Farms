import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight font-serif text-primary sm:text-5xl md:text-6xl">
          About Rohith Farms
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          A Legacy of Strength, Health, and Honesty.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 text-lg text-foreground/90">
          <p>
            Welcome to Rohith Farms, a place born from a deep passion for the art and science of gamefowl breeding. Our journey began with a simple mission: to cultivate and preserve powerful bloodlines known for their exceptional traits, robust health, and unwavering spirit.
          </p>
          <p>
            We believe in complete transparency and honesty. Every bird raised on our farm is a testament to our commitment to quality. From spacious, clean environments to a carefully managed diet, we ensure our fowl are in peak condition.
          </p>
          <p>
            Our founder, Rohith, has spent years studying genetics and husbandry to bring you birds that are not only beautiful but also embody the finest qualities of their lineage.
          </p>
        </div>
        <div>
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-0">
              <Image
                src="https://placehold.co/600x400.png"
                alt="Rohith Farms Founder"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                data-ai-hint="farm owner portrait"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-8 font-serif">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <CheckCircle className="w-8 h-8 text-primary" />
              <CardTitle>Powerful Bloodlines</CardTitle>
            </CardHeader>
            <CardContent>
              We meticulously select and breed for proven genetic traits, ensuring strength and vitality.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <CheckCircle className="w-8 h-8 text-primary" />
              <CardTitle>Peak Health</CardTitle>
            </CardHeader>
            <CardContent>
              Our birds are raised in optimal conditions with top-tier nutrition and care.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <CheckCircle className="w-8 h-8 text-primary" />
              <CardTitle>Unwavering Honesty</CardTitle>
            </CardHeader>
            <CardContent>
              We provide complete transparency about each bird's lineage and history.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

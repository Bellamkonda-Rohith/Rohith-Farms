
"use client";

import type { Bird } from "@/lib/types";
import { Button } from "./ui/button";

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);


type WhatsappButtonProps = {
  bird: Bird;
};

export function WhatsappButton({ bird }: WhatsappButtonProps) {
  // IMPORTANT: Replace with your actual phone number including country code (e.g., 919876543210)
  const phoneNumber = "919876543210";

  const message = `Hello Rohith Farms, I'm interested in the ${bird.bloodline}.
Name: ${bird.name}
ID: ${bird.id}
Link: ${typeof window !== 'undefined' ? window.location.href : ''}`;

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
    message
  )}`;

  return (
    <Button
      asChild
      size="lg"
      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg py-7"
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <WhatsappIcon className="mr-3 h-6 w-6" />
        Inquire on WhatsApp
      </a>
    </Button>
  );
}

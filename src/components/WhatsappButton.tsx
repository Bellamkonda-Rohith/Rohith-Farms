
"use client";

import type { Bird } from "@/lib/types";
import { Button } from "./ui/button";

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M16.75 13.96c.25.13.41.34.48.58.07.24.06.5-.04.72-.11.23-.3.43-.54.57-.24.14-.52.21-.8.21-.3 0-.59-.07-.86-.21-.27-.14-.52-.33-.76-.56-.24-.23-.48-.5-.7-.79-.23-.29-.44-.6-.63-.94-.19-.34-.35-.69-.49-1.05-.14-.36-.25-.72-.34-1.08-.09-.36-.15-.71-.18-1.06 0-.3.06-.59.18-.86.12-.27.3-.51.54-.7.24-.19.52-.33.82-.41.3-.08.6-.09.88-.03.3.05.57.18.8.36.23.18.42.42.55.69.13.27.19.56.19.86 0 .22-.04.44-.12.65-.08.21-.21.4-.38.56-.17.16-.38.3-.62.41-.24.11-.5.15-.76.14-.24-.01-.48-.07-.7-.18-.23-.11-.43-.26-.6-.45-.17-.19-.32-.4-.44-.61-.12-.22-.22-.45-.29-.68-.07-.23-.11-.47-.11-.71 0-.09.01-.18.04-.27.02-.09.06-.17.1-.25.04-.08.1-.15.16-.21.06-.06.14-.11.22-.15.08-.04.17-.07.26-.08.09-.02.18-.02.28-.01.1.01.19.03.28.06.09.03.18.08.26.13.41.26.82.53 1.23.82.41.29.81.59 1.2.91.04.03.08.06.11.09.28.24.54.49.79.75.25.26.47.54.68.83.05.07.1.14.15.21zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    </svg>
);

type WhatsappButtonProps = {
  bird: Bird;
};

export function WhatsappButton({ bird }: WhatsappButtonProps) {
  // IMPORTANT: Replace with your actual phone number including country code (e.g., 919876543210)
  const phoneNumber = "919876543210";

  const message = `Hi, I'm interested in the bird: ${bird.name}.
Link: ${typeof window !== 'undefined' ? window.location.href : ''}`;

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Button
      asChild
      size="lg"
      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg py-7"
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <WhatsappIcon className="mr-3 h-6 w-6" />
        Chat to Buy on WhatsApp
      </a>
    </Button>
  );
}

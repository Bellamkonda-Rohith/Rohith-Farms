import { Feather, Phone } from "lucide-react";
import Link from "next/link";

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path><path d="M16.36 12c-1.5-1.5-2.83-3.04-4.36-4.36M12 16.36C10.5 14.86 9.17 13.32 7.64 11.64"></path></svg>
);


export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Feather className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-bold text-primary">
              Rohith Farms
            </span>
          </div>
          <div className="text-center md:text-left text-sm text-muted-foreground">
            &copy; {currentYear} Rohith Farms. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" aria-label="Contact via WhatsApp">
                <WhatsappIcon className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors"/>
            </Link>
            <Link href="#" aria-label="Call us">
                <Phone className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors"/>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

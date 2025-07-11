
import Link from 'next/link';
import { Phone, MessageCircle, MapPin } from 'lucide-react';

export function Footer() {
  const contactNumber = process.env.NEXT_PUBLIC_CONTACT_PHONE_NUMBER || '+910000000000';
  const whatsappUrl = `https://wa.me/${contactNumber}`;
  const callUrl = `tel:${contactNumber}`;
  
  return (
    <footer className="bg-secondary/20 border-t">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold font-serif mb-2">Rohith Game Farm</h3>
            <p className="text-muted-foreground">Breeding excellence and champion bloodlines since 2010.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/birds" className="text-muted-foreground hover:text-primary">Birds for Sale</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Contact</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>Vijayawada, Andhra Pradesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <a href={callUrl} className="hover:text-primary">{contactNumber}</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                 <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary">WhatsApp</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Rohith Game Farm. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

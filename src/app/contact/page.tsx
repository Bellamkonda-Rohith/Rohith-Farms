
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MessageCircle, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  const farmLocation = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.478280336201!2d76.99498731480206!3d11.004787992219992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859a4f91361c3%3A0x6b4f7cbe5f6e3c8!2sCoimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1616161616161!5m2!1sen!2sin";
  const phoneNumber = process.env.NEXT_PUBLIC_CONTACT_PHONE_NUMBER || '+910000000000';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent("Hi, I would like to inquire about your gamefowl.")}`;
  const callUrl = `tel:${phoneNumber}`;

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight font-serif text-primary sm:text-5xl md:text-6xl">
          Get in Touch
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          We're here to answer your questions. Contact us or plan a visit to the farm.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Phone className="w-6 h-6 text-primary" />
              <div className="flex-grow">
                <h3 className="font-semibold">Phone</h3>
                <a href={callUrl} className="text-foreground hover:underline">{phoneNumber}</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MessageCircle className="w-6 h-6 text-primary" />
              <div className="flex-grow">
                <h3 className="font-semibold">WhatsApp</h3>
                 <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">Chat with us</a>
              </div>
            </div>
             <div className="flex items-center gap-4">
              <MapPin className="w-6 h-6 text-primary" />
              <div className="flex-grow">
                <h3 className="font-semibold">Location</h3>
                <p>Coimbatore, Tamil Nadu, India</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Clock className="w-6 h-6 text-primary" />
              <div className="flex-grow">
                <h3 className="font-semibold">Opening Hours</h3>
                <p>Mon - Sat: 9:00 AM - 6:00 PM</p>
                <p>Sunday: By appointment only</p>
              </div>
            </div>
            <div className="pt-4 space-y-3">
              <Button asChild size="lg" className="w-full">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" /> Start a WhatsApp Chat
                </a>
              </Button>
               <Button asChild size="lg" variant="secondary" className="w-full">
                <a href={callUrl}>
                  <Phone className="mr-2 h-5 w-5" /> Call to Book a Visit
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Map */}
        <div className="rounded-lg overflow-hidden shadow-lg h-96 md:h-full">
          <iframe
            src={farmLocation}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Rohith Game Farm Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

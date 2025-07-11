
'use client';

import { Button } from './ui/button';

interface WhatsAppButtonProps {
    phoneNumber: string;
    message?: string;
}

export function WhatsAppButton({ phoneNumber, message }: WhatsAppButtonProps) {
    const defaultMessage = "Hello, I'm interested in your gamefowl.";
    const encodedMessage = encodeURIComponent(message || defaultMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    return (
        <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="fixed bottom-5 right-5 z-50"
        >
            <Button size="icon" className="w-14 h-14 rounded-full shadow-lg bg-green-500 hover:bg-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                <span className="sr-only">Chat on WhatsApp</span>
            </Button>
        </a>
    );
}

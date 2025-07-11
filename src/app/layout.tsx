
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { AuthProvider } from "@/hooks/useAuth";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Rohith Game Farm",
  description: "High-quality gamefowl breeding and sales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <AuthProvider>
          <Header />
          <main className="min-h-screen bg-background">
            {children}
          </main>
          <Footer />
          <WhatsAppButton phoneNumber="+919876543210" />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

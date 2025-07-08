import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
});

const APP_NAME = "Rohith Farms";
const APP_DESCRIPTION = "Premier gamefowl breeding farm specializing in world-class bloodlines. Discover champions bred for excellence and heritage.";
const APP_URL = "https://your-domain.com"; // TODO: Replace with your actual domain

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} - Breeding Excellence`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  keywords: ["gamefowl", "breeding", "rooster", "farm", "chicks", "fighters", "bloodlines"],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  publisher: APP_NAME,
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: "website",
    url: APP_URL,
    title: `${APP_NAME} - Breeding Excellence`,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    images: [
      {
        url: `${APP_URL}/og-image.jpg`, // TODO: Create and add an OG image
        width: 1200,
        height: 630,
        alt: `${APP_NAME} Hero Image`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} - Breeding Excellence`,
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/og-image.jpg`], // TODO: Create and add an OG image
  },
};

export const viewport: Viewport = {
  themeColor: "#1E1E2F", // Matches dark mode background
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn("font-sans antialiased min-h-screen flex flex-col bg-background", inter.className)}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}

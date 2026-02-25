import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/features/common/nabvar";
import Footer from "@/features/common/footer";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";

const fontOutfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArtBook — The Digital Gallery",
  description: "A modern digital gallery for artists and collectors. Discover, buy, and auction original artwork.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontOutfit.variable} font-sans antialiased`}
      >
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

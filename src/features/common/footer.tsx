"use client";

import { Instagram, Twitter, Facebook, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const Footer = () => {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    try {
      await api.post("/newsletter/subscribe", { email: email.trim() });
      toast.success("Successfully subscribed!", {
        description: "You've been added to the ArtBook newsletter.",
      });
      setEmail("");
    } catch (error) {
      toast.error("Subscription failed", {
        description: (error as Error).message,
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  // Hide footer on admin and artist dashboard routes
  const isHidden = pathname?.startsWith("/admin") || pathname?.startsWith("/artist/dashboard") || pathname?.startsWith("/shop/dashboard");

  if (isHidden) return null;

  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
        <div className="space-y-4">
          <h3 className="font-serif text-2xl font-bold">ArtBook</h3>
          <p className="text-gray-400 text-sm">
            Connecting artists and collectors through a curated marketplace for
            extraordinary art.
          </p>
          <div className="flex space-x-4 pt-2">
            <Instagram className="h-5 w-5 cursor-pointer hover:text-purple-500 transition-colors" />
            <Twitter className="h-5 w-5 cursor-pointer hover:text-purple-500 transition-colors" />
            <Facebook className="h-5 w-5 cursor-pointer hover:text-purple-500 transition-colors" />
            <Mail className="h-5 w-5 cursor-pointer hover:text-purple-500 transition-colors" />
          </div>
        </div>

        <div>
          <h4 className="font-medium text-lg mb-4">Explore</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/artworks"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Artworks
              </Link>
            </li>
            <li>
              <Link
                href="/artists"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Artists
              </Link>
            </li>
            <li>
              <Link
                href="/auctions"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Auctions
              </Link>
            </li>
          </ul>
        </div>

        {/* Info Links */}
        <div>
          <h4 className="font-medium text-lg mb-4">Information</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/about"
                className="text-gray-400 hover:text-white transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="text-gray-400 hover:text-white transition-colors"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-lg mb-4">
            Subscribe to our newsletter
          </h4>
          <form onSubmit={handleSubscribe} className="flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              disabled={isSubscribing}
              className="bg-gray-800 px-3 py-2 outline-none flex-grow text-white text-sm rounded-l-md disabled:opacity-70"
            />
            <button
              type="submit"
              disabled={isSubscribing}
              className="bg-purple-500 px-4 py-2 rounded-r-md text-white text-sm hover:bg-purple-600 transition-colors cursor-pointer disabled:opacity-70 flex items-center justify-center min-w-[60px]"
            >
              {isSubscribing ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Join"
              )}
            </button>
          </form>
          <p className="text-gray-400 text-xs mt-2">
            Stay updated on new artworks, auctions and featured artists.
          </p>
        </div>
      </div>

      <div className="container mx-auto border-t border-gray-800 mt-12 pt-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} ArtBook Gallery. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/terms"
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

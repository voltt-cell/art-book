import { Instagram, Twitter, Facebook, Mail } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gallery-black text-gallery-white py-16">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="font-serif text-2xl">Artful</h3>
          <p className="text-gallery-beige text-sm">
            Connecting artists and collectors through a curated marketplace for
            extraordinary art.
          </p>
          <div className="flex space-x-4 pt-2">
            <Instagram className="h-5 w-5 cursor-pointer hover:text-gallery-accent transition-colors" />
            <Twitter className="h-5 w-5 cursor-pointer hover:text-gallery-accent transition-colors" />
            <Facebook className="h-5 w-5 cursor-pointer hover:text-gallery-accent transition-colors" />
            <Mail className="h-5 w-5 cursor-pointer hover:text-gallery-accent transition-colors" />
          </div>
        </div>

        <div>
          <h4 className="font-medium text-lg mb-4">Explore</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/artworks"
                className="text-gallery-beige hover:text-white transition-colors"
              >
                Artworks
              </Link>
            </li>
            <li>
              <Link
                href="/artists"
                className="text-gallery-beige hover:text-white transition-colors"
              >
                Artists
              </Link>
            </li>
            <li>
              <Link
                href="/auctions"
                className="text-gallery-beige hover:text-white transition-colors"
              >
                Auctions
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-lg mb-4">Information</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/about"
                className="text-gallery-beige hover:text-white transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-gallery-beige hover:text-white transition-colors"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="text-gallery-beige hover:text-white transition-colors"
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
          <div className="flex">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-gray-800 px-3 py-2 outline-none flex-grow text-white text-sm rounded-l-md"
            />
            <button className="bg-gallery-accent px-4 py-2 rounded-r-md text-white text-sm hover:bg-opacity-90 transition-colors">
              Join
            </button>
          </div>
          <p className="text-gallery-beige text-xs mt-2">
            Stay updated on new artworks, auctions and featured artists.
          </p>
        </div>
      </div>

      <div className="container mx-auto border-t border-gray-800 mt-12 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gallery-beige text-sm">
            © {new Date().getFullYear()} Artful Gallery. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/terms"
              className="text-gallery-beige text-sm hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-gallery-beige text-sm hover:text-white transition-colors"
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

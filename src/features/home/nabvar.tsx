import { Button } from "@/components/ui/button";
import { Search, User, Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="bg-gallery-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gallery-beige">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link
          href="/"
          className="font-serif text-2xl font-bold text-gallery-black"
        >
          Artful
        </Link>

        <nav className="hidden md:flex space-x-8">
          <Link
            href="/"
            className="font-medium hover:text-gallery-accent transition-colors"
          >
            Home
          </Link>
          <Link
            href="/artworks"
            className="font-medium hover:text-gallery-accent transition-colors"
          >
            Artworks
          </Link>
          <Link
            href="/artists"
            className="font-medium hover:text-gallery-accent transition-colors"
          >
            Artists
          </Link>
          <Link
            href="/auctions"
            className="font-medium hover:text-gallery-accent transition-colors"
          >
            Auctions
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

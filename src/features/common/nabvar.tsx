import { Button } from "@/components/ui/button";
import { Search, User, Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <Link href="/" className="font-serif text-2xl font-bold text-gray-900">
          Artful
        </Link>

        <nav className="hidden md:flex space-x-8">
          <Link
            href="/"
            className="font-medium text-gray-700 hover:text-purple-500 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/artworks"
            className="font-medium text-gray-700 hover:text-purple-500 transition-colors"
          >
            Artworks
          </Link>
          <Link
            href="/artists"
            className="font-medium text-gray-700 hover:text-purple-500 transition-colors"
          >
            Artists
          </Link>
          <Link
            href="/auctions"
            className="font-medium text-gray-700 hover:text-purple-500 transition-colors"
          >
            Auctions
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hover:text-purple-500">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:text-purple-500">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:text-purple-500">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:text-purple-500">
            <User className="h-5 w-5" />
          </Button>
          <div className="hidden md:block">
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="mr-2 hover:bg-purple-500 hover:text-white cursor-pointer"
              >
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="bg-purple-500 hover:bg-purple-400 cursor-pointer"
              >
                Join Artful
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Heart, Store, LogOut, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { CartBadge } from "@/components/cart-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const { user, isAuthenticated, isArtist, isBuyer, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/artworks?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo */}
        <Link href="/" className="font-serif text-2xl font-bold text-gray-900 tracking-tight shrink-0 hover:opacity-80 transition-opacity">
          ArtBook
        </Link>

        {/* Navigation Links - Center */}
        <nav className="hidden lg:flex items-center justify-center space-x-6 absolute left-1/2 -translate-x-1/2 h-full">
          <Link
            href="/"
            className={`flex items-center h-full text-sm font-medium px-2 transition-colors border-b-2 -mb-[2px] ${pathname === "/" ? "text-purple-600 border-purple-600" : "text-gray-600 border-transparent hover:text-purple-600"
              }`}
          >
            Home
          </Link>
          <Link
            href="/artworks"
            className={`flex items-center h-full text-sm font-medium px-2 transition-colors border-b-2 -mb-[2px] ${pathname === "/artworks" ? "text-purple-600 border-purple-600" : "text-gray-600 border-transparent hover:text-purple-600"
              }`}
          >
            Artworks
          </Link>
          <Link
            href="/artists"
            className={`flex items-center h-full text-sm font-medium px-2 transition-colors border-b-2 -mb-[2px] ${pathname === "/artists" ? "text-purple-600 border-purple-600" : "text-gray-600 border-transparent hover:text-purple-600"
              }`}
          >
            Artists
          </Link>
          <Link
            href="/auctions"
            className={`flex items-center h-full text-sm font-medium px-2 transition-colors border-b-2 -mb-[2px] ${pathname === "/auctions" ? "text-purple-600 border-purple-600" : "text-gray-600 border-transparent hover:text-purple-600"
              }`}
          >
            Auctions
          </Link>
        </nav>





        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Global Search */}
          <div className="hidden md:flex relative w-64 mr-2">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Search for anything"
                className="w-full pl-4 pr-10 h-10 rounded-full bg-gray-100 border-transparent focus:bg-white focus:border-gray-300 focus:ring-0 transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-900"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Favorites - Logged In Only */}
          {isAuthenticated && (
            <Link href="/favorites">
              <Button variant="ghost" size="icon" className="hover:text-red-500 hover:bg-red-50 rounded-full">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
          )}

          {/* Shop Icon - Artists Only */}
          {isArtist && (
            <Link href="/artist/dashboard">
              <Button variant="ghost" size="icon" className="hover:text-purple-600 hover:bg-purple-50 rounded-full">
                <Store className="h-5 w-5" />
              </Button>
            </Link>
          )}

          {/* Cart - Always Visible */}
          <CartBadge />


          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full ml-1 p-0 hover:bg-gray-100 focus-visible:outline-none ring-offset-background transition-colors">
                  <Avatar className="h-8 w-8 border border-gray-200">
                    <AvatarImage src={user?.profileImage} alt={user?.name} />
                    <AvatarFallback className="bg-purple-100 text-purple-700 font-medium text-xs">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2 rounded-xl border-gray-100 shadow-xl mt-2 bg-white" align="end" forceMount sideOffset={8}>
                <div className="px-3 py-3 mb-2 flex items-center gap-3 bg-gray-50/50 rounded-lg mx-1">
                  <Avatar className="h-10 w-10 border border-gray-200 shadow-sm">
                    <AvatarImage src={user?.profileImage} alt={user?.name} />
                    <AvatarFallback className="bg-white text-purple-700 font-bold border border-gray-100">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden">
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                    <Link href={isArtist ? `/artist/${user?.id}` : `/user/${user?.id}`} className="text-xs text-gray-500 hover:text-purple-600 hover:underline transition-colors">
                      View your profile
                    </Link>
                  </div>
                </div>

                <DropdownMenuSeparator className="bg-gray-100 my-1" />

                {isBuyer && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/buyer/dashboard" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors group">
                        <div className="p-1.5 bg-gray-100 rounded-md mr-3 group-hover:bg-white transition-colors">
                          <LayoutDashboard className="h-4 w-4 text-gray-500 group-hover:text-purple-600" />
                        </div>
                        Purchases and reviews
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors group">
                    <div className="p-1.5 bg-gray-100 rounded-md mr-3 group-hover:bg-white transition-colors">
                      <Settings className="h-4 w-4 text-gray-500 group-hover:text-gray-900" />
                    </div>
                    Account Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-gray-100 my-1" />

                <DropdownMenuItem onClick={handleLogout} className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg cursor-pointer transition-colors group">
                  <div className="p-1.5 bg-gray-100 rounded-md mr-3 group-hover:bg-white group-hover:text-red-600 transition-colors">
                    <LogOut className="h-4 w-4 text-gray-500" />
                  </div>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center ml-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-full px-5 h-9 transition-colors">
                  Sign in
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

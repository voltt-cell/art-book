"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import {
  artists,
  artworks,
  getArtistById,
  getAuctionArtworks,
} from "@/data/mockData";
import Link from "next/link";
import ArtworkCard from "@/features/home/artwork-card";
import ArtistCard from "@/features/home/artist-card";

const Page = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const featuredArtworks = artworks.slice(0, 4);
  const auctionArtworks = getAuctionArtworks().slice(0, 3);
  const featuredArtists = artists.slice(0, 4);

  const categories = [
    { id: "all", name: "All" },
    { id: "painting", name: "Painting" },
    { id: "photography", name: "Photography" },
    { id: "digital", name: "Digital Art" },
    { id: "sculpture", name: "Sculpture" },
  ];

  return (
    <div className="min-h-screen bg-gallery-cream flex flex-col">
      <section className="relative h-[80vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auhref=format&fit=crop&w=2458&q=80')",
            filter: "brightness(0.85)",
          }}
        />
        <div className="absolute inset-0 hero-gradient"></div>

        <div className="container mx-auto h-full flex items-center relative z-10">
          <div className="max-w-2xl">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Discover and Collect Extraordinary Art
            </h1>
            <p className="text-gray-100 text-lg mb-8">
              Explore our curated collection of unique artworks from established
              and emerging artists around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gallery-accent hover:bg-gallery-accent/90"
                asChild
              >
                <Link href="/artworks">Explore Artworks</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
                asChild
              >
                <Link href="/auctions">View Active Auctions</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="font-serif text-3xl font-bold">Featured Artworks</h2>
            <Link
              href="/artworks"
              className="flex items-center text-gallery-accent font-medium"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="flex overflow-x-auto pb-4 gap-4 mb-8 hide-scrollbar">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? "bg-gallery-black text-white"
                    : "bg-white text-gallery-black hover:bg-gallery-beige"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArtworks.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                artist={getArtistById(artwork.artistId)!}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Active Auctions */}
      <section className="py-20 bg-white">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="font-serif text-3xl font-bold">Active Auctions</h2>
            <Link
              href="/auctions"
              className="flex items-center text-gallery-accent font-medium"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {auctionArtworks.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                artist={getArtistById(artwork.artistId)!}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="font-serif text-3xl font-bold">Featured Artists</h2>
            <Link
              href="/artists"
              className="flex items-center text-gallery-accent font-medium"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </div>
      </section>

      {/* Join Community */}
      <section className="py-20 bg-gallery-black">
        <div className="container mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
            Join Our Art Community
          </h2>
          <p className="text-gallery-beige max-w-2xl mx-auto mb-8">
            Whether you're an artist looking to showcase your work or a
            collector in search of unique pieces, become part of our growing
            community of art enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="bg-gallery-accent hover:bg-gallery-accent/90"
            >
              Join as Artist
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-white hover:bg-white/10 border-white"
            >
              Join as Collector
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;

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
import Banner from "@/features/home/banner";
import JoinCommunity from "@/features/home/join-community";

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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Banner />

      <section className="py-20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="font-serif text-3xl font-bold">Featured Artworks</h2>
            <Link
              href="/artworks"
              className="flex items-center text-purple-500 font-medium hover:text-purple-600"
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
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Artwork Grid */}
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

      <section className="py-20 bg-white">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="font-serif text-3xl font-bold">Active Auctions</h2>
            <Link
              href="/auctions"
              className="flex items-center text-purple-500 font-medium hover:text-purple-600"
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

      <section className="py-20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="font-serif text-3xl font-bold">Featured Artists</h2>
            <Link
              href="/artists"
              className="flex items-center text-purple-500 font-medium hover:text-purple-600"
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

      <JoinCommunity />
    </div>
  );
};

export default Page;

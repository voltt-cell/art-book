"use client";

import { useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import ArtworkCard from "@/features/home/artwork-card";
import { fetcher } from "@/lib/swr";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { ArtworkSkeletonGrid } from "@/components/artwork-skeleton";

type ArtworkResponse = {
    id: string;
    title: string;
    artistId: string;
    description: string;
    price: string;
    medium: string;
    imageUrl: string;
    images: string[] | null;
    status: string;
    listingType: string;
    createdAt: string;
};

type ArtistResponse = {
    id: string;
    name: string;
    bio: string | null;
    profileImage: string | null;
};

import { ART_CATEGORIES, LISTING_TYPES } from "@/lib/constants";

// ... (remove local constant definitions)

export default function ArtworksPage() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedListing, setSelectedListing] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const { data: artworksRaw, isLoading } = useSWR<ArtworkResponse[]>(
        "/artworks",
        fetcher,
        { refreshInterval: 15000 }
    );

    const { data: artistsRaw } = useSWR<ArtistResponse[]>(
        "/users?role=artist",
        fetcher
    );

    const artworks = (artworksRaw || []).map((item) => ({
        id: item.id,
        title: item.title,
        artistId: item.artistId,
        artist: "",
        image: item.images?.[0] || item.imageUrl,
        price: parseFloat(item.price),
        medium: item.medium,
        dimensions: "Variable",
        year: new Date(item.createdAt).getFullYear(),
        description: item.description,
        isAuction: item.listingType === "auction",
        currentBid: parseFloat(item.price),
        minimumBid: parseFloat(item.price),
    }));

    const artists = (artistsRaw || []).map((a) => ({
        id: a.id,
        name: a.name,
        bio: a.bio || "",
        profileImage: a.profileImage || "",
    }));

    const getArtistById = (id: string) => artists.find((a) => a.id === id);

    const filteredArtworks = artworks.filter((artwork) => {
        // Exclude auctions
        if (artwork.isAuction) return false;

        const matchesCategory =
            selectedCategory === "all" ||
            artwork.medium.toLowerCase().includes(selectedCategory);

        const matchesSearch =
            searchQuery === "" ||
            artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            artwork.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            artwork.medium.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <section className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 text-white py-16">
                <div className="container mx-auto px-4">
                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="font-serif text-4xl md:text-5xl font-bold mb-4"
                    >
                        Explore Artworks
                    </motion.h1>
                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="text-purple-200 text-lg max-w-2xl"
                    >
                        Discover unique pieces from talented artists around the world.
                        Browse, bid, and buy original artworks.
                    </motion.p>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="mt-8 max-w-xl"
                    >
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search artworks by title, medium, or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Filters */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors text-sm font-medium ${selectedCategory === "all"
                                ? "bg-black text-white"
                                : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-200"
                                }`}
                        >
                            All
                        </button>
                        {ART_CATEGORIES.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors text-sm font-medium ${selectedCategory === category.id
                                    ? "bg-black text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-200"
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                <p className="text-gray-500 mb-6">
                    {isLoading ? "" : `${filteredArtworks.length} ${filteredArtworks.length === 1 ? "artwork" : "artworks"} found`}
                </p>

                {/* Content */}
                {isLoading ? (
                    <ArtworkSkeletonGrid count={8} />
                ) : filteredArtworks.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">
                            No artworks match your filters.
                        </p>
                        <button
                            onClick={() => {
                                setSelectedCategory("all");
                                setSearchQuery("");
                            }}
                            className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                    >
                        {filteredArtworks.map((artwork) => (
                            <motion.div key={artwork.id} variants={fadeInUp}>
                                <ArtworkCard
                                    artwork={artwork}
                                    artist={getArtistById(artwork.artistId) || { id: artwork.artistId, name: "Unknown Artist" }}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}

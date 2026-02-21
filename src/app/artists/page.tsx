"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import ArtistCard from "@/features/home/artist-card";
import { ArtistSkeletonGrid } from "@/components/artist-skeleton";

interface Artist {
    id: string;
    name: string;
    email: string;
    bio: string | null;
    profileImage: string | null;
    followerCount: number;
}

export default function ArtistsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const { data: artists, isLoading } = useSWR<Artist[]>(
        "/users?role=artist",
        fetcher
    );

    const filteredArtists = artists?.filter(
        (artist) =>
            artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            artist.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-10 max-w-6xl">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="mb-8"
                >
                    <h1 className="font-serif text-4xl font-bold mb-2">
                        Discover Artists
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Explore talented artists and their portfolios
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="mb-8"
                >
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search artists..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </motion.div>

                {isLoading ? (
                    <ArtistSkeletonGrid count={6} />
                ) : filteredArtists && filteredArtists.length > 0 ? (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredArtists.map((artist) => (
                            <motion.div key={artist.id} variants={fadeInUp}>
                                <ArtistCard artist={{
                                    id: artist.id,
                                    name: artist.name,
                                    profileImage: artist.profileImage,
                                    followers: artist.followerCount,
                                    shopName: undefined // We don't fetch shopName in this particular SWR hook right now or need to add it to Artist type
                                }} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-20">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No artists found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

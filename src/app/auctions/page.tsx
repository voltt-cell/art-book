"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { Gavel, Clock, Loader2 } from "lucide-react";
import AuctionCard from "@/features/auctions/auction-card";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/swr";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

type AuctionItem = {
    auction: {
        id: string;
        artworkId: string;
        startTime: string;
        endTime: string;
        startingBid: string;
        currentBid: string | null;
        status: string;
    };
    artwork: {
        id: string;
        title: string;
        imageUrl: string;
        images: string[] | null;
        artistId: string;
        price: string;
        medium: string;
        description: string;
    };
};

type ArtistResponse = {
    id: string;
    name: string;
    profileImage: string | null;
};

const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);



export default function AuctionsPage() {
    const { data: auctionItems, isLoading } = useSWR<AuctionItem[]>(
        "/auctions",
        fetcher,
        { refreshInterval: 5000 }
    );

    const { data: artistsRaw } = useSWR<ArtistResponse[]>(
        "/users?role=artist",
        fetcher
    );

    const artists = artistsRaw || [];
    const getArtist = (id: string) => artists.find((a) => a.id === id);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-20 px-4">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="mb-8"
            >
                <h1 className="font-serif text-4xl font-bold mb-2">
                    Active Auctions
                </h1>
                <p className="text-gray-500">
                    Bid on unique artworks with real-time countdown timers
                </p>
            </motion.div>

            {!auctionItems || auctionItems.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <Gavel className="w-16 h-16 text-purple-200 mx-auto mb-4" />
                    <h2 className="text-xl font-serif font-semibold mb-2">
                        No Active Auctions
                    </h2>
                    <p className="text-gray-500">
                        Check back later for exciting auction opportunities
                    </p>
                </div>
            ) : (
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                >
                    {auctionItems.map((item) => (
                        <AuctionCard
                            key={item.auction.id}
                            item={item}
                            artist={getArtist(item.artwork.artistId)}
                        />
                    ))}
                </motion.div>
            )}
        </div>
    );
}

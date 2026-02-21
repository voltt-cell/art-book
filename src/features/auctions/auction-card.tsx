"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gavel, Clock, Heart, ArrowRight, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    shopName?: string;
    profileImage: string | null;
};

const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(price);

function useCountdown(endTime: string) {
    const [timeLeft, setTimeLeft] = useState<{
        d: number;
        h: number;
        m: number;
        s: number;
        expired: boolean;
    }>({ d: 0, h: 0, m: 0, s: 0, expired: false });

    useEffect(() => {
        const update = () => {
            const diff = new Date(endTime).getTime() - Date.now();
            if (diff <= 0) {
                setTimeLeft({ d: 0, h: 0, m: 0, s: 0, expired: true });
                return;
            }
            setTimeLeft({
                d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                h: Math.floor((diff / (1000 * 60 * 60)) % 24),
                m: Math.floor((diff / (1000 * 60)) % 60),
                s: Math.floor((diff / 1000) % 60),
                expired: false,
            });
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [endTime]);

    return timeLeft;
}

export default function AuctionCard({
    item,
    artist,
}: {
    item: AuctionItem;
    artist?: ArtistResponse;
}) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { auction, artwork } = item;
    const timer = useCountdown(auction.endTime);
    const currentBid = parseFloat(auction.currentBid || auction.startingBid);
    const imageUrl = artwork.images?.[0] || artwork.imageUrl;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
        >
            <Link href={`/artwork/${artwork.id}`}>
                <div className="relative overflow-hidden aspect-square">
                    <img
                        src={imageUrl}
                        alt={artwork.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        <div className={`
                            px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm
                            ${timer.expired
                                ? "bg-gray-900/90 text-white backdrop-blur-md"
                                : "bg-white/90 text-purple-700 backdrop-blur-md"}
                        `}>
                            {timer.expired ? (
                                <span>Ended</span>
                            ) : (
                                <>
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                                    </span>
                                    Live
                                </>
                            )}
                        </div>
                    </div>

                    {/* Timer Overlay - Clean & Minimal */}
                    {!timer.expired && (
                        <div className="absolute bottom-3 left-3 right-3">
                            <div className="bg-black/70 backdrop-blur-md rounded-lg p-3 text-white flex items-center justify-between border border-white/10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-300 uppercase tracking-wide font-medium">Time Remaining</span>
                                    <div className="flex gap-1 font-mono text-sm leading-none mt-1">
                                        {timer.d > 0 && <span>{timer.d}d</span>}
                                        <span>{String(timer.h).padStart(2, "0")}h</span>
                                        <span>:</span>
                                        <span>{String(timer.m).padStart(2, "0")}m</span>
                                        <span>:</span>
                                        <span>{String(timer.s).padStart(2, "0")}s</span>
                                    </div>
                                </div>
                                <Clock className="w-5 h-5 text-purple-400" />
                            </div>
                        </div>
                    )}
                </div>
            </Link>

            <div className="p-3">
                <div className="flex justify-between items-start mb-0.5">
                    <Link href={`/artwork/${artwork.id}`} className="flex-1 mr-2">
                        <h3 className="text-sm font-medium text-gray-900 hover:text-purple-600 transition-colors line-clamp-1">
                            {artwork.title}
                        </h3>
                    </Link>
                </div>

                {artist && (
                    <Link href={`/artist/${artist.id}`} className="text-xs text-gray-500 hover:text-gray-900 hover:underline mb-2 block truncate">
                        {artist.shopName || artist.name}
                    </Link>
                )}

                <div className="flex items-end justify-between border-t border-gray-50 pt-2 mt-auto">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Current Bid</p>
                        <p className="text-sm font-bold text-gray-900 leading-none mt-1">
                            {formatPrice(currentBid)}
                        </p>
                    </div>

                    {!timer.expired && (
                        <Button
                            size="sm"
                            className="bg-gray-900 hover:bg-black text-white text-xs px-4 h-8 rounded-full"
                            onClick={() => {
                                if (!isAuthenticated) {
                                    toast.error("Please log in to place a bid");
                                    router.push("/login");
                                    return;
                                }
                                router.push(`/artwork/${artwork.id}`);
                            }}
                        >
                            Place Bid
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

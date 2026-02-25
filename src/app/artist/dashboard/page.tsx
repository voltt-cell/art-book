"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import ArtworkCard from "@/features/home/artwork-card";
import { Button } from "@/components/ui/button";
import { Plus, Palette, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

type ArtistBid = {
    bid: {
        id: string;
        amount: string;
        createdAt: string;
    };
    auction: {
        id: string;
        artworkId: string;
        currentBid: string | null;
        startingBid: string;
        status: string;
    };
    artwork: {
        id: string;
        title: string;
        imageUrl: string;
        images: string[] | null;
    };
    bidder: {
        id: string;
        name: string;
    };
};

const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);

export default function ArtistDashboard() {
    const { user, isArtist, loading: authLoading } = useAuth();
    const router = useRouter();

    const { data: artworksRaw, isLoading } = useSWR<ArtworkResponse[]>(
        user ? `/artworks?artistId=${user.id}` : null,
        fetcher,
        { revalidateOnFocus: true, revalidateOnMount: true }
    );

    const { data: artistBids } = useSWR<ArtistBid[]>(
        user ? `/auctions/artist-bids` : null,
        fetcher,
        { refreshInterval: 10000 }
    );



    // Group bids by artwork
    const bidsByArtwork = (artistBids || []).reduce(
        (acc, item) => {
            const id = item.artwork.id;
            if (!acc[id]) {
                acc[id] = {
                    count: 0,
                    highestBid: 0,
                    latestBidder: "",
                };
            }
            acc[id].count++;
            const amt = parseFloat(item.bid.amount);
            if (amt > acc[id].highestBid) {
                acc[id].highestBid = amt;
                acc[id].latestBidder = item.bidder.name;
            }
            return acc;
        },
        {} as Record<
            string,
            { count: number; highestBid: number; latestBidder: string }
        >
    );

    const artworks = (artworksRaw || []).map((item) => ({
        id: item.id,
        title: item.title,
        artistId: item.artistId,
        image: item.images?.[0] || item.imageUrl,
        artist: user?.name || "",
        price: parseFloat(item.price),
        medium: item.medium,
        dimensions: "Variable",
        year: new Date(item.createdAt).getFullYear(),
        description: item.description,
        isAuction: item.listingType === "auction",
        currentBid: bidsByArtwork[item.id]?.highestBid || parseFloat(item.price),
        minimumBid: parseFloat(item.price),
    }));

    if (authLoading) {
        return (
            <div className="container mx-auto py-10 px-4 max-w-6xl">
                <ArtworkSkeletonGrid count={6} />
            </div>
        );
    }

    if (!isArtist) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">
                    You need an artist account to access the dashboard.
                </p>
            </div>
        );
    }

    // Summary stats
    const totalAuctions = artworks.filter((a) => a.isAuction).length;
    const totalBids = Object.values(bidsByArtwork).reduce(
        (s, b) => s + b.count,
        0
    );



    return (
        <div className="container mx-auto py-10 px-4 max-w-6xl">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="flex justify-between items-center mb-8"
            >
                <div>
                    <h1 className="text-3xl font-serif font-bold">
                        {user?.name}
                    </h1>
                    <p className="text-gray-500 mt-1 max-w-2xl">
                        {user?.bio || "Artist on ArtBook"}
                    </p>
                </div>
                <Button
                    onClick={() => router.push("/artist/create")}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                    <Plus className="mr-2 h-4 w-4" /> Create Artwork
                </Button>
            </motion.div>



            {isLoading ? (
                <ArtworkSkeletonGrid count={6} />
            ) : artworks.length > 0 ? (
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {artworks.map((artwork) => (
                        <motion.div
                            key={artwork.id}
                            variants={fadeInUp}
                            className="relative group/card"
                        >
                            <ArtworkCard
                                artwork={artwork}
                                artist={{
                                    id: user!.id,
                                    name: user!.name,
                                    profileImage:
                                        user!.profileImage || "",
                                }}
                            />
                            {/* Edit overlay */}
                            <Link
                                href={`/artist/edit/${artwork.id}`}
                                className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm opacity-0 group-hover/card:opacity-100 transition-opacity hover:bg-white"
                            >
                                <Pencil className="w-4 h-4 text-purple-600" />
                            </Link>
                            {/* Bid info overlay for auction artworks */}
                            {/* Bid info overlay for auction artworks */}
                            {artwork.isAuction && bidsByArtwork[artwork.id] && (
                                <div className="absolute top-3 right-3 z-10">
                                    <div className="bg-white/90 backdrop-blur-md text-purple-900 text-xs font-bold rounded-full px-3 py-1 shadow-sm border border-purple-100 flex items-center gap-2">
                                        <span className="flex h-2 w-2 rounded-full bg-purple-600"></span>
                                        <span>{bidsByArtwork[artwork.id].count} {bidsByArtwork[artwork.id].count === 1 ? "Bid" : "Bids"}</span>
                                        <span className="text-purple-400">|</span>
                                        <span>{formatPrice(bidsByArtwork[artwork.id].highestBid)}</span>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <Palette className="w-16 h-16 text-purple-200 mx-auto mb-4" />
                    <h2 className="text-xl font-serif font-semibold mb-2">
                        Your canvas awaits
                    </h2>
                    <p className="text-gray-500 mb-6">
                        Start sharing your art with the world
                    </p>
                    <Button
                        onClick={() => router.push("/artist/create")}
                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Create Your First Artwork
                    </Button>
                </div>
            )}
        </div>
    );
}

"use client";

import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { ArrowLeft, Users, Palette, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import ArtworkCard from "@/features/home/artwork-card";
import { toast } from "sonner";
import { useState } from "react";
import { ArtworkSkeletonGrid } from "@/components/artwork-skeleton";

interface Artist {
    id: string;
    name: string;
    email: string;
    bio: string | null;
    role: string;
    profileImage: string | null;
    followerCount: number;
}

interface Artwork {
    id: string;
    title: string;
    artistId: string;
    description: string;
    price: string;
    medium: string;
    imageUrl: string;
    images: string[] | null;
    tags: string[] | null;
    dimensions: string | null;
    status: string;
    listingType: string;
}

function ArtistProfileSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-10 max-w-5xl">
                <Skeleton className="h-4 w-28 mb-6" />
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <Skeleton className="w-24 h-24 rounded-full flex-shrink-0" />
                        <div className="flex-1 space-y-3 text-center md:text-left">
                            <Skeleton className="h-7 w-48 mx-auto md:mx-0" />
                            <Skeleton className="h-4 w-64 mx-auto md:mx-0" />
                            <Skeleton className="h-4 w-full max-w-md mx-auto md:mx-0" />
                            <div className="flex gap-6 justify-center md:justify-start mt-4">
                                <Skeleton className="h-12 w-16" />
                                <Skeleton className="h-12 w-16" />
                                <Skeleton className="h-9 w-24 rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>
                <Skeleton className="h-6 w-24 mb-4" />
                <ArtworkSkeletonGrid count={3} />
            </div>
        </div>
    );
}

export default function ArtistProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [followLoading, setFollowLoading] = useState(false);

    const { data: artist, isLoading: artistLoading } = useSWR<Artist>(
        `/users/${params.id}`,
        fetcher
    );

    const { data: artworks, isLoading: artworksLoading } = useSWR<Artwork[]>(
        `/artworks?artistId=${params.id}`,
        fetcher
    );

    const {
        data: followerData,
        mutate: mutateFollowers,
    } = useSWR<{ followerCount: number; isFollowing: boolean }>(
        user ? `/users/${params.id}/followers?currentUserId=${user.id}` : `/users/${params.id}/followers`,
        fetcher
    );

    const isFollowing = followerData?.isFollowing || false;
    const followerCount = followerData?.followerCount ?? artist?.followerCount ?? 0;
    const isOwnProfile = user?.id === params.id;

    const handleFollow = async () => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        setFollowLoading(true);
        try {
            if (isFollowing) {
                await api.delete(`/users/${params.id}/follow`);
                toast.success("Unfollowed");
            } else {
                await api.post(`/users/${params.id}/follow`, {});
                toast.success("Following!");
            }
            mutateFollowers();
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setFollowLoading(false);
        }
    };

    if (artistLoading) {
        return <ArtistProfileSkeleton />;
    }

    if (!artist) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Artist not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-10 max-w-5xl">
                <Link
                    href="/artists"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-purple-600 mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Artists
                </Link>

                {/* Artist Hero Banner & Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative bg-white rounded-2xl shadow-sm border border-gray-100 mb-12 overflow-hidden"
                >
                    {/* Cover Banner */}
                    <div className="h-48 md:h-64 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
                        <motion.div
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"
                        ></motion.div>
                    </div>

                    <div className="px-6 pb-8 md:px-10 relative">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-8 -mt-16 md:-mt-20">
                            {/* Profile Picture */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white p-2 flex-shrink-0 shadow-lg mx-auto md:mx-0 relative z-10"
                            >
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-purple-600 text-4xl font-bold overflow-hidden border border-gray-100">
                                    {artist.profileImage ? (
                                        <img
                                            src={artist.profileImage}
                                            alt={artist.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        artist.name.charAt(0)
                                    )}
                                </div>
                            </motion.div>

                            {/* Artist Info */}
                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                                className="flex-1 text-center md:text-left pt-2 md:pt-24 flex flex-col justify-center"
                            >
                                <motion.h1 variants={fadeInUp} className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                                    {artist.name}
                                </motion.h1>
                                <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3 text-sm font-medium text-gray-600">
                                    <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                                        <Mail className="w-4 h-4 text-purple-500" />
                                        {artist.email}
                                    </span>
                                    <span className="flex items-center gap-1.5 capitalize bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-100">
                                        <Palette className="w-4 h-4" />
                                        {artist.role}
                                    </span>
                                </motion.div>

                                {artist.bio && (
                                    <motion.p variants={fadeInUp} className="mt-5 text-gray-600 leading-relaxed max-w-2xl mx-auto md:mx-0 text-base">
                                        {artist.bio}
                                    </motion.p>
                                )}

                                {/* Stats & Actions Action */}
                                <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8">
                                    <motion.div whileHover={{ y: -2 }} className="bg-gray-50 px-6 py-3 rounded-xl border border-gray-100 text-center min-w-[100px]">
                                        <span className="block text-2xl font-bold text-gray-900">
                                            {followerCount}
                                        </span>
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Followers</span>
                                    </motion.div>
                                    <motion.div whileHover={{ y: -2 }} className="bg-gray-50 px-6 py-3 rounded-xl border border-gray-100 text-center min-w-[100px]">
                                        <span className="block text-2xl font-bold text-gray-900">
                                            {artworks?.length || 0}
                                        </span>
                                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Artworks</span>
                                    </motion.div>

                                    {!isOwnProfile && (
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="ml-0 md:ml-auto w-full md:w-auto mt-4 md:mt-0">
                                            <Button
                                                onClick={handleFollow}
                                                disabled={followLoading}
                                                size="lg"
                                                variant={isFollowing ? "outline" : "default"}
                                                className={
                                                    isFollowing
                                                        ? "w-full border-purple-300 text-purple-700 hover:bg-purple-50 shadow-sm"
                                                        : "w-full bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-200"
                                                }
                                            >
                                                <Users className="w-5 h-5 mr-2" />
                                                {followLoading
                                                    ? "..."
                                                    : isFollowing
                                                        ? "Following"
                                                        : "Follow Artist"}
                                            </Button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>


                {/* Artworks Portfolio */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-gray-900">Portfolio</h2>
                        <p className="text-gray-500 text-sm mt-1">Explore creations by {artist.name}</p>
                    </div>
                </div>

                {artworksLoading ? (
                    <ArtworkSkeletonGrid count={3} />
                ) : artworks && artworks.length > 0 ? (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {artworks.map((artwork: Artwork) => (
                            <motion.div
                                key={artwork.id}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
                                }}
                            >
                                <ArtworkCard
                                    artwork={{
                                        id: artwork.id,
                                        title: artwork.title,
                                        artist: artist.name,
                                        artistId: artwork.artistId,
                                        price: Number(artwork.price),
                                        image: artwork.images?.[0] || artwork.imageUrl,
                                        medium: artwork.medium,
                                        isAuction: artwork.listingType === "auction",
                                    }}
                                    artist={{
                                        id: artist.id,
                                        name: artist.name,
                                        profileImage: artist.profileImage || "",
                                    }}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm"
                    >
                        <motion.div
                            initial={{ y: 0 }}
                            animate={{ y: [-5, 5, -5] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-4"
                        >
                            <Palette className="w-10 h-10 text-purple-400" />
                        </motion.div>
                        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">No Artworks Yet</h3>
                        <p className="text-gray-500 max-w-sm text-center">
                            {artist.name} hasn't published any artworks yet. Check back later to see their creative portfolio.
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

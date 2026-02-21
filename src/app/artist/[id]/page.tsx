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

                {/* Artist Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8"
                >
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center text-white text-3xl font-bold overflow-hidden flex-shrink-0">
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

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl font-serif font-bold">{artist.name}</h1>
                            <div className="flex items-center justify-center md:justify-start gap-4 mt-1 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Mail className="w-4 h-4" />
                                    {artist.email}
                                </span>
                                <span className="flex items-center gap-1 capitalize">
                                    <Palette className="w-4 h-4" />
                                    {artist.role}
                                </span>
                            </div>

                            {artist.bio && (
                                <p className="mt-3 text-gray-600 leading-relaxed">
                                    {artist.bio}
                                </p>
                            )}

                            <div className="flex items-center justify-center md:justify-start gap-6 mt-4">
                                <div className="text-center">
                                    <span className="block text-lg font-bold text-gray-900">
                                        {followerCount}
                                    </span>
                                    <span className="text-xs text-gray-500">Followers</span>
                                </div>
                                <div className="text-center">
                                    <span className="block text-lg font-bold text-gray-900">
                                        {artworks?.length || 0}
                                    </span>
                                    <span className="text-xs text-gray-500">Artworks</span>
                                </div>

                                {!isOwnProfile && (
                                    <Button
                                        onClick={handleFollow}
                                        disabled={followLoading}
                                        variant={isFollowing ? "outline" : "default"}
                                        className={
                                            isFollowing
                                                ? "border-purple-300 text-purple-600 hover:bg-purple-50"
                                                : "bg-purple-600 hover:bg-purple-700 text-white"
                                        }
                                    >
                                        <Users className="w-4 h-4 mr-1" />
                                        {followLoading
                                            ? "..."
                                            : isFollowing
                                                ? "Following"
                                                : "Follow"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Artworks */}
                <h2 className="text-xl font-serif font-bold mb-4">Artworks</h2>

                {artworksLoading ? (
                    <ArtworkSkeletonGrid count={3} />
                ) : artworks && artworks.length > 0 ? (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {artworks.map((artwork: Artwork) => (
                            <motion.div key={artwork.id} variants={fadeInUp}>
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
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <Palette className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No artworks listed yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

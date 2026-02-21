"use client";

import { useFavorites } from "@/hooks/useFavorites";
import ArtworkCard from "@/features/home/artwork-card";
import { motion } from "framer-motion";
import { Loader2, Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FavoritesPage() {
    const { favorites, isLoading } = useFavorites();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [authLoading, isAuthenticated, router]);

    if (authLoading || isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!favorites || favorites.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
                <div className="bg-purple-50 p-6 rounded-full mb-6">
                    <Heart className="w-12 h-12 text-purple-300" />
                </div>
                <h1 className="text-2xl font-serif font-bold mb-2">No favorites yet</h1>
                <p className="text-gray-500 mb-8 max-w-md">
                    Start exploring and save the artworks you love! they will appear here.
                </p>
                <Link href="/artworks">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        Explore Artworks
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="container mx-auto px-4 pt-8 mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <Link href="/artworks" className="text-gray-500 hover:text-gray-900">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="font-serif text-3xl font-bold">Your Favorites</h1>
                </div>
                <p className="text-gray-500 ml-9">
                    {favorites.length} artwork{favorites.length !== 1 ? 's' : ''} saved
                </p>
            </div>

            <div className="container mx-auto px-4">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {favorites.map((fav) => (
                        <motion.div key={fav.favoriteId} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <ArtworkCard
                                artwork={{
                                    id: fav.artwork.id,
                                    title: fav.artwork.title,
                                    artist: fav.artist.name,
                                    artistId: fav.artwork.artistId,
                                    price: parseFloat(fav.artwork.price),
                                    image: fav.artwork.imageUrl,
                                    medium: fav.artwork.medium,
                                    isAuction: fav.artwork.listingType === 'auction',
                                }}
                                artist={{
                                    id: fav.artist.id,
                                    name: fav.artist.name,
                                    profileImage: fav.artist.profileImage || undefined,
                                }}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

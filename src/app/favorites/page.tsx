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
            <div className="container mx-auto px-4 py-20">
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center">
                    <Heart className="w-16 h-16 text-purple-200 mx-auto mb-4" />
                    <h2 className="text-xl font-serif font-semibold mb-2">
                        No favorites yet
                    </h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        Start exploring and save the artworks you love! They will appear here.
                    </p>
                    <Link href="/artworks">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6">
                            Explore Artworks
                        </Button>
                    </Link>
                </div>
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

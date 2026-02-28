"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import { motion } from "framer-motion";
import { ArtisticLoader } from "@/components/ui/artistic-loader";
import { Package, Gavel, DollarSign, Image as ImageIcon, Plus, Settings, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

type ArtworkResponse = {
    id: string;
    title: string;
    price: string;
    imageUrl: string;
    images: string[] | null;
    status: string;
    listingType: string;
    createdAt: string;
};


const formatCurrency = (price: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);

export default function ShopDashboard() {
    const { user, hasShop, loading: authLoading } = useAuth();
    const router = useRouter();

    const { data: artworksRaw, isLoading: artworksLoading } = useSWR<ArtworkResponse[]>(
        user ? `/artworks?artistId=${user.id}` : null,
        fetcher
    );

    const artworks = artworksRaw || [];
    const totalRevenue = artworks
        .filter((a) => a.status === "sold")
        .reduce((sum, a) => sum + parseFloat(a.price || "0"), 0);
    const activeListings = artworks.filter((a) => a.status === "published").length;
    const auctionListings = artworks.filter((a) => a.listingType === "auction").length;

    if (authLoading) {
        return <ArtisticLoader fullScreen />;
    }

    if (!hasShop) {
        router.push("/shop/apply");
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Ambient Artistic Background */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-br from-indigo-100/40 via-purple-100/40 to-pink-50/20 pointer-events-none" />
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-purple-300/20 blur-[120px] pointer-events-none"
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
                className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-teal-300/20 blur-[120px] pointer-events-none"
            />

            <div className="container mx-auto py-12 px-4 max-w-7xl relative z-10">
                <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="text-4xl font-serif font-bold text-gray-900">
                                {user?.shopName || "My Shop"}
                            </h1>
                            <p className="text-gray-500 mt-1">Manage your artworks, orders, and shop settings</p>
                        </div>
                        <Link href="/artist/create">
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-11 px-6">
                                <Plus className="mr-2 h-4 w-4" /> New Artwork
                            </Button>
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {[
                            { label: "Total Artworks", value: artworks.length, icon: ImageIcon, gradient: "from-purple-500 to-indigo-600" },
                            { label: "Active Listings", value: activeListings, icon: Package, gradient: "from-blue-500 to-cyan-500" },
                            { label: "Auctions", value: auctionListings, icon: Gavel, gradient: "from-amber-500 to-orange-500" },
                            { label: "Revenue", value: formatCurrency(totalRevenue), icon: DollarSign, gradient: "from-green-500 to-emerald-500" },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-sm hover:-translate-y-1 transition-transform duration-300">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} text-white`}>
                                        <stat.icon className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <Link href="/artist/create" className="group">
                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-sm hover:-translate-y-1 transition-all duration-300 hover:shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                                            <Plus className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <span className="font-medium text-gray-900">Add New Artwork</span>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                                </div>
                            </div>
                        </Link>
                        <Link href="/buyer/dashboard" className="group">
                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-sm hover:-translate-y-1 transition-all duration-300 hover:shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                                            <Package className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <span className="font-medium text-gray-900">View Orders</span>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                </div>
                            </div>
                        </Link>
                        <Link href="/settings" className="group">
                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-sm hover:-translate-y-1 transition-all duration-300 hover:shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition-colors">
                                            <Settings className="h-5 w-5 text-gray-600" />
                                        </div>
                                        <span className="font-medium text-gray-900">Shop Settings</span>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Recent Artworks */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-serif font-bold text-gray-900">Your Artworks</h2>
                            {artworks.length > 6 && (
                                <Link href="/artist/dashboard" className="text-sm text-purple-600 hover:underline">
                                    View All
                                </Link>
                            )}
                        </div>

                        {artworksLoading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                            </div>
                        ) : artworks.length === 0 ? (
                            <div className="text-center py-16">
                                <ImageIcon className="w-16 h-16 text-purple-300 drop-shadow-sm mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No artworks yet</h3>
                                <p className="text-gray-500 mb-6">Start by creating your first masterpiece</p>
                                <Link href="/artist/create">
                                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                                        <Plus className="mr-2 h-4 w-4" /> Create Your First Artwork
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {artworks.slice(0, 8).map((artwork) => {
                                    const imgUrl = artwork.images?.[0] || artwork.imageUrl;
                                    return (
                                        <Link key={artwork.id} href={`/artwork/${artwork.id}`} className="group">
                                            <div className="rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
                                                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                                    {imgUrl && (
                                                        <img
                                                            src={imgUrl}
                                                            alt={artwork.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    )}
                                                    <div className="absolute top-2 right-2">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${artwork.status === "published"
                                                            ? "bg-green-100 text-green-700"
                                                            : artwork.status === "sold"
                                                                ? "bg-purple-100 text-purple-700"
                                                                : "bg-gray-100 text-gray-600"
                                                            }`}>
                                                            {artwork.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-3">
                                                    <p className="font-medium text-sm text-gray-900 truncate">{artwork.title}</p>
                                                    <p className="text-sm text-purple-600 font-medium">{formatCurrency(parseFloat(artwork.price))}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

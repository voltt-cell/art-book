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
        <div className="min-h-screen relative overflow-hidden bg-slate-50">
            {/* Elegant Atmospheric Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <img
                    src="/assets/watercolor_bg.png"
                    alt="abstract artistic background"
                    className="w-full h-full object-cover opacity-60 mix-blend-multiply"
                />
            </div>
            {/* Orbs for extra depth */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-purple-300/20 blur-[120px] pointer-events-none z-0"
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
                className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-teal-300/20 blur-[120px] pointer-events-none z-0"
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
                            { label: "Total Artworks", value: artworks.length, icon: ImageIcon, gradient: "from-purple-500 to-indigo-600", shadow: "shadow-purple-500/20" },
                            { label: "Active Listings", value: activeListings, icon: Package, gradient: "from-blue-500 to-cyan-500", shadow: "shadow-blue-500/20" },
                            { label: "Auctions", value: auctionListings, icon: Gavel, gradient: "from-amber-500 to-orange-500", shadow: "shadow-orange-500/20" },
                            { label: "Revenue", value: formatCurrency(totalRevenue), icon: DollarSign, gradient: "from-green-500 to-emerald-500", shadow: "shadow-emerald-500/20" },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white/60 backdrop-blur-2xl rounded-3xl p-6 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                                        <p className="text-3xl font-serif font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                    <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg ${stat.shadow}`}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <Link href="/artist/create" className="group">
                            <div className="bg-white/60 backdrop-blur-2xl rounded-3xl p-6 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-purple-100/80 rounded-2xl group-hover:bg-purple-200 transition-colors shadow-sm">
                                            <Plus className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <span className="font-serif font-bold text-lg text-gray-900">Add Artwork</span>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </Link>
                        <Link href="/shop/orders" className="group">
                            <div className="bg-white/60 backdrop-blur-2xl rounded-3xl p-6 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-100/80 rounded-2xl group-hover:bg-blue-200 transition-colors shadow-sm">
                                            <Package className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <span className="font-serif font-bold text-lg text-gray-900">View Sales</span>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </Link>
                        <Link href="/shop/settings" className="group">
                            <div className="bg-white/60 backdrop-blur-2xl rounded-3xl p-6 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gray-100/80 rounded-2xl group-hover:bg-gray-200 transition-colors shadow-sm">
                                            <Settings className="h-6 w-6 text-gray-600" />
                                        </div>
                                        <span className="font-serif font-bold text-lg text-gray-900">Shop Settings</span>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Recent Artworks */}
                    <div className="bg-white/70 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100/50">
                            <h2 className="text-2xl font-serif font-bold text-gray-900">Your Masterpieces</h2>
                            {artworks.length > 6 && (
                                <Link href="/artist/dashboard" className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors flex items-center">
                                    View All Gallery <ArrowRight className="ml-1 w-4 h-4" />
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

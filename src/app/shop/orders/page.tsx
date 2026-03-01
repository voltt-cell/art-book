"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { Loader2, Package, ArrowLeft, Search, CheckCircle } from "lucide-react";
import { fetcher } from "@/lib/swr";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { ArtisticLoader } from "@/components/ui/artistic-loader";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

type ShopOrderRow = {
    order: {
        id: string;
        artworkId: string;
        buyerId: string;
        sellerId: string;
        amount: string;
        status: "pending" | "paid" | "shipped" | "completed";
        type: "fixed" | "auction";
        createdAt: string;
    };
    artwork: {
        id: string;
        title: string;
        imageUrl: string;
    };
    buyer: {
        name: string;
        email: string;
    };
};

const orderStatusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
    shipped: "bg-blue-100 text-blue-700 border-blue-200",
    completed: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function ShopOrdersPage() {
    const { user, hasShop, loading: authLoading } = useAuth();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: ordersData, isLoading: ordersLoading } = useSWR<ShopOrderRow[]>(
        user && hasShop ? "/payments/orders/shop" : null,
        fetcher
    );

    const orders = ordersData || [];

    const filteredOrders = orders.filter((o) => {
        const search = searchTerm.toLowerCase();
        return (
            o.artwork.title.toLowerCase().includes(search) ||
            o.buyer.name.toLowerCase().includes(search) ||
            o.order.id.toLowerCase().includes(search)
        );
    });

    if (authLoading) {
        return <ArtisticLoader fullScreen />;
    }

    if (!user || !hasShop) {
        router.push("/shop/apply");
        return null;
    }

    return (
        <div className="min-h-screen relative overflow-hidden pb-20 bg-slate-50">
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
                className="absolute -top-[10%] -right-[5%] w-[600px] h-[600px] rounded-full bg-purple-300/20 blur-[120px] pointer-events-none z-0"
            />

            {/* Header */}
            <div className="bg-white/60 backdrop-blur-2xl border-b border-white/50 shadow-sm sticky top-0 z-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link href="/shop/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <h1 className="font-serif text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Package className="w-5 h-5 text-purple-600" />
                                Sales & Orders
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-8 px-4 max-w-6xl relative z-10">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-gray-900">Your Sales History</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage and track the artworks you've sold.</p>
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by buyer, artwork, or order ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="bg-white/60 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
                >
                    {ordersLoading ? (
                        <div className="py-20 flex justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="py-20 text-center px-4">
                            <div className="h-16 w-16 bg-purple-100/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-white">
                                <Package className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">No sales yet</h3>
                            <p className="text-gray-500 text-sm max-w-sm mx-auto">
                                Once your artworks start selling, the order details will appear right here in your ledger.
                            </p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-gray-500 font-medium">No orders match your search.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-medium">
                                        <th className="py-4 px-6 font-medium whitespace-nowrap hidden md:table-cell">Order ID</th>
                                        <th className="py-4 px-6 font-medium">Artwork</th>
                                        <th className="py-4 px-6 font-medium">Buyer</th>
                                        <th className="py-4 px-6 font-medium hidden sm:table-cell">Date</th>
                                        <th className="py-4 px-6 font-medium">Amount</th>
                                        <th className="py-4 px-6 font-medium text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map(({ order, artwork, buyer }) => (
                                        <tr
                                            key={order.id}
                                            className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors last:border-0"
                                        >
                                            <td className="py-4 px-6 hidden md:table-cell">
                                                <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                                    {order.id.slice(0, 8)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                                                        {artwork.imageUrl ? (
                                                            <img
                                                                src={artwork.imageUrl}
                                                                alt={artwork.title}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center">
                                                                <Package className="h-4 w-4 text-gray-300" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 line-clamp-1">{artwork.title}</p>
                                                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                                                            {order.type}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className="font-medium text-gray-900">{buyer.name}</p>
                                                <p className="text-xs text-gray-500 hidden lg:block">{buyer.email}</p>
                                            </td>
                                            <td className="py-4 px-6 hidden sm:table-cell text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString(undefined, {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric"
                                                })}
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className="font-bold text-gray-900">
                                                    ${parseFloat(order.amount).toLocaleString()}
                                                </p>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <span
                                                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border bg-white shadow-sm inline-flex items-center gap-1.5 capitalize ${orderStatusColors[order.status] || "bg-gray-100 text-gray-700"
                                                            }`}
                                                    >
                                                        {order.status === "paid" && <CheckCircle className="h-3 w-3" />}
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

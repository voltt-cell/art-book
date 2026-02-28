"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { Loader2, ShoppingBag, Gavel, Trophy, CreditCard, LayoutDashboard, User, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/swr";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import { ArtisticLoader } from "@/components/ui/artistic-loader";

type OrderRow = {
    id: string;
    artworkId: string;
    buyerId: string;
    sellerId: string;
    amount: string;
    status: "pending" | "paid" | "shipped" | "completed";
    type: "fixed" | "auction";
    stripeSessionId: string | null;
    createdAt: string;
};

type BidRow = {
    bid: {
        id: string;
        auctionId: string;
        bidderId: string;
        amount: string;
        createdAt: string;
    };
    auction: {
        id: string;
        artworkId: string;
        startTime: string;
        endTime: string;
        startingBid: string;
        currentBid: string | null;
        winnerId: string | null;
        status: "active" | "ended" | "paid";
        createdAt: string;
    };
    artwork: {
        id: string;
        title: string;
        imageUrl: string;
        price: string;
        medium: string;
    };
};

const orderStatusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    shipped: "bg-blue-100 text-blue-700",
    completed: "bg-gray-200 text-gray-700",
};

const auctionStatusColors: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    ended: "bg-yellow-100 text-yellow-700",
    paid: "bg-blue-100 text-blue-700",
};

const tabs = [
    { id: "summary", label: "Overview", icon: LayoutDashboard },
    { id: "orders", label: "My Orders", icon: ShoppingBag },
    { id: "bids", label: "My Bids", icon: Gavel },
    { id: "won", label: "Won Auctions", icon: Trophy },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function BuyerDashboard() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<TabId>("summary");

    const { data: orders, isLoading: ordersLoading } = useSWR<OrderRow[]>(
        isAuthenticated ? "/payments/orders" : null,
        fetcher
    );

    const { data: bidsRaw, isLoading: bidsLoading } = useSWR<BidRow[]>(
        isAuthenticated ? "/auctions/my-bids" : null,
        fetcher
    );

    const myBids = bidsRaw || [];
    const wonAuctions = myBids.filter(
        (b) =>
            b.auction.status === "ended" &&
            b.auction.winnerId === user?.id
    );
    // Deduplicate won auctions by auction id (keep highest bid)
    const uniqueWon = Object.values(
        wonAuctions.reduce<Record<string, BidRow>>((acc, b) => {
            if (!acc[b.auction.id] || parseFloat(b.bid.amount) > parseFloat(acc[b.auction.id].bid.amount)) {
                acc[b.auction.id] = b;
            }
            return acc;
        }, {})
    );

    const handlePayAuction = async (auctionId: string) => {
        try {
            const res = await api.post<{ sessionUrl: string }>("/payments/auction-checkout", {
                auctionId,
            });
            window.location.href = res.sessionUrl;
        } catch (err) {
            toast.error("Payment failed", { description: (err as Error).message });
        }
    };

    if (authLoading) {
        return <ArtisticLoader fullScreen />;
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Sign In Required</h2>
                    <p className="text-gray-500">Please log in to view your dashboard.</p>
                </div>
            </div>
        );
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
                className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-blue-300/20 blur-[120px] pointer-events-none"
            />

            <div className="container mx-auto py-12 px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-serif font-bold text-gray-900">My Dashboard</h1>
                    <p className="text-gray-500 mt-2">
                        Welcome back, <span className="font-medium text-gray-700">{user?.name}</span>
                    </p>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="flex gap-2 mb-10 bg-white/60 backdrop-blur-xl rounded-2xl p-2 border border-white/50 shadow-sm w-fit relative z-20"
                >
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        let count = 0;
                        if (tab.id === "orders") count = (orders || []).length;
                        if (tab.id === "bids") count = myBids.length;
                        if (tab.id === "won") count = uniqueWon.length;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${isActive
                                    ? "bg-purple-600 text-white shadow-sm"
                                    : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                                {count > 0 && (
                                    <span
                                        className={`text-xs px-1.5 py-0.5 rounded-full ${isActive
                                            ? "bg-white/20 text-white"
                                            : "bg-gray-100 text-gray-500"
                                            }`}
                                    >
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </motion.div>

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Summary Tab */}
                    {activeTab === "summary" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Profile Card */}
                            <motion.div variants={fadeInUp} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:col-span-1 h-fit transition-transform hover:-translate-y-1 duration-300">
                                <div className="flex flex-col items-center text-center">
                                    <div className="h-24 w-24 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-3xl font-bold mb-4 border-4 border-white shadow-md">
                                        {user?.profileImage ? (
                                            <img src={user.profileImage} alt={user.name} className="h-full w-full rounded-full object-cover" />
                                        ) : (
                                            user?.name?.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <h2 className="text-xl font-serif font-bold text-gray-900">{user?.name}</h2>
                                    <p className="text-gray-500 text-sm mb-6">{user?.email}</p>

                                    <div className="w-full grid grid-cols-2 gap-4 text-center mb-6">
                                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-2xl border border-purple-100/50">
                                            <p className="text-2xl font-bold text-gray-900">{orders?.length || 0}</p>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Orders</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-2xl border border-teal-100/50">
                                            <p className="text-2xl font-bold text-gray-900">{uniqueWon.length}</p>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Wins</p>
                                        </div>
                                    </div>

                                    <Button variant="outline" className="w-full rounded-full border-gray-200 hover:bg-gray-50 hover:text-purple-600" onClick={() => window.location.href = "/settings"}>
                                        <User className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                </div>
                            </motion.div>

                            {/* Recent Activity */}
                            <motion.div variants={fadeInUp} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:col-span-2 flex flex-col overflow-hidden transition-transform hover:-translate-y-1 duration-300">
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="font-serif font-bold text-lg text-gray-900 flex items-center">
                                        <Clock className="w-5 h-5 mr-2 text-purple-500" />
                                        Recent Activity
                                    </h3>
                                    <Button variant="link" className="text-purple-600 p-0 h-auto font-medium" onClick={() => setActiveTab("orders")}>
                                        View All
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                                <div className="p-6 flex-1">
                                    {ordersLoading ? (
                                        <div className="flex justify-center py-8"><Loader2 className="animate-spin text-purple-500" /></div>
                                    ) : (orders || []).length === 0 && myBids.length === 0 ? (
                                        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 mt-2">
                                            <p className="text-gray-500">No recent activity found.</p>
                                            <Button className="mt-4 bg-purple-600 rounded-full" onClick={() => window.location.href = "/artworks"}>Start Exploring</Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {/* Show latest order if exists */}
                                            {orders && orders.length > 0 && (
                                                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                                        <ShoppingBag className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900">New Order Placed</p>
                                                        <p className="text-xs text-gray-500 truncate">Order #{orders[0].id.slice(0, 8)} • {new Date(orders[0].createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-gray-900">${parseFloat(orders[0].amount).toLocaleString()}</p>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${orderStatusColors[orders[0].status]}`}>{orders[0].status}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Show latest bid if exists */}
                                            {myBids && myBids.length > 0 && (
                                                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 shrink-0">
                                                        <Gavel className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900">Bid Placed on {myBids[0].artwork.title}</p>
                                                        <p className="text-xs text-gray-500 truncate">{new Date(myBids[0].bid.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-gray-900">${parseFloat(myBids[0].bid.amount).toLocaleString()}</p>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${auctionStatusColors[myBids[0].auction.status]}`}>{myBids[0].auction.status}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* My Orders Tab */}
                    {activeTab === "orders" && (
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                            {ordersLoading ? (
                                <div className="py-12 flex justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                                </div>
                            ) : (orders || []).length === 0 ? (
                                <div className="py-16 text-center">
                                    <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 text-lg">No orders yet</p>
                                    <p className="text-gray-400 text-sm mt-1">Your purchases will appear here</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                                <th className="text-left py-3 px-4 font-medium text-gray-500">Order ID</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(orders || []).map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                                                >
                                                    <td className="py-3 px-4">
                                                        <span className="font-mono text-xs text-gray-700">
                                                            {order.id.slice(0, 8)}...
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 font-medium text-gray-900">
                                                        ${parseFloat(order.amount).toLocaleString()}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">
                                                            {order.type}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span
                                                            className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${orderStatusColors[order.status]
                                                                }`}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-500">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* My Bids Tab */}
                    {activeTab === "bids" && (
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                            {bidsLoading ? (
                                <div className="py-12 flex justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                                </div>
                            ) : myBids.length === 0 ? (
                                <div className="py-16 text-center">
                                    <Gavel className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 text-lg">No bids placed yet</p>
                                    <p className="text-gray-400 text-sm mt-1">Browse auctions to start bidding</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                                <th className="text-left py-3 px-4 font-medium text-gray-500">Artwork</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-500">Your Bid</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-500">Current Bid</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-500">Auction Status</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-500">Result</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {myBids.map((item) => {
                                                const isWinner =
                                                    item.auction.winnerId === user?.id &&
                                                    item.auction.status !== "active";
                                                return (
                                                    <tr
                                                        key={item.bid.id}
                                                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                                                    >
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    src={item.artwork.imageUrl}
                                                                    alt={item.artwork.title}
                                                                    className="w-9 h-9 rounded-lg object-cover"
                                                                />
                                                                <span className="font-medium text-gray-900 max-w-[180px] truncate">
                                                                    {item.artwork.title}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 font-medium text-gray-900">
                                                            ${parseFloat(item.bid.amount).toLocaleString()}
                                                        </td>
                                                        <td className="py-3 px-4 text-gray-600">
                                                            {item.auction.currentBid
                                                                ? `$${parseFloat(item.auction.currentBid).toLocaleString()}`
                                                                : "—"}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <span
                                                                className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${auctionStatusColors[item.auction.status]
                                                                    }`}
                                                            >
                                                                {item.auction.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            {item.auction.status === "active" ? (
                                                                <span className="text-xs text-gray-400">In progress</span>
                                                            ) : isWinner ? (
                                                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                                                                    🎉 Won
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-600">
                                                                    Outbid
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-3 px-4 text-gray-500">
                                                            {new Date(item.bid.createdAt).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Won Auctions Tab */}
                    {activeTab === "won" && (
                        <div>
                            {bidsLoading ? (
                                <div className="py-12 flex justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                                </div>
                            ) : uniqueWon.length === 0 ? (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
                                    <Trophy className="h-16 w-16 text-purple-200 mx-auto mb-4" />
                                    <h2 className="text-xl font-serif font-semibold mb-2">No won auctions yet</h2>
                                    <p className="text-gray-500 mb-6">Keep bidding to win your favorite pieces. Your victories will appear here.</p>
                                    <Button onClick={() => window.location.href = "/auctions"} className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6">Find Auctions</Button>
                                </div>
                            ) : (
                                <motion.div
                                    variants={staggerContainer}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                                >
                                    {uniqueWon.map((item) => {
                                        const isPaid = item.auction.status === "paid";
                                        return (
                                            <motion.div
                                                key={item.auction.id}
                                                variants={fadeInUp}
                                                className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)] transition-all duration-300 transform hover:-translate-y-1 group"
                                            >
                                                <div className="relative overflow-hidden">
                                                    <img
                                                        src={item.artwork.imageUrl}
                                                        alt={item.artwork.title}
                                                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                    />
                                                    <div className="absolute top-3 right-3">
                                                        <span
                                                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${isPaid
                                                                ? "bg-green-500 text-white"
                                                                : "bg-yellow-500 text-white"
                                                                }`}
                                                        >
                                                            {isPaid ? "✓ Paid" : "Awaiting Payment"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="font-serif text-lg font-semibold text-gray-900 mb-1">
                                                        {item.artwork.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mb-3">{item.artwork.medium}</p>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-xs text-gray-400">Winning Bid</p>
                                                            <p className="text-xl font-bold text-gray-900">
                                                                ${parseFloat(item.auction.currentBid || item.bid.amount).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        {!isPaid && (
                                                            <Button
                                                                onClick={() => handlePayAuction(item.auction.id)}
                                                                className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                                                            >
                                                                <CreditCard className="h-4 w-4 mr-2" />
                                                                Pay Now
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

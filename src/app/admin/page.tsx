"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { Loader2, Users, Image, ShoppingCart, Gavel, DollarSign, Palette, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetcher } from "@/lib/swr";
import { staggerContainer, fadeInUp } from "@/lib/animations";

type Stats = {
    totalUsers: number;
    totalArtworks: number;
    totalOrders: number;
    totalAuctions: number;
    totalRevenue: number;
    totalArtists: number;
    totalBuyers: number;
};

const statCards = [
    { key: "totalUsers", label: "Total Users", icon: Users, color: "from-violet-500 to-purple-600", href: "/admin/users" },
    { key: "totalArtists", label: "Artists", icon: Palette, color: "from-pink-500 to-rose-600", href: "/admin/users?role=artist" },
    { key: "totalBuyers", label: "Buyers", icon: UserCheck, color: "from-sky-500 to-blue-600", href: "/admin/users?role=buyer" },
    { key: "totalArtworks", label: "Artworks", icon: Image, color: "from-amber-500 to-orange-600", href: "/admin/artworks" },
    { key: "totalOrders", label: "Orders", icon: ShoppingCart, color: "from-emerald-500 to-green-600", href: "/admin/orders" },
    { key: "totalAuctions", label: "Auctions", icon: Gavel, color: "from-indigo-500 to-blue-600", href: "/admin/auctions" },
    { key: "totalRevenue", label: "Revenue", icon: DollarSign, color: "from-teal-500 to-cyan-600", href: "/admin/orders" },
] as const;

const navItems = [
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Artworks", href: "/admin/artworks", icon: Image },
    { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { label: "Auctions", href: "/admin/auctions", icon: Gavel },
];

export default function AdminDashboard() {
    const { isAdmin, loading: authLoading } = useAuth();
    const { data: stats, isLoading } = useSWR<Stats>(
        isAdmin ? "/admin/stats" : null,
        fetcher,
        { refreshInterval: 30000 }
    );

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Access Denied</h2>
                    <p className="text-gray-500">You need an admin account to access this page.</p>
                </div>
            </div>
        );
    }

    const formatValue = (key: string, value: number) => {
        if (key === "totalRevenue") return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
        return value.toLocaleString();
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="container mx-auto py-10 px-4">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="mb-10"
                >
                    <h1 className="text-4xl font-serif font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-2">Manage your ArtBook platform</p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10"
                >
                    {statCards.map((card) => {
                        const Icon = card.icon;
                        const value = stats?.[card.key] ?? 0;
                        return (
                            <motion.div key={card.key} variants={fadeInUp}>
                                <Link href={card.href}>
                                    <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity`} />
                                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} mb-4`}>
                                            <Icon className="h-5 w-5 text-white" />
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">{formatValue(card.key, value)}</p>
                                        <p className="text-sm text-gray-500 mt-1">{card.label}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Quick Nav */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    <h2 className="text-xl font-serif font-semibold text-gray-800 mb-4">Quick Access</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant="outline"
                                        className="w-full h-20 flex flex-col gap-2 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all cursor-pointer"
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

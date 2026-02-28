"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { Loader2, Users, Image, ShoppingCart, Gavel, DollarSign, Palette, UserCheck, TrendingUp, Activity } from "lucide-react";
import Link from "next/link";
import { fetcher } from "@/lib/swr";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from "recharts";

type Stats = {
    totalUsers: number;
    totalArtworks: number;
    totalOrders: number;
    totalAuctions: number;
    totalRevenue: number;
    totalArtists: number;
    totalBuyers: number;
    revenueTrend: { month: string; revenue: number }[];
    userGrowth: { month: string; users: number }[];
};

const statCards = [
    { key: "totalRevenue", label: "Total Revenue", icon: DollarSign, color: "from-teal-500 to-emerald-600", bgLight: "bg-teal-50", textDark: "text-teal-700" },
    { key: "totalUsers", label: "Total Users", icon: Users, color: "from-violet-500 to-purple-600", bgLight: "bg-violet-50", textDark: "text-violet-700" },
    { key: "totalArtists", label: "Verified Artists", icon: Palette, color: "from-pink-500 to-rose-600", bgLight: "bg-pink-50", textDark: "text-pink-700" },
    { key: "totalBuyers", label: "Active Buyers", icon: UserCheck, color: "from-blue-500 to-indigo-600", bgLight: "bg-blue-50", textDark: "text-blue-700" },
    { key: "totalArtworks", label: "Total Artworks", icon: Image, color: "from-amber-500 to-orange-600", bgLight: "bg-amber-50", textDark: "text-amber-700" },
    { key: "totalOrders", label: "Platform Orders", icon: ShoppingCart, color: "from-sky-500 to-cyan-600", bgLight: "bg-sky-50", textDark: "text-sky-700" },
    { key: "totalAuctions", label: "Platform Auctions", icon: Gavel, color: "from-indigo-500 to-blue-700", bgLight: "bg-indigo-50", textDark: "text-indigo-700" },
] as const;

export default function AdminDashboard() {
    const { isAdmin, loading: authLoading } = useAuth();
    const { data: stats, isLoading } = useSWR<Stats>(
        isAdmin ? "/admin/stats" : null,
        fetcher,
        { refreshInterval: 60000 }
    );

    if (authLoading || isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Access Denied</h2>
                    <p className="text-gray-500">You need an admin account to access this area.</p>
                </div>
            </div>
        );
    }

    const formatValue = (key: string, value: number) => {
        if (key === "totalRevenue") return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
        return value.toLocaleString();
    };

    const hasRevenueData = stats?.revenueTrend && stats.revenueTrend.length > 0;
    const hasUserData = stats?.userGrowth && stats.userGrowth.length > 0;

    return (
        <div className="p-8">
            {/* Header Area */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <Activity className="h-5 w-5 text-purple-700" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Platform Overview</h1>
                </div>
                <p className="text-gray-500 ml-12">Monitor your marketplace performance and key metrics in real-time.</p>
            </motion.div>

            {/* Key Metrics Grid */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10"
            >
                {statCards.map((card) => {
                    const Icon = card.icon;
                    const value = stats?.[card.key] ?? 0;
                    return (
                        <motion.div key={card.key} variants={fadeInUp}>
                            <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow group">
                                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-[0.03] rounded-bl-full group-hover:opacity-10 transition-opacity`} />
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} shadow-sm`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${card.bgLight} ${card.textDark}`}>
                                        Real-time
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-gray-900 tracking-tight">{formatValue(card.key, value)}</p>
                                <p className="text-sm font-medium text-gray-500 mt-1">{card.label}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Charts Section */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
            >
                {/* Revenue Graph */}
                <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-teal-600" />
                                Revenue Growth
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Total revenue over the last 6 months</p>
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        {hasRevenueData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.revenueTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(value: any) => `$${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111827', borderRadius: '12px', border: 'none', color: '#fff' }}
                                        itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
                                        formatter={(value: any) => [`$${value?.toLocaleString() || 0}`, 'Revenue']}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
                                <Activity className="h-8 w-8 text-gray-300 mb-2" />
                                <p className="text-sm text-gray-400 font-medium">Not enough revenue data</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* User Growth Graph */}
                <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Users className="h-5 w-5 text-purple-600" />
                                User Acquisition
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Platform registrations over time</p>
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        {hasUserData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.userGrowth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barSize={32}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                    <Tooltip
                                        cursor={{ fill: '#f3f4f6' }}
                                        contentStyle={{ backgroundColor: '#111827', borderRadius: '12px', border: 'none', color: '#fff' }}
                                        itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
                                        formatter={(value: any) => [value, 'New Users']}
                                    />
                                    <Bar dataKey="users" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
                                <Users className="h-8 w-8 text-gray-300 mb-2" />
                                <p className="text-sm text-gray-400 font-medium">Not enough user data</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

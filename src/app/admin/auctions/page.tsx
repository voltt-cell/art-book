"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { Loader2, ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { fetcher } from "@/lib/swr";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { useState } from "react";

type AuctionRow = {
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

const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    ended: "bg-yellow-100 text-yellow-700",
    paid: "bg-blue-100 text-blue-700",
};

export default function AdminAuctionsPage() {
    const { isAdmin, loading: authLoading } = useAuth();
    const { data: auctions, isLoading } = useSWR<AuctionRow[]>(
        isAdmin ? "/admin/auctions" : null,
        fetcher
    );
    const [search, setSearch] = useState("");

    const filtered = (auctions || []).filter(
        (a) =>
            a.id.toLowerCase().includes(search.toLowerCase()) ||
            a.status.includes(search.toLowerCase())
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
                    <p className="text-gray-500">Admin access required.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900">Auction Management</h1>
                        <p className="text-gray-500 mt-1">{filtered.length} auctions</p>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by ID or status..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
            </motion.div>

            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50/80 border-b border-gray-100">
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Auction ID</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Starting Bid</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Current Bid</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Starts</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Ends</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((auction) => (
                                    <motion.tr
                                        key={auction.id}
                                        variants={fadeInUp}
                                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="py-3 px-4">
                                            <span className="font-mono text-xs text-gray-700">
                                                {auction.id.slice(0, 8)}...
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-900">
                                            ${parseFloat(auction.startingBid).toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4 font-medium text-gray-900">
                                            {auction.currentBid
                                                ? `$${parseFloat(auction.currentBid).toLocaleString()}`
                                                : "—"}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusColors[auction.status]}`}>
                                                {auction.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-500">
                                            {new Date(auction.startTime).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4 text-gray-500">
                                            {new Date(auction.endTime).toLocaleDateString()}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filtered.length === 0 && (
                        <div className="py-12 text-center text-gray-400">No auctions found</div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

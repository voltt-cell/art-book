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

const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    shipped: "bg-blue-100 text-blue-700",
    completed: "bg-gray-200 text-gray-700",
};

export default function AdminOrdersPage() {
    const { isAdmin, loading: authLoading } = useAuth();
    const { data: orders, isLoading } = useSWR<OrderRow[]>(
        isAdmin ? "/admin/orders" : null,
        fetcher
    );
    const [search, setSearch] = useState("");

    const filtered = (orders || []).filter(
        (o) =>
            o.id.toLowerCase().includes(search.toLowerCase()) ||
            o.status.includes(search.toLowerCase()) ||
            o.type.includes(search.toLowerCase())
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
        <div className="min-h-screen bg-gray-50/50">
            <div className="container mx-auto py-10 px-4">
                <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                    <Link href="/admin" className="inline-flex items-center text-sm text-gray-500 hover:text-purple-600 mb-4 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
                    </Link>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-gray-900">Order Management</h1>
                            <p className="text-gray-500 mt-1">{filtered.length} orders</p>
                        </div>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by ID, status, or type..."
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
                                        <th className="text-left py-3 px-4 font-medium text-gray-500">Order ID</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((order) => (
                                        <motion.tr
                                            key={order.id}
                                            variants={fadeInUp}
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
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusColors[order.status]}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filtered.length === 0 && (
                            <div className="py-12 text-center text-gray-400">No orders found</div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

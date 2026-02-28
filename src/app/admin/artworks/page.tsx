"use client";

import useSWR, { mutate } from "swr";
import { motion } from "framer-motion";
import { useAuth } from "@/context/auth-context";
import { Loader2, ArrowLeft, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { fetcher } from "@/lib/swr";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type ArtworkRow = {
    id: string;
    title: string;
    artistId: string;
    description: string;
    price: string;
    medium: string;
    imageUrl: string;
    status: "draft" | "published" | "sold";
    listingType: "fixed" | "auction";
    createdAt: string;
};

const statusColors: Record<string, string> = {
    draft: "bg-yellow-100 text-yellow-700",
    published: "bg-green-100 text-green-700",
    sold: "bg-gray-200 text-gray-700",
};

export default function AdminArtworksPage() {
    const { isAdmin, loading: authLoading } = useAuth();
    const { data: artworks, isLoading } = useSWR<ArtworkRow[]>(
        isAdmin ? "/admin/artworks" : null,
        fetcher
    );
    const [search, setSearch] = useState("");

    const filtered = (artworks || []).filter(
        (a) =>
            a.title.toLowerCase().includes(search.toLowerCase()) ||
            a.medium.toLowerCase().includes(search.toLowerCase())
    );

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await api.put(`/admin/artworks/${id}/status`, { status: newStatus });
            toast.success("Status updated");
            mutate("/admin/artworks");
        } catch (err) {
            toast.error("Failed to update status", { description: (err as Error).message });
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete artwork "${title}"? This cannot be undone.`)) return;
        try {
            await api.delete(`/admin/artworks/${id}`);
            toast.success("Artwork deleted");
            mutate("/admin/artworks");
        } catch (err) {
            toast.error("Failed to delete", { description: (err as Error).message });
        }
    };

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
                        <h1 className="text-3xl font-serif font-bold text-gray-900">Artwork Management</h1>
                        <p className="text-gray-500 mt-1">{filtered.length} artworks</p>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by title or medium..."
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
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Artwork</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Medium</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Price</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Created</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((artwork) => (
                                    <motion.tr
                                        key={artwork.id}
                                        variants={fadeInUp}
                                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={artwork.imageUrl}
                                                    alt={artwork.title}
                                                    className="w-10 h-10 rounded-lg object-cover"
                                                />
                                                <span className="font-medium text-gray-900 max-w-[200px] truncate">
                                                    {artwork.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">{artwork.medium}</td>
                                        <td className="py-3 px-4 text-gray-900 font-medium">
                                            ${parseFloat(artwork.price).toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">
                                                {artwork.listingType}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Select
                                                value={artwork.status}
                                                onValueChange={(value) => handleStatusChange(artwork.id, value)}
                                            >
                                                <SelectTrigger className={`h-7 text-xs font-medium px-2 py-0 rounded-full border-0 ${statusColors[artwork.status]}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="draft">Draft</SelectItem>
                                                    <SelectItem value="published">Published</SelectItem>
                                                    <SelectItem value="sold">Sold</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="py-3 px-4 text-gray-500">
                                            {new Date(artwork.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(artwork.id, artwork.title)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filtered.length === 0 && (
                        <div className="py-12 text-center text-gray-400">No artworks found</div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

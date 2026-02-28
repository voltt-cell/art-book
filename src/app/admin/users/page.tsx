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

type UserRow = {
    id: string;
    name: string;
    email: string;
    role: "artist" | "buyer" | "admin";
    bio: string | null;
    profileImage: string | null;
    createdAt: string;
};

const roleColors: Record<string, string> = {
    admin: "bg-red-100 text-red-700",
    artist: "bg-purple-100 text-purple-700",
    buyer: "bg-blue-100 text-blue-700",
};

export default function AdminUsersPage() {
    const { isAdmin, loading: authLoading, user: currentUser } = useAuth();
    const { data: users, isLoading } = useSWR<UserRow[]>(
        isAdmin ? "/admin/users" : null,
        fetcher
    );
    const [search, setSearch] = useState("");

    const filteredUsers = (users || []).filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            toast.success("Role updated successfully");
            mutate("/admin/users");
        } catch (err) {
            toast.error("Failed to update role", { description: (err as Error).message });
        }
    };

    const handleDelete = async (userId: string, userName: string) => {
        if (!confirm(`Are you sure you want to delete user "${userName}"? This cannot be undone.`)) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            toast.success("User deleted");
            mutate("/admin/users");
        } catch (err) {
            toast.error("Failed to delete user", { description: (err as Error).message });
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
                        <h1 className="text-3xl font-serif font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-500 mt-1">{filteredUsers.length} users</p>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 h-10 rounded-full bg-white border-gray-200"
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
                                    <th className="text-left py-4 px-6 font-medium text-gray-500 uppercase text-xs tracking-wider">User</th>
                                    <th className="text-left py-4 px-6 font-medium text-gray-500 uppercase text-xs tracking-wider">Email</th>
                                    <th className="text-left py-4 px-6 font-medium text-gray-500 uppercase text-xs tracking-wider">Role</th>
                                    <th className="text-left py-4 px-6 font-medium text-gray-500 uppercase text-xs tracking-wider">Joined</th>
                                    <th className="text-right py-4 px-6 font-medium text-gray-500 uppercase text-xs tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <motion.tr
                                        key={user.id}
                                        variants={fadeInUp}
                                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold shadow-sm">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-gray-900">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600 font-medium">{user.email}</td>
                                        <td className="py-4 px-6">
                                            <Select
                                                value={user.role}
                                                onValueChange={(value) => handleRoleChange(user.id, value)}
                                                disabled={user.id === currentUser?.id}
                                            >
                                                <SelectTrigger className={`h-8 text-xs font-semibold px-3 py-0 rounded-full border-0 shadow-none ${roleColors[user.role]}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="buyer">Buyer</SelectItem>
                                                    <SelectItem value="artist">Artist</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="py-4 px-6 text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            {user.id !== currentUser?.id && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(user.id, user.name)}
                                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer rounded-full"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredUsers.length === 0 && (
                        <div className="py-16 text-center text-gray-400">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                                <Search className="h-8 w-8 text-gray-300" />
                            </div>
                            <p className="font-medium text-gray-500">No users found</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

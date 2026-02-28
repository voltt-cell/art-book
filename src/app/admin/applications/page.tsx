"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, Store, User, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ShopApplication = {
    application: {
        id: string;
        shopName: string;
        shopDescription: string;
        portfolioUrl: string | null;
        status: "pending" | "approved" | "rejected";
        adminNotes: string | null;
        createdAt: string;
        reviewedAt: string | null;
    };
    user: {
        id: string;
        name: string;
        email: string;
        profileImage: string | null;
    };
};

export default function AdminApplicationsPage() {
    const { isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const [applications, setApplications] = useState<ShopApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && isAdmin) {
            fetchApplications();
        }
    }, [authLoading, isAdmin]);

    const fetchApplications = async () => {
        try {
            const data = await api.get<ShopApplication[]>("/admin/shop-applications");
            setApplications(data);
        } catch (error) {
            toast.error("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        setProcessingId(id);
        try {
            await api.post(`/admin/shop-applications/${id}/approve`, {});
            toast.success("Application approved!");
            fetchApplications();
        } catch (error) {
            toast.error("Failed to approve", {
                description: (error as Error).message,
            });
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: string) => {
        const notes = prompt("Rejection reason (optional):");
        setProcessingId(id);
        try {
            await api.post(`/admin/shop-applications/${id}/reject`, { notes });
            toast.success("Application rejected");
            fetchApplications();
        } catch (error) {
            toast.error("Failed to reject", {
                description: (error as Error).message,
            });
        } finally {
            setProcessingId(null);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!isAdmin) {
        router.push("/");
        return null;
    }

    const pending = applications.filter((a) => a.application.status === "pending");
    const reviewed = applications.filter((a) => a.application.status !== "pending");

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                Shop Applications
            </h1>
            <p className="text-gray-500 mb-8">
                Review and manage shop applications from users who want to sell on ArtBook.
            </p>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                </div>
            ) : (
                <>
                    {/* Pending Applications */}
                    <div className="mb-10">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-amber-500" />
                            Pending ({pending.length})
                        </h2>
                        {pending.length === 0 ? (
                            <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
                                <p className="text-gray-400">No pending applications</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pending.map((item) => (
                                    <motion.div
                                        key={item.application.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                                    {item.user.profileImage ? (
                                                        <img src={item.user.profileImage} alt={item.user.name} className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        <User className="h-6 w-6 text-purple-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{item.user.name}</h3>
                                                    <p className="text-sm text-gray-500">{item.user.email}</p>
                                                    <div className="mt-3">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Store className="h-4 w-4 text-purple-500" />
                                                            <span className="font-medium text-purple-700">{item.application.shopName}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">{item.application.shopDescription}</p>
                                                        {item.application.portfolioUrl && (
                                                            <a href={item.application.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:underline mt-1 block">
                                                                View Portfolio →
                                                            </a>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-2">
                                                        Applied {new Date(item.application.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 flex-shrink-0">
                                                <Button
                                                    onClick={() => handleApprove(item.application.id)}
                                                    disabled={processingId === item.application.id}
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                >
                                                    {processingId === item.application.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    onClick={() => handleReject(item.application.id)}
                                                    disabled={processingId === item.application.id}
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" /> Reject
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Reviewed Applications */}
                    {reviewed.length > 0 && (
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Reviewed ({reviewed.length})
                            </h2>
                            <div className="space-y-3">
                                {reviewed.map((item) => (
                                    <div
                                        key={item.application.id}
                                        className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${item.application.status === "approved" ? "bg-green-100" : "bg-red-100"}`}>
                                                {item.application.status === "approved" ? (
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 text-red-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{item.user.name} — <span className="text-purple-600">{item.application.shopName}</span></p>
                                                <p className="text-xs text-gray-400">
                                                    {item.application.status === "approved" ? "Approved" : "Rejected"} on {item.application.reviewedAt ? new Date(item.application.reviewedAt).toLocaleDateString() : "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

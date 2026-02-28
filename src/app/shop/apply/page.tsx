"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Store, CheckCircle2, XCircle, Loader2, Clock, Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

type ApplicationStatus = {
    id: string;
    status: "pending" | "approved" | "rejected";
    shopName: string;
    adminNotes?: string;
};

export default function ShopApplyPage() {
    const { isAuthenticated, loading: authLoading, hasShop } = useAuth();
    const router = useRouter();

    const [shopName, setShopName] = useState("");
    const [shopDescription, setShopDescription] = useState("");
    const [portfolioUrl, setPortfolioUrl] = useState("");
    const [nameAvailable, setNameAvailable] = useState<boolean | null>(null);
    const [checkingName, setCheckingName] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [existingApp, setExistingApp] = useState<ApplicationStatus | null>(null);
    const [loadingApp, setLoadingApp] = useState(true);

    // Check for existing application
    useEffect(() => {
        if (isAuthenticated) {
            api.get<{ application: ApplicationStatus | null }>("/shop/my-application")
                .then((res) => setExistingApp(res.application))
                .catch(() => { })
                .finally(() => setLoadingApp(false));
        } else {
            setLoadingApp(false);
        }
    }, [isAuthenticated]);

    // Debounced name availability check
    const checkNameAvailability = useCallback(async (name: string) => {
        if (name.length < 2) {
            setNameAvailable(null);
            return;
        }
        setCheckingName(true);
        try {
            const res = await api.get<{ available: boolean }>(`/shop/check-name?name=${encodeURIComponent(name)}`);
            setNameAvailable(res.available);
        } catch {
            setNameAvailable(null);
        } finally {
            setCheckingName(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (shopName.trim().length >= 2) {
                checkNameAvailability(shopName.trim());
            } else {
                setNameAvailable(null);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [shopName, checkNameAvailability]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nameAvailable) {
            toast.error("Please choose an available shop name");
            return;
        }

        setSubmitting(true);
        try {
            await api.post("/shop/apply", {
                shopName: shopName.trim(),
                shopDescription,
                portfolioUrl: portfolioUrl || undefined,
            });
            toast.success("Application submitted!");
            // Refresh to show pending state
            const res = await api.get<{ application: ApplicationStatus | null }>("/shop/my-application");
            setExistingApp(res.application);
        } catch (error) {
            toast.error("Failed to submit", {
                description: (error as Error).message,
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading || loadingApp) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!isAuthenticated) {
        router.push("/login");
        return null;
    }

    if (hasShop) {
        router.push("/shop/dashboard");
        return null;
    }

    // Show existing application status
    if (existingApp) {
        return (
            <div className="min-h-screen bg-gray-50 relative overflow-hidden">
                {/* Artistic Background */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-200/30 blur-[120px]" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-pink-200/30 blur-[120px]" />
                </div>

                <div className="container mx-auto px-4 py-20 max-w-lg relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 border border-white/50 shadow-xl text-center"
                    >
                        {existingApp.status === "pending" && (
                            <>
                                <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6">
                                    <Clock className="h-8 w-8 text-amber-600" />
                                </div>
                                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">
                                    Application Under Review
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Your application for <span className="font-semibold text-purple-600">&quot;{existingApp.shopName}&quot;</span> is being reviewed by our team. We&apos;ll notify you once it&apos;s approved.
                                </p>
                                <p className="text-sm text-gray-400 italic font-serif">
                                    &quot;Art is not what you see, but what you make others see.&quot; — Edgar Degas
                                </p>
                            </>
                        )}
                        {existingApp.status === "rejected" && (
                            <>
                                <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
                                    <XCircle className="h-8 w-8 text-red-600" />
                                </div>
                                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">
                                    Application Not Approved
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    Unfortunately, your application was not approved.
                                </p>
                                {existingApp.adminNotes && (
                                    <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4 mb-6">
                                        <span className="font-medium">Admin notes:</span> {existingApp.adminNotes}
                                    </p>
                                )}
                                <Button
                                    onClick={() => setExistingApp(null)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                    Apply Again
                                </Button>
                            </>
                        )}
                        {existingApp.status === "approved" && (
                            <>
                                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">
                                    Congratulations!
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Your shop &quot;{existingApp.shopName}&quot; has been approved! Start adding your artworks.
                                </p>
                                <Button
                                    onClick={() => router.push("/shop/dashboard")}
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                    Go to My Shop <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </>
                        )}
                    </motion.div>
                </div>
            </div>
        );
    }

    // Application form
    return (
        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
            {/* Artistic Background */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-200/30 blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-200/20 blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 py-16 max-w-2xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="text-center mb-10">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-6">
                            <Sparkles className="h-8 w-8 text-purple-600" />
                        </div>
                        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">
                            Open Your Shop
                        </h1>
                        <p className="text-gray-600 text-lg max-w-md mx-auto">
                            Start selling your art to collectors around the world. Complete the form below to get started.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl space-y-6">
                            {/* Shop Name with live check */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Shop Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Input
                                        value={shopName}
                                        onChange={(e) => setShopName(e.target.value)}
                                        placeholder="e.g. Sunset Studios"
                                        className="pr-10 h-12"
                                        required
                                        minLength={2}
                                        maxLength={50}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <AnimatePresence mode="wait">
                                            {checkingName && (
                                                <motion.div key="checking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                                                </motion.div>
                                            )}
                                            {!checkingName && nameAvailable === true && (
                                                <motion.div key="available" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                </motion.div>
                                            )}
                                            {!checkingName && nameAvailable === false && (
                                                <motion.div key="taken" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                                                    <XCircle className="h-5 w-5 text-red-500" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                                {!checkingName && nameAvailable === false && (
                                    <p className="text-xs text-red-500">This name is already taken. Try another.</p>
                                )}
                                {!checkingName && nameAvailable === true && (
                                    <p className="text-xs text-green-600">Great, this name is available!</p>
                                )}
                                <p className="text-xs text-gray-400">Your unique shop name. This will be visible to all buyers.</p>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Shop Description <span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                    value={shopDescription}
                                    onChange={(e) => setShopDescription(e.target.value)}
                                    placeholder="Tell us about your art, your style, and what makes your work unique..."
                                    rows={4}
                                    className="resize-none"
                                    required
                                    minLength={10}
                                    maxLength={500}
                                />
                                <p className="text-xs text-gray-400">{shopDescription.length}/500 characters</p>
                            </div>

                            {/* Portfolio URL */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Portfolio URL <span className="text-gray-400 font-normal">(optional)</span>
                                </label>
                                <Input
                                    value={portfolioUrl}
                                    onChange={(e) => setPortfolioUrl(e.target.value)}
                                    placeholder="https://yourportfolio.com"
                                    type="url"
                                    className="h-12"
                                />
                                <p className="text-xs text-gray-400">Share a link to your existing portfolio or social media.</p>
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={submitting || !nameAvailable || !shopDescription || shopDescription.length < 10}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-base font-medium rounded-xl"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Store className="mr-2 h-4 w-4" />
                                            Submit Application
                                        </>
                                    )}
                                </Button>
                                <p className="text-xs text-center text-gray-400 mt-3">
                                    Applications are reviewed by our team and typically approved within 24 hours.
                                </p>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}

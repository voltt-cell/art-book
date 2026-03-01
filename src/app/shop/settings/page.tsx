"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { ArtisticLoader } from "@/components/ui/artistic-loader";
import { ArrowLeft, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import { useEffect } from "react";

export default function ShopSettingsPage() {
    const { user, hasShop, loading, refreshUser } = useAuth();
    const router = useRouter();

    const [shopName, setShopName] = useState("");
    const [debouncedShopName] = useDebounce(shopName, 500);
    const [nameAvailable, setNameAvailable] = useState<boolean | null>(null);
    const [checkingName, setCheckingName] = useState(false);
    const [saving, setSaving] = useState(false);
    const [initialized, setInitialized] = useState(false);

    if (user && hasShop && !initialized) {
        setShopName(user.shopName || "");
        setInitialized(true);
    }

    useEffect(() => {
        if (!debouncedShopName) {
            setNameAvailable(null);
            setCheckingName(false);
            return;
        }

        // If it's the same as their current name, obviously they can keep it
        if (user && debouncedShopName === user.shopName) {
            setNameAvailable(true);
            setCheckingName(false);
            return;
        }

        const checkName = async () => {
            setCheckingName(true);
            try {
                const res = await api.get<{ available: boolean }>(`/auth/check-shop?name=${encodeURIComponent(debouncedShopName)}`);
                setNameAvailable(res.available);
            } catch (error) {
                console.error("Failed to check name", error);
                setNameAvailable(null);
            } finally {
                setCheckingName(false);
            }
        };

        checkName();
    }, [debouncedShopName, user]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put("/auth/profile", { shopName });
            await refreshUser();
            toast.success("Shop settings updated!");
        } catch (error) {
            toast.error("Failed to update shop", {
                description: (error as Error).message,
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <ArtisticLoader fullScreen />;
    }

    if (!user || !hasShop) {
        router.push("/shop/apply");
        return null;
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-50">
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
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link href="/shop/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <h1 className="font-serif text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Store className="w-5 h-5 text-purple-600" />
                                Shop Settings
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-10 max-w-3xl relative z-10">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="bg-white/60 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 space-y-8"
                >
                    <div className="border-b border-white/50 pb-6">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-1">Storefront Customization</h2>
                        <p className="text-sm font-medium text-gray-500">Manage the public identity of your art shop.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Shop Display Name
                        </label>
                        <div className="relative max-w-lg">
                            <Input
                                value={shopName}
                                onChange={(e) => {
                                    setShopName(e.target.value);
                                    if (e.target.value !== debouncedShopName) {
                                        setCheckingName(true);
                                        setNameAvailable(null);
                                    }
                                }}
                                placeholder="e.g. Modern Canvas Studio"
                                className={`h-11 pr-12 transition-all duration-300 ${nameAvailable === false ? 'border-red-300 focus-visible:ring-red-500' :
                                    nameAvailable === true ? 'border-green-300 focus-visible:ring-green-500' : ''
                                    }`}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                                {checkingName ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-5 w-5">
                                        <div className="absolute top-0 right-0 h-5 w-5 rounded-full border-2 border-purple-200 border-t-purple-600 animate-spin" />
                                    </motion.div>
                                ) : nameAvailable === true ? (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-500">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.div>
                                ) : nameAvailable === false ? (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-red-500 opacity-80">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </motion.div>
                                ) : null}
                            </div>
                        </div>

                        <div className="h-6 mt-2">
                            {nameAvailable === false ? (
                                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-medium text-red-500">
                                    This shop name is already taken.
                                </motion.p>
                            ) : nameAvailable === true && user?.shopName !== debouncedShopName ? (
                                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-medium text-emerald-600">
                                    Beautiful! This name is available.
                                </motion.p>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    This is the identity buyers will see when viewing your masterpieces.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button
                            onClick={handleSave}
                            disabled={saving || nameAvailable === false}
                            className={`px-8 h-11 rounded-xl transition-all duration-300 ${nameAvailable === false
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                : "bg-purple-600 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/20 text-white"
                                }`}
                        >
                            {saving ? (
                                <>
                                    <div className="mr-2 h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                                    Saving...
                                </>
                            ) : "Save Gallery Settings"}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

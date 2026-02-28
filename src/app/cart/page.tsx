"use client";

import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/context/auth-context";
import { Loader2, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);

export default function CartPage() {
    const { cartItems, isLoading, removeFromCart, removingIds, checkout, checkoutLoading, total } = useCart();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [authLoading, isAuthenticated, router]);

    if (authLoading || isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20">
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center">
                    <ShoppingBag className="w-16 h-16 text-purple-200 mx-auto mb-4" />
                    <h2 className="text-xl font-serif font-semibold mb-2">
                        Your cart is empty
                    </h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        Looks like checking out art hasn&apos;t caught your eye yet?
                    </p>
                    <Link href="/artworks">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6">
                            Browse Artworks
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="container mx-auto px-4 pt-8 mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <Link href="/artworks" className="text-gray-500 hover:text-gray-900">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="font-serif text-3xl font-bold">Shopping Cart</h1>
                </div>
                <p className="text-gray-500 ml-9">
                    {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
                </p>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence mode="popLayout">
                            {cartItems.map((item) => (
                                <motion.div
                                    key={item.cartItemId}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center"
                                >
                                    {/* Image */}
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.artwork.imageUrl}
                                            alt={item.artwork.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-grow min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-lg leading-tight truncate pr-4">
                                                    {item.artwork.title}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {item.artist.profileImage ? (
                                                        <img
                                                            src={item.artist.profileImage}
                                                            alt={item.artist.name}
                                                            className="w-5 h-5 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-600">
                                                            {item.artist.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <span className="text-sm text-gray-500">{item.artist.name}</span>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1 capitalize">{item.artwork.listingType}</p>
                                            </div>
                                            <p className="font-bold text-lg">
                                                {formatPrice(parseFloat(item.artwork.price))}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-400 hover:text-red-500"
                                        onClick={() => removeFromCart(item.cartItemId)}
                                        disabled={removingIds.includes(item.cartItemId)}
                                    >
                                        {removingIds.includes(item.cartItemId) ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </Button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold mb-4">Summary</h2>
                            <div className="flex justify-between items-center mb-4 text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-6 text-gray-600">
                                <span>Tax</span>
                                <span className="text-xs text-gray-400">(Calculated at checkout)</span>
                            </div>
                            <div className="border-t pt-4 flex justify-between items-center mb-8">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-2xl font-bold text-purple-600">{formatPrice(total)}</span>
                            </div>

                            <Button
                                className="w-full bg-black hover:bg-gray-800 text-white py-6 text-lg"
                                onClick={() => checkout()}
                                disabled={checkoutLoading || cartItems.length === 0}
                            >
                                {checkoutLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                ) : (
                                    <ShoppingBag className="w-5 h-5 mr-2" />
                                )}
                                Checkout
                            </Button>

                            <p className="text-xs text-center text-gray-400 mt-4">
                                Secure checkout powered by Stripe
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

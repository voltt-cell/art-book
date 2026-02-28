"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { api } from "@/lib/api";

function CheckoutSuccessContent() {
    const searchParams = useSearchParams();
    const { clearCart } = useCart();
    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        if (sessionId) {
            clearCart();
            api.get(`/payments/verify-session?session_id=${sessionId}`)
                .catch(err => console.error("Verification failed", err));
        }
    }, [sessionId, clearCart]);

    if (!sessionId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Session</h1>
                    <Link href="/">
                        <Button>Return Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
            >
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                </div>

                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                    Payment Successful!
                </h2>
                <p className="text-gray-500 mb-8">
                    Thank you for your purchase. Your order has been confirmed and the artwork is now yours.
                </p>

                <div className="space-y-3">
                    <Link href="/buyer/dashboard">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 h-11 text-base">
                            View My Orders <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>

                    <Link href="/artworks">
                        <Button variant="outline" className="w-full h-11 text-base">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
        }>
            <CheckoutSuccessContent />
        </Suspense>
    );
}

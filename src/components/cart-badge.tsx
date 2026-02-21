"use client";

import { useCart } from "@/hooks/useCart";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

export function CartBadge() {
    const { cartItems } = useCart();
    const count = cartItems?.length || 0;

    return (
        <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative group">
                <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
                <AnimatePresence>
                    {count > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
                        >
                            {count}
                        </motion.span>
                    )}
                </AnimatePresence>
            </Button>
        </Link>
    );
}

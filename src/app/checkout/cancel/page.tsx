"use client";

import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fadeInUp } from "@/lib/animations";

export default function CheckoutCancelPage() {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="min-h-[60vh] flex items-center justify-center px-4"
        >
            <div className="text-center max-w-md">
                <XCircle className="h-16 w-16 text-red-400 mx-auto mb-6" />
                <h1 className="text-3xl font-serif font-bold mb-4">Payment Cancelled</h1>
                <p className="text-gray-600 mb-8">
                    Your payment was cancelled. No charges were made.
                </p>
                <Link href="/">
                    <Button className="bg-purple-600 hover:bg-purple-700">Back to Gallery</Button>
                </Link>
            </div>
        </motion.div>
    );
}

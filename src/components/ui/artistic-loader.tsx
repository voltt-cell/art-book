"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Palette } from "lucide-react";

const quotes = [
    { text: "Art washes away from the soul the dust of everyday life.", author: "Pablo Picasso" },
    { text: "I dream my painting and I paint my dream.", author: "Vincent van Gogh" },
    { text: "Every artist was first an amateur.", author: "Ralph Waldo Emerson" },
    { text: "Creativity takes courage.", author: "Henri Matisse" },
    { text: "To be an artist is to believe in life.", author: "Henry Moore" },
    { text: "The principles of true art is not to portray, but to evoke.", author: "Jerzy Kosinski" },
    { text: "A picture is a poem without words.", author: "Horace" },
    { text: "Art is the lie that enables us to realize the truth.", author: "Pablo Picasso" },
];

export function ArtisticLoader({ fullScreen = true }: { fullScreen?: boolean }) {
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
        }, 4000); // Change quote every 4 seconds

        return () => clearInterval(interval);
    }, []);

    const containerClasses = fullScreen
        ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xl"
        : "flex flex-col items-center justify-center w-full min-h-[400px]";

    return (
        <div className={containerClasses}>
            <div className="relative flex items-center justify-center w-24 h-24 mb-8">
                {/* Decorative rotating blobs */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-t-2 border-r-2 border-purple-500 opacity-30 blur-[2px]"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                    className="absolute inset-2 rounded-full border-b-2 border-l-2 border-pink-500 opacity-40 blur-[1px]"
                />
                {/* Central Icon */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="relative z-10 flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-full shadow-xl shadow-purple-500/30"
                >
                    <Palette className="w-8 h-8 text-white" />
                </motion.div>
            </div>

            <div className="h-24 w-full max-w-lg px-6 flex flex-col items-center justify-center text-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuoteIndex}
                        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col items-center"
                    >
                        <p className="text-xl md:text-2xl font-serif italic text-gray-800 bg-clip-text">
                            &quot;{quotes[currentQuoteIndex].text}&quot;
                        </p>
                        <p className="mt-3 text-sm font-medium tracking-widest uppercase text-purple-600/80">
                            — {quotes[currentQuoteIndex].author}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

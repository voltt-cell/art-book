"use client";

import { use, useState, useEffect } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    ShoppingBag,
    Gavel,
    Palette,
    Calendar,
    Tag,
    Pencil,
    ChevronLeft,
    ChevronRight,
    X,
    ZoomIn,
    Loader2,
    Clock,
    Users,
    Heart,
    ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/lib/swr";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { fadeInUp, fadeIn } from "@/lib/animations";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";

type ArtworkResponse = {
    id: string;
    title: string;
    artistId: string;
    description: string;
    price: string;
    medium: string;
    imageUrl: string;
    images: string[] | null;
    tags: string[] | null;
    dimensions: string | null;
    status: string;
    listingType: string;
    createdAt: string;
};

type ArtistResponse = {
    id: string;
    name: string;
    bio: string | null;
    profileImage: string | null;
    role: string;
};

type AuctionData = {
    auction: {
        id: string;
        artworkId: string;
        startTime: string;
        endTime: string;
        startingBid: string;
        currentBid: string | null;
        status: string;
    };
    bids: {
        id: string;
        amount: string;
        createdAt: string;
        bidderName: string;
        bidderId: string;
    }[];
};

const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);

function ArtworkDetailSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 pt-6">
                <Skeleton className="h-4 w-32" />
            </div>
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <Skeleton className="w-full h-[500px] rounded-2xl" />
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-3/4" />
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>
                        <Skeleton className="h-24 w-full rounded-xl" />
                        <Skeleton className="h-20 w-full" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-20 rounded-lg" />
                            <Skeleton className="h-20 rounded-lg" />
                            <Skeleton className="h-20 rounded-lg" />
                            <Skeleton className="h-20 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ArtworkDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [bidDialogOpen, setBidDialogOpen] = useState(false);
    const [bidAmount, setBidAmount] = useState("");
    const [bidLoading, setBidLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

    const { addToCart, isInCart, addingIds } = useCart();
    const { isFavorite, toggleFavorite, togglingId } = useFavorites();

    const { data: artwork, isLoading } = useSWR<ArtworkResponse>(
        `/artworks/${id}`,
        fetcher
    );

    const isAuctionType = artwork?.listingType === "auction";

    const { data: auctionData, mutate: mutateAuction } = useSWR<AuctionData>(
        isAuctionType ? `/auctions/artwork/${id}` : null,
        fetcher,
        { refreshInterval: 10000 }
    );

    // Countdown timer
    useEffect(() => {
        if (!auctionData?.auction?.endTime) return;

        const updateTimer = () => {
            const end = new Date(auctionData.auction.endTime).getTime();
            const now = Date.now();
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
                return;
            }

            setTimeLeft({
                d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                h: Math.floor((diff / (1000 * 60 * 60)) % 24),
                m: Math.floor((diff / (1000 * 60)) % 60),
                s: Math.floor((diff / 1000) % 60),
            });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [auctionData?.auction?.endTime]);

    const { data: artist } = useSWR<ArtistResponse>(
        artwork ? `/users/${artwork.artistId}` : null,
        fetcher
    );

    const isOwner = user?.id === artwork?.artistId;
    const isFav = isFavorite(id);
    const isTogglingFav = togglingId === id;
    const isAddedToCart = isInCart(id);
    const isAddingToCart = addingIds.includes(id);

    const allImages = artwork?.images?.length
        ? artwork.images
        : artwork?.imageUrl
            ? [artwork.imageUrl]
            : [];

    const handleBuyNow = async () => {
        if (!isAuthenticated) {
            toast.error("Please log in to purchase artwork");
            router.push("/login");
            return;
        }

        try {
            const res = await api.post<{ sessionUrl: string }>(
                "/payments/checkout",
                { artworkId: id }
            );
            window.location.href = res.sessionUrl;
        } catch (error) {
            toast.error("Purchase failed", {
                description: (error as Error).message,
            });
        }
    };

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            toast.error("Please log in to add to cart");
            router.push("/login");
            return;
        }
        addToCart(id);
    };

    const handleToggleFavorite = () => {
        if (!isAuthenticated) {
            toast.error("Please log in to manage favorites");
            router.push("/login");
            return;
        }
        if (artwork && artist) {
            toggleFavorite(
                id,
                {
                    id: artwork.id,
                    title: artwork.title,
                    imageUrl: artwork.imageUrl,
                    artistId: artwork.artistId,
                    price: artwork.price,
                    status: artwork.status,
                    medium: artwork.medium,
                    listingType: artwork.listingType,
                },
                {
                    id: artist.id,
                    name: artist.name,
                    profileImage: artist.profileImage,
                }
            );
        } else {
            // Fallback if data not fully loaded (shouldn't happen due to loading state)
            toggleFavorite(id);
        }
    };

    const handlePlaceBid = async () => {
        if (!isAuthenticated) {
            toast.error("Please log in to place a bid");
            router.push("/login");
            return;
        }
        const amount = parseFloat(bidAmount);
        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid bid amount");
            return;
        }
        setBidLoading(true);
        try {
            const res = await api.post<{ message: string; currentBid: number }>(
                `/auctions/artwork/${id}/bid`,
                { amount }
            );
            toast.success(res.message);
            setBidDialogOpen(false);
            setBidAmount("");
            // Refresh auction data to show updated bid
            mutateAuction();
        } catch (error) {
            toast.error("Bid failed", {
                description: (error as Error).message,
            });
        } finally {
            setBidLoading(false);
        }
    };

    const auctionEnded = timeLeft && timeLeft.d === 0 && timeLeft.h === 0 && timeLeft.m === 0 && timeLeft.s === 0;
    const livePrice = auctionData?.auction
        ? parseFloat(auctionData.auction.currentBid || auctionData.auction.startingBid)
        : null;

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const nextSlide = () =>
        setCurrentSlide((prev) => (prev + 1) % allImages.length);
    const prevSlide = () =>
        setCurrentSlide((prev) => (prev - 1 + allImages.length) % allImages.length);

    const nextLightbox = () =>
        setLightboxIndex((prev) => (prev + 1) % allImages.length);
    const prevLightbox = () =>
        setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

    if (isLoading) {
        return <ArtworkDetailSkeleton />;
    }

    if (!artwork) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-gray-500 text-lg">Artwork not found.</p>
                <Link href="/artworks">
                    <Button variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Artworks
                    </Button>
                </Link>
            </div>
        );
    }

    const price = parseFloat(artwork.price);
    const isAuction = artwork.listingType === "auction";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Back Navigation */}
            <div className="container mx-auto px-4 pt-6">
                <Link
                    href="/artworks"
                    className="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors text-sm"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Artworks
                </Link>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Slider */}
                    <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                        <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gray-100">
                            {/* Main image */}
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentSlide}
                                    src={allImages[currentSlide]}
                                    alt={`${artwork.title} - image ${currentSlide + 1}`}
                                    className="w-full h-auto max-h-[600px] object-contain cursor-zoom-in"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    onClick={() => openLightbox(currentSlide)}
                                />
                            </AnimatePresence>

                            {/* Zoom indicator */}
                            <button
                                onClick={() => openLightbox(currentSlide)}
                                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                            >
                                <ZoomIn className="w-4 h-4" />
                            </button>

                            {/* Badges */}
                            {isAuction && (
                                <div className="absolute top-4 left-4 bg-purple-600 text-white text-sm px-3 py-1 rounded-full font-medium">
                                    <Gavel className="w-3.5 h-3.5 inline mr-1" />
                                    Auction
                                </div>
                            )}
                            {artwork.status === "sold" && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <span className="text-white text-3xl font-serif font-bold tracking-wide bg-red-600/80 px-6 py-2 rounded-lg">
                                        SOLD
                                    </span>
                                </div>
                            )}

                            {/* Slider arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={prevSlide}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5 text-gray-700" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail strip */}
                        {allImages.length > 1 && (
                            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentSlide(idx)}
                                        className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${idx === currentSlide
                                            ? "border-purple-500 ring-2 ring-purple-200"
                                            : "border-transparent opacity-60 hover:opacity-100"
                                            }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="w-16 h-16 object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Details */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="flex flex-col"
                    >
                        <div className="flex items-start justify-between">
                            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
                                {artwork.title}
                            </h1>
                            <div className="flex items-center gap-2 ml-4">
                                {/* Favorite Button */}
                                {isOwner ? null : (
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleToggleFavorite}
                                        disabled={isTogglingFav}
                                        className={isFav ? "text-red-500 border-red-200 bg-red-50 hover:bg-red-100" : ""}
                                    >
                                        <Heart className={`w-5 h-5 ${isFav ? "fill-current" : ""}`} />
                                    </Button>
                                )}

                                {isOwner && (
                                    <Link href={`/artist/edit/${artwork.id}`}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                        >
                                            <Pencil className="w-3.5 h-3.5 mr-1" />
                                            Edit
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Artist Info */}
                        {artist && (
                            <Link
                                href={`/artist/${artist.id}`}
                                className="flex items-center gap-3 mb-6 group"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center overflow-hidden">
                                    {artist.profileImage ? (
                                        <img
                                            src={artist.profileImage}
                                            alt={artist.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-white font-medium text-sm">
                                            {artist.name.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium group-hover:text-purple-600 transition-colors">
                                        {artist.name}
                                    </p>
                                    <p className="text-xs text-gray-500">Artist</p>
                                </div>
                            </Link>
                        )}

                        {/* Price / Auction Panel */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                            {isAuction && timeLeft && (
                                <div className={`mb-4 p-3 rounded-lg ${auctionEnded ? 'bg-red-50 border border-red-200' : 'bg-purple-50 border border-purple-200'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className={`w-4 h-4 ${auctionEnded ? 'text-red-500' : 'text-purple-600'}`} />
                                        <span className={`text-sm font-medium ${auctionEnded ? 'text-red-600' : 'text-purple-700'}`}>
                                            {auctionEnded ? 'Auction Ended' : 'Time Remaining'}
                                        </span>
                                    </div>
                                    {!auctionEnded && (
                                        <div className="flex gap-2">
                                            {timeLeft.d > 0 && (
                                                <div className="bg-white rounded-lg px-3 py-2 text-center min-w-[50px] shadow-sm">
                                                    <p className="text-lg font-bold text-purple-700">{timeLeft.d}</p>
                                                    <p className="text-[10px] text-gray-500 uppercase">Days</p>
                                                </div>
                                            )}
                                            <div className="bg-white rounded-lg px-3 py-2 text-center min-w-[50px] shadow-sm">
                                                <p className="text-lg font-bold text-purple-700">{String(timeLeft.h).padStart(2, '0')}</p>
                                                <p className="text-[10px] text-gray-500 uppercase">Hrs</p>
                                            </div>
                                            <div className="bg-white rounded-lg px-3 py-2 text-center min-w-[50px] shadow-sm">
                                                <p className="text-lg font-bold text-purple-700">{String(timeLeft.m).padStart(2, '0')}</p>
                                                <p className="text-[10px] text-gray-500 uppercase">Min</p>
                                            </div>
                                            <div className="bg-white rounded-lg px-3 py-2 text-center min-w-[50px] shadow-sm">
                                                <p className="text-lg font-bold text-purple-700 tabular-nums">{String(timeLeft.s).padStart(2, '0')}</p>
                                                <p className="text-[10px] text-gray-500 uppercase">Sec</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">
                                        {isAuction ? 'Current Bid' : 'Price'}
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {formatPrice(isAuction && livePrice !== null ? livePrice : price)}
                                    </p>
                                    {isAuction && auctionData?.bids && auctionData.bids.length > 0 && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            {auctionData.bids.length} bid{auctionData.bids.length !== 1 ? 's' : ''} placed
                                        </p>
                                    )}
                                </div>
                                {!isOwner && artwork.status !== 'sold' && (
                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        {isAuction ? (
                                            <Button
                                                size="lg"
                                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                                disabled={!!auctionEnded}
                                                onClick={() => {
                                                    if (!isAuthenticated) {
                                                        toast.error('Please log in to place a bid');
                                                        router.push('/login');
                                                        return;
                                                    }
                                                    setBidDialogOpen(true);
                                                }}
                                            >
                                                <Gavel className="w-4 h-4 mr-2" />
                                                {auctionEnded ? 'Auction Ended' : 'Place Bid'}
                                            </Button>
                                        ) : (
                                            <>
                                                <Button
                                                    size="lg"
                                                    variant="outline"
                                                    onClick={handleAddToCart}
                                                    disabled={isAddedToCart || isAddingToCart}
                                                >
                                                    {isAddingToCart ? (
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                                    )}
                                                    {isAddedToCart ? "In Cart" : "Add to Cart"}
                                                </Button>
                                                <Button
                                                    size="lg"
                                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                                    onClick={handleBuyNow}
                                                >
                                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                                    Buy Now
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                )}
                                {isOwner && (
                                    <span className="text-sm text-gray-400 italic">
                                        Your Artwork
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Bid History — for auction artworks */}
                        {isAuction && auctionData?.bids && auctionData.bids.length > 0 && (
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-purple-600" />
                                    Bid History
                                </h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {auctionData.bids.map((bid, idx) => (
                                        <div
                                            key={bid.id}
                                            className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm ${idx === 0 ? 'bg-purple-50 border border-purple-100' : 'bg-gray-50'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center">
                                                    <span className="text-white text-[10px] font-medium">
                                                        {bid.bidderName.charAt(0)}
                                                    </span>
                                                </div>
                                                <span className="font-medium">{bid.bidderName}</span>
                                                {idx === 0 && (
                                                    <span className="text-[10px] bg-purple-600 text-white px-1.5 py-0.5 rounded-full">
                                                        Highest
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">{formatPrice(parseFloat(bid.amount))}</p>
                                                <p className="text-[10px] text-gray-400">
                                                    {new Date(bid.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div className="mb-6">
                            <h2 className="font-semibold text-lg mb-2">Description</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {artwork.description}
                            </p>
                        </div>

                        {/* Tags */}
                        {artwork.tags && artwork.tags.length > 0 && (
                            <div className="mb-6 flex flex-wrap gap-2">
                                {artwork.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg p-4 border border-gray-100">
                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                    <Palette className="w-4 h-4" />
                                    <span className="text-xs uppercase tracking-wide">
                                        Medium
                                    </span>
                                </div>
                                <p className="font-medium">{artwork.medium}</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-gray-100">
                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                    <Tag className="w-4 h-4" />
                                    <span className="text-xs uppercase tracking-wide">Type</span>
                                </div>
                                <p className="font-medium capitalize">
                                    {artwork.listingType === "fixed" ? "Fixed Price" : "Auction"}
                                </p>
                            </div>
                            {artwork.dimensions && (
                                <div className="bg-white rounded-lg p-4 border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <span className="text-xs uppercase tracking-wide">
                                            Dimensions
                                        </span>
                                    </div>
                                    <p className="font-medium">{artwork.dimensions}</p>
                                </div>
                            )}
                            <div className="bg-white rounded-lg p-4 border border-gray-100">
                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-xs uppercase tracking-wide">
                                        Listed
                                    </span>
                                </div>
                                <p className="font-medium">
                                    {new Date(artwork.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-gray-100">
                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                    <span className="text-xs uppercase tracking-wide">
                                        Status
                                    </span>
                                </div>
                                <p className="font-medium capitalize">{artwork.status}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Lightbox Dialog */}
            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
                <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none flex items-center justify-center">
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-4 right-4 z-50 text-white/80 hover:text-white bg-white/10 rounded-full p-2 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <AnimatePresence mode="wait">
                        <motion.img
                            key={lightboxIndex}
                            src={allImages[lightboxIndex]}
                            alt={`${artwork.title} - fullsize ${lightboxIndex + 1}`}
                            className="max-w-full max-h-[85vh] object-contain"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        />
                    </AnimatePresence>

                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={prevLightbox}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 text-white p-3 rounded-full hover:bg-white/20 transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextLightbox}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 text-white p-3 rounded-full hover:bg-white/20 transition-colors"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Image counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/50 px-3 py-1 rounded-full">
                        {lightboxIndex + 1} / {allImages.length}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Bid Dialog */}
            <Dialog open={bidDialogOpen} onOpenChange={setBidDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogTitle className="font-serif text-xl">Place a Bid</DialogTitle>
                    <div className="space-y-4 mt-2">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Current Bid</p>
                            <p className="text-2xl font-bold">{formatPrice(livePrice ?? price)}</p>
                        </div>
                        {timeLeft && !auctionEnded && (
                            <div className="flex items-center gap-2 text-sm text-purple-600">
                                <Clock className="w-4 h-4" />
                                <span>
                                    {timeLeft.d > 0 ? `${timeLeft.d}d ` : ''}
                                    {String(timeLeft.h).padStart(2, '0')}:{String(timeLeft.m).padStart(2, '0')}:{String(timeLeft.s).padStart(2, '0')} remaining
                                </span>
                            </div>
                        )}
                        <div>
                            <label htmlFor="bid-amount" className="text-sm font-medium block mb-1">
                                Your Bid (must be higher)
                            </label>
                            <Input
                                id="bid-amount"
                                type="number"
                                step="0.01"
                                min={((livePrice ?? price) + 0.01).toFixed(2)}
                                placeholder={`Min $${((livePrice ?? price) + 1).toFixed(2)}`}
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                className="text-lg"
                            />
                        </div>
                        <Button
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={handlePlaceBid}
                            disabled={bidLoading}
                        >
                            {bidLoading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Gavel className="w-4 h-4 mr-2" />
                            )}
                            {bidLoading ? "Placing Bid..." : `Place Bid${bidAmount ? ` — ${formatPrice(parseFloat(bidAmount) || 0)}` : ""}`}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

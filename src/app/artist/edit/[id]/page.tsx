"use client";

import { use, useState, useRef, useEffect } from "react";
import useSWR from "swr";
import { api } from "@/lib/api";
import { fetcher } from "@/lib/swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { Loader2, X, ImagePlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

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
};

export default function EditArtworkPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const { user, hasShop } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: artwork, isLoading } = useSWR<ArtworkResponse>(
        `/artworks/${id}`,
        fetcher
    );

    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [medium, setMedium] = useState("");
    const [dimensions, setDimensions] = useState("");
    const [listingType, setListingType] = useState("fixed");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [images, setImages] = useState<{ url: string; uploading: boolean }[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [initialized, setInitialized] = useState(false);

    // Populate form when artwork data loads
    useEffect(() => {
        if (artwork && !initialized) {
            setTitle(artwork.title);
            setDescription(artwork.description);
            setPrice(artwork.price);
            setMedium(artwork.medium);
            setDimensions(artwork.dimensions || "");
            setListingType(artwork.listingType);
            setTags(artwork.tags || []);
            setImages(
                (artwork.images || (artwork.imageUrl ? [artwork.imageUrl] : [])).map(
                    (url) => ({ url, uploading: false })
                )
            );
            setInitialized(true);
        }
    }, [artwork, initialized]);

    const addTag = () => {
        const trimmed = tagInput.trim().toLowerCase();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
        }
        setTagInput("");
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        for (const file of Array.from(files)) {
            setUploadingImage(true);
            try {
                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch(`${API_URL}/upload`, {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                });

                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.error || "Upload failed");
                }

                const { url } = await response.json();
                const fullUrl = `${API_URL}${url}`;
                setImages((prev) => [...prev, { url: fullUrl, uploading: false }]);
            } catch (error) {
                toast.error(`Failed to upload ${file.name}`, {
                    description: (error as Error).message,
                });
            }
        }
        setUploadingImage(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (images.length < 3) {
            toast.error("Please upload at least 3 images");
            return;
        }

        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }

        if (description.length < 10) {
            toast.error("Description must be at least 10 characters");
            return;
        }

        setLoading(true);
        try {
            await api.put(`/artworks/${id}`, {
                title,
                description,
                price: parseFloat(price) || 0,
                medium,
                images: images.map((img) => img.url),
                tags,
                dimensions: dimensions || undefined,
                listingType,
            });
            toast.success("Artwork updated successfully!");
            router.push(`/artwork/${id}`);
        } catch (error) {
            toast.error("Failed to update artwork", {
                description: (error as Error).message,
            });
        } finally {
            setLoading(false);
        }
    };

    if (!hasShop) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Only artists can edit artworks.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="container mx-auto py-10 px-4 max-w-2xl space-y-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        );
    }

    if (!artwork) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Artwork not found.</p>
            </div>
        );
    }

    if (artwork.artistId !== user?.id) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">You can only edit your own artworks.</p>
            </div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="container mx-auto py-10 px-4 max-w-2xl"
        >
            <Link
                href={`/artwork/${id}`}
                className="inline-flex items-center text-sm text-gray-500 hover:text-purple-600 mb-6"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Artwork
            </Link>

            <h1 className="text-3xl font-serif font-bold mb-8">Edit Artwork</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                    </label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Artwork Title"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                    </label>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your artwork (min 10 chars)"
                        rows={4}
                    />
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (USD) *
                    </label>
                    <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                {/* Medium */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Medium *
                    </label>
                    <Input
                        value={medium}
                        onChange={(e) => setMedium(e.target.value)}
                        placeholder="e.g., Oil on Canvas, Digital, Photography"
                        required
                    />
                </div>

                {/* Dimensions */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dimensions
                    </label>
                    <Input
                        value={dimensions}
                        onChange={(e) => setDimensions(e.target.value)}
                        placeholder='e.g., 24" x 36"'
                    />
                </div>

                {/* Listing Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Listing Type
                    </label>
                    <RadioGroup
                        value={listingType}
                        onValueChange={setListingType}
                        className="flex gap-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fixed" id="edit-fixed" />
                            <label htmlFor="edit-fixed" className="text-sm">
                                Fixed Price
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="auction" id="edit-auction" />
                            <label htmlFor="edit-auction" className="text-sm">
                                Auction
                            </label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags
                    </label>
                    <div className="flex gap-2 mb-2 flex-wrap">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-full"
                            >
                                #{tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="ml-1 hover:text-purple-900"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                    <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder="Type a tag and press Enter"
                    />
                </div>

                {/* Images */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Images * (min 3)
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200">
                                <img
                                    src={img.url}
                                    alt={`Image ${idx + 1}`}
                                    className="w-full h-24 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                                {idx === 0 && (
                                    <span className="absolute bottom-0 left-0 right-0 bg-purple-600 text-white text-[10px] text-center py-0.5">
                                        Cover
                                    </span>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                            className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-purple-400 hover:text-purple-500 transition-colors"
                        >
                            {uploadingImage ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <ImagePlus className="w-5 h-5 mb-1" />
                                    <span className="text-[10px]">Add</span>
                                </>
                            )}
                        </button>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                    <p className="text-xs text-gray-500">
                        {images.length} / 3 minimum images uploaded. First image is the cover.
                    </p>
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push(`/artwork/${id}`)}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </motion.div>
    );
}

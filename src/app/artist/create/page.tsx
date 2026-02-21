"use client";

import { useState, useRef } from "react";
import { api } from "@/lib/api";
import { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { Loader2, X, ImagePlus, ArrowLeft } from "lucide-react";
import { ART_CATEGORIES, AUCTION_DURATIONS } from "@/lib/constants";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export default function CreateArtworkPage() {
    const router = useRouter();
    const { isArtist, user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [medium, setMedium] = useState(""); // This will now store the Category ID
    const [dimensions, setDimensions] = useState("");
    const [listingType, setListingType] = useState("fixed");
    const [auctionDuration, setAuctionDuration] = useState("60");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [images, setImages] = useState<{ url: string; uploading: boolean }[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false);

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

        if (!medium) {
            toast.error("Category is required");
            return;
        }

        setLoading(true);
        try {
            await api.post("/artworks", {
                title,
                description,
                price: parseFloat(price) || 0,
                medium, // Sending category ID as medium
                images: images.map((img) => img.url),
                tags,
                dimensions: dimensions || undefined,
                listingType,
                ...(listingType === "auction" ? { auctionDurationMinutes: parseInt(auctionDuration) } : {}),
            });
            mutate(`/artworks?artistId=${user?.id}`);
            toast.success("Artwork published!", {
                description: "Your masterpiece is now live.",
            });
            router.push("/artist/dashboard");
        } catch (error: any) {
            let msg = error.message;
            if (error.response?.data?.error) {
                msg = JSON.stringify(error.response.data.error);
            }
            toast.error("Failed to create artwork", {
                description: msg,
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isArtist) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-xl font-bold text-gray-900">Artist Access Required</h1>
                    <p className="text-gray-500 mt-2">Only verified artists can publish artworks.</p>
                    <Link href="/">
                        <Button className="mt-4">Return Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-50">
            {/* Left Side - Inspirational Image */}
            <div className="hidden lg:block w-5/12 relative bg-gray-900 border-r border-gray-200">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2545&auto=format&fit=crop"
                    alt="Artistic Workspace"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute bottom-12 left-12 z-20 text-white max-w-md">
                    <h2 className="text-4xl font-serif font-bold mb-4">Share Your Vision</h2>
                    <p className="text-lg text-gray-200 leading-relaxed">
                        "Every artist was first an amateur. The more you paint, the more you become."
                    </p>
                    {/* <div className="mt-6 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full border-2 border-white/30 overflow-hidden">
                            <img src={user?.profileImage || ""} className="h-full w-full object-cover" />
                        </div>
                        <div>
                            <p className="font-medium">{user?.name}</p>
                            <p className="text-sm text-gray-400">Verified Artist</p>
                        </div>
                    </div> */}
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 overflow-y-auto h-[calc(100vh-64px)]">
                <div className="max-w-2xl mx-auto py-12 px-6 lg:px-12">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                    </button>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                            Publish New Artwork
                        </h1>
                        <p className="text-gray-500 mb-8">
                            Fill in the details to list your artwork for sale or auction.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Detailed Info Section */}
                            <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Artwork Details</h3>

                                {/* Title */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Sunset in Tuscany"
                                        className="h-11"
                                        required
                                    />
                                </div>

                                {/* Category (Medium) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
                                        <Select value={medium} onValueChange={setMedium} required>
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ART_CATEGORIES.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Dimensions</label>
                                        <Input
                                            value={dimensions}
                                            onChange={(e) => setDimensions(e.target.value)}
                                            placeholder="e.g. 24x36 inches"
                                            className="h-11"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                                    <Textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Tell the story behind your artwork..."
                                        rows={4}
                                        className="resize-none"
                                        required
                                    />
                                </div>

                                {/* Tags */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Tags</label>
                                    <div className="flex flex-wrap gap-2 mb-2 p-2 min-h-[44px] bg-gray-50 rounded-md border border-gray-200">
                                        {tags.length === 0 && <span className="text-gray-400 text-sm italic py-1">No tags added</span>}
                                        {tags.map((tag) => (
                                            <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-purple-700 border border-purple-100 text-xs font-medium shadow-sm">
                                                #{tag}
                                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Input
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={handleTagKeyDown}
                                            placeholder="Add tag and press Enter"
                                            className="h-10"
                                        />
                                        <Button type="button" variant="secondary" onClick={addTag}>Add</Button>
                                    </div>
                                </div>
                            </div>


                            {/* Media Section */}
                            <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Visuals</h3>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Upload Images <span className="text-red-500">*</span> <span className="text-gray-400 font-normal text-xs ml-1">(Min 3 required)</span>
                                    </label>

                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                        {images.map((img, index) => (
                                            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                                <img src={img.url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                                {index === 0 && (
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-1 text-center font-medium backdrop-blur-sm">
                                                        Cover Image
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploadingImage}
                                            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer group"
                                        >
                                            {uploadingImage ? (
                                                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                                            ) : (
                                                <>
                                                    <div className="p-2 bg-gray-100 rounded-full group-hover:bg-purple-100 transition-colors">
                                                        <ImagePlus className="w-5 h-5 text-gray-500 group-hover:text-purple-600" />
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-500 group-hover:text-purple-600">Add Image</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                                </div>
                            </div>


                            {/* Pricing & Listing Section */}
                            <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Listing Details</h3>

                                <div className="space-y-4">
                                    <label className="text-sm font-medium text-gray-700">Listing Type</label>
                                    <RadioGroup value={listingType} onValueChange={setListingType} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className={`relative flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all ${listingType === 'fixed' ? 'border-purple-600 bg-purple-50 ring-1 ring-purple-600' : 'border-gray-200 hover:border-purple-200'}`}>
                                            <RadioGroupItem value="fixed" id="fixed" />
                                            <label htmlFor="fixed" className="flex-1 cursor-pointer font-medium text-sm text-gray-900">
                                                Fixed Price
                                                <span className="block text-xs text-gray-500 font-normal mt-0.5">Instant purchase for a set amount</span>
                                            </label>
                                        </div>
                                        <div className={`relative flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all ${listingType === 'auction' ? 'border-purple-600 bg-purple-50 ring-1 ring-purple-600' : 'border-gray-200 hover:border-purple-200'}`}>
                                            <RadioGroupItem value="auction" id="auction" />
                                            <label htmlFor="auction" className="flex-1 cursor-pointer font-medium text-sm text-gray-900">
                                                Auction
                                                <span className="block text-xs text-gray-500 font-normal mt-0.5">Bidding war for a set duration</span>
                                            </label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            {listingType === "auction" ? "Starting Bid ($)" : "Price ($)"} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                            <Input
                                                type="number"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                                className="pl-8 h-11"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {listingType === "auction" && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Duration <span className="text-red-500">*</span></label>
                                            <Select value={auctionDuration} onValueChange={setAuctionDuration}>
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Select Duration" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {AUCTION_DURATIONS.map((dur) => (
                                                        <SelectItem key={dur.value} value={dur.value}>
                                                            {dur.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="pt-4 flex justify-end gap-4 pb-20">
                                <Button type="button" variant="ghost" onClick={() => router.back()} disabled={loading} className="h-12 px-6">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading || images.length < 3 || !title || !price || !medium}
                                    className="bg-gray-900 hover:bg-black text-white h-12 px-8 rounded-full text-base font-medium shadow-lg hover:shadow-xl transition-all"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                    {loading ? "Publishing..." : "Publish Artwork"}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { Loader2, Camera, User, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export default function SettingsPage() {
    const { user, isAuthenticated, loading, refreshUser, hasShop } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

    // Profile state
    const [name, setName] = useState("");
    const [shopName, setShopName] = useState("");
    const [bio, setBio] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [profileSaving, setProfileSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Password state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordSaving, setPasswordSaving] = useState(false);

    // Initialize form with user data
    const [initialized, setInitialized] = useState(false);
    if (user && !initialized) {
        setName(user.name);
        setShopName(user.shopName || "");
        setBio(user.bio || "");
        setProfileImage(user.profileImage || "");
        setInitialized(true);
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
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
            // Build full URL for the image
            const fullUrl = `${API_URL}${url}`;
            setProfileImage(fullUrl);
            toast.success("Image uploaded!");
        } catch (error) {
            toast.error("Upload failed", {
                description: (error as Error).message,
            });
        } finally {
            setUploading(false);
        }
    };

    const handleProfileSave = async () => {
        setProfileSaving(true);
        try {
            await api.put("/auth/profile", { name, bio, profileImage, shopName });
            await refreshUser();
            toast.success("Profile updated!");
        } catch (error) {
            toast.error("Failed to update profile", {
                description: (error as Error).message,
            });
        } finally {
            setProfileSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setPasswordSaving(true);
        try {
            await api.put("/auth/password", { currentPassword, newPassword });
            toast.success("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            toast.error("Failed to change password", {
                description: (error as Error).message,
            });
        } finally {
            setPasswordSaving(false);
        }
    };

    if (loading) {
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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-10 max-w-2xl">
                <motion.h1
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="font-serif text-3xl font-bold mb-8"
                >
                    Settings
                </motion.h1>

                {/* Tabs */}
                <div className="flex gap-2 mb-8">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "profile"
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                            }`}
                    >
                        <User className="w-4 h-4" />
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab("password")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "password"
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                            }`}
                    >
                        <Lock className="w-4 h-4" />
                        Password
                    </button>
                </div>

                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-6"
                    >
                        {/* Profile Image */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group">
                                <div className="w-28 h-28 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-purple-600 font-bold text-3xl">
                                            {name.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full shadow-md hover:bg-purple-700 transition-colors"
                                >
                                    {uploading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Camera className="w-4 h-4" />
                                    )}
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>
                            <p className="text-sm text-gray-500">
                                Click the camera icon to upload a new photo
                            </p>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your full name"
                            />
                        </div>

                        {/* Shop Name (Artists only) */}
                        {hasShop && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Shop Name
                                </label>
                                <Input
                                    value={shopName}
                                    onChange={(e) => setShopName(e.target.value)}
                                    placeholder="Your custom shop name (optional)"
                                />
                                <p className="text-xs text-gray-400 mt-1">If blank, your Name will be used on artworks.</p>
                            </div>
                        )}

                        {/* Email (read-only) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <Input value={user?.email || ""} disabled className="bg-gray-50" />
                            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bio
                            </label>
                            <Textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell us about yourself and your art..."
                                rows={4}
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button
                                onClick={handleProfileSave}
                                disabled={profileSaving}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                {profileSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Password Tab */}
                {activeTab === "password" && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-6"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Current Password
                            </label>
                            <Input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password (min 8 characters)"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm New Password
                            </label>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button
                                onClick={handlePasswordChange}
                                disabled={passwordSaving}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                {passwordSaving ? "Changing..." : "Change Password"}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

"use client";

import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";

export function AdminHeader() {
    const { user } = useAuth();
    const pathname = usePathname();

    const getPageTitle = () => {
        if (pathname === "/admin") return "Dashboard Overview";
        if (pathname?.startsWith("/admin/users")) return "User Management";
        if (pathname?.startsWith("/admin/artworks")) return "Artwork Management";
        if (pathname?.startsWith("/admin/applications")) return "Shop Applications";
        if (pathname?.startsWith("/admin/auctions")) return "Platform Auctions";
        if (pathname?.startsWith("/admin/orders")) return "Platform Orders";
        return "Admin Area";
    };

    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
            <div>
                <h1 className="text-lg font-serif font-semibold text-gray-800">{getPageTitle()}</h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-medium text-gray-900 leading-none">{user?.name}</p>
                        <p className="text-xs text-gray-500 mt-1 leading-none">{user?.email}</p>
                    </div>
                    <Avatar className="h-9 w-9 border border-gray-200 shadow-sm">
                        <AvatarImage src={user?.profileImage} alt={user?.name} />
                        <AvatarFallback className="bg-purple-100 text-purple-700 font-medium text-xs">
                            {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}

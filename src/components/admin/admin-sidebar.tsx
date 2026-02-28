"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Image, Store, Gavel, ShoppingCart, LogOut } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const sidebarLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Artworks", href: "/admin/artworks", icon: Image },
    { name: "Applications", href: "/admin/applications", icon: Store },
    { name: "Auctions", href: "/admin/auctions", icon: Gavel },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 flex flex-col z-40">
            <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
                <Link href="/admin" className="font-serif text-2xl font-bold text-gray-900 tracking-tight shrink-0 hover:opacity-80 transition-opacity">
                    ArtBook <span className="text-purple-600 text-sm font-sans uppercase tracking-widest ml-1">Admin</span>
                </Link>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href || (link.href !== "/admin" && pathname?.startsWith(link.href));
                    const Icon = link.icon;

                    return (
                        <Link key={link.name} href={link.href} className="block">
                            <div className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer group transition-colors ${isActive ? "text-purple-700 font-medium" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeAdminTab"
                                        className="absolute inset-0 bg-purple-50 rounded-xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <Icon className={`h-5 w-5 relative z-10 transition-colors ${isActive ? "text-purple-600" : "text-gray-400 group-hover:text-gray-600"}`} />
                                <span className="relative z-10 text-sm">{link.name}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100 shrink-0">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors cursor-pointer text-sm font-medium group"
                >
                    <LogOut className="h-5 w-5 text-red-400 group-hover:text-red-500 transition-colors" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}

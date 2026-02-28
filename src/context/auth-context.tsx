"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "@/lib/api";

export type User = {
    id: string;
    email: string;
    name: string;
    shopName?: string;
    role: "artist" | "buyer" | "admin";
    bio?: string;
    profileImage?: string;
    hasShop?: boolean;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<User>;
    signup: (data: { email: string; password: string; name: string }) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    isAuthenticated: boolean;
    hasShop: boolean;
    isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // On mount: check if user is already logged in via cookie
    useEffect(() => {
        if (typeof window !== "undefined") {
            checkAuth();
        } else {
            setLoading(false);
        }
    }, []);

    async function checkAuth() {
        try {
            const res = await api.get<{ user: User }>("/auth/me");
            setUser(res.user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function login(email: string, password: string): Promise<User> {
        const res = await api.post<{ token: string; user: User }>("/auth/login", { email, password });
        setUser(res.user);
        return res.user;
    }

    async function signup(data: { email: string; password: string; name: string }) {
        await api.post("/auth/signup", data);
        // Auto-login after signup
        await login(data.email, data.password);
    }

    async function logout() {
        await api.post("/auth/logout", {});
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                signup,
                logout,
                refreshUser: checkAuth,
                isAuthenticated: !!user,
                hasShop: user?.hasShop === true || user?.role === "artist",
                isAdmin: user?.role === "admin",
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

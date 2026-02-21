"use client";

import { AuthProvider } from "@/context/auth-context";


/**
 * Client-side providers wrapper.
 * This component is marked "use client" so it only runs in the browser.
 * The root layout (server component) renders this to provide client context.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            {children}

        </AuthProvider>
    );
}

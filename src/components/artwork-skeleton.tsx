"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ArtworkSkeleton() {
    return (
        <div className="rounded-xl overflow-hidden">
            <Skeleton className="w-full h-80 rounded-lg" />
            <div className="mt-3 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between items-center mt-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-8 w-20 rounded-md" />
                </div>
            </div>
        </div>
    );
}

export function ArtworkSkeletonGrid({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ArtworkSkeleton key={i} />
            ))}
        </div>
    );
}

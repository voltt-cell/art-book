"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ArtistSkeleton() {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
                <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mt-1" />
        </div>
    );
}

export function ArtistSkeletonGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ArtistSkeleton key={i} />
            ))}
        </div>
    );
}

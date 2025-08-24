import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function Banner() {
  return (
    <section className="relative h-[80vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auhref=format&fit=crop&w=2458&q=80')",
          filter: "brightness(0.85)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>

      <div className="container mx-auto h-full flex items-center relative z-10">
        <div className="max-w-2xl">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Discover and Collect Extraordinary Art
          </h1>
          <p className="text-gray-200 text-lg mb-8">
            Explore our curated collection of unique artworks from established
            and emerging artists around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-purple-500 hover:bg-purple-600"
              asChild
            >
              <Link href="/artworks">Explore Artworks</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 text-white hover:text-white hover:bg-white/20 border-white/20"
              asChild
            >
              <Link href="/auctions">View Active Auctions</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;

import { Button } from "@/components/ui/button";
import React from "react";

function JoinCommunity() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
          Join Our Art Community
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-8">
          Whether you're an artist looking to showcase your work or a collector
          in search of unique pieces, become part of our growing community of
          art enthusiasts.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            className="bg-purple-500 hover:bg-purple-600 cursor-pointer"
          >
            Join as Artist
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent text-white hover:bg-white/10 border-white cursor-pointer hover:text-white"
          >
            Join as Collector
          </Button>
        </div>
      </div>
    </section>
  );
}

export default JoinCommunity;

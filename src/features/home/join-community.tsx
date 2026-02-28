import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";

function JoinCommunity() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
          Join Our Art Community
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-8">
          Discover extraordinary art, connect with creators, and build your
          collection. Want to sell your art? You can open a shop anytime
          after joining.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-purple-500 hover:bg-purple-600 cursor-pointer"
            >
              Join the Community
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default JoinCommunity;

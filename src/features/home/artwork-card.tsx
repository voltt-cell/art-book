import { formatPrice } from "@/data/mockData";
import { Clock } from "lucide-react";
import type { Artwork, Artist } from "@/data/mockData";
import Link from "next/link";

interface ArtworkCardProps {
  artwork: Artwork;
  artist: Artist;
}

const ArtworkCard = ({ artwork, artist }: ArtworkCardProps) => {
  // Calculate days remaining for auction
  const getDaysRemaining = (endDate: Date): number => {
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="artwork-card group">
      <div className="relative overflow-hidden rounded-lg">
        <Link href={`/artwork/${artwork.id}`}>
          <img
            src={artwork.image}
            alt={artwork.title}
            className="w-full h-80 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-gallery-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
            {artwork.isAuction && artwork.auctionEndDate && (
              <div className="absolute top-4 right-4 bg-gallery-black/80 text-white text-xs py-1 px-2 rounded-full flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>
                  {getDaysRemaining(artwork.auctionEndDate)} days left
                </span>
              </div>
            )}
          </div>
        </Link>
      </div>

      <div className="mt-3">
        <Link href={`/artwork/${artwork.id}`} className="block">
          <h3 className="font-serif text-lg font-medium">{artwork.title}</h3>
        </Link>
        <Link
          href={`/artist/${artist.id}`}
          className="text-gallery-gray hover:text-gallery-black transition-colors"
        >
          {artist.name}
        </Link>
        <div className="flex justify-between items-center mt-2">
          <div>
            {artwork.isAuction ? (
              <div>
                <p className="font-medium">
                  {formatPrice(artwork.currentBid || 0)}
                </p>
                <p className="text-xs text-gallery-gray">Current Bid</p>
              </div>
            ) : (
              <p className="font-medium">{formatPrice(artwork.price)}</p>
            )}
          </div>
          {artwork.isAuction ? (
            <Link
              href={`/artwork/${artwork.id}`}
              className="text-sm font-medium text-gallery-accent hover:underline"
            >
              Place Bid
            </Link>
          ) : (
            <Link
              href={`/artwork/${artwork.id}`}
              className="text-sm font-medium text-gallery-accent hover:underline"
            >
              Buy Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;

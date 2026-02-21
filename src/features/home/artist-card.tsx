import Link from "next/link";

interface ArtistCardProps {
  artist: {
    id: string;
    name: string;
    shopName?: string | null;
    location?: string;
    followers?: number;
    profileImage: string | null;
  };
}

const ArtistCard = ({ artist }: ArtistCardProps) => {

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col items-center">
        <Link href={`/artist/${artist.id}`}>
          <img
            src={artist.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"}
            alt={artist.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
          />
        </Link>

        <div className="text-center mt-4">
          <Link href={`/artist/${artist.id}`}>
            <h3 className="font-serif text-lg font-medium">{artist.shopName || artist.name}</h3>
          </Link>
          <p className="text-xs text-gallery-gray font-medium">
            {(artist.followers || 0).toLocaleString()} Followers
          </p>

          <Link
            href={`/artist/${artist.id}`}
            className="mt-4 block text-sm text-gallery-accent font-medium hover:underline"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;

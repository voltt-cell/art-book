import type { Artist } from "@/data/mockData";
import { getArtworksByArtistId } from "@/data/mockData";
import Link from "next/link";

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard = ({ artist }: ArtistCardProps) => {
  const artworks = getArtworksByArtistId(artist.id);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col items-center">
        <Link href={`/artist/${artist.id}`}>
          <img
            src={artist.profileImage}
            alt={artist.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
          />
        </Link>

        <div className="text-center mt-4">
          <Link href={`/artist/${artist.id}`}>
            <h3 className="font-serif text-lg font-medium">{artist.name}</h3>
          </Link>
          <p className="text-gallery-gray text-sm mb-3">{artist.location}</p>
          <p className="text-xs text-gallery-gray font-medium">
            {artist.followers.toLocaleString()} Followers • {artworks.length}{" "}
            Artworks
          </p>

          <div className="mt-4 flex justify-center gap-2">
            {artworks.slice(0, 3).map((artwork) => (
              <Link
                href={`/artwork/${artwork.id}`}
                key={artwork.id}
                className="block w-10 h-10"
              >
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-10 h-10 rounded-md object-cover"
                />
              </Link>
            ))}
            {artworks.length > 3 && (
              <Link
                href={`/artist/${artist.id}`}
                className="w-10 h-10 rounded-md bg-gallery-beige flex items-center justify-center text-xs font-medium"
              >
                +{artworks.length - 3}
              </Link>
            )}
          </div>

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

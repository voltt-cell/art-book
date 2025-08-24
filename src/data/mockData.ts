export interface Artist {
    id: string;
    name: string;
    bio: string;
    profileImage: string;
    location: string;
    followers: number;
  }
  
  export interface Artwork {
    id: string;
    title: string;
    artistId: string;
    image: string;
    price: number;
    medium: string;
    dimensions: string;
    year: number;
    description: string;
    isAuction: boolean;
    auctionEndDate?: Date;
    currentBid?: number;
    minimumBid?: number;
  }
  
  export const artists: Artist[] = [
    {
      id: "a1",
      name: "Elena Ramirez",
      bio: "Contemporary artist focusing on abstract expressionism with vibrant colors and bold strokes.",
      profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
      location: "Barcelona, Spain",
      followers: 1245,
    },
    {
      id: "a2",
      name: "Michael Chen",
      bio: "Digital artist exploring the intersection of technology and traditional art forms.",
      profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
      location: "Seoul, South Korea",
      followers: 982,
    },
    {
      id: "a3",
      name: "Amara Okafor",
      bio: "Sculptor and painter whose work explores themes of identity and cultural heritage.",
      profileImage: "https://randomuser.me/api/portraits/women/65.jpg",
      location: "Lagos, Nigeria",
      followers: 1534,
    },
    {
      id: "a4",
      name: "Julian Blake",
      bio: "Photographer and mixed media artist capturing urban landscapes and human emotions.",
      profileImage: "https://randomuser.me/api/portraits/men/55.jpg",
      location: "London, UK",
      followers: 873,
    },
  ];
  
  export const artworks: Artwork[] = [
    {
      id: "art1",
      title: "Vibrant Chaos",
      artistId: "a1",
      image: "https://images.unsplash.com/photo-1549887534-1541e9326642?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1365&q=80",
      price: 2800,
      medium: "Acrylic on Canvas",
      dimensions: "48 x 36 inches",
      year: 2022,
      description: "A vibrant exploration of color and emotion, capturing the chaotic beauty of life through bold strokes and dynamic composition.",
      isAuction: false
    },
    {
      id: "art2",
      title: "Digital Dreamscape",
      artistId: "a2",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
      price: 1500,
      medium: "Digital Art, Limited Print",
      dimensions: "24 x 36 inches",
      year: 2023,
      description: "A mesmerizing blend of traditional painting techniques and digital manipulation, creating a dreamlike landscape that bridges reality and imagination.",
      isAuction: false
    },
    {
      id: "art3",
      title: "Heritage Bonds",
      artistId: "a3",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3290&q=80",
      price: 3200,
      medium: "Mixed Media on Canvas",
      dimensions: "40 x 60 inches",
      year: 2021,
      description: "An exploration of cultural identity through symbolic imagery and traditional patterns, reimagined through a contemporary lens.",
      isAuction: true,
      auctionEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      currentBid: 3200,
      minimumBid: 3500
    },
    {
      id: "art4",
      title: "Urban Solitude",
      artistId: "a4",
      image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3456&q=80",
      price: 1800,
      medium: "Photography, Archival Print",
      dimensions: "30 x 40 inches",
      year: 2023,
      description: "A poignant capture of isolation within urban spaces, highlighting the beauty in solitary moments amidst bustling city life.",
      isAuction: false
    },
    {
      id: "art5",
      title: "Sunset Reflections",
      artistId: "a1",
      image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
      price: 2100,
      medium: "Oil on Canvas",
      dimensions: "36 x 48 inches",
      year: 2022,
      description: "A serene landscape capturing the magical moment when day transitions to night, with reflective water mirroring the vibrant sky.",
      isAuction: true,
      auctionEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      currentBid: 2100,
      minimumBid: 2300
    },
    {
      id: "art6",
      title: "Neon Existence",
      artistId: "a2",
      image: "https://images.unsplash.com/photo-1604871000636-074fa5117945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80",
      price: 1650,
      medium: "Digital Art, AR Experience",
      dimensions: "Variable",
      year: 2023,
      description: "An interactive digital piece that explores the boundaries between physical and virtual reality through vibrant neon visuals.",
      isAuction: false
    },
    {
      id: "art7",
      title: "Ancient Futures",
      artistId: "a3",
      image: "https://images.unsplash.com/photo-1616918580183-ae70a5ed093c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3278&q=80",
      price: 2950,
      medium: "Sculpture, Bronze and Wood",
      dimensions: "24 x 18 x 12 inches",
      year: 2021,
      description: "A sculptural piece that juxtaposes traditional craftsmanship with contemporary forms, suggesting a dialogue between past and future.",
      isAuction: false
    },
    {
      id: "art8",
      title: "Midnight Crossroads",
      artistId: "a4",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2458&q=80",
      price: 1950,
      medium: "Photography, Silver Gelatin Print",
      dimensions: "24 x 30 inches",
      year: 2022,
      description: "A haunting black and white capture of an urban intersection at midnight, exploring themes of decision and direction in life's journey.",
      isAuction: true,
      auctionEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      currentBid: 1950,
      minimumBid: 2100
    }
  ];
  
  export const getArtistById = (id: string): Artist | undefined => {
    return artists.find(artist => artist.id === id);
  };
  
  export const getArtworksByArtistId = (artistId: string): Artwork[] => {
    return artworks.filter(artwork => artwork.artistId === artistId);
  };
  
  export const getAuctionArtworks = (): Artwork[] => {
    return artworks.filter(artwork => artwork.isAuction);
  };
  
  export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
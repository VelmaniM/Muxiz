export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  audioUrl: string;
  duration: number; // in seconds
  genre: string;
  isLiked?: boolean;
  lyrics?: string[];
  gradient: [string, string];
}

export interface Playlist {
  id: string;
  title: string;
  subtitle: string;
  cover: string;
  tracks: Track[];
  followers: string;
}

// 0 Default Songs - Fresh App
export const MOCK_TRACKS: Track[] = [];

// Fresh Playlists - Only Newly Added playlist
export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'pl_newly_added',
    title: 'Newly Added',
    subtitle: 'Uploaded tracks & latest cloud additions',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
    tracks: [],
    followers: 'Updated live from Firestore DB'
  }
];

export const MOCK_GENRES = [
  { id: 'g_1', name: 'Pop', color: '#8D67AB', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80' },
  { id: 'g_2', name: 'Hip-Hop', color: '#BA5D07', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80' },
  { id: 'g_3', name: 'Lo-Fi Chill', color: '#E8115B', image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80' },
  { id: 'g_4', name: 'Synthwave', color: '#148A08', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80' },
  { id: 'g_5', name: 'Acoustic', color: '#509BF5', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80' },
  { id: 'g_6', name: 'EDM / Dance', color: '#B02897', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80' },
  { id: 'g_7', name: 'Jazz & Blues', color: '#1E3264', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80' },
  { id: 'g_8', name: 'Ambient Focus', color: '#7D4B32', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80' },
];

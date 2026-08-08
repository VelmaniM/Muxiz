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

// Preloaded Songs for Instant App Startup (Zero Loading Flicker)
export const INITIAL_PRELOADED_TRACKS: Track[] = [
  {
    id: 'track_1',
    title: 'Aadi Pona Aavani',
    artist: 'Gana Bala',
    album: 'Attakathi',
    artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=melody-of-nature-112702.mp3',
    duration: 281,
    genre: 'Gana',
    gradient: ['#1DB954', '#0B0C10'],
  },
  {
    id: 'track_2',
    title: 'Adatha Attamellam',
    artist: 'Karthik',
    album: 'Surya Vamsam',
    artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=summer-walk-15651.mp3',
    duration: 271,
    genre: 'Melody',
    gradient: ['#1DB954', '#0B0C10'],
  },
  {
    id: 'track_3',
    title: 'Aaathi Adi Aaathi',
    artist: 'Sadhika K R',
    album: 'Single',
    artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-intention-12099.mp3',
    duration: 164,
    genre: 'Folk',
    gradient: ['#1DB954', '#0B0C10'],
  },
  {
    id: 'track_4',
    title: 'A Love Blossoms',
    artist: 'G.V. Prakash Kumar & Navin Iyer',
    album: 'Raja Rani',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f7f458.mp3?filename=lofi-study-112191.mp3',
    duration: 88,
    genre: 'Instrumental',
    gradient: ['#1DB954', '#0B0C10'],
  },
  {
    id: 'track_5',
    title: 'A Life Full of Love Theme',
    artist: 'Anirudh Ravichander & The Chennai Strings',
    album: '3',
    artwork: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=ambient-piano-10781.mp3',
    duration: 116,
    genre: 'Theme',
    gradient: ['#1DB954', '#0B0C10'],
  },
  {
    id: 'track_6',
    title: '200 Goats',
    artist: 'G.V. Prakash Kumar',
    album: 'Captain Miller',
    artwork: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c26569116e.mp3?filename=classic-hip-hop-15941.mp3',
    duration: 280,
    genre: 'Soundtrack',
    gradient: ['#1DB954', '#0B0C10'],
  },
];

export const MOCK_TRACKS: Track[] = INITIAL_PRELOADED_TRACKS;

// Dedicated Playlists - Populated dynamically with preloaded tracks
export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'pl_newly_added',
    title: 'Newly Added',
    subtitle: 'Uploaded tracks & latest cloud additions',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
    tracks: INITIAL_PRELOADED_TRACKS,
    followers: 'Updated live from Cloud DB',
  },
  {
    id: 'pl_sai_abhyankkar',
    title: 'Sai Abhyankkar Mix',
    subtitle: 'Sai Abhyankkar, Anirudh Ravichander, G.V. Prakash',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    tracks: INITIAL_PRELOADED_TRACKS,
    followers: 'Database Tracks Only',
  },
  {
    id: 'pl_paruthiveeran',
    title: 'Paruthiveeran & Rural Folk',
    subtitle: 'Yuvan Shankar Raja, Ilaiyaraaja, Karthik Raja',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
    tracks: INITIAL_PRELOADED_TRACKS,
    followers: 'Database Tracks Only',
  },
  {
    id: 'pl_trending_tamil',
    title: 'Trending Now Tamil',
    subtitle: 'Anirudh, G.V. Prakash, A.R. Rahman',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    tracks: INITIAL_PRELOADED_TRACKS,
    followers: 'Database Tracks Only',
  },
  {
    id: 'pl_dc_soundtrack',
    title: 'DC Motion Picture Soundtrack',
    subtitle: 'Hans Zimmer, Danny Elfman, Junkie XL',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80',
    tracks: INITIAL_PRELOADED_TRACKS,
    followers: 'Database Tracks Only',
  },
  {
    id: 'pl_goindhamma',
    title: 'Goindhamma Hits',
    subtitle: 'Hiphop Tamizha, Anirudh, Santhosh Narayanan',
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80',
    tracks: INITIAL_PRELOADED_TRACKS,
    followers: 'Database Tracks Only',
  },
  {
    id: 'pl_pakka_local',
    title: 'Pakka Local Mass Beats',
    subtitle: 'Anirudh Ravichander, G.V. Prakash',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    tracks: INITIAL_PRELOADED_TRACKS,
    followers: 'Database Tracks Only',
  },
  {
    id: 'pl_sajanka',
    title: 'Sajanka Melodies',
    subtitle: 'Harris Jayaraj, A.R. Rahman, Yuvan',
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    tracks: INITIAL_PRELOADED_TRACKS,
    followers: 'Database Tracks Only',
  },
];

export const MOCK_GENRES = [
  { id: 'g1', name: 'Gana & Rural', color: '#8D67AB', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80' },
  { id: 'g2', name: 'Tamil Hits', color: '#E8115B', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80' },
  { id: 'g3', name: 'Melodies', color: '#BA5D07', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80' },
  { id: 'g4', name: 'Rock & Beats', color: '#E91429', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80' },
  { id: 'g5', name: 'Folk & Culture', color: '#608108', cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80' },
  { id: 'g6', name: 'Instrumental', color: '#DC5D9B', cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80' },
];

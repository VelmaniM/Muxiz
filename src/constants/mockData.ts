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

// Dedicated Rich Playlists - Each playlist card has its own unique page content
export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'pl_newly_added',
    title: 'Newly Added',
    subtitle: 'Uploaded tracks & latest cloud additions',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
    tracks: [],
    followers: 'Updated live from Cloud',
  },
  {
    id: 'pl_sai_abhyankkar',
    title: 'Sai Abhyankkar Mix',
    subtitle: 'Sai Abhyankkar, Anirudh Ravichander, G.V. Prakash',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    tracks: [
      {
        id: 'sai_1',
        title: 'Katchi Sera',
        artist: 'Sai Abhyankkar',
        album: 'Katchi Sera Single',
        artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=melody-of-nature-112702.mp3',
        duration: 215,
        genre: 'Tamil Pop',
        gradient: ['#1DB954', '#0B0C10'],
      },
      {
        id: 'sai_2',
        title: 'Aasa Kooda',
        artist: 'Sai Abhyankkar & Sai Smriti',
        album: 'Aasa Kooda Single',
        artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-10781.mp3',
        duration: 198,
        genre: 'Tamil Romance',
        gradient: ['#8D67AB', '#0B0C10'],
      },
    ],
    followers: '142,500 saves',
  },
  {
    id: 'pl_paruthiveeran',
    title: 'Paruthiveeran & Rural Folk',
    subtitle: 'Yuvan Shankar Raja, Ilaiyaraaja, Karthik Raja',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
    tracks: [
      {
        id: 'paru_1',
        title: 'Ayyayo Nenju',
        artist: 'Yuvan Shankar Raja, Shreya Ghoshal',
        album: 'Paruthiveeran',
        artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=melody-of-nature-112702.mp3',
        duration: 240,
        genre: 'Folk Romance',
        gradient: ['#BA5D07', '#0B0C10'],
      },
      {
        id: 'paru_2',
        title: 'Oor Oora Pathukittu',
        artist: 'Yuvan Shankar Raja, Madhumitha',
        album: 'Paruthiveeran',
        artwork: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-10781.mp3',
        duration: 220,
        genre: 'Rural Folk',
        gradient: ['#148A08', '#0B0C10'],
      },
    ],
    followers: '98,200 saves',
  },
  {
    id: 'pl_trending_tamil',
    title: 'Trending Now Tamil',
    subtitle: 'Anirudh, G.V. Prakash, A.R. Rahman',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    tracks: [
      {
        id: 'trend_1',
        title: 'Fear Song',
        artist: 'Anirudh Ravichander',
        album: 'Devara Tamil',
        artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=melody-of-nature-112702.mp3',
        duration: 210,
        genre: 'Action Beat',
        gradient: ['#E8115B', '#0B0C10'],
      },
    ],
    followers: '520,000 saves',
  },
  {
    id: 'pl_dc_soundtrack',
    title: 'DC Motion Picture Soundtrack',
    subtitle: 'Hans Zimmer, Danny Elfman, Junkie XL',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80',
    tracks: [
      {
        id: 'dc_1',
        title: 'The Dark Knight Main Theme',
        artist: 'Hans Zimmer & James Newton Howard',
        album: 'The Dark Knight',
        artwork: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-10781.mp3',
        duration: 310,
        genre: 'Cinematic Score',
        gradient: ['#1E3264', '#0B0C10'],
      },
    ],
    followers: '310,000 saves',
  },
  {
    id: 'pl_goindhamma',
    title: 'Meesaya Murukku & Hip Hop Tamizha',
    subtitle: 'Hip Hop Tamizha, Kaushik Krish, Sudharshan',
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80',
    tracks: [
      {
        id: 'hip_1',
        title: 'Vaadi Nee Vaa',
        artist: 'Hip Hop Tamizha',
        album: 'Meesaya Murukku',
        artwork: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=melody-of-nature-112702.mp3',
        duration: 205,
        genre: 'Tamil Youth Beats',
        gradient: ['#509BF5', '#0B0C10'],
      },
    ],
    followers: '240,000 saves',
  },
  {
    id: 'pl_pakka_local',
    title: 'Pakka Local Mass Beats',
    subtitle: 'Devi Sri Prasad, Anirudh, Thaman S',
    cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
    tracks: [
      {
        id: 'pakka_1',
        title: 'Pakka Local',
        artist: 'Devi Sri Prasad, Geetha Madhuri',
        album: 'Janatha Garage',
        artwork: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=melody-of-nature-112702.mp3',
        duration: 230,
        genre: 'Mass Kuthu',
        gradient: ['#B02897', '#0B0C10'],
      },
    ],
    followers: '185,000 saves',
  },
  {
    id: 'pl_sajanka',
    title: 'Sajanka Psy & Electronic',
    subtitle: 'Sajanka, Vini Vici, Astrix',
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    tracks: [
      {
        id: 'saj_1',
        title: 'Aleluya',
        artist: 'Sajanka',
        album: 'Psytrance Vol 1',
        artwork: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-10781.mp3',
        duration: 340,
        genre: 'Psytrance',
        gradient: ['#7D4B32', '#0B0C10'],
      },
    ],
    followers: '92,000 saves',
  },
  {
    id: 'pl_latest_dance',
    title: 'Latest Dance Tamil',
    subtitle: 'Anirudh Ravichander, Sai Abhyankkar, G.V. Prakash',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    tracks: [
      {
        id: 'dance_1',
        title: 'Spark',
        artist: 'Yuvan Shankar Raja, Vrusha Balu',
        album: 'GOAT',
        artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=melody-of-nature-112702.mp3',
        duration: 210,
        genre: 'Dance Beat',
        gradient: ['#1DB954', '#0B0C10'],
      },
    ],
    followers: '450,000 saves',
  },
  {
    id: 'pl_00s_dance',
    title: '00s Dance Tamil Nostalgia',
    subtitle: 'KK, Devi Sri Prasad, Harris Jayaraj, Vidyasagar',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
    tracks: [
      {
        id: '00s_1',
        title: 'Arjunar Villu',
        artist: 'Vidyasagar, Sukhwinder Singh',
        album: 'Ghilli',
        artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=melody-of-nature-112702.mp3',
        duration: 250,
        genre: '00s Dance',
        gradient: ['#BA5D07', '#0B0C10'],
      },
      {
        id: '00s_2',
        title: 'Appadipodu',
        artist: 'Vidyasagar, KK, Anuradha Sriram',
        album: 'Ghilli',
        artwork: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-10781.mp3',
        duration: 240,
        genre: '00s Dance',
        gradient: ['#E8115B', '#0B0C10'],
      },
    ],
    followers: '610,000 saves',
  },
  {
    id: 'pl_mass_intros',
    title: 'Mass Intros & BGM',
    subtitle: 'Anirudh Ravichander, A.R. Rahman, Yuvan Shankar Raja',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    tracks: [
      {
        id: 'mass_1',
        title: 'Hukum Tiger Ka Hukum',
        artist: 'Anirudh Ravichander',
        album: 'Jailer',
        artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=melody-of-nature-112702.mp3',
        duration: 200,
        genre: 'Mass BGM',
        gradient: ['#148A08', '#0B0C10'],
      },
    ],
    followers: '780,000 saves',
  },
  {
    id: 'pl_leo_master',
    title: 'Leo / Master Hits',
    subtitle: 'Anirudh Ravichander, Thalapathy Vijay',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80',
    tracks: [
      {
        id: 'leo_1',
        title: 'Naa Ready',
        artist: 'Anirudh Ravichander, Thalapathy Vijay',
        album: 'Leo',
        artwork: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=melody-of-nature-112702.mp3',
        duration: 245,
        genre: 'Tamil Action',
        gradient: ['#509BF5', '#0B0C10'],
      },
    ],
    followers: '920,000 saves',
  },
  {
    id: 'pl_vijay_hits',
    title: 'Thalapathy Vijay Hits',
    subtitle: 'Vidyasagar, Anirudh, A.R. Rahman, Harris Jayaraj',
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80',
    tracks: [
      {
        id: 'vijay_1',
        title: 'Whistle Podu',
        artist: 'Thalapathy Vijay, Yuvan Shankar Raja',
        album: 'GOAT',
        artwork: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-10781.mp3',
        duration: 235,
        genre: 'Tamil Commercial',
        gradient: ['#B02897', '#0B0C10'],
      },
    ],
    followers: '1,200,000 saves',
  },
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

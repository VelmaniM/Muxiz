import { fetchOfficialSpotifyArtwork } from './spotifyService';

export interface TrackMetadata {
  title: string;
  artist: string;
  album: string;
  genre: string;
  artwork: string;
  lyrics: string[];
}

/**
 * Clean title helper: removes movie name prefixes/suffixes and artist names from song title
 */
export const getCleanTitleOnly = (rawTitle: string, artistName?: string): string => {
  if (!rawTitle) return '';
  
  let cleaned = rawTitle
    .replace(/\s*\(From\s+["'].*?["']\)/gi, '')
    .replace(/\s*\(From\s+.*?\)/gi, '')
    .replace(/\s*\[From\s+.*?\]/gi, '')
    .replace(/\s*-\s*From\s+["'].*?["']/gi, '')
    .replace(/\s*-\s*From\s+.*/gi, '')
    .replace(/\s*from\s+["'].*?["']/gi, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\.[^/.]+$/, '')
    .replace(/320kbps|128kbps|masstamilan|isaimini|sensongs|starmusiq|kuttyweb|tamildada|tamiltunes|video song|full song|audio|official|tamil/gi, '')
    .trim();

  // If title contains "Title - Artist", extract purely the title part
  if (cleaned.includes('-')) {
    const parts = cleaned.split('-');
    cleaned = parts[0].trim();
  }

  // If artistName is provided and title contains artistName, remove artistName from title
  if (artistName && artistName.trim().length > 0) {
    const artistLower = artistName.trim().toLowerCase();
    if (cleaned.toLowerCase().includes(artistLower)) {
      cleaned = cleaned.replace(new RegExp(artistName.trim(), 'gi'), '').trim();
    }
  }

  cleaned = cleaned.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();

  return cleaned || rawTitle;
};

/**
 * Clean fallback album cover image if Spotify / iTunes search is unavailable
 */
const CLEAN_FALLBACK_ARTWORK = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80';

/**
 * Extract 100% Accurate Song Metadata & High-Res Official Cover Artwork from Spotify / iTunes
 */
export const extractAudioFileMetadata = async (fileName: string): Promise<TrackMetadata> => {
  // 1. Fetch exact high-res movie/album cover artwork & clean artist name from Spotify/iTunes Catalog
  const officialSpotifyData = await fetchOfficialSpotifyArtwork(fileName);

  if (officialSpotifyData && officialSpotifyData.artwork) {
    const cleanTitle = getCleanTitleOnly(officialSpotifyData.title, officialSpotifyData.artist);
    const cleanArtist = (officialSpotifyData.artist || 'Unknown Artist').trim();

    return {
      title: cleanTitle,
      artist: cleanArtist,
      album: officialSpotifyData.album,
      genre: officialSpotifyData.genre,
      artwork: officialSpotifyData.artwork,
      lyrics: [
        `${cleanTitle}`,
        `Artist: ${cleanArtist}`,
        `Album: ${officialSpotifyData.album}`,
        `Playing high-quality audio stream`,
      ],
    };
  }

  // 2. Standard filename parser fallback
  let cleanName = fileName.replace(/\.[^/.]+$/, '').trim();
  let artist = 'Unknown Artist';
  let title = cleanName;

  if (cleanName.includes('-')) {
    const parts = cleanName.split('-');
    if (parts.length >= 2) {
      title = parts[0].trim();
      artist = parts[1].trim();
    }
  }

  title = getCleanTitleOnly(title, artist);
  artist = artist.replace(/320kbps|128kbps|masstamilan|isaimini|sensongs|starmusiq|kuttyweb/gi, '').trim() || 'Unknown Artist';

  return {
    title,
    artist,
    album: 'Single',
    genre: 'Music',
    artwork: CLEAN_FALLBACK_ARTWORK,
    lyrics: [`${title}`, `Performed by ${artist}`],
  };
};

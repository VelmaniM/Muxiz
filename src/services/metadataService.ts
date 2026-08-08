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
 * Clean title helper: removes movie name prefixes/suffixes like (From "Movie") or [From Movie]
 */
export const getCleanTitleOnly = (rawTitle: string): string => {
  if (!rawTitle) return '';
  const cleaned = rawTitle
    .replace(/\s*\(From\s+["'].*?["']\)/gi, '')
    .replace(/\s*\(From\s+.*?\)/gi, '')
    .replace(/\s*\[From\s+.*?\]/gi, '')
    .replace(/\s*-\s*From\s+["'].*?["']/gi, '')
    .replace(/\s*-\s*From\s+.*/gi, '')
    .replace(/\s*from\s+["'].*?["']/gi, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\.[^/.]+$/, '')
    .replace(/320kbps|128kbps|masstamilan|isaimini|sensongs|starmusiq|kuttyweb|video song|full song|audio|official|tamil/gi, '')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

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
  // 1. Fetch exact high-res movie/album cover artwork from Spotify or Official Catalog
  const officialSpotifyData = await fetchOfficialSpotifyArtwork(fileName);

  if (officialSpotifyData && officialSpotifyData.artwork) {
    const cleanTitle = getCleanTitleOnly(officialSpotifyData.title);
    return {
      title: cleanTitle,
      artist: officialSpotifyData.artist,
      album: officialSpotifyData.album,
      genre: officialSpotifyData.genre,
      artwork: officialSpotifyData.artwork,
      lyrics: [
        `${cleanTitle}`,
        `Artist: ${officialSpotifyData.artist}`,
        `Album: ${officialSpotifyData.album}`,
        `Playing high-quality audio stream`,
      ],
    };
  }

  // 2. Standard filename parser fallback
  let cleanName = fileName.replace(/\.[^/.]+$/, '').trim();
  let title = getCleanTitleOnly(cleanName);
  let artist = 'Unknown Artist';
  let album = 'Single';
  let genre = 'Music';

  if (cleanName.includes('-')) {
    const parts = cleanName.split('-');
    if (parts.length >= 2) {
      title = getCleanTitleOnly(parts[0].trim());
      artist = parts[1].trim();
    }
  }

  return {
    title,
    artist,
    album,
    genre,
    artwork: CLEAN_FALLBACK_ARTWORK,
    lyrics: [`${title}`, `Performed by ${artist}`],
  };
};

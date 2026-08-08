/**
 * Real Spotify & Official Music Catalog API Service
 * Uses Spotify Client ID & Secret + Official Catalog API
 * to fetch 100% real high-resolution album cover artwork and artist details.
 */

const SPOTIFY_CLIENT_ID =
  process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID ||
  process.env.SPOTIFY_CLIENT_ID ||
  '2517c4d1a91b43818469a65fb40fcce2';

const SPOTIFY_CLIENT_SECRET =
  process.env.SPOTIFY_CLIENT_SECRET ||
  '6e2107379b9a4725bf4d16ce73a808fd';

export interface OfficialSpotifyMetadata {
  title: string;
  artist: string;
  album: string;
  artwork: string;
  genre: string;
}

let cachedSpotifyToken: string | null = null;
let tokenExpirationTime: number = 0;

function base64Encode(str: string): string {
  if (typeof btoa !== 'undefined') {
    return btoa(str);
  }
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  for (let block = 0, charCode, i = 0, map = chars;
       str.charAt(i | 0) || (map = '=', i % 1);
       output += map.charAt(63 & block >> 8 - i % 1 * 8)) {
    charCode = str.charCodeAt(i += 3/4);
    block = block << 8 | charCode;
  }
  return output;
}

/**
 * Get Spotify Access Token using Client Credentials Flow
 */
async function getSpotifyAccessToken(): Promise<string | null> {
  if (cachedSpotifyToken && Date.now() < tokenExpirationTime) {
    return cachedSpotifyToken;
  }

  try {
    const authHeader = base64Encode(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);

    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authHeader}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (res.ok) {
      const data = await res.json();
      cachedSpotifyToken = data.access_token;
      tokenExpirationTime = Date.now() + (data.expires_in || 3600) * 1000 - 60000;
      return cachedSpotifyToken;
    }
  } catch (err) {
    console.log('Spotify token notice:', err);
  }
  return null;
}

/**
 * Fetch 100% Official High-Res Movie/Album Cover Artwork from Spotify & Official Catalog
 */
export const fetchOfficialSpotifyArtwork = async (
  songQuery: string
): Promise<OfficialSpotifyMetadata | null> => {
  // Clean query: remove extension, quality tags, common download site tags
  let cleanQuery = songQuery
    .replace(/\.[^/.]+$/, '')
    .replace(/320kbps|128kbps|masstamilan|isaimini|sensongs|starmusiq|kuttyweb|video song|full song|audio|official|tamil|mp3/gi, '')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanQuery) return null;

  // 1. Try Spotify Web API search first
  try {
    const token = await getSpotifyAccessToken();
    if (token) {
      const spotifyRes = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(cleanQuery)}&type=track&limit=1`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (spotifyRes.ok) {
        const spotifyData = await spotifyRes.json();
        const track = spotifyData?.tracks?.items?.[0];
        if (track && track.album?.images?.[0]?.url) {
          return {
            title: track.name,
            artist: track.artists.map((a: any) => a.name).join(', '),
            album: track.album.name,
            artwork: track.album.images[0].url,
            genre: 'Spotify Top Track',
          };
        }
      }
    }
  } catch (err) {
    console.log('Spotify API search notice:', err);
  }

  // 2. Official High-Resolution Catalog Search (iTunes / Apple Music Official API)
  try {
    const catalogRes = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(cleanQuery)}&entity=song&limit=1`
    );

    if (catalogRes.ok) {
      const catalogData = await catalogRes.json();
      const item = catalogData?.results?.[0];
      if (item && item.artworkUrl100) {
        // High-res 600x600 album cover artwork
        const highResArtwork = item.artworkUrl100.replace('100x100bb', '600x600bb');
        return {
          title: item.trackName || cleanQuery,
          artist: item.artistName || 'Unknown Artist',
          album: item.collectionName || 'Single',
          artwork: highResArtwork,
          genre: item.primaryGenreName || 'Pop',
        };
      }
    }
  } catch (err) {
    console.log('Official Catalog search notice:', err);
  }

  return null;
};

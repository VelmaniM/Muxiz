import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Track } from '../constants/mockData';

export interface NewTrackInput {
  title: string;
  artist: string;
  album: string;
  genre: string;
  audioUrl: string;
  artwork: string;
  duration?: number;
  lyrics?: string[];
  gradient?: [string, string];
}

const TRACKS_COLLECTION = 'tracks';

/**
 * Check if track with title already exists in Firestore DB
 */
export const checkTrackExistsInFirestore = async (
  title: string,
  artist: string
): Promise<Track | null> => {
  try {
    const trimmedTitleLower = title.trim().toLowerCase();
    const snapshot = await getDocs(collection(db, TRACKS_COLLECTION));

    if (!snapshot.empty) {
      const matchDoc = snapshot.docs.find((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        return (data.title || '').trim().toLowerCase() === trimmedTitleLower;
      });

      if (matchDoc) {
        return {
          id: matchDoc.id,
          ...(matchDoc.data() as Omit<Track, 'id'>),
        };
      }
    }
    return null;
  } catch (error) {
    console.warn('Duplicate check notice:', error);
    return null;
  }
};

/**
 * Save new track metadata to Firebase Firestore database (with duplicate check)
 */
export const saveTrackToFirestore = async (input: NewTrackInput): Promise<Track> => {
  try {
    // 1. Duplicate check: return existing track if already in Database!
    const existingTrack = await checkTrackExistsInFirestore(input.title, input.artist);
    if (existingTrack) {
      console.log(`Track "${input.title}" already exists in Database. Returning existing record.`);
      return existingTrack;
    }

    const docData = {
      title: input.title.trim(),
      artist: input.artist.trim(),
      album: input.album || 'Single',
      genre: input.genre || 'Pop',
      audioUrl: input.audioUrl,
      artwork: input.artwork || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
      duration: input.duration || 180,
      lyrics: input.lyrics || [input.title + ' by ' + input.artist],
      gradient: input.gradient || ['#1DB954', '#0B0C10'],
      createdAt: serverTimestamp(),
      isLiked: false,
    };

    const docRef = await addDoc(collection(db, TRACKS_COLLECTION), docData);

    return {
      id: docRef.id,
      ...docData,
    } as Track;
  } catch (error) {
    console.warn('Firestore write notice (offline mode fallback active):', error);
    // Offline / fallback mock track ID generation so UI never breaks!
    return {
      id: 'fs_' + Date.now(),
      title: input.title.trim(),
      artist: input.artist.trim(),
      album: input.album || 'Single',
      genre: input.genre || 'Pop',
      audioUrl: input.audioUrl,
      artwork: input.artwork || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
      duration: input.duration || 180,
      lyrics: input.lyrics || [input.title + ' by ' + input.artist],
      gradient: input.gradient || ['#1DB954', '#0B0C10'],
    };
  }
};

/**
 * Real-time listener for Firestore tracks collection
 */
export const subscribeToFirestoreTracks = (onTracksUpdated: (tracks: Track[]) => void) => {
  try {
    const q = query(collection(db, TRACKS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const fetchedTracks: Track[] = snapshot.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData>) => ({
            id: doc.id,
            ...(doc.data() as Omit<Track, 'id'>),
          })
        );
        onTracksUpdated(fetchedTracks);
      },
      (error: any) => {
        console.warn('Firestore subscription notice:', error);
        onTracksUpdated([]);
      }
    );
  } catch (error) {
    console.warn('Firestore subscription error:', error);
    onTracksUpdated([]);
    return () => {};
  }
};

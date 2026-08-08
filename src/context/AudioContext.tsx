import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { MOCK_TRACKS, Track } from '../constants/mockData';
import { subscribeToFirestoreTracks } from '../services/trackService';

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  positionMillis: number;
  durationMillis: number;
  volume: number;
  isMuted: boolean;
  repeatMode: 'off' | 'all' | 'one';
  isShuffle: boolean;
  queue: Track[];
  queueIndex: number;
  likedTrackIds: Set<string>;
  equalizerPreset: string;
  playTrack: (track: Track, newQueue?: Track[]) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (positionMs: number) => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  toggleFavorite: (trackId: string) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setVolume: (val: number) => Promise<void>;
  setEqualizerPreset: (preset: string) => void;
  addNewTrackAndPlay: (track: Track) => Promise<void>;
  addToQueue: (track: Track) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [positionMillis, setPositionMillis] = useState<number>(0);
  const [durationMillis, setDurationMillis] = useState<number>(180000);
  const [volume, setVolumeState] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [queue, setQueue] = useState<Track[]>(MOCK_TRACKS);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set(['track_1', 'track_3', 'track_4', 'track_6']));
  const [equalizerPreset, setEqualizerPreset] = useState<string>('Spotify Signature');

  const soundRef = useRef<Audio.Sound | null>(null);
  const tickerRef = useRef<any>(null);

  // Configure Audio Mode & Real-time Firestore Tracks Subscription
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(err => console.log('Audio mode config:', err));

    // Subscribe to Firestore DB live uploads and prepend them to queue
    const unsubscribeFs = subscribeToFirestoreTracks((fsTracks) => {
      if (fsTracks && fsTracks.length > 0) {
        setQueue(prev => {
          const existingIds = new Set(prev.map(t => t.id));
          const newUnique = fsTracks.filter(t => !existingIds.has(t.id));
          return [...newUnique, ...prev];
        });
      }
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
      if (tickerRef.current) {
        clearInterval(tickerRef.current);
      }
      unsubscribeFs();
    };
  }, []);

  // Smooth position ticker when audio is playing
  useEffect(() => {
    if (isPlaying) {
      tickerRef.current = setInterval(() => {
        setPositionMillis(prev => {
          if (prev >= durationMillis) {
            nextTrack();
            return 0;
          }
          return prev + 200;
        });
      }, 200);
    } else {
      if (tickerRef.current) {
        clearInterval(tickerRef.current);
        tickerRef.current = null;
      }
    }
    return () => {
      if (tickerRef.current) {
        clearInterval(tickerRef.current);
      }
    };
  }, [isPlaying, durationMillis]);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    
    setIsPlaying(status.isPlaying);
    if (status.positionMillis !== undefined) {
      setPositionMillis(status.positionMillis);
    }
    if (status.durationMillis && status.durationMillis > 0) {
      setDurationMillis(status.durationMillis);
    }

    if (status.didJustFinish && !status.isLooping) {
      if (repeatMode === 'one') {
        seekTo(0).then(() => soundRef.current?.playAsync());
      } else {
        nextTrack();
      }
    }
  };

  const playTrack = async (track: Track, newQueue?: Track[]) => {
    try {
      // Optimistic instant UI update
      setCurrentTrack(track);
      setIsPlaying(true);
      setPositionMillis(0);
      setDurationMillis(track.duration ? track.duration * 1000 : 180000);

      if (newQueue) {
        setQueue(newQueue);
        const idx = newQueue.findIndex(t => t.id === track.id);
        setQueueIndex(idx >= 0 ? idx : 0);
      } else {
        const idx = queue.findIndex(t => t.id === track.id);
        if (idx >= 0) setQueueIndex(idx);
      }

      // Unload previous sound instance
      if (soundRef.current) {
        try {
          await soundRef.current.unloadAsync();
        } catch (e) {}
        soundRef.current = null;
        setSound(null);
      }

      // Create & start new sound instance
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.audioUrl },
        { shouldPlay: true, volume: volume },
        onPlaybackStatusUpdate
      );

      soundRef.current = newSound;
      setSound(newSound);
      setIsPlaying(true);
    } catch (error) {
      console.log('Audio playback notice (using instant player state):', error);
      setIsPlaying(true);
    }
  };

  // Instant Play/Pause Toggle
  const togglePlayPause = async () => {
    if (!currentTrack) {
      const defaultTrack = queue[0] || MOCK_TRACKS[0];
      await playTrack(defaultTrack);
      return;
    }

    const nextPlayState = !isPlaying;
    setIsPlaying(nextPlayState); // Immediate instant UI icon toggle

    if (soundRef.current) {
      try {
        if (nextPlayState) {
          await soundRef.current.playAsync();
        } else {
          await soundRef.current.pauseAsync();
        }
      } catch (err) {
        console.log('Playback toggle notice:', err);
      }
    }
  };

  const seekTo = async (positionMs: number) => {
    setPositionMillis(positionMs);
    if (soundRef.current) {
      try {
        await soundRef.current.setPositionAsync(positionMs);
      } catch (e) {}
    }
  };

  const nextTrack = async () => {
    const activeQueue = queue.length > 0 ? queue : MOCK_TRACKS;
    let currIdx = activeQueue.findIndex(t => t.id === currentTrack?.id);
    if (currIdx < 0) currIdx = 0;

    let nextIdx = currIdx + 1;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * activeQueue.length);
    } else if (nextIdx >= activeQueue.length) {
      nextIdx = 0;
    }

    const nextSong = activeQueue[nextIdx];
    setQueueIndex(nextIdx);
    await playTrack(nextSong);
  };

  const previousTrack = async () => {
    const activeQueue = queue.length > 0 ? queue : MOCK_TRACKS;
    if (positionMillis > 4000) {
      await seekTo(0);
      return;
    }

    let currIdx = activeQueue.findIndex(t => t.id === currentTrack?.id);
    if (currIdx < 0) currIdx = 0;

    let prevIdx = currIdx - 1;
    if (prevIdx < 0) {
      prevIdx = activeQueue.length - 1;
    }

    const prevSong = activeQueue[prevIdx];
    setQueueIndex(prevIdx);
    await playTrack(prevSong);
  };

  const toggleFavorite = (trackId: string) => {
    setLikedTrackIds(prev => {
      const updated = new Set(prev);
      if (updated.has(trackId)) {
        updated.delete(trackId);
      } else {
        updated.add(trackId);
      }
      return updated;
    });
  };

  const toggleShuffle = () => {
    setIsShuffle(prev => !prev);
  };

  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const setVolume = async (val: number) => {
    setVolumeState(val);
    if (soundRef.current) {
      try {
        await soundRef.current.setVolumeAsync(val);
      } catch (e) {}
    }
  };

  const addNewTrackAndPlay = async (track: Track) => {
    setQueue(prev => [track, ...prev]);
    await playTrack(track);
  };

  const addToQueue = (track: Track) => {
    setQueue(prev => [...prev, track]);
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        positionMillis,
        durationMillis,
        volume,
        isMuted,
        repeatMode,
        isShuffle,
        queue,
        queueIndex,
        likedTrackIds,
        equalizerPreset,
        playTrack,
        togglePlayPause,
        seekTo,
        nextTrack,
        previousTrack,
        toggleFavorite,
        toggleShuffle,
        toggleRepeat,
        setVolume,
        setEqualizerPreset,
        addNewTrackAndPlay,
        addToQueue,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

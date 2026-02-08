"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { AudioContextType, Track } from "@/types/audio-types";
import { myPlaylist } from "@/data/playlist";

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [tracks] = useState<Track[]>(myPlaylist);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [shuffle, setShuffle] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = tracks[currentTrackIndex] || null;

  // Stable function references using useCallback
  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const togglePlay = useCallback(() => setIsPlaying((prev) => !prev), []);
  const togglePlayPause = useCallback(() => setIsPlaying((prev) => !prev), []);
  const toggleShuffle = useCallback(() => setShuffle((prev) => !prev), []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // Wrap next in useCallback with proper dependencies
  const next = useCallback(() => {
    if (shuffle) {
      setCurrentTrackIndex((prevIndex) => {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * tracks.length);
        } while (randomIndex === prevIndex && tracks.length > 1);
        return randomIndex;
      });
    } else {
      setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
    }
  }, [shuffle, tracks.length]);

  const previous = useCallback(() => {
    setCurrentTrackIndex(
      (prevIndex) => (prevIndex - 1 + tracks.length) % tracks.length,
    );
  }, [tracks.length]);

  // Volume Change Handler
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Track Play/Pause Handler
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Track Change Handler - use ref to track if we need to auto-play
  const wasPlayingRef = useRef(false);

  useEffect(() => {
    wasPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const shouldAutoPlay = wasPlayingRef.current;

      // Reset time tracking via audio element events, not direct setState
      audioRef.current.src = currentTrack.src;
      audioRef.current.load();

      if (shouldAutoPlay) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex, currentTrack]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setCurrentTime(0); // Reset on new track load via event
    };

    const handleDurationChange = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      next();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [next]);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        shuffle,
        currentTime,
        duration,
        setVolume,
        play,
        pause,
        next,
        previous,
        togglePlay,
        togglePlayPause,
        toggleShuffle,
        seek,
        audioRef,
      }}
    >
      <audio
        ref={audioRef}
        preload="metadata"
        onError={(e) => {
          console.error("Audio error:", e);
          setIsPlaying(false);
        }}
      />
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudioContext must be used within an AudioProvider");
  }
  return context;
};

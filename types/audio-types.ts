import { RefObject } from "react";
import type { Playlist } from "@/lib/generated/prisma/client";

export interface AudioContextType {
  currentTrack: Playlist | null;
  isPlaying: boolean;
  volume: number;
  shuffle: boolean;
  currentTime: number;
  duration: number;
  setVolume: (volume: number) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  togglePlay: () => void;
  togglePlayPause: () => void;
  toggleShuffle: () => void;
  seek: (time: number) => void;
  audioRef: RefObject<HTMLAudioElement | null>;
}

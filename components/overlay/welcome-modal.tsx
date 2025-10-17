"use client";

import { useEffect, useRef, useState } from "react";
import { useAudioContext } from "@/components/ui/audio-context";
import { motion, AnimatePresence } from "framer-motion";
import { Music, VolumeX, Play, Pause } from "lucide-react";
import Image from "next/image";

export const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const { currentTrack, play, pause, next } = useAudioContext();

  // Show modal on every session (no localStorage)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Generate random number between 0-3 (or however many times you want to shuffle)
    const randomSkips = Math.floor(Math.random() * 5);
    for (let i = 0; i < randomSkips; i++) {
      next();
    }
  }, [next]);

  // Cleanup preview when modal closes
  useEffect(() => {
    if (!isOpen && isPreviewPlaying) {
      pause();
      setIsPreviewPlaying(false);
    }
  }, [isOpen, isPreviewPlaying, pause]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Handle preview play/pause
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const togglePreview = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPreviewPlaying) {
      pause();
      setIsPreviewPlaying(false);
    } else {
      play();
      setIsPreviewPlaying(true);
    }
  };

  useEffect(() => {
    if (isPreviewPlaying) {
      previewTimeoutRef.current = setTimeout(() => {
        pause();
        setIsPreviewPlaying(false);
      }, 10000);
    }

    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
        previewTimeoutRef.current = null;
      }
    };
  }, [isPreviewPlaying, pause]);

  // Handle user choice
  const handlePlayMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    play();
    setIsPreviewPlaying(false);
    setIsOpen(false);
  };

  const handleBrowseSilently = (e: React.MouseEvent) => {
    e.stopPropagation();
    pause();
    setIsPreviewPlaying(false);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-background/39 backdrop-blur-sm z-90"
            onClick={(e) => {
              e.stopPropagation();
              // Optionally prevent closing on backdrop click for important choice
              // setIsOpen(false);
            }}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[1000] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-background rounded-3xl shadow-2xl max-w-md w-full p-8 space-y-6 pointer-events-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="text-center space-y-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto w-20 h-20 bg-foreground/10 rounded-2xl flex items-center justify-center"
                >
                  <Music className="h-10 w-10 text-foreground" />
                </motion.div>

                <h2 className="text-2xl font-bold text-foreground font-comfortaa">
                  Welcome!👋
                </h2>

                <p className="text-foreground/80 text-sm font-work-sans">
                  Would you like to enjoy some music while exploring my
                  portfolio?
                </p>
              </div>

              {/* Music Preview */}
              {currentTrack && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-foreground/5 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center gap-4">
                    {/* Album Art / Disk Animation */}
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <motion.div
                        animate={isPreviewPlaying ? { rotate: 360 } : {}}
                        transition={{
                          duration: 3,
                          repeat: isPreviewPlaying ? Infinity : 0,
                          ease: "linear",
                        }}
                        className="w-full h-full"
                      >
                        <Image
                          src="/assets/music-disk.svg"
                          alt="Music Disk"
                          width={64}
                          height={64}
                          className="w-full h-full"
                        />
                      </motion.div>
                    </div>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold font-work-sans text-foreground truncate">
                        {currentTrack.title}
                      </h3>
                      <p className="text-xs font-work-sans text-foreground/60 truncate">
                        {currentTrack.artist}
                      </p>
                    </div>

                    {/* Preview Play Button */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={togglePreview}
                      className="p-3 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors cursor-pointer"
                      title={
                        isPreviewPlaying ? "Pause preview" : "Play preview"
                      }
                    >
                      {isPreviewPlaying ? (
                        <Pause className="h-4 w-4 text-foreground" />
                      ) : (
                        <Play className="h-4 w-4 text-foreground" />
                      )}
                    </motion.button>
                  </div>

                  {isPreviewPlaying && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 bg-blue-500 rounded-full"
                            animate={{ height: [4, 12, 4] }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-foreground/60">
                        Preview playing...
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlayMusic}
                  className="w-full py-4 px-6 bg-primary/45 hover:bg-foreground/75 text-foreground hover:text-background rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
                >
                  <Music className="h-5 w-5" />
                  Play Music
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBrowseSilently}
                  className="w-full py-4 px-6 bg-foreground/30 hover:bg-muted text-foreground rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <VolumeX className="h-5 w-5" />
                  Browse Silently
                </motion.button>
              </div>

              {/* Footer Note */}
              <p className="text-xs text-center text-foreground/50 font-work-sans">
                You can change this anytime in settings ⚙️
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

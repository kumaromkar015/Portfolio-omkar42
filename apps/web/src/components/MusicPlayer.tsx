"use client";

import React, { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { Music, Play, Pause, Volume2, VolumeX, Loader2, ChevronUp, ChevronDown } from "lucide-react";

interface Track {
  name: string;
  url: string;
}

const DEFAULT_TRACK: Track = {
  name: "Cyberpunk Ambient Loop",
  url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", // high quality premium ambient instrumental track
};

export default function MusicPlayer() {
  const [mounted, setMounted] = useState(false);
  const [playlist, setPlaylist] = useState<Track[]>([DEFAULT_TRACK]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2); // Default to a subtle 20%
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1. Fetch uploaded audio files from the database
  useEffect(() => {
    setMounted(true);
    
    // Load preference from localStorage
    const savedMusicEnabled = localStorage.getItem("musicEnabled");
    const savedVolume = localStorage.getItem("musicVolume");
    
    if (savedVolume) {
      setVolume(parseFloat(savedVolume));
    }
    
    if (savedMusicEnabled === "true") {
      setIsPlaying(true);
    }

    const fetchTracks = async () => {
      try {
        const res = await api.getMedia({ type: "audio", limit: 20 });
        if (res.media && res.media.length > 0) {
          const fetchedTracks = res.media.map((item: any) => ({
            name: item.originalFilename?.replace(/\.[^/.]+$/, "") || "Ambient Track",
            url: item.secureUrl,
          }));
          setPlaylist(fetchedTracks);
        }
      } catch (err) {
        console.error("Failed to load custom audio tracks:", err);
      }
    };
    
    fetchTracks();
  }, []);

  // 2. Initialize the Audio element
  useEffect(() => {
    if (!mounted) return;

    audioRef.current = new Audio(playlist[currentTrackIndex].url);
    audioRef.current.loop = true;
    audioRef.current.volume = isMuted ? 0 : volume;

    // Handle loading state
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleAudioError = () => {
      setIsLoading(false);
      setError("Audio load failed");
      setIsPlaying(false);
    };

    audioRef.current.addEventListener("loadstart", handleLoadStart);
    audioRef.current.addEventListener("canplay", handleCanPlay);
    audioRef.current.addEventListener("error", handleAudioError);

    // Try to play if isPlaying is true and user has interacted
    if (isPlaying) {
      playAudio();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("loadstart", handleLoadStart);
        audioRef.current.removeEventListener("canplay", handleCanPlay);
        audioRef.current.removeEventListener("error", handleAudioError);
        audioRef.current = null;
      }
    };
  }, [mounted, playlist, currentTrackIndex]);

  // 3. Sync state changes with the Audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // 4. Play audio safely handling browser autoplay policies
  const playAudio = () => {
    if (!audioRef.current) return;

    setError(null);
    const startPromise = audioRef.current.play();

    if (startPromise !== undefined) {
      startPromise
        .then(() => {
          setIsPlaying(true);
          localStorage.setItem("musicEnabled", "true");
        })
        .catch((err) => {
          console.warn("Autoplay blocked or audio failed. Waiting for user interaction.", err);
          setIsPlaying(false);
          
          // Setup a one-time click/scroll listener to start music on first user interaction
          const startOnInteraction = () => {
            if (audioRef.current) {
              audioRef.current.play()
                .then(() => {
                  setIsPlaying(true);
                  localStorage.setItem("musicEnabled", "true");
                })
                .catch((e) => console.error("Playback on interaction failed:", e));
            }
            window.removeEventListener("click", startOnInteraction);
            window.removeEventListener("keydown", startOnInteraction);
          };

          window.addEventListener("click", startOnInteraction);
          window.addEventListener("keydown", startOnInteraction);
        });
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      localStorage.setItem("musicEnabled", "false");
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0) setIsMuted(false);
    localStorage.setItem("musicVolume", String(val));
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const nextTrack = () => {
    if (playlist.length <= 1) return;
    setIsLoading(true);
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    if (playlist.length <= 1) return;
    setIsLoading(true);
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  if (!mounted) return null;

  const currentTrack = playlist[currentTrackIndex] || DEFAULT_TRACK;

  return (
    <div className="fixed bottom-6 right-6 z-[9998] font-sans">
      {isExpanded ? (
        // Expanded Panel
        <div className="w-64 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-white backdrop-blur-md shadow-2xl space-y-3.5 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900">
            <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-lime-400">
              <Music size={13} className="animate-spin-slow" /> Ambient Mode
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              <ChevronDown size={14} />
            </button>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Current Track</p>
            <p className="text-xs font-bold text-slate-200 truncate" title={currentTrack.name}>
              {currentTrack.name}
            </p>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {playlist.length > 1 && (
                <button
                  onClick={prevTrack}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-lime-400 cursor-pointer text-xs font-bold transition-all active:scale-95"
                >
                  ⏮
                </button>
              )}
              
              <button
                onClick={togglePlay}
                disabled={isLoading}
                className="p-2.5 rounded-xl bg-lime-600 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black font-extrabold transition-all active:scale-95 cursor-pointer shadow-md disabled:opacity-40"
              >
                {isLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : isPlaying ? (
                  <Pause size={14} fill="currentColor" />
                ) : (
                  <Play size={14} fill="currentColor" />
                )}
              </button>

              {playlist.length > 1 && (
                <button
                  onClick={nextTrack}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-lime-400 cursor-pointer text-xs font-bold transition-all active:scale-95"
                >
                  ⏭
                </button>
              )}
            </div>

            {/* Mute button */}
            <button
              onClick={toggleMute}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>

          {/* Volume slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-wider">
              <span>Volume</span>
              <span>{Math.round((isMuted ? 0 : volume) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-lime-400"
            />
          </div>

          {error && (
            <p className="text-[9px] font-bold uppercase tracking-wider text-rose-500 mt-1">
              Error: {error}
            </p>
          )}
        </div>
      ) : (
        // Collapsed Floating Button
        <button
          onClick={() => setIsExpanded(true)}
          className={`flex items-center justify-center w-12 h-12 rounded-full bg-slate-950/90 border border-slate-850 text-lime-400 hover:text-white dark:hover:text-lime-300 shadow-xl cursor-pointer hover:border-lime-500 transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(163,230,53,0.25)] ${
            isPlaying ? "animate-pulse" : ""
          }`}
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Music size={16} className={isPlaying ? "animate-spin-slow" : ""} />
          )}
        </button>
      )}
    </div>
  );
}

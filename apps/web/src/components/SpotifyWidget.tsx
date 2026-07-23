"use client";

import React, { useState } from "react";
import { Music, Volume2, VolumeX } from "lucide-react";

export default function SpotifyWidget() {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="glass border border-slate-800/80 rounded-xl p-3 flex items-center justify-between gap-4 max-w-xs shadow-lg">
      <div className="flex items-center gap-3">
        {/* Album Art mockup */}
        <div className="relative w-10 h-10 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-black font-bold shadow-md overflow-hidden flex-shrink-0">
          <Music size={18} className="text-slate-950 animate-pulse" />
        </div>
        
        {/* Track Details */}
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-white truncate">Clarity</span>
          <span className="text-[10px] text-slate-400 truncate">Zedd (ft. Foxes)</span>
        </div>
      </div>

      {/* Control / Music wave */}
      <div className="flex items-center gap-2">
        {isPlaying && (
          <div className="flex items-end gap-[2px] h-3 w-4">
            <span className="w-[3px] bg-emerald-500 rounded-full animate-[bounce_0.8s_infinite]" style={{ animationDelay: "0.1s" }} />
            <span className="w-[3px] bg-emerald-500 rounded-full animate-[bounce_0.8s_infinite]" style={{ animationDelay: "0.3s" }} />
            <span className="w-[3px] bg-emerald-500 rounded-full animate-[bounce_0.8s_infinite]" style={{ animationDelay: "0.2s" }} />
            <span className="w-[3px] bg-emerald-500 rounded-full animate-[bounce_0.8s_infinite]" style={{ animationDelay: "0.4s" }} />
          </div>
        )}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          title={isPlaying ? "Mute simulation" : "Unmute simulation"}
          aria-label={isPlaying ? "Mute music" : "Play music"}
        >
          {isPlaying ? <Volume2 size={16} className="text-emerald-400" /> : <VolumeX size={16} />}
        </button>
      </div>
    </div>
  );
}

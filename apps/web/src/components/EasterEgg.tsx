"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Terminal, X, Sparkles, Code2, AlertTriangle, ShieldCheck, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const JOKES = [
  "Why do programmers wear glasses? Because they can't C#.",
  "There are 10 types of people in the world: those who understand binary, and those who don't.",
  "A SQL query walks into a bar, walks up to two tables and asks, 'Can I join you?'",
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem."
];

export default function EasterEgg() {
  const [enabled, setEnabled] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [joke, setJoke] = useState("");
  const [logoClicks, setLogoClicks] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Key tracking states
  const konamiCode = [
    "ArrowUp", "ArrowUp", 
    "ArrowDown", "ArrowDown", 
    "ArrowLeft", "ArrowRight", 
    "ArrowLeft", "ArrowRight", 
    "b", "a"
  ];
  const [konamiIndex, setKonamiIndex] = useState(0);

  const secretWord = "devmode";
  const [typedChars, setTypedChars] = useState("");

  // 1. Fetch enabled preference from DB
  useEffect(() => {
    api.getSeo()
      .then((res) => {
        const global = res.global || {};
        setEnabled(global.enableEasterEgg !== false);
      })
      .catch(() => setEnabled(true));

    // Check motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // 2. Keyboard listeners
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Konami tracking
      if (e.key === konamiCode[konamiIndex]) {
        const nextIndex = konamiIndex + 1;
        if (nextIndex === konamiCode.length) {
          triggerEasterEgg();
          setKonamiIndex(0);
        } else {
          setKonamiIndex(nextIndex);
        }
      } else {
        setKonamiIndex(e.key === konamiCode[0] ? 1 : 0);
      }

      // Secret word tracking
      const nextTyped = (typedChars + e.key.toLowerCase()).slice(-secretWord.length);
      setTypedChars(nextTyped);
      if (nextTyped === secretWord) {
        triggerEasterEgg();
        setTypedChars("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, konamiIndex, typedChars]);

  // 3. Logo click listeners
  useEffect(() => {
    if (!enabled) return;

    const handleWindowClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Target elements matching logo identifiers
      const isLogo = target.closest(".logo") || target.closest(".navbar-logo") || target.textContent?.trim() === "OK";
      if (isLogo) {
        setLogoClicks((prev) => {
          const next = prev + 1;
          if (next >= 5) {
            triggerEasterEgg();
            return 0;
          }
          return next;
        });
      } else {
        setLogoClicks(0); // Reset if click elsewhere
      }
    };

    window.addEventListener("click", handleWindowClick);
    return () => window.removeEventListener("click", handleWindowClick);
  }, [enabled]);

  const triggerEasterEgg = () => {
    const randomJoke = JOKES[Math.floor(Math.random() * JOKES.length)];
    setJoke(randomJoke);
    setIsOpen(true);
  };

  if (!enabled) return null;

  const animationProps = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.9, y: 15 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: 15 }
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-hidden text-slate-200 font-mono">
          <motion.div
            {...animationProps}
            className="w-full max-w-lg bg-zinc-950 border border-lime-500/30 rounded-2xl shadow-[0_0_50px_rgba(132,204,22,0.15)] flex flex-col relative"
          >
            {/* Matrix style grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none rounded-2xl opacity-40" />

            {/* Header */}
            <div className="px-5 py-4 border-b border-lime-500/20 bg-zinc-900/60 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-2 text-lime-400">
                <Terminal size={18} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">DEVELOPER OVERLAY // DETECTED</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-slate-400 hover:text-lime-400 border border-lime-500/10 cursor-pointer"
                aria-label="Close overlay"
              >
                <X size={14} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6 relative z-10 text-xs">
              
              {/* Build Info */}
              <div className="p-4.5 rounded-xl bg-zinc-900/40 border border-zinc-850/80 space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                  <span>System Variable</span>
                  <span>Value</span>
                </div>
                <div className="border-t border-zinc-800/80 my-1.5" />
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">PORTFOLIO_VERSION</span>
                  <span className="text-lime-400 font-bold">v2.10.12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">BUILD_MODE</span>
                  <span className="text-cyan-400 font-bold">Production Compile</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">SECURITY_INTEGRITY</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1"><ShieldCheck size={12} /> Verified</span>
                </div>
              </div>

              {/* Dev Joke */}
              <div className="space-y-2">
                <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1.5">
                  <Code2 size={12} className="text-lime-500" /> Compiled Dev-Joke:
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/20 border border-lime-500/10 italic text-slate-350 leading-relaxed">
                  "{joke}"
                </div>
              </div>

              {/* Development note */}
              <div className="text-[10px] text-slate-500 flex items-center gap-2 justify-center leading-relaxed">
                <span>Made with</span>
                <Heart size={10} className="fill-rose-500 text-rose-500 animate-bounce" />
                <span>by Omkar & Antigravity AI Partner</span>
              </div>
            </div>

            {/* Footer console action */}
            <div className="px-5 py-3 border-t border-lime-500/10 bg-zinc-900/30 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded bg-lime-950/20 hover:bg-lime-500 hover:text-black border border-lime-500/30 text-lime-400 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close Terminal
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CustomCursor from "./CustomCursor";
import ScrollProgressBar from "./ScrollProgressBar";
import CommandPalette from "./CommandPalette";
import MusicPlayer from "./MusicPlayer";
import InteractiveBackground from "./InteractiveBackground";
import TerminalMode from "./TerminalMode";
import AIAssistant from "./AIAssistant";
import EasterEgg from "./EasterEgg";
import { useState, useEffect } from "react";

export default function LayoutClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  useEffect(() => {
    const handleToggleTerminal = () => setIsTerminalOpen((prev) => !prev);
    window.addEventListener("toggle-terminal", handleToggleTerminal);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("toggle-terminal", handleToggleTerminal);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (isAdmin) {
    return <div className="flex-grow flex flex-col">{children}</div>;
  }

  return (
    <>
      <ScrollProgressBar />
      <CustomCursor />
      <Navbar />
      <div className="flex-grow flex flex-col relative">{children}</div>
      <Footer />
      <CommandPalette />
      <MusicPlayer />
      <InteractiveBackground />
      <TerminalMode isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
      <AIAssistant />
      <EasterEgg />
    </>
  );
}

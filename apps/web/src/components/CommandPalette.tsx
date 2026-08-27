"use client";

import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { Search, Home, User, Code, Briefcase, Award, Rss, Mail, Sun, Moon, FileText } from "lucide-react";
import { GithubIcon } from "./BrandIcons";
import { motion, AnimatePresence } from "framer-motion";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { theme, setTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const actions = [
    { name: "Go to Home", icon: Home, action: () => scrollToSection("home"), category: "Navigation" },
    { name: "Go to About Me", icon: User, action: () => scrollToSection("about"), category: "Navigation" },
    { name: "Go to Skills", icon: Code, action: () => scrollToSection("skills"), category: "Navigation" },
    { name: "Go to Experience", icon: Briefcase, action: () => scrollToSection("experience"), category: "Navigation" },
    { name: "Go to Featured Projects", icon: Award, action: () => scrollToSection("projects"), category: "Navigation" },
    { name: "Go to Services", icon: FileText, action: () => scrollToSection("services"), category: "Navigation" },
    { name: "Go to Blog", icon: Rss, action: () => { window.location.href = "/blog"; }, category: "Navigation" },
    { name: "Go to Contact", icon: Mail, action: () => scrollToSection("contact"), category: "Navigation" },
    { name: "Toggle Dark Mode", icon: Moon, action: () => setTheme("dark"), category: "Preferences" },
    { name: "Toggle Light Mode", icon: Sun, action: () => setTheme("light"), category: "Preferences" },
    { name: "View GitHub Profile", icon: GithubIcon, action: () => window.open("https://github.com/kumaromkar015", "_blank"), category: "Socials" },
  ];

  const filteredActions = actions.filter((action) =>
    action.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setSearchQuery("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredActions[selectedIndex]) {
        filteredActions[selectedIndex].action();
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 glass bg-white/70 dark:bg-black/60 hover:bg-lime-50 dark:hover:bg-zinc-900 text-slate-450 dark:text-slate-400 hover:text-lime-650 dark:hover:text-lime-400 p-3 rounded-full shadow-2xl flex items-center justify-center border border-slate-300 dark:border-zinc-800 hover:border-lime-500 dark:hover:border-lime-400 transition-all cursor-pointer group active:scale-95 shadow-md"
        title="Open Command Palette (Ctrl+K)"
        aria-label="Open Command Palette"
      >
        <Search size={22} className="group-hover:rotate-12 transition-transform duration-300" />
        <span className="absolute right-12 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap text-slate-700 dark:text-slate-300 shadow-sm">
          Press Ctrl + K
        </span>
      </button>
 
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-955/70 backdrop-blur-sm"
            />
 
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg glass border border-slate-200 dark:border-zinc-800/80 bg-white/95 dark:bg-card-dark/95 rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[380px]"
            >
              {/* Search bar */}
              <div className="flex items-center gap-3 px-4 border-b border-slate-200 dark:border-zinc-800/80 py-3.5 bg-slate-50/50 dark:bg-zinc-950/30">
                <Search className="text-slate-400" size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command or search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent border-0 outline-0 text-slate-900 dark:text-white placeholder-slate-500 w-full text-base focus:ring-0"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-slate-505 hover:text-slate-800 dark:hover:text-slate-350 bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 px-2 py-1 rounded"
                >
                  ESC
                </button>
              </div>
 
              {/* Items List */}
              <div className="overflow-y-auto flex-1 p-2 bg-white dark:bg-card-dark">
                {filteredActions.length > 0 ? (
                  filteredActions.map((action, index) => {
                    const Icon = action.icon;
                    const isSelected = index === selectedIndex;
                    return (
                      <div
                        key={action.name}
                        onClick={() => action.action()}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 ${
                          isSelected
                            ? "bg-slate-100 dark:bg-zinc-900/80 text-slate-950 dark:text-white border-l-2 border-lime-600 dark:border-lime-400 pl-4"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-250"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} className={isSelected ? "text-lime-650 dark:text-lime-400" : "text-slate-500"} />
                          <span className="text-sm font-medium">{action.name}</span>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold bg-slate-100 dark:bg-zinc-950/40 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-800/40">
                          {action.category}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-sm text-slate-500">No results found.</div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-slate-800/60 flex justify-between items-center bg-slate-950/40 text-slate-600 text-xs">
                <span>Use arrows to navigate, Enter to select</span>
                <span>Ctrl + K to close</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

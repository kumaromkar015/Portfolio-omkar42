"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-lg bg-slate-900/40 border border-slate-800/60" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2 rounded-lg border border-slate-700/40 dark:border-slate-800 hover:border-slate-500 dark:hover:border-slate-600 bg-slate-100 dark:bg-slate-900/60 text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      whileHover={{ rotate: 15 }}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </motion.button>
  );
}

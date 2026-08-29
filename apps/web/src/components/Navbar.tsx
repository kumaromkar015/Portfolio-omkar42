"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { api } from "@/lib/api";
import { parseMediaUrl } from "@/lib/cloudinary";

interface NavLink {
  label: string;
  href: string;
  isSection: boolean;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const pathname = usePathname();

  const navLinks: NavLink[] = [
    { label: "Home", href: "/#home", isSection: true },
    { label: "About", href: "/#about", isSection: true },
    { label: "Skills", href: "/#skills", isSection: true },
    { label: "Experience", href: "/#experience", isSection: true },
    { label: "Projects", href: "/#projects", isSection: true },
    { label: "Services", href: "/#services", isSection: true },
    { label: "Blog", href: "/blog", isSection: false },
    { label: "Gallery", href: "/gallery", isSection: false },
    { label: "Contact", href: "/#contact", isSection: true },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    // Fetch dynamic resume url from database
    api.getProfile()
      .then((data) => {
        if (data && data.resumeUrl) {
          setResumeUrl(data.resumeUrl);
        } else {
          setResumeUrl(null);
        }
      })
      .catch(() => {
        setResumeUrl(null);
      });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavLink) => {
    if (link.isSection && pathname === "/") {
      e.preventDefault();
      const targetId = link.href.replace("/#", "");
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      setIsOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-bg-dark/85 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800/80 shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-black border border-lime-650/40 dark:border-lime-500/40 text-lime-600 dark:text-lime-400 flex items-center justify-center font-bold shadow-lg shadow-lime-500/5 group-hover:scale-105 group-hover:border-lime-500 dark:group-hover:shadow-[0_0_15px_rgba(163,230,53,0.2)] transition-all duration-300">
            OK
          </div>
          <span className="font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Omkar Kumar
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/60 dark:bg-zinc-950/40 border border-slate-250 dark:border-zinc-800/80 px-2 py-1.5 rounded-full backdrop-blur-sm">
          {navLinks.map((link) => {
            const isBlogActive = link.href === "/blog" && pathname.startsWith("/blog");
            const isActive = isBlogActive || (pathname === "/" && link.href === "/#home"); // Default simple active state helper
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleClick(e, link)}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-lime-600 text-white dark:bg-lime-400 dark:text-black shadow-md dark:shadow-[0_0_12px_rgba(163,230,53,0.3)]"
                    : "text-slate-650 dark:text-slate-400 hover:text-lime-600 dark:hover:text-lime-400"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <ThemeToggle />
          {resumeUrl && (
            <Link
              href={parseMediaUrl(resumeUrl)?.downloadUrl || resumeUrl}
              download={parseMediaUrl(resumeUrl)?.fileName || "Omkar_Resume.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-full bg-lime-600 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black text-xs font-extrabold transition-all border border-lime-500/20 dark:border-lime-300/35 hover:shadow-lg dark:hover:shadow-[0_0_15px_rgba(163,230,53,0.3)] active:scale-95 cursor-pointer shadow-md"
            >
              Resume <ArrowUpRight size={14} />
            </Link>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg border border-slate-350 dark:border-zinc-800 text-slate-700 dark:text-slate-400 cursor-pointer"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden bg-white/95 dark:bg-zinc-950/95 border-b border-slate-200 dark:border-zinc-850 overflow-hidden backdrop-blur-md"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleClick(e, link)}
                  className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-lime-600 dark:hover:text-lime-400 transition-colors py-2 border-b border-slate-100 dark:border-zinc-900/60"
                >
                  {link.label}
                </Link>
              ))}
              {resumeUrl && (
                <Link
                  href={parseMediaUrl(resumeUrl)?.downloadUrl || resumeUrl}
                  download={parseMediaUrl(resumeUrl)?.fileName || "Omkar_Resume.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-lime-600 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black font-extrabold text-sm shadow-md cursor-pointer mt-2 transition-all active:scale-[0.98]"
                >
                  Resume <ArrowUpRight size={16} />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

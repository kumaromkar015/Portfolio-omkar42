"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

interface NavLink {
  label: string;
  href: string;
  isSection: boolean;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const navLinks: NavLink[] = [
    { label: "Home", href: "/#home", isSection: true },
    { label: "About", href: "/#about", isSection: true },
    { label: "Skills", href: "/#skills", isSection: true },
    { label: "Experience", href: "/#experience", isSection: true },
    { label: "Projects", href: "/#projects", isSection: true },
    { label: "Services", href: "/#services", isSection: true },
    { label: "Blog", href: "/blog", isSection: false },
    { label: "Contact", href: "/#contact", isSection: true },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
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
          ? "bg-white/80 dark:bg-bg-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform duration-300">
            OK
          </div>
          <span className="font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Omkar Kumar
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 px-2 py-1.5 rounded-full backdrop-blur-sm">
          {navLinks.map((link) => {
            const isBlogActive = link.href === "/blog" && pathname.startsWith("/blog");
            const isActive = isBlogActive || (pathname === "/" && link.href === "/#home"); // Default simple active state helper
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleClick(e, link)}
                className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-violet-600 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
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
          <Link
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all border border-slate-700 dark:border-slate-200 shadow-md cursor-pointer hover:shadow-lg active:scale-95"
          >
            Resume <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg border border-slate-700/40 dark:border-slate-800 text-slate-700 dark:text-slate-400 cursor-pointer"
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
            className="lg:hidden bg-white dark:bg-bg-dark border-b border-slate-200 dark:border-slate-850 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleClick(e, link)}
                  className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-violet-500 transition-colors py-2 border-b border-slate-100 dark:border-slate-900/60"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm shadow-md cursor-pointer mt-2"
              >
                Resume <ArrowUpRight size={16} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

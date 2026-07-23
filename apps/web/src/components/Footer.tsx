"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUp, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "./BrandIcons";
import { socialsData } from "@/data/socials";

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [year, setYear] = useState<number>(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-slate-200 dark:border-slate-900 bg-white/30 dark:bg-bg-dark/30 py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white shadow-lg">
                OK
              </div>
              <span className="font-extrabold tracking-tight text-slate-950 dark:text-white">
                Omkar Kumar
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Senior Frontend Architect & Full Stack Developer constructing premium, performant digital solutions with beautiful layouts and strict accessibility.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#about" className="text-slate-500 dark:text-slate-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors">
                  About Me
                </Link>
              </li>
              <li>
                <Link href="/#projects" className="text-slate-500 dark:text-slate-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors">
                  Featured Projects
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-500 dark:text-slate-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors">
                  Blog & Articles
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details / Status */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Availability
            </h4>
            <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{socialsData.availability}</span>
              </div>
              <div>Located in: {socialsData.location}</div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-slate-200 dark:border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href={socialsData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800/80 hover:border-slate-400 dark:hover:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all hover:bg-slate-100 dark:hover:bg-slate-900/60"
              aria-label="GitHub Profile"
            >
              <GithubIcon size={18} />
            </a>
            <a
              href={socialsData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800/80 hover:border-slate-400 dark:hover:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all hover:bg-slate-100 dark:hover:bg-slate-900/60"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon size={18} />
            </a>
            <a
              href={socialsData.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800/80 hover:border-slate-400 dark:hover:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all hover:bg-slate-100 dark:hover:bg-slate-900/60"
              aria-label="Twitter Profile"
            >
              <TwitterIcon size={18} />
            </a>
            <a
              href={`mailto:${socialsData.email}`}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800/80 hover:border-slate-400 dark:hover:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all hover:bg-slate-100 dark:hover:bg-slate-900/60"
              aria-label="Send Email"
            >
              <Mail size={18} />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center md:text-right">
            <p>© {year} Omkar Kumar. All rights reserved.</p>
            <p className="mt-1">
              Built with <span className="text-violet-500">Next.js 16</span>, TypeScript & Tailwind CSS.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll to Top Floating Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-22 right-6 z-50 glass hover:bg-slate-800/80 text-slate-400 hover:text-white p-3 rounded-full shadow-2xl flex items-center justify-center border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer active:scale-95"
          title="Scroll to Top"
          aria-label="Scroll to Top"
        >
          <ArrowUp size={20} className="animate-bounce" />
        </button>
      )}
    </footer>
  );
}

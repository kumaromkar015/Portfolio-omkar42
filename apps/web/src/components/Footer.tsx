"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUp, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "./BrandIcons";
import { socialsData } from "@/data/socials";
import { api } from "@/lib/api";

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [year, setYear] = useState<number>(2026);
  const [socials, setSocials] = useState<any>({
    github: socialsData.github,
    linkedin: socialsData.linkedin,
    twitter: socialsData.twitter,
  });

  useEffect(() => {
    setYear(new Date().getFullYear());
    
    api.getProfile()
      .then((data) => {
        if (data && data.social) {
          setSocials(data.social);
        }
      })
      .catch(() => {});

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
    <footer className="relative border-t border-slate-205 dark:border-zinc-900 bg-slate-50/50 dark:bg-black/40 py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-black border border-lime-650/40 dark:border-lime-500/40 text-lime-600 dark:text-lime-400 flex items-center justify-center font-bold shadow-md shadow-lime-500/5">
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
                <Link href="/#about" className="text-slate-500 dark:text-slate-400 hover:text-lime-650 dark:hover:text-lime-400 transition-colors">
                  About Me
                </Link>
              </li>
              <li>
                <Link href="/#projects" className="text-slate-500 dark:text-slate-400 hover:text-lime-650 dark:hover:text-lime-400 transition-colors">
                  Featured Projects
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-500 dark:text-slate-400 hover:text-lime-650 dark:hover:text-lime-400 transition-colors">
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
        <div className="border-t border-slate-200 dark:border-zinc-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href={socials.github || socialsData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-slate-200 dark:border-zinc-800/80 hover:border-lime-600 dark:hover:border-lime-400 text-slate-550 hover:text-lime-650 dark:hover:text-lime-400 transition-all hover:bg-slate-100 dark:hover:bg-zinc-900/60"
              aria-label="GitHub Profile"
            >
              <GithubIcon size={18} />
            </a>
            <a
              href={socials.linkedin || socialsData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-slate-200 dark:border-zinc-800/80 hover:border-lime-600 dark:hover:border-lime-400 text-slate-550 hover:text-lime-650 dark:hover:text-lime-400 transition-all hover:bg-slate-100 dark:hover:bg-zinc-900/60"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon size={18} />
            </a>
            <a
              href={socials.twitter || socialsData.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-slate-200 dark:border-zinc-800/80 hover:border-lime-600 dark:hover:border-lime-400 text-slate-550 hover:text-lime-650 dark:hover:text-lime-400 transition-all hover:bg-slate-100 dark:hover:bg-zinc-900/60"
              aria-label="Twitter Profile"
            >
              <TwitterIcon size={18} />
            </a>
            <a
              href={`mailto:${socialsData.email}`}
              className="p-2 rounded-lg border border-slate-200 dark:border-zinc-800/80 hover:border-lime-600 dark:hover:border-lime-400 text-slate-550 hover:text-lime-650 dark:hover:text-lime-400 transition-all hover:bg-slate-100 dark:hover:bg-zinc-900/60"
              aria-label="Send Email"
            >
              <Mail size={18} />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center md:text-right">
            <p>© {year} Omkar Kumar. All rights reserved.</p>
            <p className="mt-1">
              Built with <span className="text-lime-650 dark:text-lime-400 font-semibold">Next.js 16</span>, TypeScript & Tailwind CSS.
            </p>
            <button
              onClick={() => window.dispatchEvent(new Event("toggle-terminal"))}
              className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded bg-lime-500/10 text-lime-650 dark:text-lime-400 hover:bg-lime-500 hover:text-black transition-colors font-mono font-bold text-[10px] uppercase tracking-wider cursor-pointer border border-lime-500/20"
            >
              [ Terminal Mode ]
            </button>
          </div>
        </div>
      </div>

      {/* Scroll to Top Floating Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-22 right-6 z-50 glass bg-white/70 dark:bg-black/60 hover:bg-lime-50 dark:hover:bg-zinc-900 text-slate-450 dark:text-slate-400 hover:text-lime-650 dark:hover:text-lime-400 p-3 rounded-full shadow-2xl flex items-center justify-center border border-slate-300 dark:border-zinc-800 hover:border-lime-500 dark:hover:border-lime-400 transition-all cursor-pointer active:scale-95 shadow-md"
          title="Scroll to Top"
          aria-label="Scroll to Top"
        >
          <ArrowUp size={20} className="animate-bounce" />
        </button>
      )}
    </footer>
  );
}

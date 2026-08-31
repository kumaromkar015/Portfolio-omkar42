"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Calendar, History, ArrowRight, ExternalLink, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Project {
  _id: string;
  title: string;
  slug?: string;
}

interface ChangelogEntry {
  _id: string;
  title: string;
  description: string;
  date: string;
  category: "portfolio" | "project" | "career" | "skill" | "other";
  relatedProject?: Project | string | null;
  imageUrl?: string;
  link?: string;
  isPublished: boolean;
  isFeatured: boolean;
  displayOrder: number;
}

export default function ChangelogPage() {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getChangelogs()
      .then((data) => {
        setEntries(data || []);
      })
      .catch((err) => {
        console.error("Failed to load changelog:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white py-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-lime-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px]" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs font-bold uppercase tracking-wider">
            <History size={12} /> Live Updates
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Portfolio <span className="text-lime-400">Changelog</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-medium">
            Chronological documentation of how this portfolio, my professional skills, and engineering projects grow over time.
          </p>
        </div>

        {loading ? (
          <div className="py-24 flex justify-center items-center">
            <Loader2 className="animate-spin text-lime-400" size={36} />
          </div>
        ) : entries.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-950/20 text-slate-500">
            <h3 className="text-base font-bold uppercase tracking-wider">No Updates Logged Yet</h3>
            <p className="text-xs text-slate-650 mt-1">Check back later for future revisions.</p>
          </div>
        ) : (
          <div className="relative border-l border-zinc-800 ml-4 md:ml-32 pl-8 md:pl-12 space-y-12 py-4">
            {entries.map((entry) => {
              const projectLink =
                typeof entry.relatedProject === "object" && entry.relatedProject
                  ? `/projects/${entry.relatedProject.slug || entry.relatedProject._id}`
                  : null;

              return (
                <div key={entry._id} className="relative group">
                  {/* Timeline point */}
                  <div className="absolute -left-[41px] md:-left-[57px] top-1.5 w-6 h-6 rounded-full bg-slate-900 border-2 border-zinc-700 group-hover:border-lime-400 transition-colors flex items-center justify-center z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 group-hover:bg-lime-400 transition-colors" />
                  </div>

                  {/* Left Date column (desktop only) */}
                  <div className="hidden md:block absolute -left-[160px] top-1 w-28 text-right pr-6">
                    <span className="text-xs font-black tracking-widest text-slate-500 uppercase">
                      {entry.date}
                    </span>
                  </div>

                  {/* Card Container */}
                  <div className="bg-zinc-950/30 border border-zinc-850 hover:border-zinc-800/80 rounded-2xl p-6 md:p-8 space-y-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all">
                    
                    {/* Date (mobile only) */}
                    <div className="md:hidden text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar size={12} /> {entry.date}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                      <h3 className="text-lg md:text-xl font-bold tracking-tight text-white group-hover:text-lime-400 transition-colors">
                        {entry.title}
                      </h3>
                      
                      <span className={`self-start md:self-auto px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-slate-950 ${
                        entry.category === "portfolio" ? "bg-lime-400" :
                        entry.category === "project" ? "bg-cyan-400" :
                        entry.category === "career" ? "bg-violet-400" : "bg-amber-400"
                      }`}>
                        {entry.category}
                      </span>
                    </div>

                    <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed whitespace-pre-line font-sans">
                      {entry.description}
                    </p>

                    {/* Optional Image */}
                    {entry.imageUrl && (
                      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-zinc-800/80 mt-2">
                        <Image
                          src={entry.imageUrl}
                          alt={entry.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 800px"
                          className="object-cover hover:scale-105 transition-transform duration-500"
                          unoptimized
                        />
                      </div>
                    )}

                    {/* Metadata & Actions */}
                    {(projectLink || entry.link) && (
                      <div className="pt-4 border-t border-zinc-900/60 flex flex-wrap gap-4 items-center text-xs font-bold uppercase tracking-wider">
                        {projectLink && (
                          <Link
                            href={projectLink}
                            className="flex items-center gap-1 text-lime-400 hover:text-lime-300 transition-colors"
                          >
                            <span>Explore Project</span> <ArrowRight size={13} />
                          </Link>
                        )}
                        {entry.link && (
                          <a
                            href={entry.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-slate-450 hover:text-slate-205 transition-colors ml-auto md:ml-0"
                          >
                            <span>Verification</span> <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl border border-zinc-800 text-slate-400 hover:text-lime-400 hover:border-lime-400/50 text-xs font-bold transition-colors cursor-pointer"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

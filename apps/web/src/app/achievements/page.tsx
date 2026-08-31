"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, GraduationCap, Award, Medal, Calendar, ExternalLink, FileText, X, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { parseMediaUrl } from "@/lib/cloudinary";

interface Achievement {
  _id: string;
  title: string;
  type: "hackathon" | "cert" | "award" | "milestone" | "course" | "recognition";
  date?: string;
  description?: string;
  issuer?: string; // Organization
  link?: string; // Credential URL
  imageUrl?: string;
  certificateUrl?: string; // Certificate PDF
  featured: boolean;
  displayOrder: number;
}

const FILTER_TYPES = [
  { value: "all", label: "All" },
  { value: "cert", label: "Certifications" },
  { value: "award", label: "Awards" },
  { value: "hackathon", label: "Hackathons" },
  { value: "course", label: "Courses" },
  { value: "recognition", label: "Recognitions" },
];

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filteredList, setFilteredList] = useState<Achievement[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Lightbox State (PDF Certificates)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    api.getAchievements()
      .then((data) => {
        setAchievements(data || []);
        setFilteredList(data || []);
      })
      .catch((err) => console.error("Failed to load achievements:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredList(achievements);
    } else {
      setFilteredList(achievements.filter((item) => item.type === selectedFilter));
    }
    setLightboxIndex(null); // Reset lightbox on filter change
  }, [selectedFilter, achievements]);

  // Keyboard navigation for cert lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowRight") {
        nextCert();
      } else if (e.key === "ArrowLeft") {
        prevCert();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredList]);

  const activeCerts = filteredList.filter((item) => item.certificateUrl);

  const openCertLightbox = (certUrl: string) => {
    const index = activeCerts.findIndex((item) => item.certificateUrl === certUrl);
    if (index !== -1) {
      setLightboxIndex(index);
    }
  };

  const nextCert = () => {
    if (lightboxIndex === null || activeCerts.length === 0) return;
    setLightboxIndex((prev) => (prev! + 1) % activeCerts.length);
  };

  const prevCert = () => {
    if (lightboxIndex === null || activeCerts.length === 0) return;
    setLightboxIndex((prev) => (prev! - 1 + activeCerts.length) % activeCerts.length);
  };

  const getTypeIcon = (type: Achievement["type"]) => {
    switch (type) {
      case "award":
        return <Trophy size={18} />;
      case "course":
        return <GraduationCap size={18} />;
      case "hackathon":
        return <Medal size={18} />;
      default:
        return <Award size={18} />;
    }
  };

  const getTypeColor = (type: Achievement["type"]) => {
    switch (type) {
      case "award": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "course": return "bg-violet-500/10 text-violet-400 border-violet-500/20";
      case "hackathon": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      default: return "bg-lime-500/10 text-lime-400 border-lime-500/20";
    }
  };

  return (
    <div className="min-h-screen py-24 px-6 md:px-12 bg-slate-50 dark:bg-bg-dark text-slate-900 dark:text-white transition-colors duration-300 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 text-lime-650 dark:text-lime-400 text-xs font-bold uppercase tracking-wider border border-lime-500/20"
          >
            <Sparkles size={12} /> Achievements Wall
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold uppercase tracking-wide leading-none"
          >
            Credentials & Awards
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base font-semibold leading-relaxed"
          >
            A verified display of certifications, course credentials, hackathon wins, and professional recognitions.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2.5">
          {FILTER_TYPES.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedFilter(filter.value)}
              className={`px-4.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider border transition-all cursor-pointer ${
                selectedFilter === filter.value
                  ? "bg-lime-650 dark:bg-lime-400 text-white dark:text-black border-lime-500 shadow-md dark:shadow-[0_0_12px_rgba(163,230,53,0.25)]"
                  : "bg-white/40 dark:bg-zinc-900/40 border-slate-205 dark:border-zinc-800/80 text-slate-500 dark:text-slate-400 hover:border-slate-350 dark:hover:border-zinc-700"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* List Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-white dark:bg-card-dark border border-slate-205 dark:border-zinc-800 p-6 rounded-3xl shadow h-40 animate-pulse" />
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-slate-205 dark:border-zinc-800 rounded-3xl bg-slate-100/10 dark:bg-zinc-950/20 text-slate-500 max-w-xl mx-auto">
            <h3 className="text-sm font-bold uppercase tracking-wider">No achievements in this category</h3>
            <p className="text-xs text-slate-650 mt-1">Upload awards or course certificates to publish them here.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredList.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={reducedMotion ? {} : { opacity: 0, scale: 0.95 }}
                  animate={reducedMotion ? {} : { opacity: 1, scale: 1 }}
                  exit={reducedMotion ? {} : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-card-dark border border-slate-200 dark:border-zinc-850 p-6 rounded-3xl shadow hover:shadow-lg hover:border-lime-500/35 dark:hover:border-lime-400/30 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4">
                      <div className={`p-2.5 rounded-xl border flex items-center justify-center ${getTypeColor(item.type)}`}>
                        {getTypeIcon(item.type)}
                      </div>
                      <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-500 bg-slate-905 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 px-2 py-0.5 rounded-full">
                        <Calendar size={10} /> {item.date}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.issuer}</span>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-tight">{item.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed line-clamp-3">{item.description}</p>
                    </div>
                  </div>

                  {/* Actions footer */}
                  {(item.link || item.certificateUrl) && (
                    <div className="flex gap-3 pt-4.5 border-t border-slate-100 dark:border-zinc-900/60 mt-4 text-[10px] font-black uppercase tracking-wider">
                      {item.certificateUrl && (
                        <button
                          onClick={() => openCertLightbox(item.certificateUrl!)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-lime-500/10 hover:bg-lime-500 hover:text-black text-lime-650 dark:text-lime-400 border border-lime-500/20 cursor-pointer transition-colors"
                        >
                          <FileText size={12} /> Preview PDF
                        </button>
                      )}
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-350 hover:text-white transition-colors"
                        >
                          Verify <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* PDF Certificate Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && activeCerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 flex flex-col justify-between p-6 cursor-default"
          >
            {/* Top Close Row */}
            <div className="flex justify-between items-center text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Certificate {lightboxIndex + 1} of {activeCerts.length}
              </span>
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main iframe container + arrow navigation */}
            <div className="flex-grow flex items-center justify-between gap-4 max-h-[75vh]">
              <button
                onClick={prevCert}
                className="p-3 rounded-2xl bg-zinc-900/50 hover:bg-zinc-800 text-white cursor-pointer transition-colors"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="relative w-full max-w-4xl h-[70vh] rounded-2xl border border-zinc-850 overflow-hidden bg-slate-900 shadow-2xl">
                <iframe
                  src={`${activeCerts[lightboxIndex].certificateUrl}#toolbar=0&navpanes=0`}
                  className="w-full h-full border-0"
                  title="Certificate PDF Viewer"
                />
              </div>

              <button
                onClick={nextCert}
                className="p-3 rounded-2xl bg-zinc-900/50 hover:bg-zinc-800 text-white cursor-pointer transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom details box */}
            <div className="max-w-3xl w-full mx-auto p-5 rounded-2xl bg-zinc-950/80 border border-zinc-900 text-white space-y-2.5">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className={`inline-block text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${getTypeColor(activeCerts[lightboxIndex].type)}`}>
                    {activeCerts[lightboxIndex].type}
                  </span>
                  <h2 className="text-md font-extrabold leading-tight text-slate-100">
                    {activeCerts[lightboxIndex].title}
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-500">
                  <Calendar size={11} /> {activeCerts[lightboxIndex].date}
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                {activeCerts[lightboxIndex].description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

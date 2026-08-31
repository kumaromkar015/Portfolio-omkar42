"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { ChevronLeft, ChevronRight, Quote, ExternalLink } from "lucide-react";
import { LinkedinIcon } from "@/components/BrandIcons";

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  organization: string;
  quote: string;
  photoUrl?: string;
  profileUrl?: string;
  relationship?: string;
}

export default function Testimonials() {
  const [list, setList] = useState<Testimonial[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching testimonials...");
    api.getTestimonials()
      .then((data) => {
        console.log("Testimonials fetched successfully:", data);
        setList(data || []);
      })
      .catch((err) => {
        console.error("Failed to load testimonials:", err);
        setList([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    if (list.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [list]);

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? list.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev === list.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return null; // Silent load
  }

  if (list.length === 0) {
    return null; // Return null if there are no testimonials (hides section)
  }

  const active = list[index];

  return (
    <section
      id="testimonials"
      className="py-20 md:py-28 bg-white dark:bg-bg-dark border-t border-slate-200 dark:border-zinc-900 text-slate-900 dark:text-white overflow-hidden relative"
    >
      <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-lime-500/5 dark:bg-lime-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-lime-105 dark:bg-lime-950/30 text-lime-750 dark:text-lime-400 border border-lime-300 dark:border-lime-500/20 inline-block uppercase tracking-wider">
            Recommendations
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Client & Colleague Feedback
          </h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Press left or right arrow keys to navigate testimonials
          </p>
        </div>

        {/* Carousel slide container */}
        <div className="bg-slate-50 dark:bg-zinc-950/40 border border-slate-200 dark:border-zinc-850 rounded-3xl p-8 md:p-12 relative shadow-sm min-h-[250px] flex flex-col justify-between">
          <Quote className="absolute top-6 left-6 text-lime-500/10 dark:text-lime-450/10" size={80} />

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.25 }}
              className="space-y-6 relative z-10"
            >
              {/* Quote Quote */}
              <p className="text-base md:text-lg text-slate-655 dark:text-slate-300 italic leading-relaxed font-sans">
                “{active.quote}”
              </p>

              {/* Author Profile */}
              <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
                <div className="flex items-center gap-4">
                  {active.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={active.photoUrl}
                      alt={active.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-lime-650/45 dark:border-lime-400/40"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-205 dark:bg-zinc-900 border-2 border-lime-600/45 dark:border-lime-400/40 flex items-center justify-center font-bold text-sm text-lime-700 dark:text-lime-400">
                      {active.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-slate-955 dark:text-white flex items-center gap-2">
                      {active.name}
                      {active.profileUrl && (
                        <a
                          href={active.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-lime-650 dark:hover:text-lime-400 transition-colors"
                          title="View Profile"
                        >
                          {active.profileUrl.includes("linkedin.com") ? <LinkedinIcon size={13} /> : <ExternalLink size={13} />}
                        </a>
                      )}
                    </h4>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-tight">
                      {active.role} @ <span className="text-lime-650 dark:text-lime-400 font-bold">{active.organization}</span>
                    </div>
                    {active.relationship && (
                      <span className="text-[9px] uppercase font-extrabold bg-slate-200 dark:bg-zinc-950 text-slate-500 dark:text-slate-450 px-2 py-0.5 rounded border border-slate-250 dark:border-zinc-800/80 inline-block mt-1.5">
                        {active.relationship}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-8 border-t border-slate-105 dark:border-zinc-850/80 pt-5">
            {/* Pagination dots */}
            <div className="flex gap-1.5">
              {list.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                    i === index
                      ? "bg-lime-600 dark:bg-lime-400"
                      : "bg-slate-250 dark:bg-zinc-800 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={prevSlide}
                className="p-2.5 rounded-full border border-slate-300 dark:border-zinc-800 hover:border-lime-600 dark:hover:border-lime-400 text-slate-650 dark:text-slate-400 hover:text-lime-650 dark:hover:text-lime-400 transition-colors cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextSlide}
                className="p-2.5 rounded-full border border-slate-300 dark:border-zinc-800 hover:border-lime-600 dark:hover:border-lime-400 text-slate-655 dark:text-slate-400 hover:text-lime-650 dark:hover:text-lime-400 transition-colors cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

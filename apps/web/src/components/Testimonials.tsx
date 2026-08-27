"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { testimonialsData, Testimonial } from "@/data/testimonials";
import { ChevronLeft, ChevronRight, MessageSquare, Quote } from "lucide-react";

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev === testimonialsData.length - 1 ? 0 : prev + 1));
  };

  const activeTestimonial = testimonialsData[index];

  return (
    <section
      id="testimonials"
      className="py-20 md:py-28 bg-white dark:bg-bg-dark border-t border-slate-200 dark:border-zinc-900 text-slate-900 dark:text-white overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-6 relative">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-lime-100 dark:bg-lime-950/30 text-lime-750 dark:text-lime-400 border border-lime-300 dark:border-lime-500/20 inline-block uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Client & Colleague Feedback
          </h2>
        </div>

        {/* Carousel slide container */}
        <div className="bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800/80 rounded-3xl p-8 md:p-12 relative shadow-sm min-h-[250px] flex flex-col justify-between">
          <Quote className="absolute top-6 left-6 text-lime-500/10 dark:text-lime-400/15" size={80} />

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 relative z-10"
            >
              {/* Feedback Content */}
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 italic leading-relaxed">
                “{activeTestimonial.content}”
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <img
                  src={activeTestimonial.avatarUrl}
                  alt={activeTestimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-lime-500/45 dark:border-lime-400/45"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-955 dark:text-white">
                    {activeTestimonial.name}
                  </h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    {activeTestimonial.role} @ <span className="text-lime-650 dark:text-lime-400">{activeTestimonial.company}</span>
                  </div>
                  <span className="text-[9px] uppercase font-extrabold bg-slate-200 dark:bg-zinc-950 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-300 dark:border-zinc-800/70 inline-block mt-1">
                    {activeTestimonial.relationship} review
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-end gap-3 mt-6 border-t border-slate-200 dark:border-zinc-800/80 pt-5">
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
    </section>
  );
}

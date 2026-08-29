"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, X, ChevronLeft, ChevronRight, Images, ExternalLink } from "lucide-react";

interface GalleryItem {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: "professional" | "work" | "events" | "achievements" | "journey";
  date?: string;
  location?: string;
  altText?: string;
  isFeatured: boolean;
  displayOrder: number;
}

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "professional", label: "Professional" },
  { value: "work", label: "Work" },
  { value: "events", label: "Events" },
  { value: "achievements", label: "Achievements" },
  { value: "journey", label: "Journey" },
];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await api.getGalleryItems();
        setItems(data || []);
        setFilteredItems(data || []);
      } catch (err) {
        console.error("Failed to load gallery items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item) => item.category === selectedCategory));
    }
  }, [selectedCategory, items]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "ArrowLeft") {
        prevImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredItems]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % filteredItems.length);
  };

  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div className="min-h-screen py-24 px-6 md:px-12 bg-slate-50 dark:bg-bg-dark text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 text-lime-650 dark:text-lime-400 text-xs font-bold uppercase tracking-wider border border-lime-500/20"
          >
            <Images size={13} /> Behind The Code
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold uppercase tracking-wide leading-none"
          >
            Beyond the Code
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm md:text-base font-semibold leading-relaxed"
          >
            A glimpse into the professional milestones, events, environment, and journey behind the projects.
          </motion.p>
        </div>

        {/* Filters Panel */}
        <div className="flex justify-center flex-wrap gap-2.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider border transition-all cursor-pointer ${
                selectedCategory === cat.value
                  ? "bg-lime-600 dark:bg-lime-400 text-white dark:text-black border-lime-500 hover:shadow-lg dark:hover:shadow-[0_0_15px_rgba(163,230,53,0.25)]"
                  : "bg-white/40 dark:bg-zinc-900/40 border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-slate-400 hover:border-slate-350 dark:hover:border-zinc-700 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Masonry-Style Grid Container */}
        {loading ? (
          <div className="py-32 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-lime-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-slate-200 dark:border-zinc-805 rounded-3xl bg-slate-100/10 dark:bg-zinc-950/20 text-slate-500 max-w-xl mx-auto">
            <h3 className="text-sm font-bold uppercase tracking-wider">No photos in this category</h3>
            <p className="text-xs text-slate-650 mt-1">Upload event photos to your admin panel to publish them here.</p>
          </div>
        ) : (
          <motion.div 
            layout 
            className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                onClick={() => openLightbox(index)}
                className={`break-inside-avoid relative group rounded-3xl overflow-hidden bg-slate-905 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 cursor-pointer flex flex-col justify-end shadow-sm hover:shadow-md hover:border-lime-500/35 dark:hover:border-lime-400/30 transition-all ${
                  item.isFeatured ? "ring-1 ring-lime-500/20 shadow-lime-500/5" : ""
                }`}
              >
                <div className="relative overflow-hidden w-full h-full bg-slate-950">
                  <img
                    src={item.imageUrl}
                    alt={item.altText || item.title}
                    loading="lazy"
                    className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 space-y-1.5">
                    <span className="self-start text-[8px] font-extrabold uppercase tracking-wider bg-lime-400 text-black px-2 py-0.5 rounded-full mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-extrabold text-white leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-3 pt-2 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      {item.date && (
                        <span className="flex items-center gap-1">
                          <Calendar size={10} /> {new Date(item.date).toLocaleDateString()}
                        </span>
                      )}
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={10} /> {item.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal overlay */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[9999] bg-black/95 flex flex-col justify-between p-6 cursor-default"
          >
            {/* Top Bar */}
            <div className="flex justify-between items-center text-white" onClick={(e) => e.stopPropagation()}>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Photo {lightboxIndex + 1} of {filteredItems.length}
              </span>
              <button
                onClick={closeLightbox}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Middle Container (Image + Controls) */}
            <div className="flex-1 flex items-center justify-between gap-4 max-h-[70vh]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="p-3 rounded-2xl bg-zinc-900/50 hover:bg-zinc-800 text-white cursor-pointer transition-colors disabled:opacity-30 flex-shrink-0"
              >
                <ChevronLeft size={24} />
              </button>

              <div 
                className="relative max-h-full max-w-[85vw] flex items-center justify-center overflow-hidden rounded-2xl border border-zinc-850"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={filteredItems[lightboxIndex].imageUrl}
                  alt={filteredItems[lightboxIndex].title}
                  className="max-h-[70vh] max-w-full object-contain"
                />
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="p-3 rounded-2xl bg-zinc-900/50 hover:bg-zinc-800 text-white cursor-pointer transition-colors disabled:opacity-30 flex-shrink-0"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom details card */}
            <div 
              className="max-w-3xl w-full mx-auto p-5 rounded-2xl bg-zinc-950/80 border border-zinc-900 text-white space-y-2.5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="inline-block text-[8px] font-extrabold uppercase tracking-wider bg-lime-400 text-black px-2 py-0.5 rounded-full">
                    {filteredItems[lightboxIndex].category}
                  </span>
                  <h2 className="text-md font-extrabold leading-tight text-slate-100">
                    {filteredItems[lightboxIndex].title}
                  </h2>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  {filteredItems[lightboxIndex].date && (
                    <span className="flex items-center gap-1">
                      <Calendar size={11} /> {new Date(filteredItems[lightboxIndex].date).toLocaleDateString()}
                    </span>
                  )}
                  {filteredItems[lightboxIndex].location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={11} /> {filteredItems[lightboxIndex].location}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                {filteredItems[lightboxIndex].description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

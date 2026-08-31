"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Star, Briefcase, GraduationCap, Code2, Target, X, Compass, ChevronDown } from "lucide-react";

interface TimelineMilestone {
  _id?: string;
  company: string; // Organization
  position: string; // Role/Degree/Title
  duration: string; // Date range
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
  type: "work" | "education" | "project" | "goal";
  displayOrder: number;
  location?: string;
  imageUrl?: string;
}

export default function JourneyPage() {
  const [milestones, setMilestones] = useState<TimelineMilestone[]>([]);
  const [activeMilestone, setActiveMilestone] = useState<TimelineMilestone | null>(null);
  const [loading, setLoading] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    api.getExperiences()
      .then((data) => {
        if (data && data.length > 0) {
          const sorted = [...data].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          setMilestones(sorted);
          setActiveMilestone(sorted[0]);
        }
      })
      .catch((err) => console.error("Failed to load journey map:", err))
      .finally(() => setLoading(false));
  }, []);

  const getIcon = (type: TimelineMilestone["type"]) => {
    switch (type) {
      case "education":
        return <GraduationCap size={18} />;
      case "project":
        return <Code2 size={18} />;
      case "goal":
        return <Target size={18} />;
      default:
        return <Briefcase size={18} />;
    }
  };

  const getColorClass = (type: TimelineMilestone["type"], isActive: boolean) => {
    if (isActive) {
      switch (type) {
        case "education": return "border-violet-500 bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]";
        case "project": return "border-lime-400 bg-lime-400 text-black shadow-[0_0_15px_rgba(163,230,53,0.5)]";
        case "goal": return "border-amber-500 bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]";
        default: return "border-cyan-500 bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]";
      }
    } else {
      switch (type) {
        case "education": return "border-violet-500/40 text-violet-400 bg-violet-950/20 hover:border-violet-450";
        case "project": return "border-lime-500/40 text-lime-400 bg-lime-950/20 hover:border-lime-400";
        case "goal": return "border-amber-500/40 text-amber-400 bg-amber-950/20 hover:border-amber-400";
        default: return "border-cyan-500/40 text-cyan-400 bg-cyan-950/20 hover:border-cyan-400";
      }
    }
  };

  return (
    <div className="min-h-screen py-24 px-6 md:px-12 bg-slate-50 dark:bg-bg-dark text-slate-900 dark:text-white transition-colors duration-300 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Header section */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 text-lime-650 dark:text-lime-400 text-xs font-bold uppercase tracking-wider border border-lime-500/20"
          >
            <Compass size={13} className="animate-spin-slow" /> Interactive Map
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold uppercase tracking-wide leading-none"
          >
            My Journey
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base font-semibold leading-relaxed"
          >
            An interactive zigzag node roadmap connecting my academic path, technology products, and milestones.
          </motion.p>
        </div>

        {loading ? (
          <div className="py-32 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-lime-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : milestones.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-slate-205 dark:border-zinc-800 rounded-3xl bg-slate-100/10 dark:bg-zinc-950/20 text-slate-500 max-w-xl mx-auto">
            <h3 className="text-sm font-bold uppercase tracking-wider">No timeline milestones configured</h3>
            <p className="text-xs text-slate-650 mt-1">Publish journey entries in the Admin profile dashboard to populate this graph.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Zigzag Map canvas */}
            <div className="lg:col-span-7 bg-white/40 dark:bg-zinc-950/30 border border-slate-200 dark:border-zinc-900 rounded-3xl p-6 md:p-10 min-h-[500px] flex flex-col justify-center relative overflow-hidden">
              
              {/* Responsive SVG Grid Link connectors */}
              <div className="absolute inset-0 pointer-events-none hidden md:block z-0">
                <svg className="w-full h-full opacity-60">
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(163,230,53,0.3)" />
                      <stop offset="100%" stopColor="rgba(6,182,212,0.3)" />
                    </linearGradient>
                  </defs>
                  {/* Drawing Snaking Connection Paths */}
                  <path
                    d={`
                      M 15% 15%
                      Q 50% 15% 85% 15%
                      T 85% 50%
                      Q 50% 50% 15% 50%
                      T 15% 85%
                      Q 50% 85% 85% 85%
                    `}
                    fill="none"
                    stroke="url(#lineGrad)"
                    strokeWidth="2.5"
                    strokeDasharray="6 6"
                    className="animate-dash"
                  />
                </svg>
              </div>

              {/* Node distribution flow */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-6">
                {milestones.map((node, index) => {
                  const isActive = activeMilestone?._id === node._id;
                  const colorClass = getColorClass(node.type, isActive);

                  // Zigzag map coordinates offsets logic
                  // Alternates mapping styles to make a visually engaging snaking structure
                  return (
                    <motion.div
                      key={node._id}
                      initial={reducedMotion ? {} : { scale: 0.9, opacity: 0 }}
                      animate={reducedMotion ? {} : { scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setActiveMilestone(node)}
                      className={`flex flex-col items-center text-center cursor-pointer group`}
                    >
                      {/* Interactive visual node circle */}
                      <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 cursor-pointer ${colorClass}`}>
                        {getIcon(node.type)}
                      </div>

                      {/* Info preview */}
                      <div className="mt-3 space-y-1 max-w-[150px]">
                        <span className="text-[9px] font-black tracking-wider uppercase text-slate-400 flex items-center justify-center gap-1">
                          <Calendar size={9} /> {node.duration.split("-")[0].trim()}
                        </span>
                        <h4 className="text-xs font-black leading-tight text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-lime-400 transition-colors">
                          {node.position}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-semibold truncate w-full">
                          {node.company}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right: Selected Node Inspection details */}
            <div className="lg:col-span-5 relative">
              <AnimatePresence mode="wait">
                {activeMilestone && (
                  <motion.div
                    key={activeMilestone._id}
                    initial={reducedMotion ? {} : { opacity: 0, x: 20 }}
                    animate={reducedMotion ? {} : { opacity: 1, x: 0 }}
                    exit={reducedMotion ? {} : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-card-dark border border-slate-205 dark:border-zinc-800/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-md relative overflow-hidden"
                  >
                    {/* Visual glowing overlay inside panel */}
                    <div className="absolute top-[-30%] right-[-10%] w-[300px] h-[300px] rounded-full bg-lime-500/5 blur-[80px] pointer-events-none" />

                    <div className="space-y-4 relative z-10">
                      
                      {/* Meta Tags */}
                      <div className="flex justify-between items-center gap-4">
                        <span className={`px-2.5 py-1 rounded text-[9px] font-extrabold uppercase tracking-wider text-black ${
                          activeMilestone.type === "work" ? "bg-cyan-400" :
                          activeMilestone.type === "education" ? "bg-violet-400" :
                          activeMilestone.type === "project" ? "bg-lime-400" : "bg-amber-400"
                        }`}>
                          {activeMilestone.type}
                        </span>

                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-905 dark:bg-zinc-900 px-2.5 py-1 rounded-full border border-slate-200 dark:border-zinc-800/80">
                            <Calendar size={11} className="text-lime-500" /> {activeMilestone.duration}
                          </span>
                          {activeMilestone.location && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-905 dark:bg-zinc-900 px-2.5 py-1 rounded-full border border-slate-200 dark:border-zinc-800/80">
                              <MapPin size={11} className="text-lime-500" /> {activeMilestone.location}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Header */}
                      <div className="border-b border-slate-100 dark:border-zinc-900/60 pb-4">
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                          {activeMilestone.position}
                        </h2>
                        <h3 className="text-sm font-semibold text-slate-550 dark:text-slate-400 mt-1.5">
                          at <span className="text-lime-650 dark:text-lime-400 font-bold">{activeMilestone.company}</span>
                        </h3>
                      </div>

                      {/* Description list */}
                      {activeMilestone.responsibilities?.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-[9px] font-extrabold uppercase tracking-wider text-slate-550">Details / Background</h4>
                          <ul className="space-y-2">
                            {activeMilestone.responsibilities.map((resp, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-lime-500 mt-2 flex-shrink-0" />
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Achievements */}
                      {activeMilestone.achievements?.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-[9px] font-extrabold uppercase tracking-wider text-slate-550">Highlights</h4>
                          <ul className="space-y-2">
                            {activeMilestone.achievements.map((ach, i) => (
                              <li key={i} className="flex items-start gap-2 bg-slate-900/5 dark:bg-zinc-900/40 p-3 rounded-2xl border border-slate-205 dark:border-zinc-800/80 text-xs text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
                                <Star size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                                <span>{ach}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Technologies used */}
                      {activeMilestone.technologies?.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-900/60">
                          <h4 className="text-[9px] font-extrabold uppercase tracking-wider text-slate-550">Tech Stack Deployed</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {activeMilestone.technologies.map(tech => (
                              <span key={tech} className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-200 dark:bg-zinc-900 text-slate-700 dark:text-slate-400 border border-slate-250 dark:border-zinc-800">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

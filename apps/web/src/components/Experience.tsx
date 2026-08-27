"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { experienceData, JobExperience } from "@/data/experience";
import { Briefcase, Calendar, Star, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";

export default function Experience() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [experiencesList, setExperiencesList] = useState<JobExperience[]>([]);

  useEffect(() => {
    api.getExperiences()
      .then((data) => {
        if (data && data.length > 0) {
          setExperiencesList(data);
        } else {
          setExperiencesList(experienceData);
        }
      })
      .catch(() => {
        setExperiencesList(experienceData);
      });
  }, []);

  const activeJob = experiencesList[activeIdx] || experienceData[0];

  return (
    <section
      id="experience"
      className="py-20 md:py-28 bg-white dark:bg-bg-dark border-t border-slate-200 dark:border-zinc-900 text-slate-900 dark:text-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-lime-100 dark:bg-lime-950/30 text-lime-750 dark:text-lime-400 border border-lime-300 dark:border-lime-500/20 inline-block uppercase tracking-wider">
            Career Timeline
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Work Experience
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
            A history of my roles at top companies, detailing my architecture decisions, feature deliveries, and business impacts.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column: Job Selector List */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {experiencesList.map((job, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={job.company}
                  onClick={() => setActiveIdx(idx)}
                  className={`p-5 rounded-2xl border text-left transition-all duration-350 cursor-pointer active:scale-[0.99] relative overflow-hidden flex justify-between items-center ${
                    isActive
                      ? "bg-gradient-to-r from-lime-650/10 to-lime-500/5 dark:from-lime-400/10 dark:to-lime-300/5 border-lime-600/80 dark:border-lime-400/80 shadow-md"
                      : "bg-slate-50 dark:bg-zinc-900/60 border-slate-200 dark:border-zinc-800/80 hover:border-lime-500/30 dark:hover:border-lime-400/30"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-extrabold text-sm tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
                      <Briefcase size={16} className={isActive ? "text-lime-600 dark:text-lime-400" : "text-slate-400"} />
                      {job.company}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{job.position}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 whitespace-nowrap">
                      {job.duration}
                    </span>
                    <ChevronRight size={16} className={`transition-transform duration-300 ${isActive ? "rotate-90 text-lime-600 dark:text-lime-400" : "text-slate-400"}`} />
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="activeGlow"
                      className="absolute top-0 bottom-0 left-0 w-1 bg-lime-600 dark:bg-lime-400"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Job Details Panel */}
          <div className="lg:col-span-8 bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800/80 rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-sm">
            {/* Subtle glow background */}
            <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] rounded-full bg-lime-500/5 blur-[80px] pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 w-full"
              >
                {/* Job Title & Details */}
                <div className="border-b border-slate-200 dark:border-zinc-800 pb-5">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
                        {activeJob.position}
                      </h3>
                      <span className="text-sm font-semibold bg-gradient-to-r from-lime-650 to-lime-500 dark:from-lime-400 dark:to-lime-300 bg-clip-text text-transparent">
                        @{activeJob.company}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-805/80 px-3 py-1.5 rounded-full shadow-sm">
                      <Calendar size={14} className="text-lime-600 dark:text-lime-400" />
                      {activeJob.duration}
                    </div>
                  </div>
                </div>

                {/* Responsibilities */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-450">
                    Responsibilities
                  </h4>
                  <ul className="space-y-3">
                    {activeJob.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-lime-600 dark:bg-lime-400 mt-2 flex-shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Achievements */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-450">
                    Key Achievements
                  </h4>
                  <ul className="space-y-3">
                    {activeJob.achievements.map((ach, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-zinc-950/40 p-3 rounded-xl border border-slate-200 dark:border-zinc-800/80">
                        <Star size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies used */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-450">
                    Technologies Deployed
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeJob.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-200/60 dark:bg-zinc-800 text-slate-800 dark:text-slate-300 border border-slate-300/40 dark:border-zinc-700/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

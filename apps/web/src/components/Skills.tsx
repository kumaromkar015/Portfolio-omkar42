"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import Image from "next/image";
import DynamicIcon from "./DynamicIcon";
import { Sparkles, Calendar, FolderGit2, FolderKanban, Star, X, Info } from "lucide-react";

type SkillCategory = "All" | "Languages" | "Frontend" | "Backend" | "Database" | "Cloud & DevOps" | "Tools & Design";

interface SkillData {
  _id: string;
  name: string;
  category: string;
  description?: string;
  iconName?: string;
  iconUrl?: string;
  progress: number;
  experienceLevel: string;
  years: number;
  featured: boolean;
  status: string;
}

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>("All");
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Skill interactive details modal
  const [activeSkill, setActiveSkill] = useState<SkillData | null>(null);

  const categories: SkillCategory[] = [
    "All",
    "Languages",
    "Frontend",
    "Backend",
    "Database",
    "Cloud & DevOps",
    "Tools & Design",
  ];

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [skillsRes, projectsRes, expRes] = await Promise.all([
          api.getSkills(),
          api.getProjects().catch(() => []),
          api.getExperiences().catch(() => []),
        ]);
        setSkills(skillsRes || []);
        setProjects(projectsRes || []);
        setExperiences(expRes || []);
      } catch (err) {
        console.error("Failed to load skills details:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const filteredSkills = selectedCategory === "All"
    ? skills.filter((s) => s.status === "active")
    : skills.filter((skill) => skill.category === selectedCategory && skill.status === "active");

  // Real relationships resolution
  const matchedProjects = activeSkill
    ? projects.filter((p) =>
        p.techStack?.some((tech: string) => tech.toLowerCase() === activeSkill.name.toLowerCase())
      )
    : [];

  const matchedExperiences = activeSkill
    ? experiences.filter((e) =>
        e.technologies?.some((tech: string) => tech.toLowerCase() === activeSkill.name.toLowerCase())
      )
    : [];

  const relatedSkills = activeSkill
    ? skills.filter(
        (s) =>
          s.category === activeSkill.category &&
          s.name.toLowerCase() !== activeSkill.name.toLowerCase() &&
          s.status === "active"
      ).slice(0, 4)
    : [];

  return (
    <section
      id="skills"
      className="py-24 md:py-32 bg-slate-50 dark:bg-bg-dark border-t border-slate-200 dark:border-zinc-900 text-slate-900 dark:text-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-lime-100 dark:bg-lime-950/30 text-lime-750 dark:text-lime-400 border border-lime-300 dark:border-lime-500/20 uppercase tracking-wider">
            <Sparkles size={12} /> Tech Matrix
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide">
            Interactive Stack
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-semibold leading-relaxed">
            Click on any technology card to discover real usage relationships across my projects and career milestones.
          </p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4.5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer active:scale-95 border ${
                selectedCategory === category
                  ? "bg-lime-650 border-lime-650 dark:bg-lime-400 dark:border-lime-350 text-white dark:text-black shadow-md dark:shadow-[0_0_12px_rgba(163,230,53,0.25)]"
                  : "bg-white dark:bg-zinc-900/60 border-slate-205 dark:border-zinc-800/80 hover:border-lime-500/30 dark:hover:border-lime-400/30 text-slate-500 dark:text-slate-400"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-white dark:bg-card-dark border border-slate-205 dark:border-zinc-800 p-5 rounded-3xl shadow animate-pulse h-32" />
            ))}
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-extrabold uppercase tracking-wider bg-white dark:bg-card-dark border border-slate-205 dark:border-zinc-800 rounded-3xl">
            No technical skills found
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill) => (
                <motion.div
                  key={skill._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setActiveSkill(skill)}
                  className="bg-white dark:bg-card-dark border border-slate-200 dark:border-zinc-800/80 p-5 rounded-3xl shadow hover:border-lime-500/40 dark:hover:border-lime-400/40 transition-all duration-300 group hover:shadow-lg relative overflow-hidden cursor-pointer"
                >
                  <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-lime-500 to-lime-300 dark:from-lime-450 dark:to-lime-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-lime-50 dark:bg-zinc-950 text-lime-650 dark:text-lime-400 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                        {skill.iconUrl ? (
                          <div className="relative w-5 h-5">
                            <Image
                              src={skill.iconUrl}
                              alt={skill.name}
                              fill
                              sizes="20px"
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <DynamicIcon name={skill.iconName || "Code2"} size={20} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{skill.name}</h4>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {skill.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-extrabold text-lime-650 dark:text-lime-400 bg-lime-50 dark:bg-lime-950/20 px-2 py-0.5 rounded border border-lime-100 dark:border-lime-900/30">
                        {skill.experienceLevel}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1 font-medium">{skill.years} years exp</div>
                    </div>
                  </div>

                  {/* Proficiency slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <span>Proficiency</span>
                      <span>{skill.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-lime-600 to-lime-400 dark:from-lime-500 dark:to-lime-300 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Interactive Skill Detail Side Drawer / Modal Popup */}
      <AnimatePresence>
        {activeSkill && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-hidden text-slate-900 dark:text-white cursor-default">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: "backOut" }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 border border-slate-205 dark:border-zinc-850 rounded-3xl shadow-2xl flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-900/60 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-lime-50 dark:bg-zinc-900 text-lime-650 dark:text-lime-400 flex items-center justify-center">
                    {activeSkill.iconUrl ? (
                      <div className="relative w-5 h-5">
                        <img src={activeSkill.iconUrl} alt={activeSkill.name} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <DynamicIcon name={activeSkill.iconName || "Code2"} size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold uppercase tracking-wide">{activeSkill.name}</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeSkill.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveSkill(null)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-zinc-900 text-slate-450 hover:text-rose-500 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable details wrapper */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Description */}
                {activeSkill.description ? (
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Info size={11} /> Technology Description
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">
                      {activeSkill.description}
                    </p>
                  </div>
                ) : (
                  <div className="text-[11px] italic text-slate-550 dark:text-slate-500">
                    No custom usage description registered. Check deployed records below.
                  </div>
                )}

                {/* Level indicators */}
                <div className="grid grid-cols-3 gap-4 border-t border-b border-slate-100 dark:border-zinc-900/60 py-4.5">
                  <div className="text-center">
                    <div className="text-[10px] font-bold uppercase text-slate-500">Exp Level</div>
                    <div className="text-sm font-black text-lime-650 dark:text-lime-400 mt-1">{activeSkill.experienceLevel}</div>
                  </div>
                  <div className="text-center border-l border-r border-slate-100 dark:border-zinc-900/60">
                    <div className="text-[10px] font-bold uppercase text-slate-500">Years Experience</div>
                    <div className="text-sm font-black text-slate-800 dark:text-slate-100 mt-1">{activeSkill.years} Years</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] font-bold uppercase text-slate-500">Skill Proficiency</div>
                    <div className="text-sm font-black text-slate-800 dark:text-slate-100 mt-1">{activeSkill.progress}%</div>
                  </div>
                </div>

                {/* Used In Projects */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <FolderKanban size={11} className="text-cyan-500" /> Used in Projects ({matchedProjects.length})
                  </h4>
                  {matchedProjects.length === 0 ? (
                    <p className="text-[11px] text-slate-500 italic">No public projects match this stack element tag.</p>
                  ) : (
                    <div className="space-y-2">
                      {matchedProjects.map(p => (
                        <div key={p.id || p._id} className="p-3 rounded-2xl bg-slate-900/5 dark:bg-zinc-900/40 border border-slate-205 dark:border-zinc-800/80 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-extrabold text-slate-800 dark:text-slate-200">{p.title}</span>
                            <span className="text-[9px] uppercase tracking-wider bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full font-bold ml-2">{p.category}</span>
                          </div>
                          {p.liveUrl && (
                            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold uppercase tracking-wider text-lime-400 hover:underline">View Live</a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Used In Experience */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Calendar size={11} className="text-violet-500" /> Experience Timeline Matches ({matchedExperiences.length})
                  </h4>
                  {matchedExperiences.length === 0 ? (
                    <p className="text-[11px] text-slate-500 italic">No job descriptions or education items match this stack element tag.</p>
                  ) : (
                    <div className="space-y-2">
                      {matchedExperiences.map(e => (
                        <div key={e._id} className="p-3 rounded-2xl bg-slate-900/5 dark:bg-zinc-900/40 border border-slate-205 dark:border-zinc-800/80 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-extrabold text-slate-800 dark:text-slate-200">{e.position}</span>
                            <span className="text-slate-500 font-semibold"> at {e.company}</span>
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">{e.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Related Tools */}
                {relatedSkills.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-900/60">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Star size={11} className="text-amber-500" /> Related in {activeSkill.category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {relatedSkills.map(s => (
                        <button
                          key={s._id}
                          onClick={() => setActiveSkill(s)}
                          className="px-3 py-1.5 rounded-xl border border-slate-250 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider hover:border-lime-500 hover:text-lime-400 bg-slate-50 dark:bg-zinc-900/60 transition-colors cursor-pointer"
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

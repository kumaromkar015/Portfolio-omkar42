"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import Image from "next/image";
import DynamicIcon from "./DynamicIcon";

type SkillCategory = "All" | "Languages" | "Frontend" | "Backend" | "Database" | "Cloud & DevOps" | "Tools & Design";

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>("All");
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    api.getSkills()
      .then((data) => {
        setSkills(data || []);
      })
      .catch((err) => {
        console.error("Failed to load skills:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredSkills = selectedCategory === "All"
    ? skills.filter((s) => s.status === "active")
    : skills.filter((skill) => skill.category === selectedCategory && skill.status === "active");

  return (
    <section
      id="skills"
      className="py-20 md:py-28 bg-slate-50 dark:bg-bg-dark border-t border-slate-200 dark:border-zinc-900 text-slate-900 dark:text-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-lime-100 dark:bg-lime-950/30 text-lime-750 dark:text-lime-400 border border-lime-300 dark:border-lime-500/20 inline-block uppercase tracking-wider">
            Technical Stack
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            My Professional Skills
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
            A comprehensive matrix of my primary programming languages, backend runtimes, database layers, and tool integrations.
          </p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95 border ${
                selectedCategory === category
                  ? "bg-lime-600 border-lime-650 dark:bg-lime-400 dark:border-lime-350 text-white dark:text-black shadow-md dark:shadow-[0_0_12px_rgba(163,230,53,0.25)]"
                  : "bg-white dark:bg-zinc-900/60 border-slate-200 dark:border-zinc-800/80 hover:border-lime-500/30 dark:hover:border-lime-400/30 text-slate-600 dark:text-slate-400"
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
              <div key={idx} className="bg-white dark:bg-card-dark border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow animate-pulse h-32" />
            ))}
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="text-center py-16 text-slate-400 font-bold uppercase tracking-wider bg-white dark:bg-card-dark border border-slate-200 dark:border-zinc-800 rounded-3xl">
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-card-dark border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow hover:border-lime-500/40 dark:hover:border-lime-400/40 transition-all duration-300 group hover:shadow-lg relative overflow-hidden"
                >
                  {/* Micro particle border glow on hover */}
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
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{skill.name}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                          {skill.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-lime-650 dark:text-lime-400 bg-lime-50 dark:bg-lime-950/20 px-2 py-0.5 rounded border border-lime-100 dark:border-lime-900/30">
                        {skill.experienceLevel}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1 font-medium">{skill.years} years exp</div>
                    </div>
                  </div>

                  {/* Progress Indicators */}
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
    </section>
  );
}

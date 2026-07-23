"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skillsData, Skill } from "@/data/skills";
import DynamicIcon from "./DynamicIcon";

type SkillCategory = "All" | "Languages" | "Frontend" | "Backend" | "Database" | "Cloud & DevOps" | "Tools & Design";

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>("All");

  const categories: SkillCategory[] = [
    "All",
    "Languages",
    "Frontend",
    "Backend",
    "Database",
    "Cloud & DevOps",
    "Tools & Design",
  ];

  const filteredSkills = selectedCategory === "All"
    ? skillsData
    : skillsData.filter((skill) => skill.category === selectedCategory);

  return (
    <section
      id="skills"
      className="py-20 md:py-28 bg-slate-50 dark:bg-bg-dark border-t border-slate-200 dark:border-slate-900 text-slate-900 dark:text-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-300 border border-violet-200 dark:border-violet-850 inline-block uppercase tracking-wider">
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
                  ? "bg-violet-600 border-violet-650 text-white shadow-lg shadow-violet-500/20"
                  : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-450 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-850 p-5 rounded-2xl shadow hover:border-violet-500/40 dark:hover:border-violet-500/30 transition-all duration-300 group hover:shadow-lg relative overflow-hidden"
              >
                {/* Micro particle border glow on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-slate-900 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform duration-300">
                      <DynamicIcon name={skill.iconName} size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{skill.name}</h4>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        {skill.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 px-2 py-0.5 rounded border border-violet-100 dark:border-violet-900/40">
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
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

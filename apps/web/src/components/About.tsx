"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, ShieldCheck, Heart, Sparkles, GraduationCap } from "lucide-react";

export default function About() {
  const coreValues = [
    {
      title: "Technical Excellence",
      description: "Writing clean, type-safe, and self-documenting code with comprehensive unit and integration coverage.",
      icon: ShieldCheck,
    },
    {
      title: "User-Centric Design",
      description: "Engineering layout spacing, grid alignments, micro-interactions, and transitions that make products feel premium.",
      icon: Sparkles,
    },
    {
      title: "Business Alignment",
      description: "Translating customer pain points and business goals into scaleable features and performance strategies.",
      icon: Award,
    },
  ];

  const education = [
    {
      degree: "Master of Science in Computer Science",
      school: "IIIT Bangalore",
      year: "2018 - 2020",
      details: "Specialized in Distributed Systems and Cloud Computing. Graduated with Honors.",
    },
    {
      degree: "Bachelor of Technology in Information Technology",
      school: "VTU Belgaum",
      year: "2014 - 2018",
      details: "Foundation in Algorithms, Database Systems, and Network Architecture.",
    },
  ];

  return (
    <section
      id="about"
      className="py-20 md:py-28 bg-white dark:bg-bg-dark border-t border-slate-200 dark:border-slate-900 text-slate-900 dark:text-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-300 border border-violet-200 dark:border-violet-850 inline-block uppercase tracking-wider">
            About Me
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            My Career Journey & Philosophy
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
            A software engineer based in Bangalore, India, passionate about connecting premium design aesthetics with robust backend pipelines.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Biography & Values */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">My Story</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                Over the past 6+ years, I've had the privilege of working with leading tech teams, from fast-paced SaaS startups to global finance networks. I specialize in building custom Next.js applications, crafting scalable database schemas, and ensuring frontend layouts load in milliseconds.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                I believe that good software should not only execute instructions efficiently but also deliver a premium user experience. I spend my time optimizing database indexes, tweaking Framer Motion curves, and contributing to open-source developer toolkits.
              </p>
            </div>

            {/* Core Values */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Core Engineering Values</h3>
              <div className="space-y-4">
                {coreValues.map((value, idx) => {
                  const Icon = value.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 flex gap-4 hover:border-violet-500/40 transition-colors"
                    >
                      <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 h-10 w-10 flex items-center justify-center flex-shrink-0">
                        <Icon size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm">{value.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Education & Stats */}
          <div className="lg:col-span-6 space-y-8">
            {/* Education Timeline */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <GraduationCap size={24} className="text-violet-500" />
                Education
              </h3>
              <div className="space-y-6 relative border-l-2 border-slate-200 dark:border-slate-800 pl-6 ml-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="relative space-y-1">
                    {/* Timeline Node dot */}
                    <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-violet-600 border border-white dark:border-bg-dark" />
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                      {edu.year}
                    </span>
                    <h4 className="font-bold text-sm md:text-base text-slate-950 dark:text-white">
                      {edu.degree}
                    </h4>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {edu.school}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed pt-1">
                      {edu.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote block */}
            <div className="p-6 rounded-2xl bg-gradient-to-tr from-violet-600/10 to-fuchsia-600/10 border border-violet-500/20 dark:border-violet-500/10 flex flex-col justify-center">
              <span className="text-5xl text-violet-500/30 font-serif leading-none h-4">“</span>
              <p className="text-sm italic text-slate-600 dark:text-slate-350 leading-relaxed">
                Simplifying complex system problems and delivering premium interfaces isn't just a career; it's a craft. I thrive on translating specifications into fast, scalable applications that users enjoy interacting with.
              </p>
              <div className="mt-4 text-xs font-bold text-right text-slate-900 dark:text-white">
                — Omkar Kumar
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

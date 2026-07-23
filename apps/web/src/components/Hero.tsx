"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, FileText, Send, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { socialsData } from "@/data/socials";
import SpotifyWidget from "./SpotifyWidget";
import DynamicIcon from "./DynamicIcon";

export default function Hero() {
  const stats = [
    { value: "5+", label: "Years Exp" },
    { value: "15+", label: "Projects Completed" },
    { value: "20+", label: "Technologies" },
    { value: "100%", label: "Client Success" },
  ];

  const marqueeSkills = [
    { name: "Next.js", icon: "Atom" },
    { name: "React", icon: "Atom" },
    { name: "TypeScript", icon: "Code2" },
    { name: "Tailwind CSS", icon: "Palette" },
    { name: "PostgreSQL", icon: "Database" },
    { name: "Docker", icon: "Box" },
    { name: "Figma", icon: "Figma" },
    { name: "GraphQL", icon: "GitMerge" },
  ];

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center items-center pt-24 pb-12 overflow-hidden bg-slate-50 dark:bg-bg-dark text-slate-900 dark:text-white"
    >
      {/* Premium animated gradient background blobs */}
      <div className="absolute top-[10%] left-[-15%] w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full bg-violet-600/10 dark:bg-violet-600/20 blur-[100px] md:blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: "12s" }} />
      <div className="absolute bottom-[10%] right-[-15%] w-[400px] md:w-[700px] h-[400px] md:h-[700px] rounded-full bg-cyan-600/10 dark:bg-cyan-600/25 blur-[110px] md:blur-[160px] pointer-events-none animate-pulse" style={{ animationDuration: "16s" }} />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
        {/* Left column info */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Availability Status */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/60 shadow-sm"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
              {socialsData.availability}
            </span>
          </motion.div>

          {/* Heading */}
          <div className="space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight"
            >
              Hi, I'm{" "}
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                Omkar Kumar
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl font-medium text-slate-600 dark:text-slate-300"
            >
              Senior Frontend Architect & Full Stack Developer
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed mx-auto lg:mx-0"
            >
              I build enterprise Next.js applications, fast API pipelines, and interactive user interfaces styled with clean typography and seamless motion.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
          >
            <button
              onClick={scrollToContact}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-lg shadow-violet-500/20 transition-all cursor-pointer active:scale-95"
            >
              Hire Me <Send size={15} />
            </button>
            <button
              onClick={scrollToProjects}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-200 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 font-bold text-sm shadow-md transition-all cursor-pointer active:scale-95"
            >
              View Projects
            </button>
            <a
              href={socialsData.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-bold text-sm transition-all cursor-pointer"
            >
              Resume <FileText size={15} />
            </a>
          </motion.div>

          {/* Socials Connection */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center justify-center lg:justify-start gap-4 pt-2"
          >
            <a
              href={socialsData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-violet-500 transition-colors"
            >
              <GithubIcon size={20} />
            </a>
            <a
              href={socialsData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-violet-500 transition-colors"
            >
              <LinkedinIcon size={20} />
            </a>
            <a
              href={`mailto:${socialsData.email}`}
              className="text-slate-400 hover:text-violet-500 transition-colors"
            >
              <Mail size={20} />
            </a>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800/80 max-w-lg mx-auto lg:mx-0"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right column illustration / image */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl bg-gradient-to-tr from-violet-600 to-cyan-600 p-[2px] shadow-2xl flex items-center justify-center overflow-hidden"
          >
            {/* Visual Glassmorphic avatar placeholder */}
            <div className="absolute inset-[3px] bg-slate-900 rounded-[22px] overflow-hidden flex flex-col items-center justify-center p-6 text-center">
              {/* Inner subtle glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-600/30 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-600/30 rounded-full blur-2xl pointer-events-none" />

              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-extrabold text-white text-3xl shadow-lg mb-4">
                OK
              </div>
              <span className="text-lg font-bold text-white">Omkar Kumar</span>
              <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-1">
                Bangalore, India
              </span>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60 shadow">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Working hours: {socialsData.workingHours}
              </div>
            </div>
          </motion.div>

          {/* Spotify Widget integration */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="w-full max-w-xs"
          >
            <SpotifyWidget />
          </motion.div>
        </div>
      </div>

      {/* Tech Stack Marquee */}
      <div className="w-full mt-16 border-y border-slate-200 dark:border-slate-900 bg-white/20 dark:bg-bg-dark/20 py-4.5 overflow-hidden">
        <div className="animate-marquee gap-8 items-center">
          {/* Double array to handle infinite scrolling */}
          {[...marqueeSkills, ...marqueeSkills, ...marqueeSkills].map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 shadow-sm whitespace-nowrap text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <DynamicIcon name={skill.icon} size={16} className="text-violet-500" />
              <span>{skill.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 flex justify-center w-full">
        <button
          onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
          className="text-slate-400 hover:text-violet-500 transition-colors flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-widest cursor-pointer"
        >
          Scroll Down
          <ArrowDown size={14} className="animate-bounce" />
        </button>
      </div>
    </section>
  );
}

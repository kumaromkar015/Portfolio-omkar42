"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, FileText, Send, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import Image from "next/image";
import { socialsData } from "@/data/socials";
import DynamicIcon from "./DynamicIcon";
import { api } from "@/lib/api";
import { parseMediaUrl } from "@/lib/cloudinary";

export default function Hero() {
  const [profile, setProfile] = React.useState<any>({
    name: "Omkar Kumar",
    bio: "Senior Frontend Architect & Full Stack Developer",
    social: {
      github: socialsData.github,
      linkedin: socialsData.linkedin,
      twitter: socialsData.twitter,
    }
  });

  React.useEffect(() => {
    api.getProfile()
      .then((data) => {
        if (data) {
          setProfile(data);
        }
      })
      .catch(() => {});
  }, []);

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
      className="relative min-h-screen flex flex-col justify-center items-center pt-28 pb-12 overflow-hidden bg-slate-50 dark:bg-bg-dark text-slate-900 dark:text-white"
    >
      {/* Premium animated gradient background blobs */}
      <div className="absolute top-[10%] left-[-15%] w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full bg-lime-500/5 dark:bg-lime-500/10 blur-[100px] md:blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: "12s" }} />
      <div className="absolute bottom-[10%] right-[-15%] w-[400px] md:w-[700px] h-[400px] md:h-[700px] rounded-full bg-slate-400/5 dark:bg-zinc-800/10 blur-[110px] md:blur-[160px] pointer-events-none animate-pulse" style={{ animationDuration: "16s" }} />
      
      {/* Subtle fine grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
        {/* Left column info */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Availability Status */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-105/80 dark:bg-lime-950/30 border border-lime-300 dark:border-lime-550/30 shadow-sm"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-lime-805 dark:text-lime-350 uppercase tracking-wide">
              {socialsData.availability}
            </span>
          </motion.div>

          {/* Heading */}
          <div className="space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-none text-slate-900 dark:text-white"
            >
              Hi, I'm{" "}
              <span className="bg-gradient-to-r from-lime-650 to-lime-500 dark:from-lime-400 dark:to-lime-350 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(163,230,53,0.15)]">
                {profile.name}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl font-bold text-slate-700 dark:text-slate-200"
            >
              {profile.bio}
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
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-lime-650 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black font-extrabold text-sm shadow-md dark:shadow-[0_0_20px_rgba(163,230,53,0.25)] transition-all cursor-pointer active:scale-95"
            >
              Hire Me <Send size={15} />
            </button>
            <button
              onClick={scrollToProjects}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-800 dark:text-slate-200 border border-slate-250 dark:border-zinc-800 font-extrabold text-sm shadow-sm transition-all cursor-pointer active:scale-95"
            >
              View Projects
            </button>
            {profile.resumeUrl ? (
              <a
                href={parseMediaUrl(profile.resumeUrl)?.downloadUrl || profile.resumeUrl}
                download={parseMediaUrl(profile.resumeUrl)?.fileName || "Omkar_Resume.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-350 dark:border-zinc-800 text-slate-700 dark:text-slate-350 hover:border-lime-650 dark:hover:border-lime-400 hover:text-lime-655 dark:hover:text-lime-400 font-extrabold text-sm transition-all cursor-pointer shadow-sm bg-white/40 dark:bg-transparent"
              >
                Resume <FileText size={15} />
              </a>
            ) : (
              <button
                disabled
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 dark:border-zinc-900 text-slate-400 dark:text-slate-600 font-extrabold text-sm cursor-not-allowed opacity-50 bg-slate-50/50 dark:bg-transparent"
                title="Resume currently unavailable"
              >
                Resume <FileText size={15} />
              </button>
            )}
          </motion.div>

          {/* Socials Connection */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center justify-center lg:justify-start gap-4 pt-2"
          >
            <a
              href={profile.social?.github || socialsData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
            >
              <GithubIcon size={20} />
            </a>
            <a
              href={profile.social?.linkedin || socialsData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
            >
              <LinkedinIcon size={20} />
            </a>
            <a
              href={`mailto:${socialsData.email}`}
              className="text-slate-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
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
                <div className="text-2xl sm:text-4xl font-black text-lime-650 dark:text-lime-400 drop-shadow-[0_0_10px_rgba(163,230,53,0.1)]">
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
            className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl bg-gradient-to-tr from-lime-600 to-zinc-800 p-[1.5px] shadow-2xl flex items-center justify-center overflow-hidden"
          >
            {/* Visual Glassmorphic avatar placeholder */}
            <div className="absolute inset-[1.5px] bg-slate-50 dark:bg-zinc-950 rounded-[22px] overflow-hidden flex flex-col items-center justify-center text-center">
              {profile.photo ? (
                <div className="relative w-full h-full group/avatar">
                  <Image
                    src={profile.photo}
                    alt={profile.name || "Omkar Kumar"}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                    className="object-cover transition-transform duration-500 group-hover/avatar:scale-105"
                  />
                  {/* Subtle vignette/gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-80" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 w-full h-full relative">
                  {/* Inner subtle glow */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-lime-500/10 dark:bg-lime-500/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-slate-400/10 dark:bg-zinc-800/20 rounded-full blur-2xl pointer-events-none" />

                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-lime-650 to-lime-500 dark:from-lime-500 dark:to-lime-300 flex items-center justify-center font-black text-white dark:text-black text-3xl shadow-lg mb-4">
                    {profile.name ? profile.name.split(" ").map((n: string) => n[0]).join("") : "OK"}
                  </div>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{profile.name}</span>
                  <span className="text-xs text-slate-550 dark:text-slate-400 font-semibold tracking-wider uppercase mt-1">
                    Bangalore, India
                  </span>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-350 bg-slate-200/50 dark:bg-zinc-900 px-3 py-1 rounded-full border border-slate-300/40 dark:border-zinc-800 shadow">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Working hours: {socialsData.workingHours}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tech Stack Marquee */}
      <div className="w-full mt-16 border-y border-slate-250 dark:border-zinc-900 bg-white/20 dark:bg-zinc-950/20 py-4.5 overflow-hidden">
        <div className="animate-marquee gap-8 items-center">
          {/* Double array to handle infinite scrolling */}
          {[...marqueeSkills, ...marqueeSkills, ...marqueeSkills].map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 shadow-sm whitespace-nowrap text-xs font-semibold text-slate-700 dark:text-slate-350 hover:border-lime-500/40 transition-colors duration-250"
            >
              <DynamicIcon name={skill.icon} size={16} className="text-lime-650 dark:text-lime-400" />
              <span>{skill.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 flex justify-center w-full">
        <button
          onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
          className="text-slate-400 hover:text-lime-650 dark:hover:text-lime-400 transition-colors flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-widest cursor-pointer"
        >
          Scroll Down
          <ArrowDown size={14} className="animate-bounce" />
        </button>
      </div>
    </section>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ShieldAlert, Cpu, Database, Check, Layers, BarChart3, HelpCircle, Server } from "lucide-react";
import { GithubIcon } from "@/components/BrandIcons";
import { motion } from "framer-motion";

interface ProjectDetailsClientProps {
  project: {
    id: string;
    title: string;
    description: string;
    extendedDescription: string;
    category: string;
    imageUrl: string;
    liveUrl: string;
    githubUrl: string;
    techStack: string[];
    role: string;
    problem: string;
    challenges: string;
    solution: string;
    results: string;
    architecture: string;
    features: string[];
  };
}

export default function ProjectDetailsClient({ project }: ProjectDetailsClientProps) {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", label: "Overview", icon: Layers },
    { id: "problem", label: "The Problem", icon: HelpCircle, show: !!project.problem },
    { id: "solution", label: "The Solution", icon: Cpu, show: !!project.solution },
    { id: "architecture", label: "Architecture", icon: Server, show: !!project.architecture },
    { id: "challenges", label: "Challenges", icon: ShieldAlert, show: !!project.challenges },
    { id: "features", label: "Deliverables", icon: Check, show: project.features && project.features.length > 0 },
    { id: "results", label: "Results & Impact", icon: BarChart3, show: !!project.results },
  ];

  const visibleSections = sections.filter(s => s.show !== false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const section of visibleSections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleSections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 120,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-bg-dark text-slate-900 dark:text-white relative overflow-hidden font-sans">
      {/* Cinematic Background Gradients */}
      <div className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] rounded-full bg-lime-500/5 dark:bg-lime-500/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/5 dark:bg-cyan-500/5 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-12">
        {/* Back Link */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-lime-655 dark:hover:text-lime-400 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>

        {/* Cinematic Header Area */}
        <div className="space-y-4 max-w-4xl">
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] text-lime-655 dark:text-lime-400 font-extrabold uppercase tracking-wider bg-lime-50 dark:bg-lime-950/20 px-3.5 py-1.5 rounded-full border border-lime-100 dark:border-lime-900/35">
              {project.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-slate-900 dark:text-white">
            {project.title}
          </h1>

          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-semibold max-w-3xl">
            {project.description}
          </p>
        </div>

        {/* Big Hero Visual */}
        <div className="rounded-3xl border border-slate-205 dark:border-zinc-800/80 overflow-hidden aspect-[21/9] shadow-2xl relative group bg-zinc-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-700 opacity-90"
          />
        </div>

        {/* Two-Column Split Case Study Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-6">
          
          {/* Sticky Left Navigation Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            
            {/* Outline list */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950/40 border border-slate-200 dark:border-zinc-850/80 space-y-4 shadow-sm">
              <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-slate-400">Case Study Sections</h4>
              <nav className="flex flex-col gap-1.5">
                {visibleSections.map((sect) => {
                  const Icon = sect.icon;
                  const isActive = activeSection === sect.id;
                  return (
                    <button
                      key={sect.id}
                      onClick={() => scrollToSection(sect.id)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left w-full cursor-pointer ${
                        isActive
                          ? "bg-lime-600 dark:bg-lime-400 text-white dark:text-black shadow-md"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-350 hover:bg-slate-50 dark:hover:bg-zinc-900/60"
                      }`}
                    >
                      <Icon size={14} className={isActive ? "text-current" : "text-slate-400"} />
                      <span>{sect.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Project Quick Specs Metadata Box */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-955/20 border border-slate-200 dark:border-zinc-850/80 space-y-5 shadow-sm">
              <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-slate-400">Engineering Specs</h4>
              
              {project.role && (
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">My Role</div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">{project.role}</div>
                </div>
              )}

              <div className="space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Technology Stack</div>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack?.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-lime-650 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black font-extrabold text-xs shadow-md transition-colors cursor-pointer"
                  >
                    Launch Live Demo <ExternalLink size={13} />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-250 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-slate-205 font-bold text-xs transition-colors cursor-pointer"
                  >
                    GitHub Source <GithubIcon size={13} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Scrolling Case Study Stream */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Overview Section */}
            <section id="overview" className="scroll-mt-28 space-y-4">
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="text-lime-600 dark:text-lime-400" size={22} /> Overview
              </h2>
              <div className="p-6 md:p-8 bg-white dark:bg-zinc-955/20 border border-slate-200 dark:border-zinc-850/80 rounded-2xl shadow-sm text-sm leading-relaxed text-slate-600 dark:text-slate-350 whitespace-pre-line font-sans">
                {project.extendedDescription || project.description}
              </div>
            </section>

            {/* Problem Section */}
            {project.problem && (
              <section id="problem" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="text-rose-500" size={22} /> Problem & Requirements
                </h2>
                <div className="p-6 md:p-8 bg-white dark:bg-zinc-955/20 border border-slate-200 dark:border-zinc-850/80 rounded-2xl shadow-sm text-sm leading-relaxed text-slate-600 dark:text-slate-350 whitespace-pre-line font-sans">
                  {project.problem}
                </div>
              </section>
            )}

            {/* Solution Section */}
            {project.solution && (
              <section id="solution" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Cpu className="text-lime-600 dark:text-lime-400" size={22} /> Proposed Solution
                </h2>
                <div className="p-6 md:p-8 bg-white dark:bg-zinc-955/20 border border-slate-200 dark:border-zinc-850/80 rounded-2xl shadow-sm text-sm leading-relaxed text-slate-600 dark:text-slate-350 whitespace-pre-line font-sans">
                  {project.solution}
                </div>
              </section>
            )}

            {/* Architecture Section */}
            {project.architecture && (
              <section id="architecture" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Server className="text-cyan-500" size={22} /> System Architecture
                </h2>
                <div className="p-6 md:p-8 bg-white dark:bg-zinc-955/20 border border-slate-200 dark:border-zinc-850/80 rounded-2xl shadow-sm text-sm leading-relaxed text-slate-600 dark:text-slate-350 whitespace-pre-line font-sans">
                  {project.architecture}
                </div>
              </section>
            )}

            {/* Challenges Section */}
            {project.challenges && (
              <section id="challenges" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="text-amber-500" size={22} /> Technical Challenges
                </h2>
                <div className="p-6 md:p-8 bg-white dark:bg-zinc-955/20 border border-slate-200 dark:border-zinc-850/80 rounded-2xl shadow-sm text-sm leading-relaxed text-slate-600 dark:text-slate-350 whitespace-pre-line font-sans">
                  {project.challenges}
                </div>
              </section>
            )}

            {/* Deliverables/Features Section */}
            {project.features && project.features.length > 0 && (
              <section id="features" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Check className="text-lime-600 dark:text-lime-400" size={22} /> Key Deliverables & Features
                </h2>
                <div className="p-6 md:p-8 bg-white dark:bg-zinc-955/20 border border-slate-200 dark:border-zinc-850/80 rounded-2xl shadow-sm space-y-4">
                  <ul className="space-y-3.5">
                    {project.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-655 dark:text-slate-350 leading-relaxed font-sans">
                        <div className="p-0.5 rounded-full bg-lime-100 dark:bg-lime-950/40 text-lime-750 dark:text-lime-400 mt-1 flex-shrink-0">
                          <Check size={12} />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Results Section */}
            {project.results && (
              <section id="results" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="text-emerald-500" size={22} /> Results & Business Impact
                </h2>
                <div className="p-6 md:p-8 bg-gradient-to-tr from-emerald-600/5 to-teal-650/5 border border-emerald-500/10 rounded-2xl shadow-sm text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line font-sans">
                  {project.results}
                </div>
              </section>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}

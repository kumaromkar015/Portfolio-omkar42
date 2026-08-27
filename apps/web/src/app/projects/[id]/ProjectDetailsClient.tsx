"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ShieldAlert, Cpu, Database, Check } from "lucide-react";
import { GithubIcon } from "@/components/BrandIcons";

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
    challenges: string;
    solution: string;
    architecture: string;
    features: string[];
    impact: string;
  };
}

export default function ProjectDetailsClient({ project }: ProjectDetailsClientProps) {
  return (
    <main className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-bg-dark text-slate-900 dark:text-white">
      {/* Background gradients */}
      <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-lime-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-12">
        {/* Back Link */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-lime-655 dark:hover:text-lime-400 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>

        {/* Hero Area */}
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] text-lime-655 dark:text-lime-400 font-bold uppercase tracking-wider bg-lime-50 dark:bg-lime-950/20 px-3 py-1 rounded-full border border-lime-100 dark:border-lime-900/30">
              {project.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {project.title}
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-350 leading-relaxed">
            {project.extendedDescription || project.description}
          </p>

          {/* Action Links */}
          <div className="flex items-center gap-4 pt-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-lime-600 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Launch Live Demo <ExternalLink size={14} />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-800 dark:text-slate-205 border border-slate-350 dark:border-zinc-800/85 font-bold text-xs transition-all cursor-pointer"
              >
                GitHub Source <GithubIcon size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Project Image */}
        <div className="rounded-3xl border border-slate-205 dark:border-zinc-800/80 overflow-hidden aspect-video shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Left Column: Tech Stack & Architecture specs */}
          <div className="md:col-span-4 space-y-6">
            {/* Tech Stack Box */}
            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Deployed Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack?.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Role Box */}
            {project.role && (
              <div className="p-5 rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 space-y-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">My Role</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {project.role}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Case study description */}
          <div className="md:col-span-8 space-y-8">
            {/* Challenges & Solution */}
            <div className="space-y-4">
              {project.challenges && (
                <>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <ShieldAlert size={20} className="text-rose-500" />
                    The Challenge
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {project.challenges}
                  </p>
                </>
              )}

              {project.solution && (
                <>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Cpu size={20} className="text-lime-655 dark:text-lime-450" />
                    The Solution & Architecture
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {project.solution}
                  </p>
                </>
              )}

              {project.architecture && (
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-zinc-950/60 border border-slate-250 dark:border-zinc-900/80 flex gap-3">
                  <Database size={18} className="text-lime-655 dark:text-lime-450 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-400">Architecture Specs</div>
                    <div className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">{project.architecture}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Core Features */}
            {project.features && project.features.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Key Deliverables</h2>
                <ul className="space-y-2.5">
                  {project.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                      <div className="p-0.5 rounded-full bg-lime-100 dark:bg-lime-950/40 text-lime-750 dark:text-lime-400 mt-0.5 flex-shrink-0">
                        <Check size={12} />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Project Impact */}
            {project.impact && (
              <div className="p-6 rounded-2xl bg-gradient-to-tr from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 dark:border-emerald-500/10 space-y-2">
                <h3 className="font-extrabold text-sm text-emerald-755 dark:text-emerald-400 uppercase tracking-wider">Business Impact</h3>
                <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed">
                  {project.impact}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

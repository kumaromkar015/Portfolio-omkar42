"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, GraduationCap, Code2, Target, Calendar, ChevronDown, ChevronUp, Star, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

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
  imageUrl?: string;
}

const FALLBACK_MILESTONES: TimelineMilestone[] = [
  {
    company: "Stripe",
    position: "Senior Frontend Architect",
    duration: "2024 - Present",
    type: "work",
    displayOrder: 0,
    responsibilities: [
      "Lead frontend architectural design for Dashboard payments products, managing complex state transitions and dynamic loading.",
      "Collaborate with product designers to implement the Stripe Design System, focusing on layout spacing, accessibility (WCAG AA), and animation performance.",
      "Optimized load times and edge network rendering for internationalized checkout pages, boosting conversion rates by 4.2% globally."
    ],
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "GraphQL", "Framer Motion"],
    achievements: [
      "Architected the next-gen billing system dashboard, improving UI performance by 40%.",
      "Created an internal design-to-code automation utility used by over 150 engineers."
    ]
  },
  {
    company: "Vercel",
    position: "Staff Software Engineer - DX Team",
    duration: "2022 - 2024",
    type: "work",
    displayOrder: 1,
    responsibilities: [
      "Worked on framework performance features for Next.js App Router, particularly dynamic server routing and code-splitting APIs.",
      "Built developers-focused devtools interfaces, streamlining environment setup and diagnostics deployment."
    ],
    technologies: ["Next.js", "React", "Rust", "Node.js", "TypeScript", "Tailwind CSS"],
    achievements: [
      "Designed and deployed the Next.js DX Devtools Extension, achieving 200k+ active installs."
    ]
  },
  {
    company: "Stanford University",
    position: "M.S. in Computer Science",
    duration: "2018 - 2020",
    type: "education",
    displayOrder: 2,
    responsibilities: [
      "Specialized in Software Systems and Human-Computer Interaction.",
      "Research Assistant in the Stanford HCI Group, publishing papers on collaborative development interfaces."
    ],
    technologies: ["Python", "JavaScript", "C++", "Systems Architecture"],
    achievements: [
      "Graduated with Academic Distinction (GPA 3.95/4.00).",
      "Recipient of the Outstanding Teaching Assistant Award."
    ]
  },
  {
    company: "Linear App",
    position: "Senior Full Stack Engineer",
    duration: "2020 - 2022",
    type: "work",
    displayOrder: 3,
    responsibilities: [
      "Developed high-fidelity keyboard-interactive interfaces and custom search capabilities (Command Palette).",
      "Designed real-time collaborative state sync layers using WebSockets and conflict-free replicated data types (CRDTs)."
    ],
    technologies: ["TypeScript", "React", "Node.js", "PostgreSQL", "WebSockets"],
    achievements: [
      "Shipped the Linear Command Palette feature, reducing average user action times by 18%."
    ]
  },
  {
    company: "Next Gen Portfolio v3",
    position: "AI-Autonomous Portfolio Engine",
    duration: "2026",
    type: "project",
    displayOrder: 4,
    responsibilities: [
      "Designed and implemented a modular monorepo portfolio codebase featuring automatic multi-theme systems, media catalogs, and SEO preview widgets."
    ],
    technologies: ["Next.js", "Tailwind CSS", "Express", "Mongoose", "TypeScript", "Cloudinary"],
    achievements: [
      "Created a robust production-ready template template, yielding 100/100 Lighthouse performance metrics."
    ]
  },
  {
    company: "Future Milestones",
    position: "Principal Architect & Tech Founder",
    duration: "2027 & Beyond",
    type: "goal",
    displayOrder: 5,
    responsibilities: [
      "To build open-source development tools that automate repetitive coding tasks and empower indie makers to ship fast.",
      "Explore distributed web architecture and edge-computed state synchronization frameworks."
    ],
    technologies: ["Rust", "WASM", "Distributed Systems", "AI Agents"],
    achievements: [
      "Drive standard integrations across core open-source repositories."
    ]
  }
];

export default function Experience() {
  const [milestones, setMilestones] = useState<TimelineMilestone[]>([]);
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    api.getExperiences()
      .then((data) => {
        if (data && data.length > 0) {
          // Sort items by displayOrder
          const sorted = [...data].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
          setMilestones(sorted);
        } else {
          setMilestones(FALLBACK_MILESTONES);
        }
      })
      .catch(() => {
        setMilestones(FALLBACK_MILESTONES);
      });
  }, []);

  const toggleExpand = (id: string | number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getMilestoneIcon = (type: TimelineMilestone["type"]) => {
    switch (type) {
      case "education":
        return <GraduationCap size={16} />;
      case "project":
        return <Code2 size={16} />;
      case "goal":
        return <Target size={16} />;
      default:
        return <Briefcase size={16} />;
    }
  };

  const getMilestoneColor = (type: TimelineMilestone["type"]) => {
    switch (type) {
      case "education":
        return "border-violet-500 text-violet-400 bg-violet-950/20";
      case "project":
        return "border-lime-500 text-lime-400 bg-lime-950/20";
      case "goal":
        return "border-amber-500 text-amber-400 bg-amber-950/20";
      default:
        return "border-cyan-500 text-cyan-400 bg-cyan-950/20";
    }
  };

  return (
    <section
      id="experience"
      className="py-24 md:py-32 bg-white dark:bg-bg-dark border-t border-slate-200 dark:border-zinc-900 text-slate-900 dark:text-white overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-lime-100 dark:bg-lime-950/30 text-lime-750 dark:text-lime-400 border border-lime-300 dark:border-lime-500/20 uppercase tracking-wider">
            <Sparkles size={12} /> Interactive Timeline
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide">
            Career Journey
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-semibold leading-relaxed">
            The chronological path of my roles, degrees, major projects, and future technology targets.
          </p>
        </div>

        {/* Vertical Timeline container */}
        <div className="relative">
          {/* Central progress track */}
          <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-zinc-800 -translate-x-1/2" />

          <div className="space-y-12">
            {milestones.map((item, idx) => {
              const itemId = item._id || idx;
              const isEven = idx % 2 === 0;
              const isExpanded = expandedId === itemId;
              const colorClass = getMilestoneColor(item.type);

              return (
                <div 
                  key={itemId}
                  className={`relative flex flex-col md:flex-row items-stretch w-full ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline Dot Node */}
                  <div className="absolute left-4 md:left-1/2 top-6 w-8 h-8 rounded-full border-2 bg-white dark:bg-bg-dark -translate-x-1/2 flex items-center justify-center z-20 shadow-md transition-transform duration-300">
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full border ${colorClass}`}>
                      {getMilestoneIcon(item.type)}
                    </span>
                  </div>

                  {/* Card Container block (alternates side on desktop) */}
                  <div className={`w-full md:w-[calc(50%-2rem)] ml-10 md:ml-0 ${
                    isEven ? "md:pr-8" : "md:pl-8"
                  }`}>
                    <motion.div
                      initial={reducedMotion ? {} : { opacity: 0, y: 35 }}
                      whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.4, ease: "backOut" }}
                      className={`p-6 rounded-3xl bg-slate-905 dark:bg-zinc-950/60 border hover:border-lime-500/30 dark:hover:border-lime-400/30 transition-all duration-300 shadow-sm hover:shadow-lg relative overflow-hidden group cursor-pointer ${
                        isExpanded ? "border-lime-500/40 dark:border-lime-400/40" : "border-slate-205 dark:border-zinc-850"
                      }`}
                      onClick={() => toggleExpand(itemId)}
                    >
                      {/* Image backdrop (optional preview) */}
                      {item.imageUrl && (
                        <div className="absolute right-0 top-0 w-24 h-24 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-300 pointer-events-none">
                          <img src={item.imageUrl} alt="milestone" className="w-full h-full object-cover" />
                        </div>
                      )}

                      {/* Header row */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <span className={`inline-block text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${colorClass}`}>
                              {item.type}
                            </span>
                            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
                              {item.position}
                            </h3>
                            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                              {item.company}
                            </h4>
                          </div>
                          <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 px-2.5 py-1 rounded-full shadow-sm whitespace-nowrap self-start">
                            <Calendar size={10} className="text-lime-500" /> {item.duration}
                          </span>
                        </div>

                        {/* Collapsed view snippet */}
                        {!isExpanded && item.responsibilities?.length > 0 && (
                          <p className="text-[11px] text-slate-500 line-clamp-1 leading-relaxed font-medium">
                            {item.responsibilities[0]}
                          </p>
                        )}
                      </div>

                      {/* Expandable Details Container */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden space-y-4 pt-4 border-t border-slate-200 dark:border-zinc-900/60"
                          >
                            {/* Responsibilities */}
                            {item.responsibilities?.length > 0 && (
                              <div className="space-y-2">
                                <h5 className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500">Details</h5>
                                <ul className="space-y-2 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
                                  {item.responsibilities.map((resp, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-lime-500 mt-1.5 flex-shrink-0" />
                                      <span>{resp}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Achievements */}
                            {item.achievements?.length > 0 && (
                              <div className="space-y-2">
                                <h5 className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500">Achievements</h5>
                                <ul className="space-y-2 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
                                  {item.achievements.map((ach, i) => (
                                    <li key={i} className="flex items-start gap-2 bg-white dark:bg-zinc-900/40 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800/80">
                                      <Star size={11} className="text-amber-400 mt-0.5 flex-shrink-0" />
                                      <span>{ach}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Technologies */}
                            {item.technologies?.length > 0 && (
                              <div className="space-y-2">
                                <h5 className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500">Technologies Deployed</h5>
                                <div className="flex flex-wrap gap-1.5">
                                  {item.technologies.map(tech => (
                                    <span key={tech} className="px-2 py-0.5 text-[9px] bg-slate-200 dark:bg-zinc-900 text-slate-600 dark:text-slate-400 rounded font-semibold border border-slate-300 dark:border-zinc-800/80">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Expand indicator chevron */}
                      <div className="flex justify-center mt-3 pt-2 border-t border-slate-100 dark:border-zinc-900/10 text-slate-400 group-hover:text-lime-500 transition-colors">
                        {isExpanded ? (
                          <span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider">
                            Collapse <ChevronUp size={12} />
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider">
                            Expand Details <ChevronDown size={12} />
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Empty right-side block for desktop layout symmetry */}
                  <div className="hidden md:block w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

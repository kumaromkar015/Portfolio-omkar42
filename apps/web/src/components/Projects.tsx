"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { projectsData, Project } from "@/data/projects";
import { ArrowUpRight, ExternalLink, BookOpen } from "lucide-react";
import { GithubIcon } from "./BrandIcons";
import { api } from "@/lib/api";

type ProjectCategory = "All" | "Full Stack" | "Frontend" | "Open Source";

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const categories: ProjectCategory[] = ["All", "Full Stack", "Frontend", "Open Source"];

  React.useEffect(() => {
    api.getProjects()
      .then((data) => {
        if (data && data.length > 0) {
          // Map Mongo schemas to frontend keys
          const mapped = data.map((p: any) => ({
            id: p._id,
            title: p.title,
            category: (p.featured ? "Full Stack" : "Frontend") as any, // fallback categories map
            description: p.description,
            extendedDescription: p.description,
            techStack: p.techStack || [],
            features: [],
            architecture: "",
            role: "",
            challenges: "",
            solution: "",
            impact: "",
            githubUrl: p.githubUrl || "",
            liveUrl: p.liveUrl || "",
            imageUrl: p.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
          }));
          setProjectsList(mapped);
        } else {
          setProjectsList(projectsData);
        }
      })
      .catch(() => {
        setProjectsList(projectsData);
      });
  }, []);

  const filteredProjects = projectsList.filter((project) => {
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section
      id="projects"
      className="py-20 md:py-28 bg-slate-50 dark:bg-bg-dark border-t border-slate-200 dark:border-slate-900 text-slate-900 dark:text-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-300 border border-violet-200 dark:border-violet-850 inline-block uppercase tracking-wider">
            Case Studies
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Featured Projects
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
            Explore detailed summaries of my core software engineering work, including challenges faced, architecture design, and final impact.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                    : "bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-350 dark:hover:border-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="w-full md:w-72 relative">
            <input
              type="text"
              placeholder="Search projects or stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 text-sm rounded-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-850 rounded-3xl overflow-hidden shadow hover:shadow-2xl hover:border-violet-500/40 dark:hover:border-violet-500/30 transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Project Image card with overlay */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-white text-slate-900 hover:scale-110 transition-transform cursor-pointer"
                      title="Live Demo"
                    >
                      <ExternalLink size={18} />
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-white text-slate-900 hover:scale-110 transition-transform cursor-pointer"
                      title="GitHub Repository"
                    >
                      <GithubIcon size={18} />
                    </a>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] text-violet-600 dark:text-violet-400 font-bold uppercase tracking-wider bg-violet-50 dark:bg-violet-950/40 px-2.5 py-1 rounded-full border border-violet-100 dark:border-violet-900/40 inline-block">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-bold text-slate-950 dark:text-white leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Footer Links */}
                  <div className="border-t border-slate-200 dark:border-slate-850 pt-4 flex justify-between items-center">
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-500 transition-colors cursor-pointer group/link"
                    >
                      <BookOpen size={14} className="group-hover/link:-translate-y-[1px] transition-transform" />
                      Read Case Study
                    </Link>
                    <div className="flex items-center gap-2">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
                        title="GitHub"
                      >
                        <GithubIcon size={16} />
                      </a>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors"
                        title="Live"
                      >
                        <ArrowUpRight size={16} />
                      </a>
                    </div>
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

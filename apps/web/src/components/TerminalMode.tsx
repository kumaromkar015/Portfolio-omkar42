"use client";

import React, { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { X, Terminal as TerminalIcon, CornerDownLeft } from "lucide-react";

interface LogLine {
  text: string;
  type: "input" | "output" | "error" | "success" | "info";
}

interface TerminalModeProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMANDS = ["help", "about", "skills", "projects", "experience", "education", "contact", "resume", "github", "clear"];

export default function TerminalMode({ isOpen, onClose }: TerminalModeProps) {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Real Database Data cache
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Initialize and load real data
  useEffect(() => {
    if (!isOpen) return;

    // Load API data for commands
    Promise.all([
      api.getProfile().catch(() => null),
      api.getSkills().catch(() => []),
      api.getProjects().catch(() => []),
      api.getExperiences().catch(() => []),
    ]).then(([profileRes, skillsRes, projectsRes, experiencesRes]) => {
      setProfile(profileRes);
      setSkills(skillsRes || []);
      setProjects(projectsRes || []);
      setExperiences(experiencesRes || []);
    });

    // Welcome messages
    setLogs([
      { text: "OMKAR PORTFOLIO CLI [Version 4.2.0]", type: "info" },
      { text: "(c) 2026 Omkar. All rights reserved.", type: "info" },
      { text: "-------------------------------------------------", type: "info" },
      { text: "   ___  __  ___ ___  ___ ", type: "success" },
      { text: "  / _ \\/  |/  / _ / / _ \\", type: "success" },
      { text: " / // / /|_/ / __ |/ ___/", type: "success" },
      { text: " \\___/_/  /_/_/ |_/_/     ", type: "success" },
      { text: "-------------------------------------------------", type: "info" },
      { text: "Welcome to the Portfolio terminal console interface.", type: "output" },
      { text: "Type 'help' to list all simulated system commands.", type: "success" },
      { text: "", type: "output" },
    ]);

    // Focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [isOpen]);

  // Scroll to bottom when logs update
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Command History tracking
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex = historyIndex + 1;
      if (newIndex < history.length) {
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = historyIndex - 1;
      if (newIndex >= 0) {
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const trimmed = input.trim().toLowerCase();
      if (!trimmed) return;
      const matches = COMMANDS.filter((cmd) => cmd.startsWith(trimmed));
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        setLogs((prev) => [
          ...prev,
          { text: `$ ${input}`, type: "input" },
          { text: matches.join("    "), type: "info" },
        ]);
      }
    }
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const parts = trimmed.split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const newLogs: LogLine[] = [...logs, { text: `$ ${trimmed}`, type: "input" }];

    // Update command history
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
    setInput("");

    switch (cmd) {
      case "help":
        newLogs.push(
          { text: "Available commands:", type: "success" },
          { text: "  about       - Short biography and background details", type: "output" },
          { text: "  skills      - List programming languages and tech stacks", type: "output" },
          { text: "  projects    - View portfolio projects and details", type: "output" },
          { text: "  experience  - Show professional milestones and roles", type: "output" },
          { text: "  education   - Show educational degrees and studies", type: "output" },
          { text: "  contact     - View contact info and links", type: "output" },
          { text: "  resume      - Open developer resume PDF in new tab", type: "output" },
          { text: "  github      - Redirect to github codebase profile", type: "output" },
          { text: "  clear       - Wipe the screen logs clean", type: "output" }
        );
        break;

      case "clear":
        setLogs([]);
        return;

      case "about":
        if (profile) {
          newLogs.push(
            { text: `Name: ${profile.name}`, type: "success" },
            { text: `Bio: ${profile.bio}`, type: "output" },
            { text: `GitHub: ${profile.social?.github || "N/A"}`, type: "info" },
            { text: `LinkedIn: ${profile.social?.linkedin || "N/A"}`, type: "info" }
          );
        } else {
          newLogs.push({ text: "Loading bio credentials...", type: "error" });
        }
        break;

      case "skills":
        if (skills.length > 0) {
          newLogs.push({ text: "── Dynamic Skills Matrix ──", type: "success" });
          const categories = Array.from(new Set(skills.map((s) => s.category)));
          categories.forEach((cat) => {
            const catSkills = skills.filter((s) => s.category === cat && s.status === "active");
            if (catSkills.length > 0) {
              const skillString = catSkills.map((s) => `${s.name} (${s.progress}%)`).join(", ");
              newLogs.push({ text: `[${cat}]: ${skillString}`, type: "output" });
            }
          });
        } else {
          newLogs.push({ text: "No active skill list matching.", type: "error" });
        }
        break;

      case "projects":
        if (projects.length > 0) {
          newLogs.push({ text: "── Portfolio Project Records ──", type: "success" });
          projects.forEach((proj) => {
            newLogs.push(
              { text: `▶ ${proj.title} [${proj.category}]`, type: "info" },
              { text: `  Description: ${proj.description}`, type: "output" },
              { text: `  Tech Stack: ${proj.techStack?.join(", ")}`, type: "output" },
              { text: `  Live Link: ${proj.liveUrl || "N/A"}`, type: "success" },
              { text: "", type: "output" }
            );
          });
        } else {
          newLogs.push({ text: "No projects loaded.", type: "error" });
        }
        break;

      case "experience":
        const workItems = experiences.filter((e) => e.type === "work" && e.isVisible !== false);
        if (workItems.length > 0) {
          newLogs.push({ text: "── Work Experience Milestones ──", type: "success" });
          workItems.forEach((exp) => {
            newLogs.push(
              { text: `■ ${exp.position} at ${exp.company} (${exp.duration})`, type: "info" },
              { text: `  Key Responsibilities:`, type: "output" },
              ...exp.responsibilities.map((r: string) => ({ text: `    - ${r}`, type: "output" as const })),
              { text: "", type: "output" }
            );
          });
        } else {
          newLogs.push({ text: "No work milestones matching.", type: "error" });
        }
        break;

      case "education":
        const eduItems = experiences.filter((e) => e.type === "education" && e.isVisible !== false);
        if (eduItems.length > 0) {
          newLogs.push({ text: "── Educational Background ──", type: "success" });
          eduItems.forEach((edu) => {
            newLogs.push(
              { text: `🎓 ${edu.position} at ${edu.company} (${edu.duration})`, type: "info" },
              ...edu.responsibilities.map((r: string) => ({ text: `    - ${r}`, type: "output" as const })),
              { text: "", type: "output" }
            );
          });
        } else {
          newLogs.push({ text: "No education entries listed.", type: "error" });
        }
        break;

      case "contact":
        newLogs.push(
          { text: "Drop a line or schedule a call:", type: "success" },
          { text: "  Email:  kumaromkar015@gmail.com", type: "output" },
          { text: "  Site:   https://portfolio-omkar42-frontend.vercel.app", type: "info" }
        );
        break;

      case "resume":
        if (profile?.resumeUrl) {
          newLogs.push({ text: "Redirecting to developer resume PDF...", type: "success" });
          window.open(profile.resumeUrl, "_blank");
        } else {
          newLogs.push({ text: "Resume PDF URL is not configured.", type: "error" });
        }
        break;

      case "github":
        if (profile?.social?.github) {
          newLogs.push({ text: "Opening GitHub repository profile...", type: "success" });
          window.open(profile.social.github, "_blank");
        } else {
          newLogs.push({ text: "Opening generic developer repository...", type: "success" });
          window.open("https://github.com", "_blank");
        }
        break;

      default:
        newLogs.push({ text: `command not recognized: '${cmd}'. Type 'help' to view suggestions.`, type: "error" });
        break;
    }

    setLogs(newLogs);
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] bg-black/95 text-lime-400 font-mono p-6 flex flex-col justify-between"
      onClick={focusInput}
    >
      {/* Top Header info */}
      <div className="flex justify-between items-center border-b border-zinc-800 pb-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <TerminalIcon size={16} className="text-lime-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">System Shell Console</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-slate-450 hover:text-white cursor-pointer hover:border-lime-500/50 transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      {/* Logs Output list */}
      <div className="flex-1 overflow-y-auto py-4 space-y-1.5 text-xs md:text-sm selection:bg-lime-500 selection:text-black">
        {logs.map((log, i) => (
          <div key={i} className="leading-relaxed">
            {log.type === "input" ? (
              <div className="text-slate-400">
                <span className="text-lime-500 font-bold">guest@portfolio:~$</span> {log.text.substring(2)}
              </div>
            ) : (
              <span className={
                log.type === "error" ? "text-rose-500" :
                log.type === "success" ? "text-lime-400 font-bold" :
                log.type === "info" ? "text-cyan-400 font-semibold" :
                "text-slate-200"
              }>
                {log.text}
              </span>
            )}
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>

      {/* Bottom Command Prompt line */}
      <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 border-t border-zinc-800 pt-3" onClick={(e) => e.stopPropagation()}>
        <span className="text-lime-500 font-bold text-xs md:text-sm shrink-0">guest@portfolio:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-0 outline-none text-lime-400 font-mono text-xs md:text-sm"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <button type="submit" className="p-1 text-slate-500 hover:text-lime-400 transition-colors">
          <CornerDownLeft size={14} />
        </button>
      </form>
    </div>
  );
}

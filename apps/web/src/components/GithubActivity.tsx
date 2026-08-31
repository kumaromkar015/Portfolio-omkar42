"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Star, GitFork, BookOpen, Clock, AlertTriangle, Terminal, GitCommit, GitPullRequest, CircleDot } from "lucide-react";
import { GithubIcon } from "./BrandIcons";

interface Repository {
  id: number;
  name: string;
  htmlUrl: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  isFeatured: boolean;
}

interface GithubEvent {
  id: string;
  type: string;
  repoName: string;
  message: string;
  createdAt: string;
}

export default function GithubActivity() {
  const [profile, setProfile] = useState<any>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [events, setEvents] = useState<GithubEvent[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.getGithubSummary()
      .then((res) => {
        if (res) {
          setProfile(res.profile);
          setRepos(res.repos || []);
          setEvents(res.events || []);
          setLastUpdated(res.lastUpdated);
        } else {
          setError(true);
        }
      })
      .catch((err) => {
        console.error("Failed to load GitHub activity:", err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "PushEvent":
        return <GitCommit size={14} className="text-lime-400" />;
      case "PullRequestEvent":
        return <GitPullRequest size={14} className="text-cyan-400" />;
      case "IssuesEvent":
        return <CircleDot size={14} className="text-rose-400" />;
      default:
        return <Terminal size={14} className="text-slate-400" />;
    }
  };

  return (
    <section
      id="github-activity"
      className="py-24 md:py-32 bg-slate-50 dark:bg-bg-dark border-t border-slate-205 dark:border-zinc-900 text-slate-900 dark:text-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-lime-100 dark:bg-lime-950/30 text-lime-750 dark:text-lime-400 border border-lime-300 dark:border-lime-500/20 uppercase tracking-wider">
            <GithubIcon size={12} className="animate-pulse" /> Engineering Activity
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide">
            Live Development
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-semibold leading-relaxed">
            Real-time insights into my active repositories, code contributions, and recent open-source commits.
          </p>
        </div>

        {loading ? (
          // Loading State
          <div className="py-20 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-lime-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          // Error State / Graceful Fallback
          <div className="max-w-md mx-auto p-6 rounded-3xl border border-dashed border-rose-300/40 bg-rose-500/5 text-center space-y-3.5">
            <div className="flex justify-center text-rose-500">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider">GitHub Connection Offline</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              The GitHub API is currently rate-limited or unreachable. Click the button below to visit my repositories page directly.
            </p>
            <a
              href="https://github.com/kumaromkar015"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block py-2 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-lime-500 text-white font-extrabold text-[10px] uppercase tracking-wider transition-colors"
            >
              Visit GitHub Profile
            </a>
          </div>
        ) : (
          // Loaded Data
          <div className="space-y-12">
            
            {/* User Stats Summary */}
            {profile && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white dark:bg-zinc-950/40 border border-slate-205 dark:border-zinc-855 rounded-3xl text-center shadow-sm">
                <div>
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider flex items-center justify-center gap-1"><BookOpen size={11} /> Repositories</div>
                  <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1.5">{profile.public_repos}</div>
                </div>
                <div className="border-l border-slate-200 dark:border-zinc-900/60">
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider flex items-center justify-center gap-1"><Star size={11} /> Profile Stars</div>
                  <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1.5">{repos.reduce((acc, r) => acc + r.stars, 0)}</div>
                </div>
                <div className="border-l border-slate-200 dark:border-zinc-900/60">
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider flex items-center justify-center gap-1"><GitFork size={11} /> Profile Forks</div>
                  <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1.5">{repos.reduce((acc, r) => acc + r.forks, 0)}</div>
                </div>
                <div className="border-l border-slate-200 dark:border-zinc-900/60">
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider flex items-center justify-center gap-1"><Clock size={11} /> Followers</div>
                  <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1.5">{profile.followers}</div>
                </div>
              </div>
            )}

            {/* Split layout: Repos vs Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Column: Public Repositories (Visible & Featured) */}
              <div className="lg:col-span-8 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <BookOpen size={13} className="text-lime-500" /> Selected Repositories
                </h3>
                {repos.length === 0 ? (
                  <div className="p-8 text-center bg-white dark:bg-card-dark border border-slate-200 dark:border-zinc-850 rounded-2xl text-slate-500 italic">No visible repositories to display.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {repos.slice(0, 6).map((repo) => (
                      <a
                        key={repo.id}
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-5 bg-white dark:bg-card-dark border hover:border-lime-500/40 dark:hover:border-lime-400/40 rounded-3xl flex flex-col justify-between hover:shadow-md transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                          repo.isFeatured ? "border-lime-500/20" : "border-slate-200 dark:border-zinc-850"
                        }`}
                      >
                        {repo.isFeatured && (
                          <div className="absolute top-0 right-0 p-1.5 bg-lime-500 text-black text-[7px] font-black uppercase tracking-widest rounded-bl-lg shadow-sm flex items-center gap-0.5">
                            <Star size={8} className="fill-black" /> Top Repo
                          </div>
                        )}
                        <div className="space-y-1.5">
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-lime-400 transition-colors leading-tight flex items-center gap-1.5">
                            {repo.name}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-450 line-clamp-2 leading-relaxed font-semibold">{repo.description || "No custom description defined."}</p>
                        </div>
                        <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 dark:border-zinc-900/60 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-900 rounded border border-slate-200 dark:border-zinc-800 text-slate-550 dark:text-slate-400">{repo.language}</span>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-0.5"><Star size={11} /> {repo.stars}</span>
                            <span className="flex items-center gap-0.5"><GitFork size={11} /> {repo.forks}</span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Commit Timeline feed */}
              <div className="lg:col-span-4 bg-white/40 dark:bg-zinc-950/20 border border-slate-200 dark:border-zinc-900 rounded-3xl p-5 md:p-6 flex flex-col justify-between h-full relative overflow-hidden shadow-sm">
                <div className="space-y-5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Terminal size={13} className="text-lime-500" /> Recent Commits
                  </h3>
                  {events.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No recent push/merge activities resolved.</p>
                  ) : (
                    <div className="space-y-4">
                      {events.slice(0, 5).map((ev) => (
                        <div key={ev.id} className="flex gap-3 text-xs leading-relaxed font-semibold">
                          <div className="mt-1 shrink-0">{getEventIcon(ev.type)}</div>
                          <div className="space-y-0.5">
                            <p className="text-slate-800 dark:text-slate-250 font-bold line-clamp-1">{ev.repoName.split("/")[1]}</p>
                            <p className="text-[11px] text-slate-550 dark:text-slate-450 line-clamp-2 leading-relaxed font-medium">{ev.message}</p>
                            <span className="block text-[8px] text-slate-450 font-black uppercase tracking-widest">{new Date(ev.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Timestamp */}
                {lastUpdated && (
                  <div className="border-t border-slate-100 dark:border-zinc-900/60 pt-4 mt-6 text-[8px] text-slate-400 font-black uppercase tracking-widest text-center flex items-center justify-center gap-1.5">
                    <Clock size={10} className="text-lime-500" /> Last updated: {new Date(lastUpdated).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { GitBranch, Loader2, CheckCircle, AlertCircle, Save, Eye, EyeOff, Star, ArrowUp, ArrowDown } from "lucide-react";

interface Repository {
  id: number;
  name: string;
  fullName: string;
  htmlUrl: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  isVisible: boolean;
  isFeatured: boolean;
  displayOrder: number;
}

export default function AdminGithubPage() {
  const [profile, setProfile] = useState<any>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [customRepoName, setCustomRepoName] = useState("");
  const [addingCustomRepo, setAddingCustomRepo] = useState(false);

  const handleAddCustomRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRepoName || !customRepoName.includes("/")) {
      alert("Please enter a valid repository slug (e.g. owner/repo-name).");
      return;
    }
    setAddingCustomRepo(true);
    try {
      await api.updateGithubConfig({
        repoName: customRepoName.trim(),
        isVisible: true,
        isFeatured: false,
        displayOrder: repos.length,
      });
      setCustomRepoName("");
      setMessage("External/Collaborated repository added successfully!");
      loadData();
    } catch (err: any) {
      setError(err.message || "Failed to add external repository.");
    } finally {
      setAddingCustomRepo(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getGithubSummary(true); // Already unwrapped json.data
      if (res) {
        setProfile(res.profile);
        setRepos(res.repos || []);
      }
    } catch (err) {
      console.error("Failed to load GitHub config data:", err);
      setError("Failed to fetch data from GitHub API. Please check your token or username.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleChange = async (repo: Repository, field: "isVisible" | "isFeatured", value: boolean) => {
    setSubmittingId(`${repo.id}-${field}`);
    const updatedPayload = {
      repoName: repo.fullName,
      isVisible: field === "isVisible" ? value : repo.isVisible,
      isFeatured: field === "isFeatured" ? value : repo.isFeatured,
      displayOrder: repo.displayOrder,
    };

    try {
      await api.updateGithubConfig(updatedPayload);
      setRepos((prev) =>
        prev.map((r) => (r.id === repo.id ? { ...r, [field]: value } : r))
      );
      setMessage(`Updated configuration for ${repo.name}`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update repository configuration.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setSubmittingId(null);
    }
  };

  const handleOrderChange = async (repo: Repository, newOrder: number) => {
    setSubmittingId(`${repo.id}-order`);
    const updatedPayload = {
      repoName: repo.fullName,
      isVisible: repo.isVisible,
      isFeatured: repo.isFeatured,
      displayOrder: newOrder,
    };

    try {
      await api.updateGithubConfig(updatedPayload);
      setRepos((prev) =>
        prev.map((r) => (r.id === repo.id ? { ...r, displayOrder: newOrder } : r))
      );
      setMessage(`Updated order for ${repo.name}`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update display order.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-zinc-800/80 rounded-3xl p-6 md:p-8 space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-zinc-900/60">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <GitBranch className="text-lime-600 dark:text-lime-400" /> GitHub Engineering Settings
          </h2>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
            Customize repository visibility, display order, and featured highlights.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div className="flex gap-2.5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-250 dark:border-emerald-900/60 text-xs font-bold text-emerald-700 dark:text-emerald-450 items-center">
          <CheckCircle size={16} /> <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="flex gap-2.5 p-4 rounded-2xl bg-rose-50 dark:bg-rose-955/40 border border-rose-250 dark:border-rose-900/60 text-xs font-bold text-rose-650 dark:text-rose-455 items-center">
          <AlertCircle size={16} /> <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="animate-spin text-lime-500" size={32} />
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Profile Stats Overview */}
          {profile && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-slate-905 dark:bg-zinc-950/40 border border-slate-205 dark:border-zinc-850 rounded-2xl text-center">
              <div>
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">GitHub Username</div>
                <div className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-1">{profile.login}</div>
              </div>
              <div className="border-l border-slate-200 dark:border-zinc-900/60">
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Public Repos</div>
                <div className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-1">{profile.public_repos}</div>
              </div>
              <div className="border-l border-slate-200 dark:border-zinc-900/60">
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Followers</div>
                <div className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-1">{profile.followers}</div>
              </div>
              <div className="border-l border-slate-200 dark:border-zinc-900/60">
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Forks Count</div>
                <div className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-1">{repos.reduce((acc, curr) => acc + curr.forks, 0)}</div>
              </div>
            </div>
          )}

          {/* Add collaborated repo form */}
          <form onSubmit={handleAddCustomRepo} className="p-5 bg-slate-905 dark:bg-zinc-950/40 border border-slate-205 dark:border-zinc-850 rounded-2xl flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-1.5 w-full">
              <label className="text-[10px] text-slate-455 uppercase tracking-widest font-bold">Add External / Collaborated Repository</label>
              <input
                type="text"
                value={customRepoName}
                onChange={(e) => setCustomRepoName(e.target.value)}
                placeholder="e.g. globalwebify27-svg/Global-Safety-Solution"
                className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={addingCustomRepo}
              className="px-5 py-2.5 rounded-xl bg-lime-650 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black text-xs font-bold shadow-md cursor-pointer transition-colors shrink-0 disabled:opacity-50"
            >
              {addingCustomRepo ? "Adding..." : "Add Repository"}
            </button>
          </form>

          {/* Repos list */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Repositories Matrix</h3>
            <div className="space-y-3">
              {repos.map((repo) => {
                const isSubmitting = (field: string) => submittingId === `${repo.id}-${field}` || submittingId === `${repo.id}-order`;
                
                return (
                  <div
                    key={repo.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-900/10 dark:bg-slate-950/20 border border-slate-200 dark:border-zinc-850 rounded-2xl gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100 truncate">{repo.name}</span>
                        <span className="text-[9px] bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-2 py-0.5 rounded text-slate-400 font-bold uppercase">{repo.language}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-450 line-clamp-1 mt-1 font-semibold">{repo.description || "No description provided."}</p>
                    </div>

                    {/* Configuration Panel */}
                    <div className="flex items-center flex-wrap gap-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider justify-start md:justify-end border-t md:border-t-0 border-slate-150 dark:border-zinc-850 pt-3 md:pt-0">
                      
                      {/* Featured Star toggle */}
                      <label className="flex items-center gap-1.5 cursor-pointer hover:text-lime-400 select-none">
                        <input
                          type="checkbox"
                          checked={repo.isFeatured}
                          disabled={isSubmitting("isFeatured")}
                          onChange={(e) => handleToggleChange(repo, "isFeatured", e.target.checked)}
                          className="w-4 h-4 rounded text-lime-600 focus:ring-lime-500 cursor-pointer accent-lime-500"
                        />
                        <span className="flex items-center gap-1">
                          <Star size={12} className={repo.isFeatured ? "text-amber-500 fill-amber-500" : ""} /> Featured
                        </span>
                      </label>

                      {/* Visibility Eye toggle */}
                      <label className="flex items-center gap-1.5 cursor-pointer hover:text-lime-400 select-none">
                        <input
                          type="checkbox"
                          checked={repo.isVisible}
                          disabled={isSubmitting("isVisible")}
                          onChange={(e) => handleToggleChange(repo, "isVisible", e.target.checked)}
                          className="w-4 h-4 rounded text-lime-600 focus:ring-lime-500 cursor-pointer accent-lime-500"
                        />
                        <span className="flex items-center gap-1">
                          {repo.isVisible ? <Eye size={12} /> : <EyeOff size={12} />} Visible
                        </span>
                      </label>

                      {/* Display Order */}
                      <div className="flex items-center gap-1.5">
                        <span>Order:</span>
                        <input
                          type="number"
                          value={repo.displayOrder}
                          disabled={isSubmitting("order")}
                          onChange={(e) => handleOrderChange(repo, Number(e.target.value))}
                          className="w-14 px-2 py-1 rounded bg-slate-50 dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white text-center font-mono"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

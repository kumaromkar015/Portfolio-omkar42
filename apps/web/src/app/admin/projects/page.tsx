"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plus, Trash2, Edit2, CheckCircle, AlertCircle } from "lucide-react";
import MediaPicker from "@/components/media/MediaPicker";

export default function AdminProjectsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [projects, setProjects] = useState<any[]>([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectTechStack, setProjectTechStack] = useState("");
  const [projectLiveUrl, setProjectLiveUrl] = useState("");
  const [projectGithubUrl, setProjectGithubUrl] = useState("");
  const [projectCoverImage, setProjectCoverImage] = useState("");
  const [projectFeatured, setProjectFeatured] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Case Study & SEO states
  const [projectProblem, setProjectProblem] = useState("");
  const [projectSolution, setProjectSolution] = useState("");
  const [projectRole, setProjectRole] = useState("");
  const [projectChallenges, setProjectChallenges] = useState("");
  const [projectResults, setProjectResults] = useState("");
  const [projectArchitecture, setProjectArchitecture] = useState("");
  const [projectFeatures, setProjectFeatures] = useState("");
  const [projectMetaTitle, setProjectMetaTitle] = useState("");
  const [projectMetaDesc, setProjectMetaDesc] = useState("");
  const [projectMetaKeywords, setProjectMetaKeywords] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const clearAlerts = () => {
    setMessage("");
    setError("");
  };

  const fetchProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (err: any) {
      console.error("Projects load err:", err);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    setLoading(true);

    const projectPayload = {
      title: projectTitle,
      description: projectDesc,
      techStack: projectTechStack.split(",").map((s) => s.trim()).filter(Boolean),
      liveUrl: projectLiveUrl,
      githubUrl: projectGithubUrl,
      coverImage: projectCoverImage,
      featured: projectFeatured,
      problem: projectProblem || undefined,
      solution: projectSolution || undefined,
      role: projectRole || undefined,
      challenges: projectChallenges || undefined,
      results: projectResults || undefined,
      architecture: projectArchitecture || undefined,
      features: projectFeatures ? projectFeatures.split("\n").map((s) => s.trim()).filter(Boolean) : [],
      metaTitle: projectMetaTitle || undefined,
      metaDescription: projectMetaDesc || undefined,
      metaKeywords: projectMetaKeywords || undefined,
    };

    try {
      if (editingProjectId) {
        await api.updateProject(editingProjectId, projectPayload);
        setMessage("Project updated successfully!");
      } else {
        await api.createProject(projectPayload);
        setMessage("Project created successfully!");
      }
      resetProjectForm();
      fetchProjects();
    } catch (err: any) {
      setError(err.message || "Failed to save project.");
    } finally {
      setLoading(false);
    }
  };

  const editProject = (p: any) => {
    setEditingProjectId(p._id);
    setProjectTitle(p.title || "");
    setProjectDesc(p.description || "");
    setProjectTechStack(p.techStack?.join(", ") || "");
    setProjectLiveUrl(p.liveUrl || "");
    setProjectGithubUrl(p.githubUrl || "");
    setProjectCoverImage(p.coverImage || "");
    setProjectFeatured(p.featured || false);
    // Case Study mapping
    setProjectProblem(p.problem || "");
    setProjectSolution(p.solution || "");
    setProjectRole(p.role || "");
    setProjectChallenges(p.challenges || "");
    setProjectResults(p.results || "");
    setProjectArchitecture(p.architecture || "");
    setProjectFeatures(p.features?.join("\n") || "");
    setProjectMetaTitle(p.metaTitle || "");
    setProjectMetaDesc(p.metaDescription || "");
    setProjectMetaKeywords(p.metaKeywords || "");
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    clearAlerts();
    try {
      await api.deleteProject(id);
      setMessage("Project deleted successfully!");
      fetchProjects();
    } catch (err: any) {
      setError(err.message || "Failed to delete project.");
    }
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjectTitle("");
    setProjectDesc("");
    setProjectTechStack("");
    setProjectLiveUrl("");
    setProjectGithubUrl("");
    setProjectCoverImage("");
    setProjectFeatured(false);
    setProjectProblem("");
    setProjectSolution("");
    setProjectRole("");
    setProjectChallenges("");
    setProjectResults("");
    setProjectArchitecture("");
    setProjectFeatures("");
    setProjectMetaTitle("");
    setProjectMetaDesc("");
    setProjectMetaKeywords("");
  };

  return (
    <div className="space-y-8">
      {/* Notifications */}
      {message && (
        <div className="flex gap-2.5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-250 dark:border-emerald-900/60 text-xs font-bold text-emerald-700 dark:text-emerald-450 items-center">
          <CheckCircle size={16} /> <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="flex gap-2.5 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-250 dark:border-rose-900/60 text-xs font-bold text-rose-600 dark:text-rose-455 items-center">
          <AlertCircle size={16} /> <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CRUD Form */}
        <form onSubmit={handleProjectSubmit} className="lg:col-span-7 bg-white dark:bg-card-dark border border-slate-200 dark:border-zinc-800/80 rounded-3xl p-6 space-y-4">
          <h2 className="text-lg font-bold">{editingProjectId ? "Edit Project" : "Create New Project"}</h2>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Project Title</label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              required
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description</label>
            <textarea
              rows={3}
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors resize-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tech Stack (comma separated)</label>
            <input
              type="text"
              placeholder="Next.js, Tailwind, TypeScript"
              value={projectTechStack}
              onChange={(e) => setProjectTechStack(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Live URL</label>
              <input
                type="text"
                value={projectLiveUrl}
                onChange={(e) => setProjectLiveUrl(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">GitHub URL</label>
              <input
                type="text"
                value={projectGithubUrl}
                onChange={(e) => setProjectGithubUrl(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-805 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
              />
            </div>
          </div>
          {/* Case Study Details Accordion */}
          <details className="group border border-slate-200 dark:border-zinc-850 rounded-2xl p-4 bg-slate-50/50 dark:bg-zinc-950/20">
            <summary className="text-xs font-bold uppercase tracking-wider text-lime-650 dark:text-lime-450 cursor-pointer list-none flex items-center justify-between select-none">
              <span>Project Case Study & SEO (Optional)</span>
              <span className="text-[10px] text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            
            <div className="space-y-4 mt-4 border-t border-slate-200 dark:border-zinc-850 pt-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">My Role</label>
                <input
                  type="text"
                  placeholder="e.g. Lead Frontend Architect"
                  value={projectRole}
                  onChange={(e) => setProjectRole(e.target.value)}
                  className="w-full px-4 py-2 text-xs rounded-xl bg-white dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Problem Statement</label>
                <textarea
                  rows={3}
                  placeholder="Describe the challenge or problem this project solved..."
                  value={projectProblem}
                  onChange={(e) => setProjectProblem(e.target.value)}
                  className="w-full px-4 py-2 text-xs rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none resize-none font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Engineering Solution</label>
                <textarea
                  rows={3}
                  placeholder="How was it solved? Detail the methodology..."
                  value={projectSolution}
                  onChange={(e) => setProjectSolution(e.target.value)}
                  className="w-full px-4 py-2 text-xs rounded-xl bg-white dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none resize-none font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Technical Challenges</label>
                <textarea
                  rows={3}
                  placeholder="What were the bottleneck issues (e.g. state size, api latency)?"
                  value={projectChallenges}
                  onChange={(e) => setProjectChallenges(e.target.value)}
                  className="w-full px-4 py-2 text-xs rounded-xl bg-white dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none resize-none font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Business/Technical Results</label>
                <textarea
                  rows={2}
                  placeholder="Performance metrics, speed scores, or user conversion results..."
                  value={projectResults}
                  onChange={(e) => setProjectResults(e.target.value)}
                  className="w-full px-4 py-2 text-xs rounded-xl bg-white dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none resize-none font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">System Architecture</label>
                <textarea
                  rows={3}
                  placeholder="Explain the component flow, state architecture, database or rendering layers..."
                  value={projectArchitecture}
                  onChange={(e) => setProjectArchitecture(e.target.value)}
                  className="w-full px-4 py-2 text-xs rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none resize-none font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Key Features (One per line)</label>
                <textarea
                  rows={3}
                  placeholder="Feature A&#13;&#10;Feature B&#13;&#10;Feature C"
                  value={projectFeatures}
                  onChange={(e) => setProjectFeatures(e.target.value)}
                  className="w-full px-4 py-2 text-xs rounded-xl bg-white dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none resize-none font-sans"
                />
              </div>

              <div className="border-t border-slate-200 dark:border-zinc-850 pt-4 space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Search Engine Optimization (SEO)</h4>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Meta Title</label>
                  <input
                    type="text"
                    placeholder="SEO friendly page title"
                    value={projectMetaTitle}
                    onChange={(e) => setProjectMetaTitle(e.target.value)}
                    className="w-full px-4 py-2 text-xs rounded-xl bg-white dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Meta Description</label>
                  <textarea
                    rows={2}
                    placeholder="Short summary for Google search listings..."
                    value={projectMetaDesc}
                    onChange={(e) => setProjectMetaDesc(e.target.value)}
                    className="w-full px-4 py-2 text-xs rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none resize-none font-sans"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Keywords (comma separated)</label>
                  <input
                    type="text"
                    placeholder="react components, custom mapping, charts"
                    value={projectMetaKeywords}
                    onChange={(e) => setProjectMetaKeywords(e.target.value)}
                    className="w-full px-4 py-2 text-xs rounded-xl bg-white dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                  />
                </div>
              </div>
            </div>
          </details>

          <MediaPicker
            label="Cover Image"
            value={projectCoverImage}
            onChange={setProjectCoverImage}
            typeFilter="image"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="feat"
              checked={projectFeatured}
              onChange={(e) => setProjectFeatured(e.target.checked)}
              className="rounded text-lime-600 focus:ring-lime-500 w-4 h-4 border-slate-300 dark:border-zinc-800/80"
            />
            <label htmlFor="feat" className="text-xs font-semibold text-slate-400">Feature this project at the top</label>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-lime-600 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black text-xs font-bold cursor-pointer disabled:opacity-50 transition-colors"
            >
              <Plus size={14} /> {editingProjectId ? "Save Changes" : "Add Project"}
            </button>
            {editingProjectId && (
              <button
                type="button"
                onClick={resetProjectForm}
                className="px-4.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-800 text-xs font-bold hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* List panel */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-lg font-bold">Existing Projects</h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {projects.map((p) => (
              <div key={p._id} className="p-4 bg-white dark:bg-card-dark border border-slate-200 dark:border-zinc-800/80 rounded-2xl flex justify-between items-center shadow-sm">
                <div>
                  <h4 className="font-bold text-sm text-slate-955 dark:text-white flex items-center gap-2">
                    {p.title}
                    {p.featured && <span className="text-[8px] bg-amber-500/25 border border-amber-500 text-amber-500 px-1 py-0.2 rounded uppercase font-bold">Featured</span>}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{p.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editProject(p)}
                    className="p-2 text-slate-400 hover:text-lime-605 hover:bg-lime-50 dark:hover:bg-lime-950/20 rounded-lg transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => deleteProject(p._id)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

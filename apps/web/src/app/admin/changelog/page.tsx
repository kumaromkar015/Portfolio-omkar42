"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Plus, Edit2, Trash2, X, Save, CheckCircle, AlertCircle, Loader2, Calendar, History, Eye, EyeOff, Star } from "lucide-react";
import MediaPicker from "@/components/media/MediaPicker";

interface Project {
  _id: string;
  title: string;
}

interface ChangelogEntry {
  _id?: string;
  title: string;
  description: string;
  date: string;
  category: "portfolio" | "project" | "career" | "skill" | "other";
  relatedProject?: Project | string | null;
  imageUrl?: string;
  link?: string;
  isPublished: boolean;
  isFeatured: boolean;
  displayOrder: number;
}

export default function AdminChangelogPage() {
  const [changelogs, setChangelogs] = useState<ChangelogEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ChangelogEntry | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState<ChangelogEntry["category"]>("portfolio");
  const [relatedProject, setRelatedProject] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);

  const loadData = async () => {
    setLoading(true);
    try {
      const [clRes, projRes] = await Promise.all([
        api.getChangelogs(true), // Get all including drafts
        api.getProjects(),
      ]);
      setChangelogs(clRes || []);
      setProjects(projRes || []);
    } catch (err) {
      console.error("Failed to load changelog data:", err);
      setError("Failed to fetch changelog or project data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingEntry(null);
    setTitle("");
    setDescription("");
    setDate("");
    setCategory("portfolio");
    setRelatedProject("");
    setImageUrl("");
    setLink("");
    setIsPublished(true);
    setIsFeatured(false);
    setDisplayOrder(changelogs.length);
    setIsModalOpen(true);
  };

  const openEditModal = (item: ChangelogEntry) => {
    setEditingEntry(item);
    setTitle(item.title);
    setDescription(item.description);
    setDate(item.date);
    setCategory(item.category || "portfolio");
    
    // Resolve project ID safely
    const projId = typeof item.relatedProject === "object" ? item.relatedProject?._id : item.relatedProject;
    setRelatedProject(projId || "");
    
    setImageUrl(item.imageUrl || "");
    setLink(item.link || "");
    setIsPublished(item.isPublished !== false);
    setIsFeatured(item.isFeatured || false);
    setDisplayOrder(item.displayOrder || 0);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !date) {
      alert("Title, description and date are required.");
      return;
    }

    const payload = {
      title,
      description,
      date,
      category,
      relatedProject: relatedProject || undefined,
      imageUrl: imageUrl || undefined,
      link: link || undefined,
      isPublished,
      isFeatured,
      displayOrder: Number(displayOrder),
    };

    try {
      if (editingEntry?._id) {
        await api.updateChangelog(editingEntry._id, payload);
        setMessage("Changelog entry updated successfully!");
      } else {
        await api.createChangelog(payload);
        setMessage("Changelog entry created successfully!");
      }
      setIsModalOpen(false);
      loadData();
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save changelog entry.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this changelog entry?")) {
      try {
        await api.deleteChangelog(id);
        setMessage("Changelog entry deleted successfully!");
        loadData();
        setTimeout(() => setMessage(""), 3000);
      } catch (err: any) {
        setError(err.message || "Failed to delete changelog entry.");
        setTimeout(() => setError(""), 3000);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-card-dark border border-slate-205 dark:border-zinc-800/80 rounded-3xl p-6 md:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-zinc-900/60">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <History className="text-lime-600 dark:text-lime-400" /> Portfolio Changelog Manager
          </h2>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
            Log updates, projects history, milestones, and version history.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-lime-650 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-md"
        >
          <Plus size={14} /> Add Entry
        </button>
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
      ) : changelogs.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl bg-slate-905 dark:bg-bg-dark/10 text-slate-500">
          <h3 className="text-sm font-bold uppercase tracking-wider">No Changelog Entries Found</h3>
          <p className="text-xs text-slate-650 mt-1">Publish your first development update.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {changelogs.map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-slate-900/10 dark:bg-slate-950/20 border border-slate-200 dark:border-zinc-850 rounded-2xl gap-4"
            >
              <div className="flex items-start gap-4">
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider text-black mt-1 ${
                  item.category === "portfolio" ? "bg-lime-400" :
                  item.category === "project" ? "bg-cyan-400" :
                  item.category === "career" ? "bg-violet-400" : "bg-amber-400"
                }`}>
                  {item.category}
                </span>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    {item.title}
                    {item.isFeatured && (
                      <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5"><Star size={8} className="fill-amber-500" /> Featured</span>
                    )}
                    {!item.isPublished && (
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-400/15 px-2 py-0.5 rounded-full flex items-center gap-0.5"><EyeOff size={8} /> Draft</span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-550 dark:text-slate-450 mt-1 font-semibold flex items-center gap-1">
                    <Calendar size={11} /> {item.date} {typeof item.relatedProject === "object" && item.relatedProject && `• Related: ${item.relatedProject.title}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4.5 justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-150 dark:border-zinc-850">
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                  Order: {item.displayOrder}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 rounded bg-slate-905 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:text-lime-450 cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id!)}
                    className="p-2 rounded bg-rose-955/20 border border-rose-900/40 text-rose-500 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-hidden text-slate-900 dark:text-white">
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-955 border border-slate-200 dark:border-zinc-850 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-900/60 px-6 py-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                {editingEntry ? "Edit Changelog Entry" : "Add Changelog Entry"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded bg-slate-100 dark:bg-zinc-900 text-slate-450 hover:text-rose-500 cursor-pointer">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div className="space-y-1.5">
                <label>Changelog Title*</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Portfolio 2.0 Launch, Integrated Map API"
                  className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label>Type / Category*</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="portfolio">Portfolio Core</option>
                    <option value="project">Project Updates</option>
                    <option value="career">Career Journey</option>
                    <option value="skill">Skill Upgrades</option>
                    <option value="other">General updates</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label>Timeline Date (e.g. AUG 2026)*</label>
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. AUG 2026, Sept 2025"
                    className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label>Description / Details*</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details about what changed, improved or shipped..."
                  rows={4}
                  className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label>Related Project (Optional)</label>
                  <select
                    value={relatedProject}
                    onChange={(e) => setRelatedProject(e.target.value)}
                    className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="">None</option>
                    {projects.map((proj) => (
                      <option key={proj._id} value={proj._id}>
                        {proj.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label>Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label>External Verification link (Optional)</label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="e.g. https://github.com/..."
                  className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <MediaPicker label="Changelog Preview Image (Optional)" value={imageUrl} onChange={setImageUrl} typeFilter="image" />
              </div>

              <div className="flex gap-6 items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="w-4.5 h-4.5 accent-lime-500 cursor-pointer" />
                  <span>Published (Visible)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-4.5 h-4.5 accent-lime-500 cursor-pointer" />
                  <span>Featured Update</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-900/60 flex justify-end gap-3.5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-250 dark:border-zinc-800 hover:bg-slate-905 hover:text-white transition-colors cursor-pointer text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-lime-650 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black text-xs font-bold shadow-md cursor-pointer">
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

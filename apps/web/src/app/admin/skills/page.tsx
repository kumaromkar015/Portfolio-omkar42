"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plus, Trash2, Edit2, CheckCircle, AlertCircle, Sparkles, FolderOpen, ArrowUp, ArrowDown } from "lucide-react";
import MediaPicker from "@/components/media/MediaPicker";

const CATEGORIES = ["Frontend", "Backend", "Database", "Languages", "Cloud & DevOps", "Tools & Design"] as const;

export default function AdminSkillsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [skills, setSkills] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<typeof CATEGORIES[number]>("Frontend");
  const [iconName, setIconName] = useState("Code2");
  const [iconUrl, setIconUrl] = useState("");
  const [progress, setProgress] = useState(80);
  const [experienceLevel, setExperienceLevel] = useState<"Expert" | "Advanced" | "Intermediate">("Advanced");
  const [years, setYears] = useState(2);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<"active" | "inactive">("active");
  
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const clearAlerts = () => {
    setMessage("");
    setError("");
  };

  const fetchSkills = async () => {
    try {
      const res = await api.getSkills();
      setSkills(res);
    } catch (err: any) {
      console.error("Skills load err:", err);
    }
  };

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    setLoading(true);

    const payload = {
      name,
      description,
      category,
      iconName,
      iconUrl,
      progress: Number(progress),
      experienceLevel,
      years: Number(years),
      displayOrder: Number(displayOrder),
      featured,
      status,
    };

    try {
      if (editingSkillId) {
        await api.updateSkill(editingSkillId, payload);
        setMessage("Skill updated successfully!");
      } else {
        await api.createSkill(payload);
        setMessage("Skill added successfully!");
      }
      resetForm();
      fetchSkills();
    } catch (err: any) {
      setError(err.message || "Failed to save skill.");
    } finally {
      setLoading(false);
    }
  };

  const editSkill = (s: any) => {
    setEditingSkillId(s._id);
    setName(s.name || "");
    setDescription(s.description || "");
    setCategory(s.category || "Frontend");
    setIconName(s.iconName || "Code2");
    setIconUrl(s.iconUrl || "");
    setProgress(s.progress || 80);
    setExperienceLevel(s.experienceLevel || "Advanced");
    setYears(s.years || 2);
    setDisplayOrder(s.displayOrder || 0);
    setFeatured(s.featured || false);
    setStatus(s.status || "active");
  };

  const deleteSkill = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    clearAlerts();
    try {
      await api.deleteSkill(id);
      setMessage("Skill deleted successfully!");
      fetchSkills();
    } catch (err: any) {
      setError(err.message || "Failed to delete skill.");
    }
  };

  const handleMoveOrder = async (s: any, direction: "up" | "down") => {
    clearAlerts();
    const newOrder = direction === "up" ? s.displayOrder - 1 : s.displayOrder + 1;
    try {
      await api.updateSkill(s._id, { displayOrder: newOrder });
      fetchSkills();
    } catch (err: any) {
      setError("Failed to update ordering.");
    }
  };

  const resetForm = () => {
    setEditingSkillId(null);
    setName("");
    setDescription("");
    setCategory("Frontend");
    setIconName("Code2");
    setIconUrl("");
    setProgress(80);
    setExperienceLevel("Advanced");
    setYears(2);
    setDisplayOrder(0);
    setFeatured(false);
    setStatus("active");
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
        <div className="flex gap-2.5 p-4 rounded-2xl bg-rose-50 dark:bg-rose-955/40 border border-rose-250 dark:border-rose-900/60 text-xs font-bold text-rose-650 dark:text-rose-455 items-center">
          <AlertCircle size={16} /> <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Add/Edit Form */}
        <form onSubmit={handleSkillSubmit} className="lg:col-span-6 bg-white dark:bg-card-dark border border-slate-205 dark:border-zinc-800/80 rounded-3xl p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="text-lime-600 dark:text-lime-400" size={18} />
            {editingSkillId ? "Edit Technical Skill" : "Add Technical Skill"}
          </h2>
          
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Skill Name</label>
            <input
              type="text"
              placeholder="e.g. Next.js, Docker, Java"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description</label>
            <textarea
              placeholder="Describe how you apply this technology..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Lucide Icon Name</label>
              <input
                type="text"
                placeholder="Code2, Server, Database"
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Proficiency %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                required
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Exp Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
              >
                <option value="Expert">Expert</option>
                <option value="Advanced">Advanced</option>
                <option value="Intermediate">Intermediate</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Years Exp</label>
              <input
                type="number"
                min="0"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                required
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Display Order</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <MediaPicker
            label="Custom Icon Image (Optional)"
            value={iconUrl}
            onChange={setIconUrl}
            typeFilter="image"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="skillFeatured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded text-lime-600 focus:ring-lime-500 w-4 h-4 border-slate-350 dark:border-zinc-800/80 cursor-pointer"
            />
            <label htmlFor="skillFeatured" className="text-xs font-semibold text-slate-550 dark:text-slate-400 cursor-pointer">Feature this skill in key highlights</label>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-lime-600 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black text-xs font-bold cursor-pointer disabled:opacity-50 transition-colors shadow"
            >
              <Plus size={14} /> {editingSkillId ? "Save Changes" : "Add Skill"}
            </button>
            {editingSkillId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-800 text-xs font-bold hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Grouped Skills List */}
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-lg font-bold">Manage Technical Matrix</h2>
          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
            {CATEGORIES.map((cat) => {
              const catSkills = skills.filter((s) => s.category === cat);
              if (catSkills.length === 0) return null;
              
              return (
                <div key={cat} className="space-y-2 bg-slate-905 dark:bg-zinc-950/20 border border-slate-205 dark:border-zinc-900 rounded-3xl p-5">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-lime-650 dark:text-lime-400 border-b border-slate-200 dark:border-zinc-900 pb-1.5">{cat}</h3>
                  <div className="space-y-2.5 mt-3">
                    {catSkills.map((s) => (
                      <div key={s._id} className="p-3 bg-white dark:bg-card-dark border border-slate-200 dark:border-zinc-800/80 rounded-2xl flex justify-between items-center shadow-sm">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-slate-950 dark:text-white flex items-center gap-1.5">
                            {s.name}
                            {s.featured && <span className="text-[8px] bg-lime-500/25 border border-lime-500 text-lime-600 dark:text-lime-400 px-1 py-0.2 rounded font-bold uppercase">Featured</span>}
                            {s.status === "inactive" && <span className="text-[8px] bg-rose-500/25 border border-rose-500 text-rose-500 px-1 py-0.2 rounded font-bold uppercase">Inactive</span>}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wide">
                            {s.experienceLevel} • {s.years} yrs exp • order: {s.displayOrder}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMoveOrder(s, "up")}
                            className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded transition-colors cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            onClick={() => handleMoveOrder(s, "down")}
                            className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded transition-colors cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            onClick={() => editSkill(s)}
                            className="p-1.5 text-slate-400 hover:text-lime-650 dark:hover:text-lime-400 rounded-lg transition-colors cursor-pointer ml-1"
                            title="Edit"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => deleteSkill(s._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

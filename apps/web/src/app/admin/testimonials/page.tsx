"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Plus, Edit2, Trash2, X, Save, CheckCircle, AlertCircle, Loader2, MessageSquare, Eye, EyeOff, Star, Link as LinkIcon } from "lucide-react";
import MediaPicker from "@/components/media/MediaPicker";

interface Testimonial {
  _id?: string;
  name: string;
  role: string;
  organization: string;
  quote: string;
  photoUrl?: string;
  profileUrl?: string;
  featured: boolean;
  displayOrder: number;
  isVisible: boolean;
  relationship?: string;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Testimonial | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [organization, setOrganization] = useState("");
  const [quote, setQuote] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [relationship, setRelationship] = useState("Professional collaborator");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getTestimonials(true); // Fetch all including hidden ones
      setTestimonials(res || []);
    } catch (err) {
      console.error("Failed to load testimonials:", err);
      setError("Failed to fetch testimonials from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingEntry(null);
    setName("");
    setRole("");
    setOrganization("");
    setQuote("");
    setPhotoUrl("");
    setProfileUrl("");
    setFeatured(false);
    setDisplayOrder(testimonials.length);
    setIsVisible(true);
    setRelationship("Professional collaborator");
    setIsModalOpen(true);
  };

  const openEditModal = (item: Testimonial) => {
    setEditingEntry(item);
    setName(item.name);
    setRole(item.role);
    setOrganization(item.organization);
    setQuote(item.quote);
    setPhotoUrl(item.photoUrl || "");
    setProfileUrl(item.profileUrl || "");
    setFeatured(item.featured || false);
    setDisplayOrder(item.displayOrder || 0);
    setIsVisible(item.isVisible !== false);
    setRelationship(item.relationship || "Professional collaborator");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !organization || !quote) {
      alert("Name, Role, Organization and Quote are required.");
      return;
    }

    const payload = {
      name,
      role,
      organization,
      quote,
      photoUrl: photoUrl || undefined,
      profileUrl: profileUrl || undefined,
      featured,
      displayOrder: Number(displayOrder),
      isVisible,
      relationship: relationship || undefined,
    };

    try {
      if (editingEntry?._id) {
        await api.updateTestimonial(editingEntry._id, payload);
        setMessage("Testimonial updated successfully!");
      } else {
        await api.createTestimonial(payload);
        setMessage("Testimonial created successfully!");
      }
      setIsModalOpen(false);
      loadData();
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save testimonial.");
      setTimeout(() => setError(""), 3500);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await api.deleteTestimonial(id);
        setMessage("Testimonial deleted successfully!");
        loadData();
        setTimeout(() => setMessage(""), 3000);
      } catch (err: any) {
        setError(err.message || "Failed to delete testimonial.");
        setTimeout(() => setError(""), 3500);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-card-dark border border-slate-205 dark:border-zinc-800/80 rounded-3xl p-6 md:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-zinc-900/60">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="text-lime-600 dark:text-lime-400" /> Testimonials Manager
          </h2>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
            Manage endorsements, recommendations, and reviews from clients, colleagues, and collaborators.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-lime-650 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-md"
        >
          <Plus size={14} /> Add Testimonial
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
      ) : testimonials.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl bg-slate-905 dark:bg-bg-dark/10 text-slate-500">
          <h3 className="text-sm font-bold uppercase tracking-wider">No Testimonials Found</h3>
          <p className="text-xs text-slate-650 mt-1">Add your first professional client recommendation.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((item) => (
            <div
              key={item._id}
              className="p-5 bg-slate-900/10 dark:bg-slate-950/20 border border-slate-200 dark:border-zinc-850 rounded-2xl flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {item.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.photoUrl} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-zinc-800" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-205 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs">
                        {item.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        {item.name}
                        {item.featured && <Star size={12} className="fill-amber-500 text-amber-500" />}
                      </h4>
                      <p className="text-[11px] text-slate-450 font-semibold leading-tight">
                        {item.role} @ <span className="text-lime-650 dark:text-lime-400">{item.organization}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider bg-slate-200 dark:bg-zinc-950 text-slate-500 px-2 py-0.5 rounded border border-slate-250 dark:border-zinc-800 font-bold shrink-0">
                    {item.relationship}
                  </span>
                </div>
                <p className="text-xs text-slate-550 dark:text-slate-400 italic line-clamp-3 leading-relaxed font-sans">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-zinc-900/60 text-[10px] text-slate-400 font-bold">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-bold">
                    {item.isVisible ? (
                      <span className="text-emerald-500 flex items-center gap-0.5"><Eye size={11} /> Visible</span>
                    ) : (
                      <span className="text-slate-450 flex items-center gap-0.5"><EyeOff size={11} /> Hidden</span>
                    )}
                  </span>
                  <span>Order: {item.displayOrder}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:text-lime-450 cursor-pointer"
                  >
                    <Edit2 size={11} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id!)}
                    className="p-1.5 rounded bg-rose-955/20 border border-rose-900/40 text-rose-500 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                  >
                    <Trash2 size={11} />
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
                {editingEntry ? "Edit Testimonial" : "Add Testimonial"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded bg-slate-100 dark:bg-zinc-900 text-slate-450 hover:text-rose-500 cursor-pointer">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label>Person Name*</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label>Relationship Type</label>
                  <input
                    type="text"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder="e.g. Managed Omkar directly, Client"
                    className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label>Role / Position*</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Director of Engineering"
                    className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label>Organization / Company*</label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Google, TechCorp"
                    className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label>Recommendation Quote*</label>
                <textarea
                  required
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Paste the recommendation message or quote here..."
                  rows={4}
                  className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label>LinkedIn / Profile URL (Optional)</label>
                  <input
                    type="text"
                    value={profileUrl}
                    onChange={(e) => setProfileUrl(e.target.value)}
                    placeholder="e.g. https://linkedin.com/in/..."
                    className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                  />
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
                <MediaPicker label="Profile Photo (Optional)" value={photoUrl} onChange={setPhotoUrl} typeFilter="image" />
              </div>

              <div className="flex gap-6 items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} className="w-4.5 h-4.5 accent-lime-500 cursor-pointer" />
                  <span>Visible (Show on Site)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4.5 h-4.5 accent-lime-500 cursor-pointer" />
                  <span>Featured Testimonial</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-900/60 flex justify-end gap-3.5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-250 dark:border-zinc-800 hover:bg-slate-905 hover:text-white transition-colors cursor-pointer text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-lime-650 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black text-xs font-bold shadow-md cursor-pointer">
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

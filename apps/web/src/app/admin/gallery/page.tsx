"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import MediaPicker from "@/components/media/MediaPicker";
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff, Loader2, Calendar, MapPin } from "lucide-react";

interface GalleryItemData {
  _id?: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: "professional" | "work" | "events" | "achievements" | "journey";
  date?: string;
  location?: string;
  altText?: string;
  isFeatured: boolean;
  displayOrder: number;
  isVisible: boolean;
}

const CATEGORIES = [
  { value: "professional", label: "Professional" },
  { value: "work", label: "Work" },
  { value: "events", label: "Events" },
  { value: "achievements", label: "Achievements" },
  { value: "journey", label: "Journey" },
];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItemData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItemData | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState<GalleryItemData["category"]>("professional");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [altText, setAltText] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Fetch Items
  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await api.getGalleryItems({ all: true });
      setItems(data || []);
    } catch (err) {
      console.error("Failed to fetch gallery items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setTitle("");
    setDescription("");
    setImageUrl("");
    setCategory("professional");
    setDate("");
    setLocation("");
    setAltText("");
    setIsFeatured(false);
    setDisplayOrder(items.length); // Default to bottom
    setIsVisible(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryItemData) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description || "");
    setImageUrl(item.imageUrl);
    setCategory(item.category);
    setDate(item.date ? new Date(item.date).toISOString().split("T")[0] : "");
    setLocation(item.location || "");
    setAltText(item.altText || "");
    setIsFeatured(item.isFeatured);
    setDisplayOrder(item.displayOrder);
    setIsVisible(item.isVisible);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) {
      alert("Title and Image URL are required");
      return;
    }

    const payload: Omit<GalleryItemData, "_id"> = {
      title,
      description,
      imageUrl,
      category,
      date: date || undefined,
      location,
      altText,
      isFeatured,
      displayOrder: Number(displayOrder),
      isVisible,
    };

    try {
      if (editingItem?._id) {
        await api.updateGalleryItem(editingItem._id, payload);
      } else {
        await api.createGalleryItem(payload);
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (err: any) {
      alert(err.message || "Failed to save gallery item");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this gallery item?")) {
      try {
        await api.deleteGalleryItem(id);
        fetchItems();
      } catch (err: any) {
        alert(err.message || "Failed to delete item");
      }
    }
  };

  return (
    <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-zinc-800/80 rounded-3xl p-6 md:p-8 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-zinc-900/60">
        <div>
          <h2 className="text-xl font-bold">Beyond the Code Gallery</h2>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
            Manage professional history images and career moments.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-lime-650 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-md"
        >
          <Plus size={14} /> Add Item
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="animate-spin text-lime-500" size={32} />
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl bg-slate-905 dark:bg-bg-dark/10 text-slate-500">
          <h3 className="text-sm font-bold uppercase tracking-wider">No Gallery Items Found</h3>
          <p className="text-xs text-slate-650 mt-1">Upload your first event, work environment, or professional career photo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item._id}
              className="group border border-slate-200 dark:border-zinc-850 bg-slate-900/10 dark:bg-slate-950/20 rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-slate-950/80 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-slate-950/90 border border-slate-800 text-lime-400">
                  {item.category}
                </span>
                {item.isFeatured && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-lime-500 text-black shadow-md">
                    Featured
                  </span>
                )}
              </div>

              <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.description || "No description provided."}</p>
                </div>

                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold space-y-1">
                  {item.date && (
                    <div className="flex items-center gap-1.5">
                      <Calendar size={11} /> {new Date(item.date).toLocaleDateString()}
                    </div>
                  )}
                  {item.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={11} /> {item.location}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-zinc-900/60 text-xs">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">
                    Order: {item.displayOrder}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 rounded bg-slate-905 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:text-lime-400 transition-colors cursor-pointer"
                      title="Edit Item"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id!)}
                      className="p-2 rounded bg-rose-955/20 border border-rose-900/40 text-rose-500 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                      title="Delete Item"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-hidden text-slate-900 dark:text-white">
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-900/60 px-6 py-4">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                {editingItem ? "Edit Gallery Item" : "Add Gallery Item"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded bg-slate-100 dark:bg-zinc-900 text-slate-450 hover:text-rose-500 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div className="space-y-1.5">
                <label>Title*</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter event name or work milestone"
                  className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-lime-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label>Category*</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
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
                    className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label>Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label>Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this career event, conference, or moment"
                  rows={3}
                  className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <MediaPicker
                  label="Gallery Image*"
                  value={imageUrl}
                  onChange={setImageUrl}
                  typeFilter="image"
                />
              </div>

              <div className="space-y-1.5">
                <label>Alt Text (SEO/Accessibility)</label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="e.g. Omkar presenting at Next.js conference"
                  className="w-full px-4 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-250 dark:border-zinc-800 text-slate-900 dark:text-white outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="flex gap-6 items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4.5 h-4.5 accent-lime-500 cursor-pointer"
                  />
                  <span>Featured Item</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={(e) => setIsVisible(e.target.checked)}
                    className="w-4.5 h-4.5 accent-lime-500 cursor-pointer"
                  />
                  <span>Visible (Publish)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-900/60 flex justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-250 dark:border-zinc-800 hover:bg-slate-905 hover:text-white transition-colors cursor-pointer text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-lime-650 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

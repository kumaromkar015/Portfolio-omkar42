import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import MediaCard from "./MediaCard";
import MediaDetails from "./MediaDetails";
import MediaUploader from "./MediaUploader";
import MediaUrlInput from "./MediaUrlInput";
import { Search, Grid, UploadCloud, ChevronLeft, ChevronRight, Filter, Link2, Globe, Cloud } from "lucide-react";

interface MediaLibraryProps {
  onSelectMedia?: (media: any) => void;
  selectedUrl?: string;
  typeFilter?: "all" | "image" | "pdf" | "audio" | "video";
}

export default function MediaLibrary({ onSelectMedia, selectedUrl, typeFilter }: MediaLibraryProps) {
  const [activeTab, setActiveTab] = useState<"library" | "upload" | "url">("library");
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Filters & Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState(typeFilter || "all");         // 'all' | 'image' | 'pdf'
  const [source, setSource] = useState("all");     // 'all' | 'cloudinary' | 'external'
  const [folder, setFolder] = useState("");
  const [limit] = useState(12);

  const folders = [
    { label: "All Folders", value: "" },
    { label: "General", value: "portfolio/general" },
    { label: "Profile", value: "portfolio/profile" },
    { label: "Projects", value: "portfolio/projects" },
    { label: "Blog", value: "portfolio/blog" },
    { label: "Resume", value: "portfolio/resume" },
    { label: "Audio", value: "portfolio/audio" },
    { label: "External URL", value: "portfolio/external" },
  ];

  const types = [
    { label: "All Types", value: "all" },
    { label: "Images", value: "image" },
    { label: "Videos", value: "video" },
    { label: "Documents (PDF)", value: "pdf" },
    { label: "Audio", value: "audio" },
  ];

  const sources = [
    { label: "All Sources", value: "all" },
    { label: "Cloudinary", value: "cloudinary" },
    { label: "External Link", value: "external" },
  ];

  useEffect(() => {
    if (activeTab === "library") {
      fetchMedia();
    }
  }, [page, type, folder, source, activeTab]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await api.getMedia({
        page,
        limit,
        type,
        folder,
        search,
        source,
      });
      setMediaList(res.media || []);
      setTotalPages(res.pagination?.totalPages || 1);

      // Pre-select matching or first item
      if (res.media && res.media.length > 0) {
        const matchingItem = selectedUrl 
          ? res.media.find((item: any) => item.secureUrl === selectedUrl)
          : null;
        setSelectedItem(matchingItem || res.media[0]);
      } else {
        setSelectedItem(null);
      }
    } catch (err) {
      console.error("Failed to fetch media assets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchTrigger = () => {
    setPage(1);
    fetchMedia();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchTrigger();
    }
  };

  const handleUploadSuccess = () => {
    setActiveTab("library");
    setPage(1);
    fetchMedia();
  };

  const handleUrlSuccess = () => {
    setActiveTab("library");
    setPage(1);
    fetchMedia();
  };

  return (
    <div className="space-y-6">
      {/* Tab Selectors */}
      <div className="flex justify-between items-center border-b border-slate-205 dark:border-zinc-800/80 pb-2.5">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("library")}
            className={`flex items-center gap-1.5 pb-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeTab === "library"
                ? "border-lime-600 text-lime-650 dark:border-lime-400 dark:text-lime-400"
                : "border-transparent text-slate-450 hover:text-slate-200"
            }`}
          >
            <Grid size={15} /> Media Grid
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-1.5 pb-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeTab === "upload"
                ? "border-lime-600 text-lime-650 dark:border-lime-400 dark:text-lime-400"
                : "border-transparent text-slate-450 hover:text-slate-200"
            }`}
          >
            <UploadCloud size={15} /> Upload Files
          </button>
          <button
            onClick={() => setActiveTab("url")}
            className={`flex items-center gap-1.5 pb-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeTab === "url"
                ? "border-lime-600 text-lime-650 dark:border-lime-400 dark:text-lime-400"
                : "border-transparent text-slate-450 hover:text-slate-200"
            }`}
          >
            <Link2 size={15} /> Add URL
          </button>
        </div>
      </div>

      {activeTab === "upload" && (
        <div className="max-w-2xl">
          <MediaUploader defaultFolder={folder || "portfolio/general"} onUploadSuccess={handleUploadSuccess} />
        </div>
      )}

      {activeTab === "url" && (
        <div className="max-w-2xl">
          <MediaUrlInput onSuccess={handleUrlSuccess} />
        </div>
      )}

      {activeTab === "library" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main List Section */}
          <div className="lg:col-span-8 space-y-5">
            {/* Search & Filter Bar (DIV structure, no nested forms!) */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-3 text-slate-500" size={16} />
                <input
                  type="text"
                  placeholder="Search assets by name or link..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-905 dark:bg-zinc-950 border border-slate-205 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
                />
              </div>

              <div className="flex gap-2">
                {/* Source filter */}
                <select
                  value={source}
                  onChange={(e) => {
                    setSource(e.target.value);
                    setPage(1);
                  }}
                  className="px-3.5 py-2.5 text-xs font-bold rounded-xl bg-slate-905 dark:bg-zinc-950 border border-slate-205 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
                >
                  {sources.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>

                {/* Folder filter */}
                <select
                  value={folder}
                  onChange={(e) => {
                    setFolder(e.target.value);
                    setPage(1);
                  }}
                  className="px-3.5 py-2.5 text-xs font-bold rounded-xl bg-slate-905 dark:bg-zinc-950 border border-slate-205 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
                >
                  {folders.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>

                {/* Type filter */}
                {!typeFilter && (
                  <select
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value as "all" | "image" | "pdf");
                      setPage(1);
                    }}
                    className="px-3.5 py-2.5 text-xs font-bold rounded-xl bg-slate-905 dark:bg-zinc-950 border border-slate-205 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
                  >
                    {types.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                )}
                
                <button
                  type="button"
                  onClick={handleSearchTrigger}
                  className="px-4 py-2.5 text-xs font-bold text-white dark:text-black bg-lime-600 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 rounded-xl transition-all cursor-pointer shadow-md"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Media Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="aspect-video bg-slate-900/30 border border-slate-850 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : mediaList.length === 0 ? (
              <div className="py-20 border border-dashed border-slate-800 rounded-3xl text-center space-y-4 bg-slate-900/10 text-slate-500">
                <Filter size={32} className="mx-auto text-slate-750" />
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">No Media Assets Found</h3>
                  <p className="text-xs text-slate-600 mt-1">Upload your first asset or add an external URL.</p>
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("upload")}
                    className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-850 rounded-xl transition-colors cursor-pointer"
                  >
                    Upload Media
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("url")}
                    className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-850 rounded-xl transition-colors cursor-pointer"
                  >
                    Add from URL
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {mediaList.map((media) => (
                  <MediaCard
                    key={media._id}
                    media={media}
                    isSelected={selectedItem?._id === media._id}
                    onClick={() => setSelectedItem(media)}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center border-t border-slate-850 pt-4 text-xs">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold hover:text-white transition-colors cursor-pointer disabled:opacity-40"
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                <span className="text-slate-400 font-bold">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold hover:text-white transition-colors cursor-pointer disabled:opacity-40"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Details Sidebar / Selection Pane */}
          <div className="lg:col-span-4 space-y-4">
            <MediaDetails media={selectedItem} onDeleteSuccess={fetchMedia} />

            {/* Selector mode action button */}
            {onSelectMedia && selectedItem && (
              <button
                type="button"
                onClick={() => onSelectMedia(selectedItem)}
                className="w-full py-3.5 rounded-2xl bg-lime-600 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(163,230,53,0.3)] transition-all cursor-pointer active:scale-[0.99]"
              >
                Select File
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

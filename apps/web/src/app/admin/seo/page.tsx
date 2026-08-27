"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Save, CheckCircle, AlertCircle, Globe, Search, Monitor, Share2 } from "lucide-react";
import MediaPicker from "@/components/media/MediaPicker";

const PAGES = ["home", "about", "projects", "services", "blog", "contact"] as const;

type PageKey = typeof PAGES[number];

export default function AdminSeoPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Tabs
  const [activeTab, setActiveTab] = useState<"global" | "pages">("global");
  const [activePageTab, setActivePageTab] = useState<PageKey>("home");

  // Global SEO States
  const [siteTitle, setSiteTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [defaultOgImage, setDefaultOgImage] = useState("");
  const [robots, setRobots] = useState("index, follow");
  const [author, setAuthor] = useState("");
  const [siteName, setSiteName] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [keywords, setKeywords] = useState("");

  // Page SEO States (grouped in object)
  const [pageSeo, setPageSeo] = useState<Record<PageKey, any>>({
    home: {},
    about: {},
    projects: {},
    services: {},
    blog: {},
    contact: {},
  });

  useEffect(() => {
    fetchSeo();
  }, []);

  const clearAlerts = () => {
    setMessage("");
    setError("");
  };

  const fetchSeo = async () => {
    try {
      const res = await api.getSeo();
      const global = res.global || {};
      setSiteTitle(global.siteTitle || "");
      setMetaDescription(global.metaDescription || "");
      setSiteUrl(global.siteUrl || "");
      setDefaultOgImage(global.defaultOgImage || "");
      setRobots(global.robots || "index, follow");
      setAuthor(global.author || "");
      setSiteName(global.siteName || "");
      setTwitterHandle(global.twitterHandle || "");
      setKeywords(global.keywords?.join(", ") || "");

      const pages = res.pages || {};
      const newPageSeo: any = {};
      PAGES.forEach((pk) => {
        newPageSeo[pk] = pages[pk] || {
          title: "",
          description: "",
          canonicalUrl: "",
          ogTitle: "",
          ogDescription: "",
          ogImage: "",
          robots: "index, follow",
        };
      });
      setPageSeo(newPageSeo);
    } catch (err: any) {
      console.error("SEO load err:", err);
    }
  };

  const handlePageSeoChange = (pk: PageKey, field: string, val: string) => {
    setPageSeo((prev) => ({
      ...prev,
      [pk]: {
        ...prev[pk],
        [field]: val,
      },
    }));
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    setLoading(true);

    const payload = {
      global: {
        siteTitle,
        metaDescription,
        siteUrl,
        defaultOgImage,
        robots,
        author,
        siteName,
        keywords: keywords.split(",").map((s) => s.trim()).filter(Boolean),
        twitterHandle,
      },
      pages: pageSeo,
    };

    try {
      await api.updateSeo(payload);
      setMessage("SEO settings updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update SEO settings.");
    } finally {
      setLoading(false);
    }
  };

  // Preview helper values
  const activePageData = pageSeo[activePageTab] || {};
  const previewTitle = activePageData.title || `${activePageTab.toUpperCase()} | ${siteTitle || "Portfolio"}`;
  const previewDesc = activePageData.description || metaDescription || "No page description set.";
  const previewOgTitle = activePageData.ogTitle || previewTitle;
  const previewOgDesc = activePageData.ogDescription || previewDesc;
  const previewOgImg = activePageData.ogImage || defaultOgImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800";

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

      {/* Main Tab Nav */}
      <div className="flex justify-between items-center border-b border-slate-205 dark:border-zinc-800/80 pb-2.5">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("global")}
            className={`flex items-center gap-1.5 pb-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeTab === "global"
                ? "border-lime-600 text-lime-650 dark:border-lime-400 dark:text-lime-400"
                : "border-transparent text-slate-450 hover:text-slate-200"
            }`}
          >
            <Globe size={15} /> Global Configurations
          </button>
          <button
            onClick={() => setActiveTab("pages")}
            className={`flex items-center gap-1.5 pb-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
              activeTab === "pages"
                ? "border-lime-600 text-lime-650 dark:border-lime-400 dark:text-lime-400"
                : "border-transparent text-slate-450 hover:text-slate-200"
            }`}
          >
            <Search size={15} /> Page-Level Overrides
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container */}
        <form onSubmit={handleSaveSeo} className="lg:col-span-7 bg-white dark:bg-card-dark border border-slate-205 dark:border-zinc-800/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
          {activeTab === "global" && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-lime-650 dark:text-lime-400">Site-Wide SEO</h3>
              
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Default Site Title</label>
                <input
                  type="text"
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Meta Description</label>
                <textarea
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Website URL</label>
                  <input
                    type="text"
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Robots Directive</label>
                  <select
                    value={robots}
                    onChange={(e) => setRobots(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
                  >
                    <option value="index, follow">Index, Follow</option>
                    <option value="noindex, nofollow">No-Index, No-Follow</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Author Name</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Site Name</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Twitter Handle</label>
                  <input
                    type="text"
                    value={twitterHandle}
                    onChange={(e) => setTwitterHandle(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Default Meta Keywords (comma separated)</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-450 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
                />
              </div>

              <MediaPicker
                label="Site Default OG Image"
                value={defaultOgImage}
                onChange={setDefaultOgImage}
                typeFilter="image"
              />
            </div>
          )}

          {activeTab === "pages" && (
            <div className="space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-1.5">
                {PAGES.map((pk) => (
                  <button
                    key={pk}
                    type="button"
                    onClick={() => setActivePageTab(pk)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      activePageTab === pk
                        ? "bg-lime-500/15 text-lime-650 dark:text-lime-400 border border-lime-500/30"
                        : "bg-slate-50 dark:bg-zinc-900 text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    {pk}
                  </button>
                ))}
              </div>

              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-550 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-zinc-900">
                SEO overrides for <span className="text-lime-600 dark:text-lime-400 font-black">{activePageTab.toUpperCase()}</span> page:
              </h4>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Page SEO Title</label>
                <input
                  type="text"
                  value={pageSeo[activePageTab]?.title || ""}
                  onChange={(e) => handlePageSeoChange(activePageTab, "title", e.target.value)}
                  placeholder={`${activePageTab.toUpperCase()} | Site Title`}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Page Meta Description</label>
                <textarea
                  rows={3}
                  value={pageSeo[activePageTab]?.description || ""}
                  onChange={(e) => handlePageSeoChange(activePageTab, "description", e.target.value)}
                  placeholder="Custom details regarding this specific section..."
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Canonical URL</label>
                  <input
                    type="text"
                    value={pageSeo[activePageTab]?.canonicalUrl || ""}
                    onChange={(e) => handlePageSeoChange(activePageTab, "canonicalUrl", e.target.value)}
                    placeholder={`${siteUrl}/${activePageTab}`}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Robots Directive</label>
                  <select
                    value={pageSeo[activePageTab]?.robots || "index, follow"}
                    onChange={(e) => handlePageSeoChange(activePageTab, "robots", e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
                  >
                    <option value="index, follow">Index, Follow</option>
                    <option value="noindex, nofollow">No-Index, No-Follow</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-zinc-900">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">OG Title</label>
                    <input
                      type="text"
                      value={pageSeo[activePageTab]?.ogTitle || ""}
                      onChange={(e) => handlePageSeoChange(activePageTab, "ogTitle", e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">OG Description</label>
                    <textarea
                      rows={2}
                      value={pageSeo[activePageTab]?.ogDescription || ""}
                      onChange={(e) => handlePageSeoChange(activePageTab, "ogDescription", e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-zinc-955 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white outline-none focus:border-lime-500 dark:focus:border-lime-450 focus:ring-1 focus:ring-lime-500/25 transition-colors resize-none"
                    />
                  </div>
                </div>
                
                <MediaPicker
                  label="OG Share Image"
                  value={pageSeo[activePageTab]?.ogImage || ""}
                  onChange={(val) => handlePageSeoChange(activePageTab, "ogImage", val)}
                  typeFilter="image"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-lime-600 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 transition-colors"
          >
            <Save size={15} /> {loading ? "Updating..." : "Save SEO Details"}
          </button>
        </form>

        {/* Live SEO Preview Panel */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-lg font-bold">Search & Share Previews</h3>
          
          {/* SERP Search Preview */}
          <div className="bg-white dark:bg-card-dark border border-slate-205 dark:border-zinc-800/80 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 border-b border-slate-100 dark:border-zinc-900 pb-2">
              <Monitor size={14} className="text-lime-600 dark:text-lime-400" /> Google Search Preview
            </div>
            <div className="font-sans space-y-1 text-left">
              {/* Domain path */}
              <div className="text-[11px] text-[#202124] dark:text-slate-400 truncate flex items-center gap-1">
                {siteUrl || "https://omkarkumar.dev"}
                <span className="text-[10px] text-slate-500">› {activePageTab}</span>
              </div>
              {/* SEO Title */}
              <h4 className="text-sm md:text-base text-[#1a0dab] dark:text-sky-400 hover:underline cursor-pointer font-medium leading-tight">
                {previewTitle}
              </h4>
              {/* Snippet Meta description */}
              <p className="text-[12px] text-[#4d5156] dark:text-slate-300 leading-normal line-clamp-2">
                {previewDesc}
              </p>
            </div>
          </div>

          {/* Social Share OG Preview */}
          <div className="bg-white dark:bg-card-dark border border-slate-205 dark:border-zinc-800/80 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 border-b border-slate-100 dark:border-zinc-900 pb-2">
              <Share2 size={14} className="text-lime-600 dark:text-lime-400" /> Open Graph Social Card
            </div>
            
            <div className="border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-zinc-950/40 text-left">
              {/* Image box */}
              <div className="relative aspect-[1.91/1] w-full bg-slate-900 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewOgImg} alt="OG Social Card Preview" className="object-cover w-full h-full" />
              </div>
              
              {/* Description texts */}
              <div className="p-4 space-y-1 border-t border-slate-200 dark:border-zinc-800">
                <div className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">{siteName || "Portfolio"}</div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{previewOgTitle}</h4>
                <p className="text-[10px] text-slate-450 dark:text-slate-400 line-clamp-1 leading-normal">{previewOgDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

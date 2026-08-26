import React, { useState, useEffect } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import { Link2, AlertCircle, FileText, Image as ImageIcon } from "lucide-react";

interface MediaUrlInputProps {
  onSuccess: (media: any) => void;
}

export default function MediaUrlInput({ onSuccess }: MediaUrlInputProps) {
  const [url, setUrl] = useState("");
  const [resourceType, setResourceType] = useState<"image" | "raw">("image");
  const [mimeType, setMimeType] = useState("image/jpeg");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewValid, setPreviewValid] = useState(false);

  useEffect(() => {
    if (!url) {
      setPreviewValid(false);
      setError(null);
      return;
    }

    // Try to auto-detect mimeType and resourceType from extension
    const cleanUrl = url.trim();
    try {
      const parsed = new URL(cleanUrl);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        setError("Only HTTP and HTTPS URLs are allowed");
        setPreviewValid(false);
        return;
      }
      setError(null);
      
      const pathname = parsed.pathname.toLowerCase();
      if (pathname.endsWith(".pdf")) {
        setResourceType("raw");
        setMimeType("application/pdf");
        setPreviewValid(true);
      } else if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) {
        setResourceType("image");
        setMimeType("image/jpeg");
        setPreviewValid(true);
      } else if (pathname.endsWith(".png")) {
        setResourceType("image");
        setMimeType("image/png");
        setPreviewValid(true);
      } else if (pathname.endsWith(".webp")) {
        setResourceType("image");
        setMimeType("image/webp");
        setPreviewValid(true);
      } else if (pathname.endsWith(".gif")) {
        setResourceType("image");
        setMimeType("image/gif");
        setPreviewValid(true);
      } else if (pathname.endsWith(".svg")) {
        setResourceType("image");
        setMimeType("image/svg+xml");
        setPreviewValid(true);
      } else {
        // Unknown extension, let the user specify but default to image
        setPreviewValid(resourceType === "image");
      }
    } catch (err) {
      setError("Please enter a valid URL");
      setPreviewValid(false);
    }
  }, [url, resourceType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error || !url) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.addMediaUrl({
        url: url.trim(),
        resourceType,
        mimeType,
      });
      onSuccess(res);
      setUrl("");
    } catch (err: any) {
      setError(err.message || "Failed to add external URL media");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/30 border border-slate-800 p-6 rounded-3xl">
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-350 flex items-center gap-1.5">
          <Link2 size={14} className="text-violet-500" /> Media URL
        </label>
        <input
          type="text"
          placeholder="https://example.com/assets/my-photo.jpg"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-950 border border-slate-850 text-slate-200 outline-none focus:border-violet-500 transition-colors"
        />
        {error && (
          <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-1 mt-1">
            <AlertCircle size={12} /> {error}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Media Type Select */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-350">Media Type</label>
          <div className="flex flex-col gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-900">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-350 cursor-pointer">
              <input
                type="radio"
                name="resourceType"
                checked={resourceType === "image"}
                onChange={() => {
                  setResourceType("image");
                  setMimeType("image/jpeg");
                }}
                className="text-violet-600 focus:ring-violet-500 rounded-full"
              />
              Image
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-350 cursor-pointer">
              <input
                type="radio"
                name="resourceType"
                checked={resourceType === "raw"}
                onChange={() => {
                  setResourceType("raw");
                  setMimeType("application/pdf");
                }}
                className="text-violet-600 focus:ring-violet-500 rounded-full"
              />
              PDF / Document
            </label>
          </div>
        </div>

        {/* Live URL Preview Container */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-350">Live Preview</label>
          <div className="relative aspect-video w-full rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center overflow-hidden">
            {url && previewValid && !error ? (
              resourceType === "image" ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={url} alt="External Preview" className="object-cover w-full h-full" onError={() => setPreviewValid(false)} />
              ) : (
                <div className="flex flex-col items-center text-slate-500 gap-1.5">
                  <FileText size={28} className="text-violet-500" />
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-violet-500/10 px-2 py-0.5 rounded-full text-violet-400">PDF Document</span>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center text-slate-700 text-center p-4">
                <ImageIcon size={28} className="mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider">No Preview Available</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !!error || !url}
        className="w-full py-3 rounded-xl bg-violet-650 hover:bg-violet-600 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-[0.98] disabled:opacity-40 cursor-pointer"
      >
        {loading ? "Adding External Media..." : "Add Media URL"}
      </button>
    </form>
  );
}

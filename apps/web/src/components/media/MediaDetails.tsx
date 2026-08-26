import React, { useState, useEffect } from "react";
import { formatBytes } from "./MediaCard";
import { api } from "@/lib/api";
import { FileText, Copy, ExternalLink, Trash2, AlertTriangle, Globe, Cloud } from "lucide-react";

interface MediaDetailsProps {
  media: any;
  onDeleteSuccess: () => void;
}

export default function MediaDetails({ media, onDeleteSuccess }: MediaDetailsProps) {
  const [copyingUrl, setCopyingUrl] = useState(false);
  const [copyingId, setCopyingId] = useState(false);
  const [checkingRefs, setCheckingRefs] = useState(false);
  const [references, setReferences] = useState<any[]>([]);
  const [isReferenced, setIsReferenced] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (media) {
      setReferences([]);
      setIsReferenced(false);
      setShowWarning(false);
      checkReferences();
    }
  }, [media]);

  const checkReferences = async () => {
    if (!media) return;
    setCheckingRefs(true);
    try {
      const res = await api.getMediaReferences(media._id);
      setIsReferenced(res.isReferenced);
      setReferences(res.references || []);
    } catch (err) {
      console.error("Failed to check references:", err);
    } finally {
      setCheckingRefs(false);
    }
  };

  if (!media) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-3xl bg-slate-900/10 text-slate-500">
        <FileText size={32} className="text-slate-600 mb-2 animate-bounce" />
        <h3 className="text-sm font-bold uppercase tracking-wider">No Asset Selected</h3>
        <p className="text-xs text-slate-650 mt-1 max-w-[200px]">
          Select an image or document from the library to view details.
        </p>
      </div>
    );
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(media.secureUrl);
    setCopyingUrl(true);
    setTimeout(() => setCopyingUrl(false), 1500);
  };

  const handleCopyId = () => {
    if (media.publicId) {
      navigator.clipboard.writeText(media.publicId);
      setCopyingId(true);
      setTimeout(() => setCopyingId(false), 1500);
    }
  };

  const handleDeleteClick = () => {
    if (isReferenced) {
      setShowWarning(true);
    } else {
      const confirmMsg = media.source === "external"
        ? "Are you sure you want to delete this external URL reference from the database?"
        : "Are you sure you want to delete this file from the database and Cloudinary?";
      if (confirm(confirmMsg)) {
        proceedDeletion();
      }
    }
  };

  const proceedDeletion = async () => {
    setDeleting(true);
    try {
      await api.deleteMedia(media._id);
      onDeleteSuccess();
    } catch (err: any) {
      alert(err.message || "Failed to delete asset");
    } finally {
      setDeleting(false);
      setShowWarning(false);
    }
  };

  const isExternal = media.source === "external";
  const filename = media.originalFilename || "external-media";

  return (
    <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-5 space-y-6">
      {showWarning ? (
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-2 text-rose-500">
            <AlertTriangle size={24} className="animate-pulse" />
            <h3 className="text-md font-extrabold uppercase tracking-wider">Warning: In Use!</h3>
          </div>
          <p className="text-xs text-slate-350 leading-relaxed">
            This asset is currently referenced in:
          </p>
          <div className="space-y-2 max-h-[150px] overflow-y-auto bg-rose-950/20 border border-rose-900/40 p-3 rounded-xl">
            {references.map((ref, idx) => (
              <div key={idx} className="flex justify-between text-xs font-semibold">
                <span className="text-rose-400 uppercase tracking-wider text-[10px] bg-rose-500/10 px-2 py-0.5 rounded-full">{ref.type}</span>
                <span className="text-slate-200 truncate max-w-[150px]">{ref.name}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-rose-455 font-bold">
            Deleting it will break these references. Do you want to proceed?
          </p>
          <div className="flex gap-2">
            <button
              onClick={proceedDeletion}
              disabled={deleting}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer disabled:opacity-50 transition-colors"
            >
              {deleting ? "Deleting..." : "Force Delete"}
            </button>
            <button
              onClick={() => setShowWarning(false)}
              className="flex-1 py-2.5 rounded-xl border border-slate-750 text-slate-300 font-bold text-xs cursor-pointer hover:bg-slate-900 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
            Asset Metadata
          </h3>

          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between border-b border-slate-850/50 pb-2">
              <span className="text-slate-500 font-bold">Filename</span>
              <span className="text-slate-200 font-semibold truncate max-w-[150px]" title={filename}>
                {filename}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-850/50 pb-2">
              <span className="text-slate-500 font-bold">Source</span>
              <span className="text-slate-200 font-semibold flex items-center gap-1">
                {isExternal ? (
                  <>
                    <Globe size={12} className="text-cyan-400" />
                    <span className="text-cyan-400 uppercase tracking-wider text-[10px]">External URL</span>
                  </>
                ) : (
                  <>
                    <Cloud size={12} className="text-violet-400" />
                    <span className="text-violet-400 uppercase tracking-wider text-[10px]">Cloudinary</span>
                  </>
                )}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-850/50 pb-2">
              <span className="text-slate-500 font-bold">Type</span>
              <span className="text-slate-200 font-semibold uppercase tracking-wider text-[10px]">{media.format || "unknown"}</span>
            </div>
            {media.bytes !== undefined && media.bytes !== null && (
              <div className="flex justify-between border-b border-slate-850/50 pb-2">
                <span className="text-slate-500 font-bold">Size</span>
                <span className="text-slate-200 font-semibold">{formatBytes(media.bytes)}</span>
              </div>
            )}
            {media.width && media.height && (
              <div className="flex justify-between border-b border-slate-850/50 pb-2">
                <span className="text-slate-500 font-bold">Dimensions</span>
                <span className="text-slate-200 font-semibold">
                  {media.width} × {media.height} px
                </span>
              </div>
            )}
            {media.folder && (
              <div className="flex justify-between border-b border-slate-850/50 pb-2">
                <span className="text-slate-500 font-bold">Folder</span>
                <span className="text-slate-200 font-semibold truncate max-w-[150px]">{media.folder}</span>
              </div>
            )}
            <div className="flex justify-between pb-1">
              <span className="text-slate-500 font-bold">Uploaded</span>
              <span className="text-slate-200 font-semibold">
                {new Date(media.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleCopyUrl}
              className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Copy size={13} /> Copy Secure URL
              </span>
              <span className="text-[10px] text-violet-400 font-bold">{copyingUrl ? "Copied!" : ""}</span>
            </button>
            {!isExternal && media.publicId && (
              <button
                onClick={handleCopyId}
                className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Copy size={13} /> Copy Public ID
                </span>
                <span className="text-[10px] text-violet-400 font-bold">{copyingId ? "Copied!" : ""}</span>
              </button>
            )}
            <a
              href={media.secureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-2 justify-center px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-all text-center"
            >
              <ExternalLink size={13} /> Open Asset
            </a>
            <button
              onClick={handleDeleteClick}
              disabled={deleting || checkingRefs}
              className="w-full flex items-center gap-2 justify-center px-4 py-2.5 text-xs font-bold text-rose-500 hover:text-white bg-rose-950/20 hover:bg-rose-600 border border-rose-900/50 hover:border-rose-500 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              <Trash2 size={13} /> {deleting ? "Deleting..." : "Delete Asset"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

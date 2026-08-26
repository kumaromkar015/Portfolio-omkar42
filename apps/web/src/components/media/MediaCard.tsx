import React from "react";
import Image from "next/image";
import { FileText, Globe, Cloud } from "lucide-react";

interface MediaCardProps {
  media: {
    _id: string;
    source: "cloudinary" | "external";
    publicId?: string;
    secureUrl: string;
    resourceType: string;
    type: string;
    format?: string;
    originalFilename?: string;
    folder?: string;
    bytes?: number;
    width?: number;
    height?: number;
  };
  isSelected: boolean;
  onClick: () => void;
}

export function formatBytes(bytes?: number, decimals = 2) {
  if (bytes === undefined || bytes === null) return "";
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export default function MediaCard({ media, isSelected, onClick }: MediaCardProps) {
  const isImage = media.resourceType === "image";
  const sizeStr = formatBytes(media.bytes);
  const isExternal = media.source === "external";
  const filename = media.originalFilename || "external-media";

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden bg-slate-900/40 border cursor-pointer transition-all duration-300 ${
        isSelected
          ? "border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.3)] bg-violet-950/20"
          : "border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
      }`}
    >
      {/* Media Preview Area */}
      <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-900">
        {isImage ? (
          <Image
            src={media.secureUrl}
            alt={filename}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500 space-y-2">
            <FileText size={36} className="text-violet-500 animate-pulse" />
            {media.format && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded-full">
                {media.format}
              </span>
            )}
          </div>
        )}

        {/* Source Badge Overlay */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-950/80 border border-slate-800 shadow backdrop-blur-sm">
          {isExternal ? (
            <>
              <Globe size={10} className="text-cyan-400" />
              <span className="text-cyan-400">External</span>
            </>
          ) : (
            <>
              <Cloud size={10} className="text-violet-400" />
              <span className="text-violet-400">Cloudinary</span>
            </>
          )}
        </div>

        {/* Selected Checkbox Overlay */}
        {isSelected && (
          <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
            ✓
          </div>
        )}
      </div>

      {/* Info footer */}
      <div className="p-3 space-y-1">
        <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-violet-400 transition-colors" title={filename}>
          {filename}
        </h4>
        <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
          <span>{media.format || "unknown"}</span>
          <span>{sizeStr || "External URL"}</span>
        </div>
        {media.folder && (
          <p className="text-[9px] text-slate-650 truncate font-semibold">
            {media.folder}
          </p>
        )}
      </div>
    </div>
  );
}

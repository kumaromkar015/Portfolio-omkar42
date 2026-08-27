import React, { useState, useEffect } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import MediaLibrary from "./MediaLibrary";
import { FolderOpen, X, Image as ImageIcon, FileText } from "lucide-react";

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  typeFilter?: "all" | "image" | "pdf";
}

export default function MediaPicker({ value, onChange, label, typeFilter = "all" }: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSelect = (media: any) => {
    // Validate selected asset file type
    if (typeFilter === "pdf" && !media.secureUrl.toLowerCase().endsWith(".pdf")) {
      alert("Validation Error: Please select a valid PDF document asset.");
      return;
    }
    if (typeFilter === "image" && media.secureUrl.toLowerCase().endsWith(".pdf")) {
      alert("Validation Error: Please select an image asset, not a PDF.");
      return;
    }
    onChange(media.secureUrl);
    setIsOpen(false);
  };

  const isImage = value && (value.match(/\.(jpg|jpeg|png|webp|gif)/i) || !value.toLowerCase().endsWith(".pdf"));

  const modalContent = isOpen && (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-hidden text-slate-900 dark:text-white">
      <div className="relative w-full max-w-5xl h-[85vh] bg-slate-955 border border-slate-850 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-slate-900 px-6 py-4.5 bg-slate-950">
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-200">
              Select {label}
            </h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              Media Library Asset Selector
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-500 hover:border-rose-900/40 hover:bg-rose-955/20 transition-all cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/90">
          <MediaLibrary onSelectMedia={handleSelect} selectedUrl={value} typeFilter={typeFilter} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-450">
        {label}
      </label>

      <div className="flex flex-col sm:flex-row gap-3.5 items-start sm:items-center bg-slate-900/30 border border-slate-800 p-4 rounded-2xl">
        {/* Thumbnail Preview Area */}
        <div className="relative w-20 h-20 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-850 overflow-hidden flex-shrink-0">
          {value ? (
            isImage ? (
              <Image src={value} alt="Preview" fill className="object-cover" />
            ) : (
              <FileText className="text-lime-600 dark:text-lime-400 animate-pulse" size={24} />
            )
          ) : (
            <ImageIcon className="text-slate-800" size={24} />
          )}
        </div>

        {/* Input & Action Trigger */}
        <div className="flex-1 w-full space-y-2">
          <input
            type="text"
            readOnly
            placeholder="No media asset selected"
            value={value}
            className="w-full px-4 py-2 text-xs font-semibold rounded-xl bg-slate-950 border border-slate-850 text-slate-450 outline-none select-all"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-lime-600 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black text-xs font-bold transition-colors cursor-pointer active:scale-95 shadow-md"
            >
              <FolderOpen size={13} /> Select Asset
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-colors cursor-pointer hover:bg-slate-955 active:scale-95"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Render Modal via Portal to avoid nesting under parent component form */}
      {mounted && isOpen && typeof document !== "undefined"
        ? createPortal(modalContent, document.body)
        : null}
    </div>
  );
}

import React, { useState, useRef } from "react";
import { api } from "@/lib/api";
import { UploadCloud, CheckCircle, AlertCircle, X, RefreshCw } from "lucide-react";

interface MediaUploaderProps {
  defaultFolder?: string;
  onUploadSuccess: (media: any) => void;
}

interface UploadTask {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  errorMsg?: string;
}

export default function MediaUploader({ defaultFolder = "portfolio/general", onUploadSuccess }: MediaUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [folder, setFolder] = useState(defaultFolder);
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const folders = [
    "portfolio/general",
    "portfolio/profile",
    "portfolio/projects",
    "portfolio/blog",
    "portfolio/resume",
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addFiles(Array.from(e.target.files));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const addFiles = (files: File[]) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
      "video/x-msvideo"
    ];
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB

    const newTasks: UploadTask[] = files.map((file) => {
      let errorMsg = undefined;
      let status: UploadTask["status"] = "pending";

      if (!allowedTypes.includes(file.type)) {
        errorMsg = "Invalid format. Allowed: JPG, PNG, WEBP, GIF, PDF, MP4, WEBM, OGG, MOV, AVI";
        status = "error";
      } else if (file.size > maxSizeBytes) {
        errorMsg = "Size exceeds 10MB limit";
        status = "error";
      }

      return {
        id: Math.random().toString(36).substring(2, 9),
        file,
        progress: 0,
        status,
        errorMsg,
      };
    });

    setTasks((prev) => [...newTasks, ...prev]);

    // Automatically trigger upload for pending tasks
    newTasks.forEach((task) => {
      if (task.status === "pending") {
        uploadFile(task.id, task.file);
      }
    });
  };

  const uploadFile = async (taskId: string, file: File) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "uploading", progress: 20 } : t))
    );

    try {
      // Since fetch progress stream is complex, we simulate progress visually and make the actual upload request
      const progressTimer = setInterval(() => {
        setTasks((prev) =>
          prev.map((t) => {
            if (t.id === taskId && t.status === "uploading" && t.progress < 90) {
              return { ...t, progress: t.progress + 15 };
            }
            return t;
          })
        );
      }, 300);

      const uploadedMedia = await api.uploadMedia(file, folder);
      clearInterval(progressTimer);

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: "success", progress: 100 } : t))
      );

      onUploadSuccess(uploadedMedia);
    } catch (err: any) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: "error", errorMsg: err.message || "Upload failed" } : t))
      );
    }
  };

  const removeTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const retryTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "pending", progress: 0, errorMsg: undefined } : t))
    );
    uploadFile(taskId, task.file);
  };

  return (
    <div className="space-y-6">
      {/* Target Folder Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-905 dark:bg-zinc-900 border border-slate-205 dark:border-zinc-800/80 p-4 rounded-2xl">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Target Folder</h4>
          <p className="text-[10px] text-slate-400 font-semibold">Asset files will be organized under this directory.</p>
        </div>
        <select
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-xl bg-slate-950 border border-slate-805 text-slate-200 outline-none focus:border-lime-500"
        >
          {folders.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Drag & Drop File Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`flex flex-col items-center justify-center p-8 md:p-12 rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 text-center ${
          isDragActive
            ? "border-lime-500 bg-lime-950/10 shadow-[0_0_20px_rgba(163,230,53,0.15)]"
            : "border-slate-300 dark:border-slate-800 hover:border-lime-500 dark:hover:border-lime-400 bg-slate-50/50 dark:bg-zinc-950/10"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          className="hidden"
          multiple
          accept="image/*,.pdf,video/*"
        />
        <UploadCloud size={40} className={`mb-3 ${isDragActive ? "text-lime-500 animate-bounce" : "text-slate-400"}`} />
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-205 uppercase tracking-wider">Drag & Drop Files Here</h3>
        <p className="text-[10px] font-semibold text-slate-500 mt-1.5 mb-3 uppercase tracking-wider">or</p>
        <button
          type="button"
          className="px-4.5 py-2 text-xs font-bold text-white dark:text-black bg-lime-600 hover:bg-lime-700 dark:bg-lime-400 dark:hover:bg-lime-300 rounded-xl shadow-md transition-all active:scale-[0.98]"
        >
          Browse Files
        </button>
        <span className="text-[9px] text-slate-450 font-semibold mt-4 uppercase tracking-wider">
          JPEG, PNG, WEBP, GIF, PDF, MP4, WEBM — Max 10MB
        </span>
      </div>

      {/* Upload Tasks Queue List */}
      {tasks.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Upload Status Queue</h4>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3.5 bg-slate-905 dark:bg-zinc-900 border border-slate-205 dark:border-zinc-800/80 rounded-2xl gap-4 shadow-sm"
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate" title={task.file.name}>
                      {task.file.name}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {(task.file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>

                  {/* Progress bar container */}
                  {task.status === "uploading" && (
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-lime-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  )}

                  {/* Errors */}
                  {task.status === "error" && (
                    <span className="text-[10px] text-rose-500 font-semibold flex items-center gap-1">
                      <AlertCircle size={12} /> {task.errorMsg}
                    </span>
                  )}
                  {task.status === "success" && (
                    <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                      <CheckCircle size={12} /> Uploaded successfully
                    </span>
                  )}
                </div>

                {/* Task Action Buttons */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {task.status === "error" && (
                    <button
                      onClick={() => retryTask(task.id)}
                      className="p-1.5 text-slate-500 hover:text-lime-650 dark:hover:text-lime-400 rounded-lg hover:bg-slate-950"
                      title="Retry"
                    >
                      <RefreshCw size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => removeTask(task.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-450 rounded-lg hover:bg-slate-950"
                    title="Remove"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

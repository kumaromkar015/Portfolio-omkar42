"use client";

import React from "react";
import MediaLibrary from "@/components/media/MediaLibrary";

export default function AdminMediaPage() {
  return (
    <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-zinc-800/80 rounded-3xl p-6 md:p-8">
      <h2 className="text-xl font-bold mb-6">Manage Media Library</h2>
      <MediaLibrary />
    </div>
  );
}

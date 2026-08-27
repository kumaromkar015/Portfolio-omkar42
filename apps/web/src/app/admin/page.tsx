"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/admin/profile");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-slate-50 dark:bg-bg-dark text-slate-900 dark:text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-4 border-lime-600 border-t-transparent animate-spin" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Loading console...</span>
      </div>
    </div>
  );
}

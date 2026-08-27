"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, Home, User, FolderKanban, FileText, Image as ImageIcon } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const isLoginPage = pathname === "/admin/login";

    if (!token) {
      if (!isLoginPage) {
        router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
      } else {
        setAuthorized(true);
      }
    } else {
      if (isLoginPage) {
        router.push("/admin");
      } else {
        setAuthorized(true);
      }
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  const isLoginPage = pathname === "/admin/login";

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-bg-dark text-slate-900 dark:text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-lime-600 border-t-transparent animate-spin" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Verifying session...</span>
        </div>
      </div>
    );
  }

  // Login page doesn't get the header decoration wrapper
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-bg-dark text-slate-900 dark:text-white">
      {/* Admin Panel Header */}
      <header className="border-b border-slate-200 dark:border-zinc-800/80 bg-white/70 dark:bg-bg-dark/70 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-black border border-lime-650/40 dark:border-lime-500/40 text-lime-655 dark:text-lime-400 flex items-center justify-center font-bold shadow-md shadow-lime-500/5">
              A
            </div>
            <div>
              <h1 className="font-extrabold text-sm leading-none">Admin Console</h1>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-1 inline-block">
                Portfolio Omkar
              </span>
            </div>
          </div>

          {/* Navigation Sub-tabs inside Layout */}
          <nav className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-zinc-805 pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto justify-start overflow-x-auto">
            <Link
              href="/admin/profile"
              className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                pathname === "/admin/profile" || pathname === "/admin"
                  ? "text-lime-650 dark:text-lime-400"
                  : "text-slate-400 hover:text-slate-205"
              }`}
            >
              <User size={14} /> Profile
            </Link>
            <Link
              href="/admin/projects"
              className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                pathname === "/admin/projects"
                  ? "text-lime-650 dark:text-lime-400"
                  : "text-slate-400 hover:text-slate-205"
              }`}
            >
              <FolderKanban size={14} /> Projects
            </Link>
            <Link
              href="/admin/blogs"
              className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                pathname === "/admin/blogs"
                  ? "text-lime-650 dark:text-lime-400"
                  : "text-slate-400 hover:text-slate-205"
              }`}
            >
              <FileText size={14} /> Blogs
            </Link>
            <Link
              href="/admin/media"
              className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                pathname === "/admin/media"
                  ? "text-lime-650 dark:text-lime-400"
                  : "text-slate-400 hover:text-slate-205"
              }`}
            >
              <ImageIcon size={14} /> Media
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4 self-end md:self-auto mt-2 md:mt-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-250 dark:border-zinc-850 text-xs font-bold text-slate-500 hover:text-lime-650 dark:hover:text-lime-455 hover:border-lime-500 dark:hover:border-lime-400/50 transition-colors"
          >
            <Home size={14} /> View Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-955/40 border border-rose-200 dark:border-rose-900/40 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-955/60 transition-colors cursor-pointer active:scale-95"
          >
            <LogOut size={14} /> Exit
          </button>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10">
        {children}
      </div>
    </div>
  );
}

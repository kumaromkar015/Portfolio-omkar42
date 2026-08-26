"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Lock, User, AlertCircle, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // If token already exists, redirect to admin console (unless session expired)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token");
      if (token && window.location.search.indexOf("error=expired") === -1) {
        router.push("/admin");
      }

      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("error") === "expired") {
        setError("Your session has expired. Please sign in again.");
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (isSetupMode) {
        // Setup initial admin account
        await api.setupAdmin({ username, password });
        setIsSetupMode(false);
        setError("Admin setup successful! Please log in.");
      } else {
        // Standard Login
        const data = await api.login({ username, password });
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_user", data.username);
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err.message || "Authentication process failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-bg-dark text-slate-900 dark:text-white px-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[350px] h-[350px] rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-850 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-lg">
            <Lock size={22} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {isSetupMode ? "Admin Console Setup" : "Admin Authentication"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isSetupMode
              ? "Register the initial administrator credentials for your database."
              : "Access the console to manage your personal portfolio data."}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex gap-2.5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-xs font-semibold text-rose-600 dark:text-rose-450 items-center">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-450 outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-slate-400" size={16} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-455 outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-650 hover:bg-violet-600 text-white font-bold text-sm shadow-md disabled:opacity-50 transition-all cursor-pointer active:scale-98"
          >
            {isSubmitting
              ? "Processing..."
              : isSetupMode
              ? "Create Admin Account"
              : "Authenticate"}
          </button>
        </form>

        {/* Switch Setup/Login Mode */}
        <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-850">
          <button
            onClick={() => setIsSetupMode(!isSetupMode)}
            className="inline-flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 hover:underline font-semibold cursor-pointer"
          >
            <Sparkles size={12} />
            {isSetupMode ? "Back to standard login" : "Setup initial admin account"}
          </button>
        </div>
      </div>
    </main>
  );
}

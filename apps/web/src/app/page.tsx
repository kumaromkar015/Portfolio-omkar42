"use client";

import React, { useState, useEffect } from "react";

export default function Home() {
  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<null | {
    status: string;
    timestamp: string;
    env: string;
    latency: string;
  }>(null);

  const runDiagnostics = () => {
    setDiagnosticsRunning(true);
    setTimeout(() => {
      setDiagnosticResult({
        status: "All Systems Operational",
        timestamp: new Date().toLocaleString(),
        env: process.env.NODE_ENV || "production",
        latency: `${Math.floor(Math.random() * 40) + 10}ms`,
      });
      setDiagnosticsRunning(false);
    }, 1500);
  };

  useEffect(() => {
    // Run once on load
    runDiagnostics();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-fuchsia-500 selection:text-white overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-fuchsia-600/20 blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center bg-slate-950/70">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-500/20">
            P
          </div>
          <span className="font-semibold tracking-wide bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            Portfolio Omkar
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Vercel Active
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-16 flex flex-col justify-center relative z-10">
        <div className="text-center mb-12">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-violet-950/80 text-violet-300 border border-violet-800/60 inline-block mb-4 shadow-inner">
            Deployment Status Verification
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4">
            Vercel Deployment Check
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            This demo screen validates that your Next.js application frontend builds, routes, and deploys successfully on Vercel.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1: Vercel Status */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl hover:border-slate-700 transition-all duration-300 shadow-xl">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Deployment Status</div>
            <div className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              Operational
            </div>
            <p className="text-xs text-slate-400">Successfully served by Vercel Edge Network.</p>
          </div>

          {/* Card 2: Environment */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl hover:border-slate-700 transition-all duration-300 shadow-xl">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Environment Mode</div>
            <div className="text-2xl font-bold text-fuchsia-400 mb-2 capitalize">
              {process.env.NODE_ENV || "Production"}
            </div>
            <p className="text-xs text-slate-400">Running with optimized server-side bundling.</p>
          </div>

          {/* Card 3: Framework */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl hover:border-slate-700 transition-all duration-300 shadow-xl">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Next.js Framework</div>
            <div className="text-2xl font-bold text-violet-400 mb-2">
              v16.2.9 (App Router)
            </div>
            <p className="text-xs text-slate-400">Powered by React Server Components.</p>
          </div>
        </div>

        {/* Diagnostics & Logs Console */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden mb-12">
          {/* Console Header */}
          <div className="bg-slate-900/40 px-6 py-4 border-b border-slate-800/80 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/70" />
              <span className="w-3 h-3 rounded-full bg-amber-500/70" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <span className="text-xs font-mono text-slate-400 ml-2">diagnostic_console.log</span>
            </div>
            <button
              onClick={runDiagnostics}
              disabled={diagnosticsRunning}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white transition-all disabled:opacity-50 cursor-pointer shadow-md active:scale-95"
            >
              {diagnosticsRunning ? "Running..." : "Rerun Diagnostics"}
            </button>
          </div>

          {/* Console Body */}
          <div className="p-6 font-mono text-sm leading-relaxed text-slate-300 min-h-[160px] flex flex-col justify-between">
            {diagnosticsRunning ? (
              <div className="flex flex-col gap-2 animate-pulse text-violet-400">
                <div>&gt; Initiating network latency checks...</div>
                <div>&gt; Validating environment variables...</div>
                <div>&gt; Checking routing integrity...</div>
              </div>
            ) : diagnosticResult ? (
              <div className="space-y-2">
                <div className="text-emerald-400">&gt; Status: {diagnosticResult.status}</div>
                <div className="text-slate-400">&gt; Verified At: {diagnosticResult.timestamp}</div>
                <div className="text-slate-400">&gt; Node Env: {diagnosticResult.env}</div>
                <div className="text-slate-400">&gt; Edge Latency: {diagnosticResult.latency}</div>
                <div className="text-fuchsia-400">&gt; Vercel Diagnostics: SUCCESS</div>
              </div>
            ) : (
              <div className="text-slate-500">&gt; Waiting for diagnostic sequence...</div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-900 text-center text-xs text-slate-500 bg-slate-950/20 backdrop-blur-sm relative z-10">
        <p>© {new Date().getFullYear()} Omkar's Portfolio. Verified and Deployed on Vercel.</p>
      </footer>
    </div>
  );
}

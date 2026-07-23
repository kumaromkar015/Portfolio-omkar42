"use client";

import React from "react";
import { achievementsData } from "@/data/achievements";
import { Award, ExternalLink, Calendar, Shield } from "lucide-react";

export default function Achievements() {
  return (
    <section
      id="achievements"
      className="py-20 md:py-28 bg-slate-50 dark:bg-bg-dark border-t border-slate-200 dark:border-slate-900 text-slate-900 dark:text-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-300 border border-violet-200 dark:border-violet-850 inline-block uppercase tracking-wider">
            Recognitions
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Credentials & Achievements
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
            Certifications, awards, hackathon wins, and open-source contribution achievements.
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {achievementsData.map((ach, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-850 p-6 rounded-3xl flex gap-5 hover:border-violet-500/40 dark:hover:border-violet-500/30 transition-all duration-300 group shadow-sm hover:shadow-lg relative overflow-hidden"
            >
              {/* Category tag bubble */}
              <div className="absolute top-4 right-4 text-[9px] uppercase font-extrabold text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                {ach.category}
              </div>

              {/* Icon container */}
              <div className="p-3 rounded-2xl bg-violet-50 dark:bg-slate-900 text-violet-600 dark:text-violet-400 h-12 w-12 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                {ach.category === "Award" || ach.category === "Hackathon" ? (
                  <Award size={22} />
                ) : (
                  <Shield size={22} />
                )}
              </div>

              {/* Body */}
              <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1 pr-12">
                  <h3 className="font-bold text-sm md:text-base leading-tight text-slate-950 dark:text-white">
                    {ach.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <span>{ach.issuer}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {ach.date}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                    {ach.description}
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href={ach.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-450 hover:text-violet-500 transition-colors group/link"
                  >
                    Verify Credential
                    <ExternalLink size={12} className="group-hover/link:translate-x-[1px] transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

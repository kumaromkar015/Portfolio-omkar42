"use client";

import React from "react";
import { servicesData } from "@/data/services";
import DynamicIcon from "./DynamicIcon";
import { Check } from "lucide-react";

export default function Services() {
  return (
    <section
      id="services"
      className="py-20 md:py-28 bg-white dark:bg-bg-dark border-t border-slate-200 dark:border-zinc-900 text-slate-900 dark:text-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-lime-100 dark:bg-lime-950/30 text-lime-750 dark:text-lime-400 border border-lime-300 dark:border-lime-500/20 inline-block uppercase tracking-wider">
            Consultancy Services
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Premium Engineering Services
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
            I offer advanced frontend architecture design, database layout optimizations, and full-stack SaaS bootstrapping.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className="bg-slate-50 dark:bg-card-dark border border-slate-200 dark:border-zinc-800/80 p-6 md:p-8 rounded-3xl flex flex-col justify-between hover:border-lime-500/40 dark:hover:border-lime-400/40 transition-all duration-300 group shadow-sm hover:shadow-lg relative overflow-hidden"
            >
              {/* Subtle top border bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-lime-650 to-lime-450 dark:from-lime-500 dark:to-lime-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              <div className="space-y-6">
                {/* Icon & Title */}
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-lime-100 dark:bg-zinc-950 text-lime-700 dark:text-lime-400 group-hover:scale-110 transition-transform duration-300">
                    <DynamicIcon name={service.iconName} size={24} />
                  </div>
                  <h3 className="text-lg font-bold leading-tight">{service.title}</h3>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-500 dark:text-slate-405 leading-relaxed">
                  {service.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3 pt-2">
                  {service.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                      <div className="p-0.5 rounded-full bg-lime-100 dark:bg-lime-950/40 text-lime-750 dark:text-lime-400 mt-0.5 flex-shrink-0">
                        <Check size={12} />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing & CTA */}
              <div className="border-t border-slate-200 dark:border-zinc-800/80 mt-6 pt-5 flex justify-between items-center">
                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Investment</div>
                  <div className="text-sm font-extrabold text-lime-650 dark:text-lime-400">{service.priceRange}</div>
                </div>
                <button
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="px-4.5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-lime-400 dark:hover:bg-lime-300 text-white dark:text-black text-xs font-extrabold hover:shadow-lg dark:hover:shadow-[0_0_15px_rgba(163,230,53,0.3)] transition-all cursor-pointer active:scale-95"
                >
                  Book Service
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

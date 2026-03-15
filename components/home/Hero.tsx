"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import { VaultStats } from "@/types";

interface HeroProps {
  stats: VaultStats;
  onSearchOpen: () => void;
}

export function Hero({ stats, onSearchOpen }: HeroProps) {
  return (
    <section className="pt-36 pb-20 px-5 md:px-10 flex flex-col items-center text-center relative">
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgb(var(--dv-accent) / 0.04) 0%, transparent 70%)" }}
      />



      {/* Headline */}
      <h1 className="animate-fade-up stagger-1 font-heading font-bold text-[clamp(30px,5vw,52px)] leading-[1.08] tracking-[-0.035em] text-dv-text max-w-[640px] mb-5">
        The vault for{" "}
        <span className="text-dv-accent">CS learning</span>{" "}
        resources
      </h1>

      {/* Sub */}
      <p className="animate-fade-up stagger-2 text-[clamp(13px,1.6vw,15px)] text-dv-text2 max-w-[460px] leading-relaxed mb-10">
        {stats.totalResources.toLocaleString()} courses, books, tutorials, and tools
        parsed from the best open-source GitHub repositories. Search everything.
      </p>

      {/* CTA row */}
      <div className="animate-fade-up stagger-3 flex items-center gap-3">
        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 bg-dv-accent hover:bg-dv-accentHover text-dv-bg text-[13px] font-heading font-semibold px-6 py-2.5 rounded-lg transition-all cursor-pointer border-none hover:scale-[1.02] active:scale-[0.98]"
        >
          Search the vault
          <ArrowRight size={14} strokeWidth={2} />
        </button>
        <a
          href="#sources"
          className="text-[13px] text-dv-text3 hover:text-dv-text2 transition-colors no-underline font-medium px-4 py-2.5 border border-dv-text3 rounded-lg hover:border-dv-text2"
        >
          Browse sources
        </a>
      </div>

      {/* Stats strip */}
      <div className="animate-fade-up stagger-4 mt-14 grid grid-cols-2 sm:grid-cols-4 border border-dv-border2 rounded-lg overflow-hidden bg-dv-surface">
        {[
          { value: stats.totalResources.toLocaleString(), label: "Resources" },
          { value: stats.totalCollections.toString(), label: "Collections" },
          { value: stats.totalCategories.toString(), label: "Categories" },
          { value: stats.stars > 0 ? `${Math.round(stats.stars / 1000)}k` : "—", label: "GitHub Stars" },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className={`px-7 py-5 text-center ${
              i < 3 ? "border-r border-dv-border2" : ""
            } ${i < 2 ? "sm:border-r" : ""}`}
          >
            <div className="font-heading font-bold text-[20px] text-dv-text tracking-tight">
              {stat.value}
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-dv-text3 mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

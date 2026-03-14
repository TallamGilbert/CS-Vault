"use client";

import { useState } from "react";
import {
  GraduationCap, Server, Briefcase, BookOpen, Wrench, Cpu,
  Target, Code, Layers, Plug, ArrowRight, ExternalLink,
} from "lucide-react";
import { FetchedSource } from "@/types";

const ICON_MAP: Record<string, React.ElementType> = {
  GraduationCap, Server, Briefcase, BookOpen, Wrench,
  Cpu, Target, Code, Layers, Plug,
};

const COLOR_MAP: Record<string, string> = {
  emerald: "text-emerald-400",
  blue:    "text-blue-400",
  violet:  "text-violet-400",
  amber:   "text-amber-400",
  orange:  "text-orange-400",
  cyan:    "text-cyan-400",
  rose:    "text-rose-400",
  yellow:  "text-yellow-400",
  sky:     "text-sky-400",
  teal:    "text-teal-400",
};

const COLOR_BG_MAP: Record<string, string> = {
  emerald: "bg-emerald-400/10",
  blue:    "bg-blue-400/10",
  violet:  "bg-violet-400/10",
  amber:   "bg-amber-400/10",
  orange:  "bg-orange-400/10",
  cyan:    "bg-cyan-400/10",
  rose:    "bg-rose-400/10",
  yellow:  "bg-yellow-400/10",
  sky:     "bg-sky-400/10",
  teal:    "bg-teal-400/10",
};

interface SourceCardProps {
  source: FetchedSource;
  index: number;
  onSelect: (sourceId: string) => void;
}

export function SourceCard({ source, index, onSelect }: SourceCardProps) {
  const [hovered, setHovered] = useState(false);
  const Icon = ICON_MAP[source.icon] ?? Code;
  const colorClass = COLOR_MAP[source.color] ?? "text-dv-text2";
  const bgClass = COLOR_BG_MAP[source.color] ?? "bg-dv-text/5";

  // Top 3 categories by item count
  const topCategories = [...source.categories]
    .sort((a, b) => b.items.length - a.items.length)
    .slice(0, 3);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(source.id)}
      className={`animate-fade-up stagger-${Math.min(index + 1, 10)} group bg-dv-surface border rounded-lg p-6 cursor-pointer transition-all duration-200 flex flex-col gap-5 ${
        hovered
          ? "border-dv-border -translate-y-0.5"
          : "border-dv-border2"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-lg ${hovered ? bgClass : "bg-dv-text/[0.04]"} flex items-center justify-center transition-colors`}>
          <Icon
            size={18}
            className={`${hovered ? colorClass : "text-dv-text2"} transition-colors`}
            strokeWidth={1.6}
          />
        </div>

        {source.status === "error" ? (
          <span className="text-[10px] font-mono text-red-400/70 border border-red-400/20 rounded px-1.5 py-0.5">
            error
          </span>
        ) : (
          <ArrowRight
            size={14}
            className={`${
              hovered ? "text-dv-accent translate-x-0.5" : "text-dv-text3"
            } transition-all`}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="font-heading font-semibold text-[15px] text-dv-text tracking-tight mb-1.5 leading-snug">
          {source.label}
        </h3>
        <p className="text-[12px] text-dv-text3 leading-relaxed line-clamp-2">
          {source.description}
        </p>
      </div>

      {/* Top categories preview */}
      {topCategories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {topCategories.map((cat) => (
            <span
              key={cat.id}
              className="text-[10px] font-mono text-dv-text3 border border-dv-border2 rounded px-2 py-0.5 truncate max-w-[140px]"
            >
              {cat.title}
            </span>
          ))}
        </div>
      )}

      {/* Footer stats */}
      <div className="flex items-center gap-4 pt-3 border-t border-dv-border2">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[13px] font-medium text-dv-text">
            {source.total_items.toLocaleString()}
          </span>
          <span className="text-[10px] text-dv-text3 uppercase tracking-wider">
            resources
          </span>
        </div>
        <div className="w-px h-3 bg-dv-border2" />
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[13px] font-medium text-dv-text">
            {source.categories.length}
          </span>
          <span className="text-[10px] text-dv-text3 uppercase tracking-wider">
            categories
          </span>
        </div>
        <div className="ml-auto">
          <a
            href={`https://github.com/${source.owner}/${source.repo}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-dv-text3 hover:text-dv-text2 transition-colors"
          >
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}

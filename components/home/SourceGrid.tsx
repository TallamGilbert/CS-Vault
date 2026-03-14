"use client";

import { FetchedSource } from "@/types";
import { SourceCard } from "./SourceCard";

interface SourceGridProps {
  sources: FetchedSource[];
  onSelectSource: (sourceId: string) => void;
}

export function SourceGrid({ sources, onSelectSource }: SourceGridProps) {
  // Sort: Developer-Y repos first, then by item count
  const sorted = [...sources].sort((a, b) => {
    const aDevY = a.owner === "Developer-Y" ? 1 : 0;
    const bDevY = b.owner === "Developer-Y" ? 1 : 0;
    if (bDevY !== aDevY) return bDevY - aDevY;
    return b.total_items - a.total_items;
  });

  return (
    <section id="sources" className="scroll-mt-20 max-w-[1100px] mx-auto px-5 md:px-10 mb-24">
      <div className="mb-10">
        <h2 className="font-heading font-semibold text-[clamp(20px,3vw,26px)] tracking-tight text-dv-text mb-2">
          Curated sources
        </h2>
        <p className="text-[13px] text-dv-text3 max-w-[440px] leading-relaxed">
          Each source is a top GitHub repository parsed in real-time. Click to browse categories and resources.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sorted.map((source, i) => (
          <SourceCard
            key={source.id}
            source={source}
            index={i}
            onSelect={onSelectSource}
          />
        ))}
      </div>
    </section>
  );
}

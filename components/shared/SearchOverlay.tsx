"use client";

import { useEffect, useRef } from "react";
import { Search, X, ExternalLink, ArrowRight } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  youtube:  "text-red-400",
  coursera: "text-blue-400",
  github:   "text-dv-text2",
  udemy:    "text-purple-400",
  nptel:    "text-green-400",
  paper:    "text-yellow-400",
  website:  "text-dv-text3",
  wiki:     "text-dv-text3",
};

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const { results, loading, query, setQuery, clear } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      clear();
    }
  }, [open, clear]);

  // Keyboard: Escape to close, / to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dv-bg/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[600px] mx-4 animate-fade-up">
        {/* Search input */}
        <div className="bg-dv-surface border border-dv-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 h-14 border-b border-dv-border2">
            <Search size={16} className="text-dv-text3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resources, courses, universities..."
              className="flex-1 bg-transparent text-dv-text text-[14px] font-body placeholder:text-dv-text3 outline-none"
            />
            {query && (
              <button
                onClick={clear}
                className="text-dv-text3 hover:text-dv-text2 transition-colors cursor-pointer bg-transparent border-none"
              >
                <X size={14} />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-[11px] text-dv-text3 border border-dv-accent rounded px-2 py-0.5 font-mono cursor-pointer bg-transparent hover:text-dv-text2 hover:border-dv-accentHover transition-colors"
            >
              ESC
            </button>
          </div>

          {/* Results */}
          {query.length >= 2 && (
            <div className="max-h-[400px] overflow-y-auto">
              {loading && (
                <div className="px-5 py-8 text-center">
                  <div className="text-dv-text3 text-[13px] font-mono animate-pulse-slow">
                    searching...
                  </div>
                </div>
              )}

              {!loading && results.length === 0 && (
                <div className="px-5 py-8 text-center">
                  <div className="text-dv-text3 text-[13px]">
                    No results for &ldquo;{query}&rdquo;
                  </div>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="py-2">
                  <div className="px-5 py-2">
                    <span className="text-[11px] font-mono text-dv-text3 uppercase tracking-wider">
                      {results.length} result{results.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {results.map((item) => (
                    <a
                      key={item.id}
                      href={item.links[0]?.url ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 px-5 py-3 hover:bg-dv-elevated transition-colors group cursor-pointer no-underline"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] text-dv-text font-medium truncate group-hover:text-dv-accent transition-colors">
                          {item.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {item.university && (
                            <span className="text-[11px] text-dv-text3 truncate">
                              {item.university}
                            </span>
                          )}
                          {item.university && (
                            <span className="text-dv-border2">·</span>
                          )}
                          <span className="text-[11px] text-dv-text3 truncate">
                            {item.source}
                          </span>
                          <span className="text-dv-border2">·</span>
                          <span className="text-[11px] text-dv-text3">
                            {item.category}
                          </span>
                        </div>
                        {/* Link type badges */}
                        <div className="flex gap-1.5 mt-1.5">
                          {item.links.slice(0, 3).map((link, i) => (
                            <span
                              key={i}
                              className={`text-[10px] font-mono border border-dv-border2 rounded px-1.5 py-0.5 ${
                                TYPE_COLORS[link.type] ?? "text-dv-text3"
                              }`}
                            >
                              {link.type}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ExternalLink
                        size={13}
                        className="text-dv-text3 group-hover:text-dv-accent transition-colors mt-1 shrink-0"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Empty state hint */}
          {query.length < 2 && (
            <div className="px-5 py-6">
              <div className="text-[12px] text-dv-text3 mb-3">Quick searches</div>
              <div className="flex flex-wrap gap-2">
                {["algorithms", "machine learning", "MIT", "react", "system design", "python"].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="text-[12px] text-dv-text3 border border-dv-border2 rounded-md px-3 py-1.5 hover:text-dv-text2 hover:border-dv-border transition-colors cursor-pointer bg-transparent font-body"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

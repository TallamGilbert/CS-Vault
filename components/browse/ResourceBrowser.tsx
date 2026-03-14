"use client";

import { useState } from "react";
import {
  ArrowLeft, ExternalLink, ChevronDown, ChevronRight,
  Youtube, BookOpen, Github, Globe, FileText, LayoutList, LayoutGrid,
} from "lucide-react";
import { FetchedSource, ParsedCategory, Resource, LinkType } from "@/types";

const LINK_ICON: Record<LinkType, React.ElementType> = {
  youtube:  Youtube,
  coursera: Globe,
  github:   Github,
  udemy:    Globe,
  nptel:    Globe,
  paper:    FileText,
  wiki:     BookOpen,
  website:  Globe,
};

const LINK_COLOR: Record<LinkType, string> = {
  youtube:  "text-red-400 border-red-400/20",
  coursera: "text-blue-400 border-blue-400/20",
  github:   "text-dv-text2 border-dv-border",
  udemy:    "text-purple-400 border-purple-400/20",
  nptel:    "text-green-400 border-green-400/20",
  paper:    "text-yellow-400 border-yellow-400/20",
  wiki:     "text-dv-text3 border-dv-border2",
  website:  "text-dv-text3 border-dv-border2",
};

// ─── Single Resource Row ───
function ResourceRow({ resource, layout = "list" }: { resource: Resource; layout?: "list" | "grid" }) {
  if (layout === "grid") {
    return (
      <div className="group flex flex-col gap-3 p-4 bg-dv-surface border border-dv-border2 rounded-lg hover:bg-dv-elevated transition-colors">
        <div className="flex-1 min-w-0">
          <div className="text-[13px] text-dv-text font-medium leading-snug">
            {resource.name}
          </div>
          {resource.university && (
            <div className="text-[11px] text-dv-text3 mt-0.5">{resource.university}</div>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {resource.links.map((link) => {
            const Icon = LINK_ICON[link.type] ?? Globe;
            const colorClass = LINK_COLOR[link.type] ?? "text-dv-text3 border-dv-border2";
            return (
              <a
                key={`${link.type}-${link.url}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 text-[10px] font-mono border rounded px-2 py-0.5 hover:opacity-80 transition-opacity no-underline ${colorClass}`}
              >
                <Icon size={10} />
                {link.type}
              </a>
            );
          })}
        </div>
        {resource.links.length > 0 && (
          <a
            href={resource.links[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dv-accent hover:text-dv-accentHover transition-colors inline-flex items-center gap-1 text-[11px] font-medium"
          >
            View <ExternalLink size={10} />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="group flex items-start gap-3 py-3 px-4 hover:bg-dv-elevated/50 transition-colors rounded-md -mx-1">
      <div className="flex-1 min-w-0">
        <div className="text-[13px] text-dv-text font-medium leading-snug">
          {resource.name}
        </div>
        {resource.university && (
          <div className="text-[11px] text-dv-text3 mt-0.5">{resource.university}</div>
        )}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {resource.links.map((link) => {
            const Icon = LINK_ICON[link.type] ?? Globe;
            const colorClass = LINK_COLOR[link.type] ?? "text-dv-text3 border-dv-border2";
            return (
              <a
                key={`${link.type}-${link.url}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 text-[10px] font-mono border rounded px-2 py-0.5 hover:opacity-80 transition-opacity no-underline ${colorClass}`}
              >
                <Icon size={10} />
                {link.type}
              </a>
            );
          })}
        </div>
      </div>
      {resource.links.length > 0 && (
        <a
          href={resource.links[0].url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-dv-text3 hover:text-dv-accent transition-colors mt-0.5 shrink-0"
        >
          <ExternalLink size={12} />
        </a>
      )}
    </div>
  );
}

// ─── Category Accordion ───
function CategorySection({ category, layout = "list" }: { category: ParsedCategory; layout?: "list" | "grid" }) {
  const [expanded, setExpanded] = useState(false);
  const displayItems = expanded ? category.items : category.items.slice(0, 5);

  return (
    <div className="border border-dv-border2 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-dv-surface hover:bg-dv-elevated transition-colors cursor-pointer border-none text-left"
      >
        <div className="flex items-center gap-3">
          <h4 className="font-heading font-semibold text-[14px] text-dv-text tracking-tight">
            {category.title}
          </h4>
          <span className="font-mono text-[10px] text-dv-text3 border border-dv-border2 rounded px-1.5 py-0.5">
            {category.items.length}
          </span>
        </div>
        {expanded ? (
          <ChevronDown size={14} className="text-dv-text3" />
        ) : (
          <ChevronRight size={14} className="text-dv-text3" />
        )}
      </button>

      <div className={layout === "grid" ? "px-5 py-4 bg-dv-bg/50 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" : "px-5 py-2 bg-dv-bg/50"}>
        {displayItems.map((resource) => (
          <ResourceRow key={resource.id} resource={resource} layout={layout} />
        ))}

        {!expanded && category.items.length > 5 && (
          <button
            onClick={() => setExpanded(true)}
            className="w-full text-[12px] text-dv-accent hover:text-dv-accentHover font-medium py-2 mt-1 cursor-pointer bg-transparent border-none transition-colors"
          >
            Show all {category.items.length} resources
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Browser ───
interface ResourceBrowserProps {
  source: FetchedSource;
  onBack: () => void;
}

export function ResourceBrowser({ source, onBack }: ResourceBrowserProps) {
  const [filterText, setFilterText] = useState("");
  const [layout, setLayout] = useState<"list" | "grid">("list");

  // Filter categories by name match
  const filtered = filterText.trim()
    ? source.categories.filter(
        (c) =>
          c.title.toLowerCase().includes(filterText.toLowerCase()) ||
          c.items.some((item) =>
            item.name.toLowerCase().includes(filterText.toLowerCase())
          )
      )
    : source.categories;

  return (
    <section id="browse" className="scroll-mt-20 max-w-[1100px] mx-auto px-5 md:px-10 mb-24 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[13px] text-dv-text3 hover:text-dv-text2 transition-colors cursor-pointer bg-transparent border-none font-body"
          aria-label="Go back to sources list"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <div className="w-px h-4 bg-dv-border2" />
        <div className="flex-1">
          <h2 className="font-heading font-semibold text-[22px] tracking-tight text-dv-text">
            {source.label}
          </h2>
          <p className="text-[12px] text-dv-text3 mt-0.5">
            {source.total_items.toLocaleString()} resources across {source.categories.length} categories
            &middot;{" "}
            <a
              href={`https://github.com/${source.owner}/${source.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-dv-accent hover:text-dv-accentHover transition-colors no-underline"
            >
              View on GitHub
            </a>
          </p>
        </div>
        {/* Layout Toggle */}
        <div className="flex items-center gap-1 bg-dv-surface border border-dv-border2 rounded-lg p-1">
          <button
            onClick={() => setLayout("list")}
            className={`flex items-center justify-center p-2 rounded transition-colors ${
              layout === "list"
                ? "bg-dv-accent text-dv-bg"
                : "text-dv-text3 hover:text-dv-text2 bg-transparent"
            }`}
            title="List view"
            aria-label="Switch to list view"
            aria-pressed={layout === "list"}
          >
            <LayoutList size={14} />
          </button>
          <button
            onClick={() => setLayout("grid")}
            className={`flex items-center justify-center p-2 rounded transition-colors ${
              layout === "grid"
                ? "bg-dv-accent text-dv-bg"
                : "text-dv-text3 hover:text-dv-text2 bg-transparent"
            }`}
            title="Grid view"
            aria-label="Switch to grid view"
            aria-pressed={layout === "grid"}
          >
            <LayoutGrid size={14} />
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Filter categories..."
          className="w-full max-w-[360px] bg-dv-surface border border-dv-border2 rounded-lg px-4 py-2.5 text-[13px] text-dv-text font-body placeholder:text-dv-text3 focus:border-dv-border focus:outline-none transition-colors"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="text-[13px] text-dv-text3 py-8 text-center">
            No categories match &ldquo;{filterText}&rdquo;
          </div>
        ) : (
          filtered.map((category) => (
            <CategorySection key={category.id} category={category} layout={layout} />
          ))
        )}
      </div>
    </section>
  );
}

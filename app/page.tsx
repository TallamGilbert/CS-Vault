"use client";

import { useState, useEffect, useCallback } from "react";
import { useResources } from "@/hooks/useResources";
import { Navbar } from "@/components/shared/Navbar";
import { SearchOverlay } from "@/components/shared/SearchOverlay";
import { Footer } from "@/components/shared/Footer";
import { Hero } from "@/components/home/Hero";
import { SourceGrid } from "@/components/home/SourceGrid";
import { ResourceBrowser } from "@/components/browse/ResourceBrowser";
import { LoadingSkeleton, ErrorState } from "@/components/shared/LoadingSkeleton";

export default function HomePage() {
  const { data, loading, error, totalResources, totalCollections, totalCategories, stars } =
    useResources();
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  // Keyboard shortcut: / to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && !searchOpen && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchOpen]);

  const handleSelectSource = useCallback((sourceId: string) => {
    setSelectedSource(sourceId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBack = useCallback(() => {
    setSelectedSource(null);
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} />;
  if (!data) return null;

  const activeSource = selectedSource
    ? data.sources.find((s) => s.id === selectedSource)
    : null;

  return (
    <div className="min-h-screen bg-dv-bg">
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <main>
        {activeSource ? (
          /* ─── Source detail view ─── */
          <div className="pt-20">
            <ResourceBrowser source={activeSource} onBack={handleBack} />
          </div>
        ) : (
          /* ─── Home view ─── */
          <>
            <Hero
              stats={{ totalResources, totalCollections, totalCategories, stars }}
              onSearchOpen={() => setSearchOpen(true)}
            />
            <SourceGrid
              sources={data.sources}
              onSelectSource={handleSelectSource}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SearchResultItem } from "@/types";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    abortRef.current?.abort();
    if (q.trim().length < 2) { setResults([]); setLoading(false); return; }

    setLoading(true);
    setError(null);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`/api/resources?q=${encodeURIComponent(q.trim())}&limit=30`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`Search returned ${res.status}`);
      const json = await res.json();
      setResults(json.results ?? []);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(query), 250);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query, search]);

  const clear = useCallback(() => {
    setQuery(""); setResults([]); abortRef.current?.abort();
  }, []);

  return { results, loading, error, query, setQuery, clear };
}

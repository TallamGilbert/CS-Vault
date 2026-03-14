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
  const isMountedRef = useRef(true);

  const search = useCallback(async (q: string) => {
    abortRef.current?.abort();
    if (q.trim().length < 2) {
      if (isMountedRef.current) {
        setResults([]);
        setLoading(false);
      }
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    if (isMountedRef.current) setLoading(true);
    if (isMountedRef.current) setError(null);

    try {
      const res = await fetch(`/api/resources?q=${encodeURIComponent(q.trim())}&limit=30`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`Search returned ${res.status}`);
      const json = await res.json();
      if (isMountedRef.current) setResults(json.results ?? []);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (isMountedRef.current) setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(query), 250);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query, search]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  const clear = useCallback(() => {
    setQuery(""); setResults([]); abortRef.current?.abort();
  }, []);

  return { results, loading, error, query, setQuery, clear };
}

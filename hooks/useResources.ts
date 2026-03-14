"use client";

import { useState, useEffect, useCallback } from "react";
import { ApiResponse } from "@/types";

export function useResources() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (refresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const url = refresh ? "/api/resources?refresh=1" : "/api/resources";
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return {
    data,
    loading,
    error,
    totalResources: data?.stats.totalResources ?? 0,
    totalCollections: data?.stats.totalCollections ?? 0,
    totalCategories: data?.stats.totalCategories ?? 0,
    stars: data?.stats.stars ?? 0,
    refetch: () => fetchData(true),
  };
}

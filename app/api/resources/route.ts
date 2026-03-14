import { NextRequest, NextResponse } from "next/server";
import { SOURCES } from "@/lib/sources";
import { fetchAllSources, fetchTotalStars } from "@/lib/fetcher";
import { cacheGet, cacheSet } from "@/lib/cache";
import { searchResources } from "@/lib/search";
import { FetchedSource } from "@/types";

const CACHE_KEY = "vault:resources";
const STARS_KEY = "vault:stars";
const SIX_HOURS = 6 * 60 * 60 * 1000;
const TWELVE_HOURS = 12 * 60 * 60 * 1000;

const HEADERS = {
  "Cache-Control": "s-maxage=21600, stale-while-revalidate=3600",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET",
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const sourceFilter = searchParams.get("source");
    const categoryFilter = searchParams.get("category");
    const limitParam = searchParams.get("limit");
    const forceRefresh = searchParams.get("refresh") === "1";

    // Fetch or cache
    let sources = forceRefresh ? null : cacheGet<FetchedSource[]>(CACHE_KEY);
    if (!sources) {
      sources = await fetchAllSources(SOURCES);
      cacheSet(CACHE_KEY, sources, SIX_HOURS);
    }

    let stars = cacheGet<number>(STARS_KEY);
    if (stars === null) {
      stars = await fetchTotalStars(SOURCES);
      cacheSet(STARS_KEY, stars, TWELVE_HOURS);
    }

    // Search mode
    if (query) {
      const limit = Math.min(parseInt(limitParam ?? "50", 10) || 50, 200);
      const results = searchResources(sources, query, limit);
      return NextResponse.json({
        query,
        results: results.map((hit) => ({
          ...hit.resource,
          category: hit.category.title,
          source: hit.sourceLabel,
          sourceId: hit.sourceId,
          score: hit.score,
        })),
        total: results.length,
      }, { headers: HEADERS });
    }

    // Filter
    let filtered = sources;
    if (sourceFilter) {
      filtered = sources.filter((s) => s.id === sourceFilter);
      if (filtered.length === 0) {
        return NextResponse.json({ error: `Source '${sourceFilter}' not found` }, { status: 404 });
      }
    }
    if (categoryFilter) {
      filtered = filtered.map((s) => ({
        ...s,
        categories: s.categories.filter((c) => c.id === categoryFilter),
      }));
    }

    const totalCategories = sources.reduce((a, s) => a + s.categories.length, 0);

    return NextResponse.json({
      sources: filtered,
      total_items: filtered.reduce((a, s) => a + s.total_items, 0),
      fetched_at: new Date().toISOString(),
      stats: {
        totalResources: sources.reduce((a, s) => a + s.total_items, 0),
        totalCollections: sources.length,
        totalCategories,
        stars,
      },
    }, { headers: HEADERS });
  } catch (err) {
    console.error("[GET /api/resources]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

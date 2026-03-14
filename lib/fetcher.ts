import { SourceDef, FetchedSource } from "@/types";
import { parseMarkdown } from "./parser";

const FETCH_TIMEOUT_MS = 12_000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function fetchSource(source: SourceDef): Promise<FetchedSource> {
  const rawUrl = `https://raw.githubusercontent.com/${source.owner}/${source.repo}/${source.branch}/${source.file}`;
  try {
    const headers: Record<string, string> = { "User-Agent": "devvault/2.4" };
    if (GITHUB_TOKEN) headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;

    const res = await fetch(rawUrl, {
      headers,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const md = await res.text();
    const categories = parseMarkdown(md, source.id);
    const total_items = categories.reduce((a, c) => a + c.items.length, 0);

    return { ...source, categories, total_items, status: "ok" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[fetchSource] ${source.id}: ${message}`);
    return { ...source, categories: [], total_items: 0, status: "error", error: message };
  }
}

export async function fetchAllSources(sources: SourceDef[]): Promise<FetchedSource[]> {
  return Promise.all(sources.map(fetchSource));
}

export async function fetchStarCount(owner: string, repo: string): Promise<number> {
  try {
    const headers: Record<string, string> = {
      "User-Agent": "devvault/2.4",
      Accept: "application/vnd.github.v3+json",
    };
    if (GITHUB_TOKEN) headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers, signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.stargazers_count ?? 0;
  } catch { return 0; }
}

export async function fetchTotalStars(sources: SourceDef[]): Promise<number> {
  const counts = await Promise.all(sources.map((s) => fetchStarCount(s.owner, s.repo)));
  return counts.reduce((a, b) => a + b, 0);
}

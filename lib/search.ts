import { FetchedSource, Resource, ParsedCategory } from "@/types";

export interface SearchHit {
  resource: Resource;
  category: ParsedCategory;
  sourceId: string;
  sourceLabel: string;
  score: number;
}

export function searchResources(
  sources: FetchedSource[],
  query: string,
  limit = 50
): SearchHit[] {
  if (!query || query.trim().length < 2) return [];

  const q = query.toLowerCase().trim();
  const terms = q.split(/\s+/);
  const hits: SearchHit[] = [];

  for (const source of sources) {
    if (source.status !== "ok") continue;
    for (const category of source.categories) {
      const catTitle = category.title.toLowerCase();
      const catBonus = terms.some((t) => catTitle.includes(t)) ? 20 : 0;

      for (const resource of category.items) {
        let score = catBonus;
        const name = resource.name.toLowerCase();

        if (name === q) score += 100;
        else if (name.startsWith(q)) score += 80;
        else if (name.includes(q)) score += 60;
        else if (terms.every((t) => name.includes(t))) score += 50;
        else if (terms.some((t) => name.includes(t))) score += 30;

        if (resource.university) {
          const uni = resource.university.toLowerCase();
          if (terms.some((t) => uni.includes(t))) score += 40;
        }

        for (const link of resource.links) {
          if (terms.some((t) => link.label.toLowerCase().includes(t))) { score += 10; break; }
        }

        if (score > 0) {
          hits.push({ resource, category, sourceId: source.id, sourceLabel: source.label, score });
        }
      }
    }
  }

  hits.sort((a, b) => b.score !== a.score ? b.score - a.score : a.resource.name.localeCompare(b.resource.name));
  return hits.slice(0, limit);
}

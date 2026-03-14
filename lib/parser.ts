import { LinkType, ParsedCategory, ResourceLink } from "@/types";

const SKIP_HEADINGS = new Set([
  "table of contents", "contributing", "notes", "license", "readme",
  "introduction", "contents", "index", "about", "how to use",
  "usage", "contact", "credits", "acknowledgments", "related",
]);

const INSTITUTION_RE =
  /University|Institute|College|Berkeley|Stanford|\bMIT\b|CMU|ETH|UCLA|Caltech|Cornell|UBC|Harvard|Princeton|Purdue|Waterloo|Oxford|Cambridge|Georgia|Carnegie|Mellon|Rutgers|Brown|Columbia|\bIIT\b|IISC|NPTEL|FAU/i;

export function classifyLink(url: string): LinkType {
  if (/youtube\.com|youtu\.be/i.test(url)) return "youtube";
  if (/coursera\.org/i.test(url))           return "coursera";
  if (/github\.com/i.test(url))            return "github";
  if (/udemy\.com/i.test(url))             return "udemy";
  if (/nptel\.ac\.in/i.test(url))          return "nptel";
  if (/arxiv\.org/i.test(url))             return "paper";
  if (/wikipedia\.org/i.test(url))         return "wiki";
  return "website";
}

export function extractUniversity(label: string): string {
  const commaParts = label.split(",");
  let last = commaParts[commaParts.length - 1].trim();
  last = last
    .replace(/^(Spring|Fall|Winter|Summer)\s+\d{4}\s*[,-]?\s*/i, "")
    .replace(/^[-–\s]+/, "");
  if (INSTITUTION_RE.test(last) && last.length < 70) {
    return last.replace(/[.,;:]+$/, "").trim();
  }
  const dashParts = label.split(/\s+-\s+/);
  for (let i = dashParts.length - 1; i >= 1; i--) {
    const part = dashParts[i].trim();
    if (INSTITUTION_RE.test(part) && part.length < 70) {
      return part.replace(/[.,;:]+$/, "").trim();
    }
  }
  return "";
}

export function parseMarkdown(markdown: string, sourceId: string): ParsedCategory[] {
  const categories: Record<string, ParsedCategory> = {};
  let currentCat: string | null = null;
  let idx = 0;

  for (const rawLine of markdown.split("\n")) {
    const line = rawLine.trimEnd();

    const hMatch = line.match(/^#{2,4}\s+\*{0,2}(.+?)\*{0,2}\s*$/);
    if (hMatch) {
      const title = hMatch[1].trim();
      const lower = title.toLowerCase();
      const skip = [...SKIP_HEADINGS].some((s) => lower.includes(s));
      if (skip) { currentCat = null; continue; }
      const slug = `${sourceId}__${lower.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
      currentCat = slug;
      if (!categories[slug]) categories[slug] = { id: slug, title, items: [] };
      continue;
    }

    if (!currentCat || !/^\s*-\s+/.test(line)) continue;

    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
    const matches = [...line.matchAll(linkRegex)];
    if (matches.length === 0) continue;

    const primaryLabel = matches[0][1].trim();
    const primaryUrl = matches[0][2].trim();
    const university = extractUniversity(primaryLabel);

    const links: ResourceLink[] = [{
      label: primaryLabel.replace(/[.,;:]+$/, "").trim(),
      url: primaryUrl,
      type: classifyLink(primaryUrl),
    }];

    for (const m of matches.slice(1)) {
      const lbl = m[1].trim();
      if (lbl.length < 2) continue;
      links.push({ label: lbl, url: m[2].trim(), type: classifyLink(m[2]) });
    }

    categories[currentCat].items.push({
      id: `${sourceId}-${idx++}`,
      name: primaryLabel.replace(/[.,;:]+$/, "").trim(),
      university,
      links,
    });
  }

  return Object.values(categories).filter((c) => c.items.length > 0);
}

export type LinkType =
  | "youtube" | "coursera" | "github" | "udemy"
  | "nptel"   | "paper"    | "wiki"   | "website";

export interface ResourceLink {
  label: string;
  url: string;
  type: LinkType;
}

export interface Resource {
  id: string;
  name: string;
  university: string;
  links: ResourceLink[];
}

export interface ParsedCategory {
  id: string;
  title: string;
  items: Resource[];
}

export type SourceColor =
  | "emerald" | "blue"   | "violet" | "amber" | "orange"
  | "cyan"    | "rose"   | "yellow" | "sky"   | "teal";

export interface SourceDef {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: SourceColor;
  owner: string;
  repo: string;
  branch: string;
  file: string;
  parser: "heading-list";
}

export interface FetchedSource extends SourceDef {
  categories: ParsedCategory[];
  total_items: number;
  status: "ok" | "error";
  error?: string;
}

export interface ApiResponse {
  sources: FetchedSource[];
  total_items: number;
  fetched_at: string;
  stats: VaultStats;
}

export interface VaultStats {
  totalResources: number;
  totalCollections: number;
  totalCategories: number;
  stars: number;
}

export interface SearchResultItem extends Resource {
  category: string;
  source: string;
  sourceId: string;
  score: number;
}

export interface SearchResponse {
  query: string;
  results: SearchResultItem[];
  total: number;
}

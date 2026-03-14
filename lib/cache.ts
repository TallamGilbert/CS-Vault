interface CacheEntry<T> { data: T; expiresAt: number; }

const store = new Map<string, CacheEntry<unknown>>();
const DEFAULT_TTL = 6 * 60 * 60 * 1000;

export function cacheGet<T>(key: string): T | null {
  const entry = store.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { store.delete(key); return null; }
  return entry.data;
}

export function cacheSet<T>(key: string, data: T, ttl = DEFAULT_TTL): void {
  store.set(key, { data, expiresAt: Date.now() + ttl });
}

export function cacheClear(): void { store.clear(); }

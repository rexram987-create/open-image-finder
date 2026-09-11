import type { CommonsImage } from '../types/image';
import { defaultLicenseFilters, type LicenseFilters } from '../types/search';

const KEYS = {
  filters: 'free-image-search.filters',
  recent: 'free-image-search.recent',
  favorites: 'free-image-search.favorites',
} as const;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Persistence is optional; the app remains usable without storage.
  }
}

export function loadFilters(): LicenseFilters {
  const stored = readJson<Partial<LicenseFilters> | null>(KEYS.filters, null);
  if (!stored || typeof stored !== 'object') return { ...defaultLicenseFilters };

  const result: LicenseFilters = { ...defaultLicenseFilters };
  for (const key of Object.keys(result) as Array<keyof LicenseFilters>) {
    if (typeof stored[key] === 'boolean') result[key] = stored[key] as boolean;
  }
  return result;
}

export function saveFilters(filters: LicenseFilters): void {
  writeJson(KEYS.filters, filters);
}

export function loadRecentSearches(): string[] {
  const value = readJson<unknown>(KEYS.recent, []);
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string').slice(0, 10) : [];
}

export function addRecentSearch(query: string): string[] {
  const trimmed = query.trim();
  if (!trimmed) return loadRecentSearches();

  const next = [trimmed, ...loadRecentSearches().filter((item) => item !== trimmed)].slice(0, 10);
  writeJson(KEYS.recent, next);
  return next;
}

export function loadFavorites(): CommonsImage[] {
  const value = readJson<unknown>(KEYS.favorites, []);
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is CommonsImage => (
    typeof item === 'object' &&
    item !== null &&
    typeof (item as CommonsImage).id === 'number' &&
    typeof (item as CommonsImage).title === 'string' &&
    typeof (item as CommonsImage).sourcePageUrl === 'string'
  ));
}

export function toggleFavorite(image: CommonsImage): CommonsImage[] {
  const current = loadFavorites();
  const exists = current.some((favorite) => favorite.id === image.id);
  const next = exists ? current.filter((favorite) => favorite.id !== image.id) : [image, ...current];
  writeJson(KEYS.favorites, next);
  return next;
}

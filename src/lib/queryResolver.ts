export interface ResolvedQuery {
  original: string;
  equivalent: string | null;
  sourceLanguage: 'he' | 'en' | 'unknown';
}

interface WikipediaResponse {
  query?: {
    pages?: Array<{
      title?: string;
      langlinks?: Array<{ lang?: string; title?: string }>;
    }>;
  };
}

function detectLanguage(query: string): ResolvedQuery['sourceLanguage'] {
  if (/[\u0590-\u05FF]/.test(query)) return 'he';
  if (/[A-Za-z]/.test(query)) return 'en';
  return 'unknown';
}

export async function resolveEquivalentQuery(query: string, signal?: AbortSignal): Promise<ResolvedQuery> {
  const original = query.trim();
  const sourceLanguage = detectLanguage(original);
  if (!original || sourceLanguage === 'unknown') {
    return { original, equivalent: null, sourceLanguage };
  }

  const targetLanguage = sourceLanguage === 'he' ? 'en' : 'he';
  const url = new URL(`https://${sourceLanguage}.wikipedia.org/w/api.php`);
  url.search = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    origin: '*',
    generator: 'search',
    gsrsearch: original,
    gsrlimit: '1',
    prop: 'langlinks',
    lllang: targetLanguage,
    lllimit: '1',
    redirects: '1',
  }).toString();

  try {
    const response = await fetch(url.toString(), { signal });
    if (!response.ok) return { original, equivalent: null, sourceLanguage };
    const data = (await response.json()) as WikipediaResponse;
    const candidate = data.query?.pages?.[0]?.langlinks?.find((link) => link.lang === targetLanguage)?.title?.trim() ?? null;
    const equivalent = candidate && candidate.localeCompare(original, undefined, { sensitivity: 'base' }) !== 0 ? candidate : null;
    return { original, equivalent, sourceLanguage };
  } catch (error) {
    if (signal?.aborted) throw error;
    return { original, equivalent: null, sourceLanguage };
  }
}

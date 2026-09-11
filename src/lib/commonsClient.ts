export interface RawMetadataValue {
  value?: string;
  source?: string;
  hidden?: string;
}

export interface RawCommonsImageInfo {
  url?: string;
  thumburl?: string;
  mime?: string;
  width?: number;
  height?: number;
  extmetadata?: Record<string, RawMetadataValue>;
}

export interface RawCommonsPage {
  pageid: number;
  title: string;
  imageinfo?: RawCommonsImageInfo[];
}

interface CommonsResponse {
  query?: {
    pages?: RawCommonsPage[];
  };
  error?: {
    code?: string;
    info?: string;
  };
}

export class CommonsApiError extends Error {
  constructor(
    message: string,
    public readonly status: number | null = null,
  ) {
    super(message);
    this.name = 'CommonsApiError';
  }
}

export function buildCommonsSearchUrl(query: string): string {
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  url.search = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    origin: '*',
    generator: 'search',
    gsrsearch: query.trim(),
    gsrnamespace: '6',
    gsrlimit: '40',
    prop: 'imageinfo',
    iiprop: 'url|mime|size|extmetadata',
    iiurlwidth: '640',
  }).toString();
  return url.toString();
}

export async function searchCommons(query: string, signal?: AbortSignal): Promise<RawCommonsPage[]> {
  const response = await fetch(buildCommonsSearchUrl(query), { signal });

  if (!response.ok) {
    throw new CommonsApiError(`Commons request failed with HTTP ${response.status}`, response.status);
  }

  const data = (await response.json()) as CommonsResponse;
  if (data.error) {
    throw new CommonsApiError(data.error.info ?? data.error.code ?? 'Commons API error');
  }

  return data.query?.pages ?? [];
}

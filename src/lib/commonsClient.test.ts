import { describe, expect, it, vi } from 'vitest';
import { searchCommons } from './commonsClient';

describe('searchCommons', () => {
  it('builds a Commons file search request', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ query: { pages: [] } }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await searchCommons('greenland shark');

    const url = new URL(fetchMock.mock.calls[0][0] as string);
    expect(url.origin + url.pathname).toBe('https://commons.wikimedia.org/w/api.php');
    expect(url.searchParams.get('origin')).toBe('*');
    expect(url.searchParams.get('generator')).toBe('search');
    expect(url.searchParams.get('gsrnamespace')).toBe('6');
    expect(url.searchParams.get('gsrsearch')).toBe('greenland shark');
    expect(url.searchParams.get('prop')).toBe('imageinfo');
    expect(url.searchParams.get('iiprop')).toBe('url|mime|size|extmetadata');
    expect(url.searchParams.get('iiurlwidth')).toBe('640');

    vi.unstubAllGlobals();
  });

  it('returns an empty list when Commons returns no pages', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ batchcomplete: true }) }));
    await expect(searchCommons('nothing')).resolves.toEqual([]);
    vi.unstubAllGlobals();
  });
});

import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultLicenseFilters } from '../types/search';
import { useImageSearch } from './useImageSearch';

const searchCommons = vi.fn();
const resolveEquivalentQuery = vi.fn();

vi.mock('../lib/commonsClient', () => ({
  CommonsApiError: class CommonsApiError extends Error {},
  searchCommons: (...args: unknown[]) => searchCommons(...args),
}));
vi.mock('../lib/queryResolver', () => ({
  resolveEquivalentQuery: (...args: unknown[]) => resolveEquivalentQuery(...args),
}));
vi.mock('../lib/normalizeCommons', () => ({
  normalizeCommonsPage: (page: any) => page.normalized ?? null,
}));
vi.mock('../lib/storage', () => ({ addRecentSearch: vi.fn() }));

const normalized = (id: number) => ({
  id,
  title: `File:${id}.jpg`,
  description: null,
  thumbnailUrl: 'thumb',
  originalUrl: 'original',
  sourcePageUrl: 'source',
  mimeType: 'image/jpeg',
  width: null,
  height: null,
  author: null,
  credit: null,
  exactLicenseName: 'CC BY 4.0',
  normalizedLicenseGroup: 'cc-by',
  licenseUrl: null,
  attributionRequired: true,
  commercialUseAllowed: true,
  modificationAllowed: true,
  shareAlikeRequired: false,
  licenseConfidence: 'high',
});

describe('useImageSearch', () => {
  beforeEach(() => {
    searchCommons.mockReset();
    resolveEquivalentQuery.mockReset();
  });

  it('keeps primary results when equivalent resolution fails', async () => {
    searchCommons.mockResolvedValueOnce([{ normalized: normalized(1) }]);
    resolveEquivalentQuery.mockResolvedValue({ original: 'test', equivalent: null, sourceLanguage: 'en' });

    const { result } = renderHook(() => useImageSearch(defaultLicenseFilters));
    await act(async () => result.current.search('test'));

    expect(result.current.state.images.map((image) => image.id)).toEqual([1]);
    expect(result.current.state.loading).toBe(false);
  });

  it('merges and deduplicates equivalent results', async () => {
    searchCommons
      .mockResolvedValueOnce([{ normalized: normalized(1) }])
      .mockResolvedValueOnce([{ normalized: normalized(1) }, { normalized: normalized(2) }]);
    resolveEquivalentQuery.mockResolvedValue({ original: 'כריש', equivalent: 'shark', sourceLanguage: 'he' });

    const { result } = renderHook(() => useImageSearch(defaultLicenseFilters));
    await act(async () => result.current.search('כריש'));

    await waitFor(() => expect(result.current.state.images.map((image) => image.id)).toEqual([1, 2]));
  });
});

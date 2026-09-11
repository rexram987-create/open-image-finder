import { beforeEach, describe, expect, it } from 'vitest';
import type { CommonsImage } from '../types/image';
import { defaultLicenseFilters } from '../types/search';
import {
  addRecentSearch,
  loadFavorites,
  loadFilters,
  loadRecentSearches,
  saveFilters,
  toggleFavorite,
} from './storage';

const image: CommonsImage = {
  id: 7,
  title: 'File:Favorite.jpg',
  description: null,
  thumbnailUrl: 'thumb',
  originalUrl: 'original',
  sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:Favorite.jpg',
  mimeType: 'image/jpeg',
  width: 100,
  height: 100,
  author: 'Author',
  credit: null,
  exactLicenseName: 'CC BY 4.0',
  normalizedLicenseGroup: 'cc-by',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  attributionRequired: true,
  commercialUseAllowed: true,
  modificationAllowed: true,
  shareAlikeRequired: false,
  licenseConfidence: 'high',
};

describe('storage helpers', () => {
  beforeEach(() => localStorage.clear());

  it('falls back safely from malformed JSON', () => {
    localStorage.setItem('free-image-search.filters', '{bad');
    expect(loadFilters()).toEqual(defaultLicenseFilters);
  });

  it('persists filters', () => {
    const filters = { ...defaultLicenseFilters, publicDomainOnly: true };
    saveFilters(filters);
    expect(loadFilters()).toEqual(filters);
  });

  it('deduplicates and bounds recent searches to ten', () => {
    for (let i = 0; i < 12; i += 1) addRecentSearch(`query-${i}`);
    addRecentSearch('query-5');
    const recent = loadRecentSearches();
    expect(recent).toHaveLength(10);
    expect(recent[0]).toBe('query-5');
    expect(recent.filter((query) => query === 'query-5')).toHaveLength(1);
  });

  it('toggles favorites by id and preserves source/license data', () => {
    toggleFavorite(image);
    expect(loadFavorites()[0]).toMatchObject({
      id: 7,
      sourcePageUrl: image.sourcePageUrl,
      exactLicenseName: 'CC BY 4.0',
    });
    expect(toggleFavorite(image)).toEqual([]);
  });
});

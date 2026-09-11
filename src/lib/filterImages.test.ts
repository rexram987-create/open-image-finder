import { describe, expect, it } from 'vitest';
import type { CommonsImage } from '../types/image';
import { defaultLicenseFilters } from '../types/search';
import { filterImages } from './filterImages';

const base: CommonsImage = {
  id: 1,
  title: 'File:Known.jpg',
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
};

describe('filterImages', () => {
  it('hides unclear licenses by default and shows them only when requested', () => {
    const unknown = { ...base, id: 2, normalizedLicenseGroup: 'unknown' as const, licenseConfidence: 'unknown' as const, commercialUseAllowed: null, modificationAllowed: null, attributionRequired: null };
    expect(filterImages([base, unknown], defaultLicenseFilters).map((x) => x.id)).toEqual([1]);
    expect(filterImages([base, unknown], { ...defaultLicenseFilters, showUnclear: true }).map((x) => x.id)).toEqual([1, 2]);
  });

  it('rejects unknown permission values for strict filters', () => {
    const uncertain = { ...base, commercialUseAllowed: null, modificationAllowed: null };
    expect(filterImages([uncertain], { ...defaultLicenseFilters, commercialUseAllowed: true })).toEqual([]);
    expect(filterImages([uncertain], { ...defaultLicenseFilters, modificationAllowed: true })).toEqual([]);
  });
});

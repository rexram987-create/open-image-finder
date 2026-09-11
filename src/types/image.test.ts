import { describe, expect, it } from 'vitest';
import type { CommonsImage } from './image';
import { defaultLicenseFilters } from './search';

describe('normalized image models', () => {
  it('accepts null for unknown metadata', () => {
    const image: CommonsImage = {
      id: 1,
      title: 'File:Example.jpg',
      description: null,
      thumbnailUrl: 'https://upload.wikimedia.org/thumb/example.jpg',
      originalUrl: 'https://upload.wikimedia.org/example.jpg',
      sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:Example.jpg',
      mimeType: 'image/jpeg',
      width: 1000,
      height: 800,
      author: null,
      credit: null,
      exactLicenseName: null,
      normalizedLicenseGroup: 'unknown',
      licenseUrl: null,
      attributionRequired: null,
      commercialUseAllowed: null,
      modificationAllowed: null,
      shareAlikeRequired: null,
      licenseConfidence: 'unknown',
    };

    expect(image.author).toBeNull();
    expect(image.licenseConfidence).toBe('unknown');
  });

  it('hides unclear licenses by default', () => {
    expect(defaultLicenseFilters.showUnclear).toBe(false);
    expect(defaultLicenseFilters.reuseAllowed).toBe(true);
  });
});

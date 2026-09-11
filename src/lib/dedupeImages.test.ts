import { describe, expect, it } from 'vitest';
import type { CommonsImage } from '../types/image';
import { dedupeImages } from './dedupeImages';

const image = (id: number, title: string): CommonsImage => ({
  id,
  title,
  description: null,
  thumbnailUrl: `https://example.com/${id}-thumb.jpg`,
  originalUrl: `https://example.com/${id}.jpg`,
  sourcePageUrl: `https://commons.wikimedia.org/wiki/${id}`,
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

describe('dedupeImages', () => {
  it('deduplicates by page id while preserving first-seen order', () => {
    expect(dedupeImages([image(2, 'first'), image(1, 'second'), image(2, 'duplicate')]).map((x) => x.title))
      .toEqual(['first', 'second']);
  });
});

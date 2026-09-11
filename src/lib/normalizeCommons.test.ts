import { describe, expect, it } from 'vitest';
import { commonsPageFixture } from '../test/fixtures/commons';
import { normalizeCommonsPage } from './normalizeCommons';

describe('normalizeCommonsPage', () => {
  it('maps Commons metadata into the normalized image model', () => {
    expect(normalizeCommonsPage(commonsPageFixture)).toEqual({
      id: 123,
      title: 'File:Example image.jpg',
      description: 'An example image',
      thumbnailUrl: 'https://upload.wikimedia.org/thumb/example.jpg',
      originalUrl: 'https://upload.wikimedia.org/example.jpg',
      sourcePageUrl: 'https://commons.wikimedia.org/wiki/File%3AExample_image.jpg',
      mimeType: 'image/jpeg',
      width: 1200,
      height: 800,
      author: 'Example Author',
      credit: 'Own work',
      exactLicenseName: 'CC BY-SA 4.0',
      normalizedLicenseGroup: 'cc-by-sa',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      attributionRequired: true,
      commercialUseAllowed: true,
      modificationAllowed: true,
      shareAlikeRequired: true,
      licenseConfidence: 'high',
    });
  });

  it('drops pages without usable image URLs', () => {
    expect(normalizeCommonsPage({ pageid: 1, title: 'File:Broken.jpg', imageinfo: [] })).toBeNull();
  });
});

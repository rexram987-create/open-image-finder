import { describe, expect, it } from 'vitest';
import type { CommonsImage, LicenseGroup } from '../types/image';
import { getLicenseExplanation } from './licenseExplanation';

const makeImage = (group: LicenseGroup): CommonsImage => ({
  id: 1, title: 'File:X.jpg', description: null, thumbnailUrl: 'thumb', originalUrl: 'original', sourcePageUrl: 'source',
  mimeType: 'image/jpeg', width: null, height: null, author: null, credit: null, exactLicenseName: null,
  normalizedLicenseGroup: group, licenseUrl: null, attributionRequired: null, commercialUseAllowed: null,
  modificationAllowed: null, shareAlikeRequired: null, licenseConfidence: group === 'unknown' ? 'unknown' : 'high',
});

describe('getLicenseExplanation', () => {
  it.each([
    ['public-domain', 'נחלת הכלל'],
    ['cc0', 'CC0'],
    ['cc-by', 'CC BY'],
    ['cc-by-sa', 'CC BY-SA'],
    ['unknown', 'הרישיון לא זוהה'],
  ] as const)('explains %s in Hebrew', (group, fragment) => {
    expect(getLicenseExplanation(makeImage(group), 'he')).toContain(fragment);
  });

  it('returns an English warning for unknown licenses', () => {
    expect(getLicenseExplanation(makeImage('unknown'), 'en')).toContain('not identified');
  });
});

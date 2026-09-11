import { describe, expect, it } from 'vitest';
import { classifyLicense } from './licenseClassifier';

describe('classifyLicense', () => {
  it('classifies Public domain conservatively', () => {
    expect(classifyLicense({ licenseShortName: 'Public domain', licenseUrl: null, usageTerms: null, attributionRequired: null })).toMatchObject({
      normalizedLicenseGroup: 'public-domain',
      attributionRequired: false,
      commercialUseAllowed: true,
      modificationAllowed: true,
      shareAlikeRequired: false,
      licenseConfidence: 'high',
    });
  });

  it('classifies CC0', () => {
    expect(classifyLicense({ licenseShortName: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/', usageTerms: null, attributionRequired: 'false' })).toMatchObject({
      normalizedLicenseGroup: 'cc0',
      attributionRequired: false,
      commercialUseAllowed: true,
      modificationAllowed: true,
      shareAlikeRequired: false,
    });
  });

  it('classifies CC BY', () => {
    expect(classifyLicense({ licenseShortName: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/', usageTerms: null, attributionRequired: 'true' })).toMatchObject({
      normalizedLicenseGroup: 'cc-by',
      attributionRequired: true,
      commercialUseAllowed: true,
      modificationAllowed: true,
      shareAlikeRequired: false,
    });
  });

  it('classifies CC BY-SA', () => {
    expect(classifyLicense({ licenseShortName: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/', usageTerms: null, attributionRequired: 'true' })).toMatchObject({
      normalizedLicenseGroup: 'cc-by-sa',
      attributionRequired: true,
      commercialUseAllowed: true,
      modificationAllowed: true,
      shareAlikeRequired: true,
    });
  });

  it('does not guess permissions for an unrecognized license', () => {
    expect(classifyLicense({ licenseShortName: 'Some free license', licenseUrl: null, usageTerms: 'free', attributionRequired: null })).toEqual({
      exactLicenseName: 'Some free license',
      normalizedLicenseGroup: 'unknown',
      licenseUrl: null,
      attributionRequired: null,
      commercialUseAllowed: null,
      modificationAllowed: null,
      shareAlikeRequired: null,
      licenseConfidence: 'unknown',
    });
  });
});

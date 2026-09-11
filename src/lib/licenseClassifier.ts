import type { LicenseConfidence, LicenseGroup } from '../types/image';

export interface RawLicenseMetadata {
  licenseShortName: string | null | undefined;
  licenseUrl: string | null | undefined;
  usageTerms: string | null | undefined;
  attributionRequired: string | null | undefined;
}

export interface ClassifiedLicense {
  exactLicenseName: string | null;
  normalizedLicenseGroup: LicenseGroup;
  licenseUrl: string | null;
  attributionRequired: boolean | null;
  commercialUseAllowed: boolean | null;
  modificationAllowed: boolean | null;
  shareAlikeRequired: boolean | null;
  licenseConfidence: LicenseConfidence;
}

const clean = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

export function classifyLicense(input: RawLicenseMetadata): ClassifiedLicense {
  const exactLicenseName = clean(input.licenseShortName);
  const licenseUrl = clean(input.licenseUrl);
  const normalized = exactLicenseName?.toLowerCase().replace(/\s+/g, ' ') ?? '';

  const known = (
    normalizedLicenseGroup: Exclude<LicenseGroup, 'other-free' | 'unknown'>,
    attributionRequired: boolean,
    shareAlikeRequired: boolean,
  ): ClassifiedLicense => ({
    exactLicenseName,
    normalizedLicenseGroup,
    licenseUrl,
    attributionRequired,
    commercialUseAllowed: true,
    modificationAllowed: true,
    shareAlikeRequired,
    licenseConfidence: 'high',
  });

  if (normalized === 'public domain') {
    return known('public-domain', false, false);
  }

  if (/^cc0(?: 1\.0)?$/.test(normalized)) {
    return known('cc0', false, false);
  }

  if (/^cc by(?: [1-9](?:\.\d+)?)?$/.test(normalized)) {
    return known('cc-by', true, false);
  }

  if (/^cc by-sa(?: [1-9](?:\.\d+)?)?$/.test(normalized)) {
    return known('cc-by-sa', true, true);
  }

  return {
    exactLicenseName,
    normalizedLicenseGroup: 'unknown',
    licenseUrl,
    attributionRequired: null,
    commercialUseAllowed: null,
    modificationAllowed: null,
    shareAlikeRequired: null,
    licenseConfidence: 'unknown',
  };
}

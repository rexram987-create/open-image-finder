export type LicenseGroup =
  | 'public-domain'
  | 'cc0'
  | 'cc-by'
  | 'cc-by-sa'
  | 'other-free'
  | 'unknown';

export type LicenseConfidence = 'high' | 'medium' | 'unknown';

export interface CommonsImage {
  id: number;
  title: string;
  description: string | null;
  thumbnailUrl: string;
  originalUrl: string;
  sourcePageUrl: string;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  author: string | null;
  credit: string | null;
  exactLicenseName: string | null;
  normalizedLicenseGroup: LicenseGroup;
  licenseUrl: string | null;
  attributionRequired: boolean | null;
  commercialUseAllowed: boolean | null;
  modificationAllowed: boolean | null;
  shareAlikeRequired: boolean | null;
  licenseConfidence: LicenseConfidence;
}

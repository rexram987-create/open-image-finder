import type { CommonsImage } from '../types/image';
import type { RawCommonsPage, RawMetadataValue } from './commonsClient';
import { classifyLicense } from './licenseClassifier';

function metadataValue(metadata: Record<string, RawMetadataValue> | undefined, key: string): string | null {
  const value = metadata?.[key]?.value?.trim();
  return value ? value : null;
}

function htmlToPlainText(value: string | null): string | null {
  if (!value) return null;
  const document = new DOMParser().parseFromString(value, 'text/html');
  const text = document.body.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  return text || null;
}

export function normalizeCommonsPage(page: RawCommonsPage): CommonsImage | null {
  const info = page.imageinfo?.[0];
  if (!info?.url || !info.thumburl) return null;

  const metadata = info.extmetadata;
  const license = classifyLicense({
    licenseShortName: metadataValue(metadata, 'LicenseShortName'),
    licenseUrl: metadataValue(metadata, 'LicenseUrl'),
    usageTerms: metadataValue(metadata, 'UsageTerms'),
    attributionRequired: metadataValue(metadata, 'AttributionRequired'),
  });

  return {
    id: page.pageid,
    title: page.title,
    description: htmlToPlainText(metadataValue(metadata, 'ImageDescription')),
    thumbnailUrl: info.thumburl,
    originalUrl: info.url,
    sourcePageUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
    mimeType: info.mime ?? null,
    width: info.width ?? null,
    height: info.height ?? null,
    author: htmlToPlainText(metadataValue(metadata, 'Artist')),
    credit: htmlToPlainText(metadataValue(metadata, 'Credit')),
    ...license,
  };
}

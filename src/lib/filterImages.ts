import type { CommonsImage } from '../types/image';
import type { LicenseFilters } from '../types/search';

export function filterImages(images: CommonsImage[], filters: LicenseFilters): CommonsImage[] {
  return images.filter((image) => {
    const unclear = image.normalizedLicenseGroup === 'unknown' || image.licenseConfidence === 'unknown';
    if (unclear && !filters.showUnclear) return false;

    if (filters.publicDomainOnly && image.normalizedLicenseGroup !== 'public-domain') return false;
    if (filters.cc0Only && image.normalizedLicenseGroup !== 'cc0') return false;
    if (filters.requiresAttribution && image.attributionRequired !== true) return false;
    if (filters.modificationAllowed && image.modificationAllowed !== true) return false;
    if (filters.commercialUseAllowed && image.commercialUseAllowed !== true) return false;

    if (filters.reuseAllowed && !unclear) {
      return image.commercialUseAllowed === true && image.modificationAllowed === true;
    }

    return true;
  });
}

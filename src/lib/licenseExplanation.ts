import { messages, type Language } from '../i18n/messages';
import type { CommonsImage } from '../types/image';

export function getLicenseExplanation(image: CommonsImage, language: Language): string {
  const catalog = messages[language];
  switch (image.normalizedLicenseGroup) {
    case 'public-domain':
      return catalog.licensePublicDomain;
    case 'cc0':
      return catalog.licenseCc0;
    case 'cc-by':
      return catalog.licenseCcBy;
    case 'cc-by-sa':
      return catalog.licenseCcBySa;
    default:
      return catalog.licenseUnknown;
  }
}

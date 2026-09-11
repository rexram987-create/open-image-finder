export interface LicenseFilters {
  reuseAllowed: boolean;
  publicDomainOnly: boolean;
  cc0Only: boolean;
  requiresAttribution: boolean;
  modificationAllowed: boolean;
  commercialUseAllowed: boolean;
  showUnclear: boolean;
}

export const defaultLicenseFilters: LicenseFilters = {
  reuseAllowed: true,
  publicDomainOnly: false,
  cc0Only: false,
  requiresAttribution: false,
  modificationAllowed: false,
  commercialUseAllowed: false,
  showUnclear: false,
};

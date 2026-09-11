import type { MessageKey } from '../i18n/messages';
import type { LicenseFilters as LicenseFiltersValue } from '../types/search';

interface Props {
  value: LicenseFiltersValue;
  t(key: MessageKey): string;
  onChange(value: LicenseFiltersValue): void;
}

const controls: Array<{ key: keyof LicenseFiltersValue; label: MessageKey }> = [
  { key: 'reuseAllowed', label: 'reuseAllowed' },
  { key: 'publicDomainOnly', label: 'publicDomainOnly' },
  { key: 'cc0Only', label: 'cc0Only' },
  { key: 'requiresAttribution', label: 'requiresAttribution' },
  { key: 'modificationAllowed', label: 'modificationAllowed' },
  { key: 'commercialUseAllowed', label: 'commercialUseAllowed' },
  { key: 'showUnclear', label: 'showUnclear' },
];

export function LicenseFilters({ value, t, onChange }: Props) {
  return (
    <fieldset className="license-filters">
      <legend>{t('filters')}</legend>
      {controls.map(({ key, label }) => (
        <label key={key}>
          <input
            type="checkbox"
            checked={value[key]}
            onChange={(event) => onChange({ ...value, [key]: event.target.checked })}
          />
          <span>{t(label)}</span>
        </label>
      ))}
    </fieldset>
  );
}

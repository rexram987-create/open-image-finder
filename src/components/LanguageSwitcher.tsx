import type { Language, MessageKey } from '../i18n/messages';

interface Props {
  language: Language;
  t(key: MessageKey): string;
  onChange(language: Language): void;
}

export function LanguageSwitcher({ language, t, onChange }: Props) {
  return (
    <div className="language-switcher">
      <span>{t('language')}</span>
      <button type="button" aria-pressed={language === 'he'} onClick={() => onChange('he')}>{t('hebrew')}</button>
      <button type="button" aria-pressed={language === 'en'} onClick={() => onChange('en')}>{t('english')}</button>
    </div>
  );
}

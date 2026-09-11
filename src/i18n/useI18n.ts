import { useEffect, useMemo, useState } from 'react';
import { messages, type Language, type MessageKey } from './messages';

const LANGUAGE_KEY = 'free-image-search.language';

function loadLanguage(): Language {
  try {
    return localStorage.getItem(LANGUAGE_KEY) === 'en' ? 'en' : 'he';
  } catch {
    return 'he';
  }
}

export function useI18n() {
  const [language, setLanguageState] = useState<Language>(loadLanguage);
  const dir = language === 'he' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    try {
      localStorage.setItem(LANGUAGE_KEY, language);
    } catch {
      // Storage may be unavailable in private/restricted browser contexts.
    }
  }, [language, dir]);

  return useMemo(() => ({
    language,
    dir,
    setLanguage(language: Language) {
      setLanguageState(language);
    },
    t(key: MessageKey) {
      return messages[language][key];
    },
  }), [language, dir]);
}

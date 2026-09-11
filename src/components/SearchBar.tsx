import { useState, type FormEvent } from 'react';
import type { MessageKey } from '../i18n/messages';

interface Props {
  t(key: MessageKey): string;
  onSearch(query: string): void;
  disabled?: boolean;
}

export function SearchBar({ t, onSearch, disabled = false }: Props) {
  const [query, setQuery] = useState('');

  function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) onSearch(trimmed);
  }

  return (
    <form className="search-bar" role="search" onSubmit={submit}>
      <label htmlFor="image-search">{t('searchLabel')}</label>
      <div className="search-row">
        <input
          id="image-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('searchPlaceholder')}
          autoComplete="off"
        />
        <button type="submit" disabled={disabled || !query.trim()}>{t('searchButton')}</button>
      </div>
    </form>
  );
}

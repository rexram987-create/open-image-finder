import type { MessageKey } from '../i18n/messages';

interface Props {
  queries: string[];
  t(key: MessageKey): string;
  onSearch(query: string): void;
}

export function RecentSearches({ queries, t, onSearch }: Props) {
  return (
    <section className="saved-section" aria-labelledby="recent-heading">
      <h2 id="recent-heading">{t('recentSearches')}</h2>
      {queries.length ? (
        <div className="chip-list">
          {queries.map((query) => (
            <button key={query} type="button" onClick={() => onSearch(query)}>{query}</button>
          ))}
        </div>
      ) : <p>{t('noRecentSearches')}</p>}
    </section>
  );
}

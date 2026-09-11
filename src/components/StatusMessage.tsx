import type { MessageKey } from '../i18n/messages';

interface Props {
  loading: boolean;
  error: 'network' | 'api' | null;
  searched: boolean;
  resultCount: number;
  t(key: MessageKey): string;
  onRetry(): void;
}

export function StatusMessage({ loading, error, searched, resultCount, t, onRetry }: Props) {
  if (loading) return <p role="status" aria-live="polite">{t('loading')}</p>;
  if (error) {
    return (
      <div role="alert" className="status-error">
        <p>{t(error === 'network' ? 'networkError' : 'apiError')}</p>
        <button type="button" onClick={onRetry}>{t('retry')}</button>
      </div>
    );
  }
  if (searched && resultCount === 0) return <p role="status">{t('noResults')}</p>;
  return null;
}

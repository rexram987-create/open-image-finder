import { useState } from 'react';
import { ImageGallery } from './components/ImageGallery';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { LicenseFilters } from './components/LicenseFilters';
import { SearchBar } from './components/SearchBar';
import { StatusMessage } from './components/StatusMessage';
import { useImageSearch } from './hooks/useImageSearch';
import { useI18n } from './i18n/useI18n';
import { loadFilters, saveFilters } from './lib/storage';
import type { CommonsImage } from './types/image';
import type { LicenseFilters as LicenseFiltersValue } from './types/search';

export default function App() {
  const { language, setLanguage, t } = useI18n();
  const [filters, setFilters] = useState<LicenseFiltersValue>(loadFilters);
  const [, setSelectedImage] = useState<CommonsImage | null>(null);
  const { state, search, retry } = useImageSearch(filters);

  function updateFilters(next: LicenseFiltersValue) {
    setFilters(next);
    saveFilters(next);
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <h1>{t('appTitle')}</h1>
          <p className="subtitle">Wikimedia Commons</p>
        </div>
        <LanguageSwitcher language={language} t={t} onChange={setLanguage} />
      </header>

      <SearchBar t={t} onSearch={search} />
      <LicenseFilters value={filters} t={t} onChange={updateFilters} />
      <StatusMessage
        loading={state.loading}
        error={state.error}
        searched={state.searched}
        resultCount={state.images.length}
        t={t}
        onRetry={retry}
      />
      <ImageGallery images={state.images} t={t} onSelect={setSelectedImage} />
    </main>
  );
}

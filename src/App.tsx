import { useState } from 'react';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { ImageGallery } from './components/ImageGallery';
import { ImageModal } from './components/ImageModal';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { LicenseFilters } from './components/LicenseFilters';
import { RecentSearches } from './components/RecentSearches';
import { SearchBar } from './components/SearchBar';
import { StatusMessage } from './components/StatusMessage';
import { useImageSearch } from './hooks/useImageSearch';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useI18n } from './i18n/useI18n';
import {
  loadFavorites,
  loadFilters,
  loadRecentSearches,
  saveFilters,
  toggleFavorite,
} from './lib/storage';
import type { CommonsImage } from './types/image';
import type { LicenseFilters as LicenseFiltersValue } from './types/search';

export default function App() {
  const { language, setLanguage, t } = useI18n();
  const [filters, setFilters] = useState<LicenseFiltersValue>(loadFilters);
  const [selectedImage, setSelectedImage] = useState<CommonsImage | null>(null);
  const [recentSearches, setRecentSearches] = useState(loadRecentSearches);
  const [favorites, setFavorites] = useState(loadFavorites);
  const { state, search, retry } = useImageSearch(filters);
  const online = useOnlineStatus();

  function updateFilters(next: LicenseFiltersValue) {
    setFilters(next);
    saveFilters(next);
  }

  function runSearch(query: string) {
    if (!online) return;
    void search(query);
    setRecentSearches(loadRecentSearches());
  }

  function updateFavorite(image: CommonsImage) {
    setFavorites(toggleFavorite(image));
  }

  const selectedIsFavorite = selectedImage ? favorites.some((image) => image.id === selectedImage.id) : false;

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <h1>{t('appTitle')}</h1>
          <p className="subtitle">Wikimedia Commons</p>
        </div>
        <LanguageSwitcher language={language} t={t} onChange={setLanguage} />
      </header>

      {!online && <p className="offline-banner" role="status">{t('offline')}</p>}
      <SearchBar t={t} onSearch={runSearch} disabled={!online} />
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

      <div className="saved-grid">
        <RecentSearches queries={recentSearches} t={t} onSearch={runSearch} />
        <FavoritesDrawer
          images={favorites}
          t={t}
          onSelect={setSelectedImage}
          onRemove={updateFavorite}
        />
      </div>

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          language={language}
          t={t}
          isFavorite={selectedIsFavorite}
          onToggleFavorite={() => updateFavorite(selectedImage)}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </main>
  );
}

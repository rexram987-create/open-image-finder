import type { MessageKey } from '../i18n/messages';
import type { CommonsImage } from '../types/image';

interface Props {
  images: CommonsImage[];
  t(key: MessageKey): string;
  onSelect(image: CommonsImage): void;
  onRemove(image: CommonsImage): void;
}

export function FavoritesDrawer({ images, t, onSelect, onRemove }: Props) {
  return (
    <section className="saved-section" aria-labelledby="favorites-heading">
      <h2 id="favorites-heading">{t('favorites')}</h2>
      {!images.length ? <p>{t('noFavorites')}</p> : (
        <ul className="favorites-list">
          {images.map((image) => (
            <li key={image.id}>
              <button type="button" onClick={() => onSelect(image)}>{image.title.replace(/^File:/, '')}</button>
              <a href={image.sourcePageUrl} target="_blank" rel="noopener noreferrer">{t('openSource')}</a>
              <button type="button" onClick={() => onRemove(image)}>{t('unfavorite')}</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

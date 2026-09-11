import type { MessageKey } from '../i18n/messages';
import type { CommonsImage } from '../types/image';
import { ImageCard } from './ImageCard';

interface Props {
  images: CommonsImage[];
  t(key: MessageKey): string;
  onSelect(image: CommonsImage): void;
}

export function ImageGallery({ images, t, onSelect }: Props) {
  if (!images.length) return null;

  return (
    <section aria-labelledby="results-heading">
      <h2 id="results-heading">{t('results')} ({images.length})</h2>
      <div className="image-grid">
        {images.map((image) => <ImageCard key={image.id} image={image} t={t} onSelect={onSelect} />)}
      </div>
    </section>
  );
}

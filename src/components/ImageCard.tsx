import type { MessageKey } from '../i18n/messages';
import type { CommonsImage } from '../types/image';

interface Props {
  image: CommonsImage;
  t(key: MessageKey): string;
  onSelect(image: CommonsImage): void;
}

export function ImageCard({ image, t, onSelect }: Props) {
  return (
    <article className="image-card">
      <button type="button" className="image-card-button" onClick={() => onSelect(image)}>
        <img src={image.thumbnailUrl} alt={image.description ?? image.title.replace(/^File:/, '')} loading="lazy" />
        <span className="image-card-body">
          <strong>{image.title.replace(/^File:/, '')}</strong>
          <span className="license-badge">{image.exactLicenseName ?? t('unknownLicense')}</span>
        </span>
      </button>
    </article>
  );
}

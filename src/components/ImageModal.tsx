import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { Language, MessageKey } from '../i18n/messages';
import { downloadOriginal, type DownloadResult } from '../lib/download';
import { getLicenseExplanation } from '../lib/licenseExplanation';
import type { CommonsImage } from '../types/image';

interface Props {
  image: CommonsImage;
  language: Language;
  t(key: MessageKey): string;
  isFavorite: boolean;
  onToggleFavorite(): void;
  onClose(): void;
}

export function ImageModal({ image, language, t, isFavorite, onToggleFavorite, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [downloadResult, setDownloadResult] = useState<DownloadResult | null>(null);

  useEffect(() => {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    return () => openerRef.current?.focus();
  }, []);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [],
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  async function handleDownload() {
    setDownloadResult(await downloadOriginal(image));
  }

  const unclear = image.normalizedLicenseGroup === 'unknown' || image.licenseConfidence === 'unknown';

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div ref={dialogRef} className="image-modal" role="dialog" aria-modal="true" aria-labelledby="image-modal-title" onKeyDown={onKeyDown}>
        <div className="modal-header">
          <h2 id="image-modal-title">{image.title.replace(/^File:/, '')}</h2>
          <button ref={closeRef} type="button" onClick={onClose} aria-label={t('close')}>×</button>
        </div>

        <img className="modal-image" src={image.thumbnailUrl} alt={image.description ?? image.title.replace(/^File:/, '')} />

        <dl className="image-metadata">
          <div><dt>{t('license')}</dt><dd>{image.exactLicenseName ?? t('unknownLicense')}</dd></div>
          {image.author && <div><dt>{t('author')}</dt><dd>{image.author}</dd></div>}
          {image.credit && <div><dt>{t('credit')}</dt><dd>{image.credit}</dd></div>}
          {image.width && image.height && <div><dt>{t('dimensions')}</dt><dd>{image.width} × {image.height}</dd></div>}
          {image.mimeType && <div><dt>{t('originalFormat')}</dt><dd>{image.mimeType}</dd></div>}
        </dl>

        {unclear && <p className="license-warning" role="alert">{t('unclearLicenseWarning')}</p>}
        <p>{getLicenseExplanation(image, language)}</p>
        <p className="informational-note">{t('informationalOnly')}</p>

        <div className="modal-actions">
          <button type="button" onClick={onToggleFavorite}>{t(isFavorite ? 'unfavorite' : 'favorite')}</button>
          <button type="button" onClick={handleDownload}>{t('downloadOriginal')}</button>
          <a href={image.sourcePageUrl} target="_blank" rel="noopener noreferrer">{t('openSource')}</a>
          {image.licenseUrl && <a href={image.licenseUrl} target="_blank" rel="noopener noreferrer">{t('openLicense')}</a>}
          <button type="button" onClick={onClose}>{t('close')}</button>
        </div>
        {downloadResult && <p role="status">{t(downloadResult === 'download-started' ? 'downloadStarted' : 'openedOriginal')}</p>}
      </div>
    </div>
  );
}

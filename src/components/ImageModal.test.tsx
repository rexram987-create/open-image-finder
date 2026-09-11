import { fireEvent, render, screen, within } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import type { CommonsImage } from '../types/image';
import { ImageModal } from './ImageModal';

const image = {
  id: 1, title: 'File:Example.jpg', description: 'Example', thumbnailUrl: 'thumb', originalUrl: 'original',
  sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:Example.jpg', mimeType: 'image/jpeg', width: 100, height: 80,
  author: 'Author', credit: null, exactLicenseName: 'CC BY 4.0', normalizedLicenseGroup: 'cc-by',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/', attributionRequired: true, commercialUseAllowed: true,
  modificationAllowed: true, shareAlikeRequired: false, licenseConfidence: 'high',
} as CommonsImage;

it('is an accessible dialog and closes with Escape', () => {
  const onClose = vi.fn();
  render(<ImageModal image={image} language="en" t={(key: any) => key} isFavorite={false} onToggleFavorite={vi.fn()} onClose={onClose} />);
  const dialog = screen.getByRole('dialog');
  expect(dialog).toHaveAttribute('aria-modal', 'true');
  expect(within(dialog).getAllByRole('button', { name: 'close' })[0]).toHaveFocus();
  fireEvent.keyDown(dialog, { key: 'Escape' });
  expect(onClose).toHaveBeenCalled();
  expect(screen.getByRole('link', { name: 'openSource' })).toHaveAttribute('rel', 'noopener noreferrer');
});

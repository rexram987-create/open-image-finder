import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import type { CommonsImage } from '../types/image';
import { FavoritesDrawer } from './FavoritesDrawer';

const favorite = {
  id: 1, title: 'File:Favorite.jpg', description: null, thumbnailUrl: 'thumb', originalUrl: 'original',
  sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:Favorite.jpg', mimeType: 'image/jpeg', width: null, height: null,
  author: null, credit: null, exactLicenseName: 'CC BY 4.0', normalizedLicenseGroup: 'cc-by',
  licenseUrl: null, attributionRequired: true, commercialUseAllowed: true, modificationAllowed: true,
  shareAlikeRequired: false, licenseConfidence: 'high',
} as CommonsImage;

it('keeps the source page openable from a saved favorite', () => {
  render(<FavoritesDrawer images={[favorite]} t={(key: any) => key} onSelect={vi.fn()} onRemove={vi.fn()} />);
  expect(screen.getByRole('link', { name: 'openSource' })).toHaveAttribute('href', favorite.sourcePageUrl);
});

it('renders the translated empty state', () => {
  render(<FavoritesDrawer images={[]} t={(key: any) => key} onSelect={vi.fn()} onRemove={vi.fn()} />);
  expect(screen.getByText('noFavorites')).toBeInTheDocument();
});

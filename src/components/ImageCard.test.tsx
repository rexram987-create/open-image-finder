import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import type { CommonsImage } from '../types/image';
import { ImageCard } from './ImageCard';

it('renders license badge and title fallback alt text', () => {
  const image = {
    id: 1, title: 'File:Shark.jpg', description: null, thumbnailUrl: 'thumb', originalUrl: 'original',
    sourcePageUrl: 'source', mimeType: 'image/jpeg', width: null, height: null, author: null, credit: null,
    exactLicenseName: 'CC BY 4.0', normalizedLicenseGroup: 'cc-by', licenseUrl: null, attributionRequired: true,
    commercialUseAllowed: true, modificationAllowed: true, shareAlikeRequired: false, licenseConfidence: 'high',
  } as CommonsImage;
  render(<ImageCard image={image} t={(key: any) => key} onSelect={vi.fn()} />);
  expect(screen.getByRole('img', { name: 'Shark.jpg' })).toBeInTheDocument();
  expect(screen.getByText('CC BY 4.0')).toBeInTheDocument();
});

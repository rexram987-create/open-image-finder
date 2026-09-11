import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CommonsImage } from '../types/image';
import { downloadOriginal } from './download';

const image = {
  id: 1, title: 'File:Example.svg', description: null, thumbnailUrl: 'thumb', originalUrl: 'https://upload.wikimedia.org/example.svg',
  sourcePageUrl: 'source', mimeType: 'image/svg+xml', width: null, height: null, author: null, credit: null,
  exactLicenseName: 'CC0 1.0', normalizedLicenseGroup: 'cc0', licenseUrl: null, attributionRequired: false,
  commercialUseAllowed: true, modificationAllowed: true, shareAlikeRequired: false, licenseConfidence: 'high',
} as CommonsImage;

afterEach(() => vi.unstubAllGlobals());

describe('downloadOriginal', () => {
  it('downloads a fetched original blob', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, blob: async () => new Blob(['x']) }));
    const create = vi.fn(() => 'blob:test');
    const revoke = vi.fn();
    vi.stubGlobal('URL', { ...URL, createObjectURL: create, revokeObjectURL: revoke });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    await expect(downloadOriginal(image)).resolves.toBe('download-started');
    expect(create).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
    click.mockRestore();
  });

  it('opens the original when direct fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('cors')));
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    await expect(downloadOriginal(image)).resolves.toBe('opened-original');
    expect(open).toHaveBeenCalledWith(image.originalUrl, '_blank', 'noopener,noreferrer');
    open.mockRestore();
  });
});

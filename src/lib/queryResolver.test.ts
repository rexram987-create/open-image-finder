import { describe, expect, it, vi } from 'vitest';
import { resolveEquivalentQuery } from './queryResolver';

describe('resolveEquivalentQuery', () => {
  it('resolves Hebrew to English', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ query: { pages: [{ title: 'פיל אפריקני', langlinks: [{ lang: 'en', title: 'African bush elephant' }] }] } }),
    }));
    await expect(resolveEquivalentQuery('פיל אפריקני')).resolves.toEqual({
      original: 'פיל אפריקני',
      equivalent: 'African bush elephant',
      sourceLanguage: 'he',
    });
    vi.unstubAllGlobals();
  });

  it('resolves English to Hebrew', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ query: { pages: [{ title: 'Greenland shark', langlinks: [{ lang: 'he', title: 'כריש גרינלנדי' }] }] } }),
    }));
    await expect(resolveEquivalentQuery('Greenland shark')).resolves.toMatchObject({
      equivalent: 'כריש גרינלנדי',
      sourceLanguage: 'en',
    });
    vi.unstubAllGlobals();
  });

  it('returns null when no equivalent exists', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ query: { pages: [] } }) }));
    await expect(resolveEquivalentQuery('No match')).resolves.toMatchObject({ equivalent: null });
    vi.unstubAllGlobals();
  });

  it('degrades gracefully on resolver network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('network')));
    await expect(resolveEquivalentQuery('T. rex')).resolves.toEqual({
      original: 'T. rex',
      equivalent: null,
      sourceLanguage: 'en',
    });
    vi.unstubAllGlobals();
  });
});

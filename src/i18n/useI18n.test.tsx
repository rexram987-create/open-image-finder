import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useI18n } from './useI18n';

describe('useI18n', () => {
  beforeEach(() => localStorage.clear());

  it('defaults to Hebrew and RTL', () => {
    const { result } = renderHook(() => useI18n());
    expect(result.current.language).toBe('he');
    expect(result.current.dir).toBe('rtl');
    expect(result.current.t('appTitle')).toBe('חיפוש תמונות חופשיות');
    expect(document.documentElement.dir).toBe('rtl');
  });

  it('switches to English/LTR and persists it', () => {
    const { result } = renderHook(() => useI18n());
    act(() => result.current.setLanguage('en'));
    expect(result.current.language).toBe('en');
    expect(result.current.dir).toBe('ltr');
    expect(localStorage.getItem('free-image-search.language')).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });
});

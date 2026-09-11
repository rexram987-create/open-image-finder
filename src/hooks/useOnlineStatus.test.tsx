import { act, renderHook } from '@testing-library/react';
import { expect, it } from 'vitest';
import { useOnlineStatus } from './useOnlineStatus';

it('reacts to offline and online browser events', () => {
  Object.defineProperty(navigator, 'onLine', { configurable: true, value: true });
  const { result } = renderHook(() => useOnlineStatus());
  expect(result.current).toBe(true);

  act(() => window.dispatchEvent(new Event('offline')));
  expect(result.current).toBe(false);

  act(() => window.dispatchEvent(new Event('online')));
  expect(result.current).toBe(true);
});

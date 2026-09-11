import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { RecentSearches } from './RecentSearches';

it('reruns a recent search', () => {
  const onSearch = vi.fn();
  render(<RecentSearches queries={['shark']} t={(key: any) => key} onSearch={onSearch} />);
  fireEvent.click(screen.getByRole('button', { name: 'shark' }));
  expect(onSearch).toHaveBeenCalledWith('shark');
});

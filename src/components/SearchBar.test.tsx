import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { SearchBar } from './SearchBar';

const t = (key: any) => ({ searchLabel: 'Search images', searchPlaceholder: 'Search', searchButton: 'Go' }[key] ?? key);

it('submits a trimmed query by keyboard/form submit', () => {
  const onSearch = vi.fn();
  render(<SearchBar t={t} onSearch={onSearch} />);
  fireEvent.change(screen.getByLabelText('Search images'), { target: { value: '  shark  ' } });
  fireEvent.submit(screen.getByRole('search'));
  expect(onSearch).toHaveBeenCalledWith('shark');
});

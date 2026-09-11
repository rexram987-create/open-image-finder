import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import type { MessageKey } from '../i18n/messages';
import { SearchBar } from './SearchBar';

const labels: Partial<Record<MessageKey, string>> = {
  searchLabel: 'Search images',
  searchPlaceholder: 'Search',
  searchButton: 'Go',
};
const t = (key: MessageKey) => labels[key] ?? key;

it('submits a trimmed query by keyboard/form submit', () => {
  const onSearch = vi.fn();
  render(<SearchBar t={t} onSearch={onSearch} />);
  fireEvent.change(screen.getByLabelText('Search images'), { target: { value: '  shark  ' } });
  fireEvent.submit(screen.getByRole('search'));
  expect(onSearch).toHaveBeenCalledWith('shark');
});

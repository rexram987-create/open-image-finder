import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { StatusMessage } from './StatusMessage';

const t = (key: any) => key;

it('renders loading, error, and empty states semantically', () => {
  const { rerender } = render(<StatusMessage loading error={null} searched={false} resultCount={0} t={t} onRetry={vi.fn()} />);
  expect(screen.getByRole('status')).toHaveTextContent('loading');
  rerender(<StatusMessage loading={false} error="network" searched resultCount={0} t={t} onRetry={vi.fn()} />);
  expect(screen.getByRole('alert')).toHaveTextContent('networkError');
  rerender(<StatusMessage loading={false} error={null} searched resultCount={0} t={t} onRetry={vi.fn()} />);
  expect(screen.getByRole('status')).toHaveTextContent('noResults');
});

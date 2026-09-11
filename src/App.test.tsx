import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the Hebrew app title by default', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'חיפוש תמונות חופשיות' })).toBeInTheDocument();
  });
});

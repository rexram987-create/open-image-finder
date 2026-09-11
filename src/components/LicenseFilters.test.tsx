import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { defaultLicenseFilters } from '../types/search';
import { LicenseFilters } from './LicenseFilters';

it('renders labeled filter controls', () => {
  const onChange = vi.fn();
  render(<LicenseFilters value={defaultLicenseFilters} t={(key: any) => key} onChange={onChange} />);
  const control = screen.getByLabelText('publicDomainOnly');
  fireEvent.click(control);
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ publicDomainOnly: true }));
});

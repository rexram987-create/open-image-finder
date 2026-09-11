import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import App from './App';

function page(
  pageid: number,
  title: string,
  licenseShortName: string,
  licenseUrl: string | null,
) {
  return {
    pageid,
    title,
    imageinfo: [{
      url: `https://upload.wikimedia.org/${pageid}.jpg`,
      thumburl: `https://upload.wikimedia.org/${pageid}-thumb.jpg`,
      mime: 'image/jpeg',
      width: 1200,
      height: 800,
      extmetadata: {
        ImageDescription: { value: title.replace(/^File:/, '') },
        Artist: { value: 'Example Author' },
        LicenseShortName: { value: licenseShortName },
        ...(licenseUrl ? { LicenseUrl: { value: licenseUrl } } : {}),
        AttributionRequired: { value: licenseShortName.startsWith('CC BY') ? 'true' : 'false' },
      },
    }],
  };
}

beforeEach(() => {
  localStorage.clear();
  Object.defineProperty(navigator, 'onLine', { configurable: true, value: true });
});

afterEach(() => vi.unstubAllGlobals());

it('supports the primary bilingual, license, favorite, language, and unclear-license flow', async () => {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = new URL(String(input));

    if (url.hostname === 'he.wikipedia.org') {
      return {
        ok: true,
        json: async () => ({
          query: { pages: [{ title: 'פיל אפריקאי', langlinks: [{ lang: 'en', title: 'African elephant' }] }] },
        }),
      };
    }

    if (url.hostname === 'commons.wikimedia.org') {
      const query = url.searchParams.get('gsrsearch');
      if (query === 'African elephant') {
        return {
          ok: true,
          json: async () => ({
            query: {
              pages: [
                page(1, 'File:Elephant.jpg', 'CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0/'),
                page(2, 'File:Unclear elephant.jpg', 'Custom open license', null),
              ],
            },
          }),
        };
      }

      return {
        ok: true,
        json: async () => ({
          query: { pages: [page(1, 'File:Elephant.jpg', 'CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0/')] },
        }),
      };
    }

    throw new Error(`Unexpected URL: ${url}`);
  });

  vi.stubGlobal('fetch', fetchMock);
  render(<App />);

  fireEvent.change(screen.getByLabelText('חיפוש תמונות'), { target: { value: 'פיל אפריקאי' } });
  fireEvent.click(screen.getByRole('button', { name: 'חפש' }));

  await screen.findByText('Elephant.jpg');
  expect(screen.getByText('CC BY 4.0')).toBeInTheDocument();
  expect(screen.queryByText('Unclear elephant.jpg')).not.toBeInTheDocument();

  fireEvent.click(screen.getByText('Elephant.jpg'));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByText(/מותר להשתמש ולשנות/)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'הוסף למועדפים' }));
  expect(screen.getByRole('button', { name: 'הסר מהמועדפים' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'סגור' }));

  fireEvent.click(screen.getByRole('button', { name: 'English' }));
  await waitFor(() => expect(document.documentElement.dir).toBe('ltr'));

  fireEvent.click(screen.getByLabelText('Show images with unclear license information'));
  await screen.findByText('Unclear elephant.jpg');
});

import type { RawCommonsPage } from '../../lib/commonsClient';

export const commonsPageFixture: RawCommonsPage = {
  pageid: 123,
  title: 'File:Example image.jpg',
  imageinfo: [
    {
      url: 'https://upload.wikimedia.org/example.jpg',
      thumburl: 'https://upload.wikimedia.org/thumb/example.jpg',
      mime: 'image/jpeg',
      width: 1200,
      height: 800,
      extmetadata: {
        ImageDescription: { value: '<p>An <b>example</b> image</p>' },
        Artist: { value: '<a href="/wiki/User:Example">Example Author</a>' },
        Credit: { value: 'Own work' },
        LicenseShortName: { value: 'CC BY-SA 4.0' },
        LicenseUrl: { value: 'https://creativecommons.org/licenses/by-sa/4.0/' },
        UsageTerms: { value: 'Creative Commons Attribution-Share Alike 4.0' },
        AttributionRequired: { value: 'true' }
      }
    }
  ]
};

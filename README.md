# Open Image Finder

Open Image Finder is an installable, accessible PWA for finding images with clear reuse information.

## V1

Version 1 searches **Wikimedia Commons only**. The architecture keeps the image-provider boundary separate so additional sources can be added later without redesigning the interface.

### What it does

- Searches Wikimedia Commons without an API key.
- Accepts Hebrew or English searches and tries to resolve the equivalent term in the other language.
- Shows image creator, source, exact license identifier, and a plain-language license explanation.
- Hides images with unclear/unrecognized license metadata by default.
- Filters for public domain, CC0, attribution, modification, and commercial-use requirements.
- Opens or downloads the original Wikimedia file.
- Saves language, filters, recent searches, and favorites locally in the browser.
- Works as a PWA: after the app shell has loaded successfully once, the interface can reopen offline. New image searches still require internet access.
- Supports Hebrew RTL and English LTR interfaces.

## Privacy and architecture

No account, backend, server database, cloud sync, AI service, or API key is required. Preferences, recents, and favorites remain in the browser's `localStorage`.

The app makes public requests directly to Wikimedia Commons and Wikipedia APIs. V1 does not send searches to a custom server.

## License information

License summaries in the app are **informational only**. The exact license and Wikimedia Commons source page are the authoritative references.

The classifier deliberately recognizes only known license families. Unknown or unclear licenses are not guessed and are hidden by default unless the user explicitly chooses to show them.

Other rights can still matter even when copyright permits reuse, including privacy, publicity, trademark, cultural-property, or jurisdiction-specific restrictions.

## Development

Requirements: a current Node.js release (Node 22 is used in CI).

```bash
npm install
npm run dev
npm test -- --run
npm run build
```

## Current branch workflow

Development is performed on feature branches and verified before merging to `main`.

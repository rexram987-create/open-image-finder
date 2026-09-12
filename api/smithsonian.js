export default async function handler(req, res) {
  const key = process.env.SMITHSONIAN_API_KEY;

  if (!key) {
    return res.status(500).json({
      results: [],
      error: 'Smithsonian API key is not configured'
    });
  }

  const q = String(req.query.q || '').trim();
  const rows = Math.min(
    Math.max(Number(req.query.rows) || 30, 1),
    50
  );

  if (!q) {
    return res.status(400).json({
      results: [],
      error: 'Missing search query'
    });
  }

  try {
    const url =
      'https://api.si.edu/openaccess/api/v1.0/search' +
      '?q=' + encodeURIComponent(q) +
      '&rows=' + rows +
      '&api_key=' + encodeURIComponent(key);

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({
        results: [],
        error: 'Smithsonian request failed'
      });
    }

    const data = await response.json();

    const rowsData = data?.response?.rows || [];
    const results = [];

    for (const item of rowsData) {
      const descriptive =
        item?.content?.descriptiveNonRepeating || {};

      const media =
        descriptive?.online_media?.media || [];

      const image = Array.isArray(media)
        ? media.find(
            m =>
              m &&
              m.type === 'Images' &&
              (m.content || m.thumbnail)
          )
        : null;

      if (!image) continue;

      const metadataUsage =
        descriptive?.metadata_usage || {};

      const access = String(
        metadataUsage?.access || ''
      ).toUpperCase();

      // רק פריטי Open Access / CC0
      if (access && access !== 'CC0') continue;

      const freeText =
        item?.content?.freetext || {};

      const names = Array.isArray(freeText?.name)
        ? freeText.name
        : [];

      const creator =
        names[0]?.content ||
        descriptive?.data_source ||
        'Smithsonian Institution';

      const itemUrl =
        descriptive?.record_link ||
        descriptive?.guid ||
        '';

      // טקסט מורחב לצורך בדיקת רלוונטיות
      const metadataParts = [];

      metadataParts.push(
        item?.title || '',
        descriptive?.title?.content || '',
        descriptive?.data_source || '',
        descriptive?.record_ID || '',
        descriptive?.unit_code || ''
      );

      for (const value of Object.values(freeText)) {
        if (!Array.isArray(value)) continue;

        for (const entry of value) {
          if (entry?.content) {
            metadataParts.push(entry.content);
          }
        }
      }

      const indexedStructured =
        item?.content?.indexedStructured || {};

      for (const value of Object.values(indexedStructured)) {
        if (Array.isArray(value)) {
          metadataParts.push(...value.map(String));
        } else if (value) {
          metadataParts.push(String(value));
        }
      }

      const indexText = metadataParts
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      results.push({
        id: item.id || '',
        title: item.title || 'Smithsonian item',
        image: image.content || image.thumbnail || '',
        thumbnail: image.thumbnail || image.content || '',
        url: itemUrl,
        creator,
        license: 'CC0',
        source: 'Smithsonian Open Access',
        indexText
      });
    }

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400'
    );

    return res.status(200).json({ results });
  } catch (error) {
    return res.status(500).json({
      results: [],
      error: 'Smithsonian search failed'
    });
  }
}

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

      const indexedStructured = item?.content?.indexedStructured || {};

      const namesText = [
        ...(Array.isArray(freeText?.name) ? freeText.name.map(x => x?.content || '') : []),
        ...(Array.isArray(indexedStructured?.name) ? indexedStructured.name.map(String) : [])
      ].filter(Boolean).join(' ');

      const subjectsText = [
        ...(Array.isArray(freeText?.topic) ? freeText.topic.map(x => x?.content || '') : []),
        ...(Array.isArray(freeText?.subject) ? freeText.subject.map(x => x?.content || '') : []),
        ...(Array.isArray(indexedStructured?.topic) ? indexedStructured.topic.map(String) : []),
        ...(Array.isArray(indexedStructured?.subject) ? indexedStructured.subject.map(String) : [])
      ].filter(Boolean).join(' ');

      const objectTypesText = [
        ...(Array.isArray(indexedStructured?.object_type) ? indexedStructured.object_type.map(String) : []),
        ...(Array.isArray(indexedStructured?.type) ? indexedStructured.type.map(String) : [])
      ].filter(Boolean).join(' ');

      results.push({
        id: item.id || '',
        title: item.title || 'Smithsonian item',
        image: image.content || image.thumbnail || '',
        thumbnail: image.thumbnail || image.content || '',
        url: itemUrl,
        creator,
        license: 'CC0',
        source: 'Smithsonian Open Access',
        namesText,
        subjectsText,
        objectTypesText
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

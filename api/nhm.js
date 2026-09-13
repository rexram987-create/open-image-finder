export default async function handler(req,res){
  try{
    const q=String(req.query.q||'').trim();
    const rows=Math.min(Math.max(Number(req.query.rows)||20,1),50);
    if(!q)return res.status(400).json({results:[]});
    const params=new URLSearchParams({
      resource_id:'05ff2255-c38a-40c9-b657-4ccb55ab2feb',
      q,
      limit:String(rows)
    });
    const r=await fetch('https://data.nhm.ac.uk/api/3/action/datastore_search?'+params.toString(),{
      headers:{'User-Agent':'Open-Image-Finder/1.0'}
    });
    if(!r.ok)return res.status(r.status).json({results:[]});
    const d=await r.json();
    const records=d?.result?.records||[];
    const results=[];
    for(const x of records){
      const mediaValues=Object.entries(x)
        .filter(([k,v])=>/^associatedMedia(?:\.|$)/i.test(k)&&v)
        .flatMap(([,v])=>Array.isArray(v)?v:[v])
        .map(v=>String(v));

      const urls=[...new Set(
        mediaValues.flatMap(v=>v.match(/https?:[^\s,;|"']+/g)||[])
      )];

      let imageUrl=urls.find(u=>/associatedMedia\.identifier/i.test(u))||'';
      if(!imageUrl)imageUrl=urls.find(u=>/iiif|image|media/i.test(u))||'';
      if(!imageUrl)continue;

      imageUrl=imageUrl.replace(/^http:/,'https:');

      results.push({
        id:String(x._id||x.occurrenceID||x.catalogNumber||results.length),
        title:x.scientificName||x.currentScientificName||x.acceptedNameUsage||x.catalogNumber||'Natural History Museum specimen',
        image:imageUrl,
        thumbnail:imageUrl,
        url:x.occurrenceID&&/^https?:/i.test(String(x.occurrenceID))
          ?String(x.occurrenceID)
          :'https://data.nhm.ac.uk/dataset/collection-specimens/resource/05ff2255-c38a-40c9-b657-4ccb55ab2feb/record/'+String(x._id||''),
        creator:'Natural History Museum, London',
        license:'CC BY 4.0',
        description:[x.scientificName,x.family,x.genus,x.collectionCode,x.catalogNumber,x.catalogueDescription].filter(Boolean).join(' · ')
      });
    }
    res.setHeader('Cache-Control','public, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({results});
  }catch(e){
    return res.status(500).json({results:[]});
  }
}
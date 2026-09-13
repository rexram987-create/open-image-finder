export default async function handler(req,res){
  try{
    const q=String(req.query.q||'').trim();
    const rows=Math.min(Math.max(Number(req.query.rows)||20,1),50);
    if(!q)return res.status(400).json({results:[]});

    const params=new URLSearchParams({
      resource_id:'05ff2255-c38a-40c9-b657-4ccb55ab2feb',
      q,
      limit:String(rows),
      fields:'_id,scientificName,currentScientificName,acceptedNameUsage,catalogNumber,family,genus,collectionCode,catalogueDescription,associatedMedia',
      filters:JSON.stringify({_has_image:true})
    });

    const r=await fetch('https://data.nhm.ac.uk/api/3/action/datastore_search?'+params.toString(),{
      headers:{'User-Agent':'Open-Image-Finder/1.0'}
    });
    if(!r.ok)return res.status(r.status).json({results:[]});

    const d=await r.json();
    const records=d?.result?.records||[];
    const results=[];

    for(const x of records){
      let media=x.associatedMedia;
      if(typeof media==='string'){
        try{media=JSON.parse(media)}catch{media=null}
      }
      const mediaList=Array.isArray(media)?media:(media?[media]:[]);
      if(!mediaList.length)continue;

      for(const m of mediaList){
        if(!m||typeof m!=='object')continue;
        const image=String(m.identifier||m.accessURI||m.reference||m.thumbnail||'').trim();
        if(!image)continue;

        const imageUrl=image.replace(/^http:/,'https:');
        const license=String(m.license||m.rights||'CC BY 4.0').trim()||'CC BY 4.0';

        results.push({
          id:String(x._id||x.catalogNumber||results.length),
          title:x.scientificName||x.currentScientificName||x.acceptedNameUsage||x.catalogNumber||'Natural History Museum specimen',
          image:imageUrl,
          thumbnail:imageUrl,
          url:'https://data.nhm.ac.uk/dataset/collection-specimens/resource/05ff2255-c38a-40c9-b657-4ccb55ab2feb/record/'+String(x._id||''),
          creator:String(m.creator||m.rightsHolder||'Natural History Museum, London'),
          license,
          description:[x.scientificName,x.family,x.genus,x.collectionCode,x.catalogNumber,x.catalogueDescription,m.title].filter(Boolean).join(' · ')
        });

        if(results.length>=rows)break;
      }
      if(results.length>=rows)break;
    }

    res.setHeader('Cache-Control','public, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({results});
  }catch(e){
    return res.status(500).json({results:[]});
  }
}
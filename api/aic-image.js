export default async function handler(req,res){
  const id=String(req.query.id||'');
  if(!id)return res.status(400).end();
  try{
    const r=await fetch('https://www.artic.edu/iiif/2/'+id+'/full/843,/0/default.jpg');
    if(!r.ok)return res.status(r.status).end();
    const data=await r.arrayBuffer();
    res.setHeader('Content-Type','image/jpeg');
    res.setHeader('Cache-Control','public, max-age=86400');
    return res.status(200).send(Buffer.from(data));
  }catch{
    return res.status(500).end();
  }
}
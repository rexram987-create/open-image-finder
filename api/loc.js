export default async function handler(req,res){
  try{
    const q=String(req.query.q||'').trim();
    const c=Math.min(30,Math.max(1,Number(req.query.c)||12));
    if(!q)return res.status(400).json({results:[]});
    const params=new URLSearchParams({q,fo:'json',c:String(c),at:'results'});
    const r=await fetch('https://www.loc.gov/pictures/search/?'+params.toString(),{
      headers:{'User-Agent':'Open-Image-Finder/1.0'}
    });
    if(!r.ok)return res.status(r.status).json({results:[]});
    const d=await r.json();
    return res.status(200).json(d);
  }catch(e){
    return res.status(500).json({results:[]});
  }
}
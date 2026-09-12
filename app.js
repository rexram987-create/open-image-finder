const $=s=>document.querySelector(s),results=$('#results'),status=$('#status'),q=$('#q'),dlg=$('#licenseDialog'),body=$('#licenseBody'),imgDlg=$('#imageDialog'),imgPreview=$('#imagePreview'),imgStage=$('#imageStage'),filters=$('#filters'),licenseFilter=$('#licenseFilter'),sourceFilter=$('#sourceFilter');
let lang=localStorage.getItem('oif-lang')||'he';
const T={he:{tag:'חיפוש תמונות חופשיות ב־Wikimedia Commons',label:'מה תרצה למצוא?',ph:'לדוגמה: Tyrannosaurus rex',go:'חיפוש',switch:'English',found:n=>`נמצאו ${n} תוצאות`,none:'לא נמצאו תוצאות.',searching:'מחפש…',error:'אירעה שגיאה בחיפוש. נסה שוב.',file:'דף הקובץ',license:'הסבר רישיון',download:'הורדת תמונה',creator:'יוצר',credit:'קרדיט',unknown:'לא צוין',see:'ראו בדף הקובץ',original:'פתיחת דף הקובץ המקורי',notice:'המידע הוא תקציר נוח בלבד. התנאים המחייבים הם אלה המופיעים בדף הקובץ ב־Wikimedia Commons.',aria:'תוצאות חיפוש',simple:'מה מותר לעשות?',share:'להעתיק ולשתף',edit:'לשתף גרסה שעברה שינוי',commercial:'שימוש מסחרי',attribution:'חובה לתת קרדיט',sameLicense:'יצירה נגזרת באותו רישיון',required:'חובה',notRequired:'לא נדרש',disallowed:'אסור',checkFile:'יש לבדוק בדף הקובץ',yes:'מותר',no:'לא ידוע',copyCredit:'העתקת קרדיט',copied:'הקרדיט הועתק',terms:'תנאים חשובים',licensePage:'דף הרישיון',version:'גרסת הרישיון',versionMeaning:'מה פירוש המספר?',versionGeneric:v=>`המספר ${v} הוא גרסת הנוסח המשפטי של הרישיון — לא דירוג ולא רמת חופש. סוג הרישיון נקבע לפי האותיות (למשל BY או BY-SA), והמספר מציין איזו מהדורה של התנאים חלה על התמונה.`,version40:'גרסה 4.0 היא הגרסה הבינלאומית העדכנית של רישיונות Creative Commons. היא נועדה לפעול בצורה אחידה יותר במדינות שונות וכוללת עדכונים משפטיים לעומת גרסאות קודמות.',filterLabel:'סינון לפי רישיון',allLicenses:'כל הרישיונות',shown:(n,total)=>`מוצגות ${n} מתוך ${total} תוצאות`,exact:'חיפוש מדויק',exactHint:'נותן עדיפות חזקה לתמונות שמתאימות ישירות למונח שחיפשת.'},en:{tag:'Search freely licensed images on Wikimedia Commons',label:'What would you like to find?',ph:'Example: Tyrannosaurus rex',go:'Search',switch:'עברית',found:n=>`${n} results found`,none:'No results found.',searching:'Searching…',error:'Search failed. Please try again.',file:'File page',license:'License info',download:'Download image',creator:'Creator',credit:'Credit',unknown:'Not specified',see:'See file page',original:'Open original file page',notice:'This is a convenient summary only. The binding terms are those shown on the Wikimedia Commons file page.',aria:'Search results',simple:'What can I do with it?',share:'Copy and share',edit:'Share adapted versions',commercial:'Commercial use',attribution:'Attribution required',sameLicense:'Adaptations under same license',required:'Required',notRequired:'Not required',disallowed:'Not allowed',checkFile:'Check the file page',yes:'Allowed',no:'Unknown',copyCredit:'Copy credit',copied:'Credit copied',terms:'Important terms',licensePage:'License page',version:'License version',versionMeaning:'What does the number mean?',versionGeneric:v=>`The number ${v} is the version of the legal license text — not a rating or level of freedom. The letters (such as BY or BY-SA) identify the license type; the number identifies which edition of its terms applies to the image.`,version40:'Version 4.0 is the current international version of the Creative Commons license suite. It was designed to work more consistently across jurisdictions and includes legal updates compared with earlier versions.',filterLabel:'Filter by license',allLicenses:'All licenses',shown:(n,total)=>`Showing ${n} of ${total} results`,exact:'Focused search',exactHint:'Strongly prioritizes images that directly match what you searched for.'}};
const strip=s=>(s||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function licenseInfo(m){
  const raw=strip(m.LicenseShortName?.value||m.UsageTerms?.value||m.License?.value||T[lang].unknown);
  const url=(m.LicenseUrl?.value||'').trim();
  const l=(raw+' '+url).toLowerCase();
  const ccLike=/creative commons|\bcc\s*(?:by|0)|attribution|creativecommons\.org\/licenses/i.test(raw+' '+url);
  const versionMatch=ccLike?(raw.match(/(?:^|\s)([1-4](?:\.0|\.5)?)(?:\s|$|international)/i)||url.match(/\/licenses\/[^/]+\/([1-4](?:\.0|\.5)?)\/?/i)):null;
  const version=versionMatch?.[1]||'';
  let share=null,edit=null,commercial=null,attribution=null,sameLicense=null;
  let he='יש לבדוק את תנאי הרישיון בדף הקובץ לפני שימוש.',en='Check the license terms on the file page before use.';
  const isNCND=/by-nc-nd|attribution.noncommercial.noderiv|attribution-noncommercial-noderiv/i.test(l);
  const isNCSA=/by-nc-sa|attribution.noncommercial.sharealike|attribution-noncommercial-sharealike/i.test(l);
  const isNC=/by-nc(?!-(?:sa|nd))|\/by-nc\/|attribution.noncommercial(?!.*(?:sharealike|noderiv))/i.test(l);
  const isND=/by-nd|\/by-nd\/|attribution.noderiv/i.test(l);
  const isSA=/by-sa|\/by-sa\/|attribution.sharealike/i.test(l);
  const isBY=/\bcc\s*by\b|\/by\/|creative commons attribution/i.test(l);
  if(/cc0|public domain|pd-old|pd-us|pd-art|pd-self/.test(l)){
    share=edit=commercial=true;attribution=false;sameLicense=false;
    he='התמונה מסומנת כנחלת הכלל או CC0. בדרך כלל מותר להעתיק, לשתף, לשנות ולהשתמש גם מסחרית ללא בקשת רשות. מתן קרדיט עדיין מומלץ כשאפשר.';
    en='The image is marked Public Domain or CC0. Copying, sharing, adapting and commercial use are generally allowed without permission. Credit is still recommended when practical.';
  }else if(isNCND){
    share=true;edit=false;commercial=false;attribution=true;sameLicense=false;
    he='מותר לשתף את היצירה ללא שינוי ולתת קרדיט מתאים. אסור להשתמש בה מסחרית, ואסור לשתף גרסה שעברה שינוי.';
    en='You may share the unmodified work with proper attribution. Commercial use is not allowed, and adapted versions may not be shared.';
  }else if(isNCSA){
    share=true;edit=true;commercial=false;attribution=true;sameLicense=true;
    he='מותר לשתף וליצור גרסאות מותאמות לשימוש לא־מסחרי בלבד. חובה לתת קרדיט, וגרסה שעברה שינוי חייבת להישאר באותו רישיון או ברישיון תואם.';
    en='Sharing and adaptations are allowed for noncommercial use only. Attribution is required, and adaptations must use the same or a compatible license.';
  }else if(isNC){
    share=true;edit=true;commercial=false;attribution=true;sameLicense=false;
    he='מותר לשתף וליצור גרסאות מותאמות, אך רק לשימוש לא־מסחרי. חובה לתת קרדיט מתאים ליוצר.';
    en='Sharing and adaptations are allowed, but only for noncommercial use. Proper attribution is required.';
  }else if(isND){
    share=true;edit=false;commercial=true;attribution=true;sameLicense=false;
    he='מותר לשתף ולהשתמש ביצירה גם מסחרית עם קרדיט מתאים, אך אסור לשתף גרסה שעברה שינוי.';
    en='You may share and use the work commercially with proper attribution, but adapted versions may not be shared.';
  }else if(isSA){
    share=edit=commercial=true;attribution=true;sameLicense=true;
    he='מותר להעתיק, לשתף, לשנות ולהשתמש גם מסחרית, בתנאי שנותנים ייחוס מתאים ושומרים על אותו רישיון או רישיון תואם ביצירה נגזרת.';
    en='Copying, sharing, adapting and commercial use are allowed, provided proper attribution is given and adaptations use the same or a compatible license.';
  }else if(isBY){
    share=edit=commercial=true;attribution=true;sameLicense=false;
    he='מותר להעתיק, לשתף, לשנות ולהשתמש גם מסחרית, בתנאי שנותנים קרדיט מתאים ליוצר.';
    en='Copying, sharing, adapting and commercial use are allowed, provided proper attribution is given.';
  }else if(/gfdl|gnu free documentation/.test(l)){
    share=edit=commercial=true;attribution=true;sameLicense=true;
    he='בדרך כלל מותר להעתיק, לשנות ולהשתמש גם מסחרית, אך ל־GFDL יש דרישות ייחוס ושיתוף ברישיון זהה או תואם. מומלץ לבדוק את דף הקובץ.';
    en='Copying, adapting and commercial use are generally allowed, but GFDL has attribution and share-alike requirements. Check the file page for the exact terms.';
  }
  return{raw,url,note:lang==='he'?he:en,share,edit,commercial,attribution,sameLicense,version};
}
function licenseBadge(label,value,mode='permission'){
  const t=T[lang],state=value===true?'ok':value===false?(mode==='permission'?'blocked':'neutral'):'warn',text=value===true?(mode==='requirement'?t.required:t.yes):value===false?(mode==='permission'?t.disallowed:t.notRequired):t.no;
  return `<div class="license-row"><span>${esc(label)}</span><strong class="${state}">${esc(text)}</strong></div>`;
}
function applyLang(){const t=T[lang];document.documentElement.lang=lang;document.documentElement.dir=lang==='he'?'rtl':'ltr';$('#tagline').textContent=t.tag;$('#searchLabel').textContent=t.label;q.placeholder=t.ph;$('#go').textContent=t.go;$('#lang').textContent=t.switch;$('#licenseFilterLabel').textContent=t.filterLabel;$('#exactSearchLabel').textContent=t.exact;$('#exactSearchHint').textContent=t.exactHint;if(licenseFilter.options.length)licenseFilter.options[0].textContent=t.allLicenses;results.setAttribute('aria-label',t.aria);$('.close').setAttribute('aria-label',lang==='he'?'סגירה':'Close');$('.image-close').setAttribute('aria-label',lang==='he'?'סגירה':'Close');$('#zoomIn').setAttribute('aria-label',lang==='he'?'הגדלה':'Zoom in');$('#zoomOut').setAttribute('aria-label',lang==='he'?'הקטנה':'Zoom out');$('#zoomReset').setAttribute('aria-label',lang==='he'?'איפוס הגדלה':'Reset zoom');localStorage.setItem('oif-lang',lang)}
$('#lang').onclick=()=>{lang=lang==='he'?'en':'he';applyLang();if(results.children.length)search()};
async function downloadImage(url,title){try{const r=await fetch(url);if(!r.ok)throw 0;const blob=await r.blob(),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=title;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}catch{window.open(url,'_blank','noopener')}}
function applyLicenseFilter(){
  const t=T[lang],value=licenseFilter.value,source=sourceFilter.value;
  let visible=0,total=0;
  results.querySelectorAll('.card').forEach(card=>{
    total++;
    const show=(!value||card.dataset.license===value)&&(!source||card.dataset.source===source);
    card.hidden=!show;
    if(show)visible++;
  });
  if(total)status.textContent=(value||source)?t.shown(visible,total):t.found(total);
}
licenseFilter.addEventListener('change',applyLicenseFilter);sourceFilter.addEventListener('change',applyLicenseFilter);
async function resolveSearchEntity(term){
  try{
    const langCode=lang==='he'?'he':'en';
    const s=new URLSearchParams({action:'wbsearchentities',search:term,language:langCode,uselang:langCode,limit:'5',format:'json',origin:'*'});
    const sr=await fetch('https://www.wikidata.org/w/api.php?'+s),sd=await sr.json();
    const ids=(sd.search||[]).map(x=>x.id).filter(Boolean);
    if(!ids.length)return{category:'',english:''};
    const e=new URLSearchParams({action:'wbgetentities',ids:ids.join('|'),props:'claims|labels|descriptions',languages:'en|he',format:'json',origin:'*'});
    const er=await fetch('https://www.wikidata.org/w/api.php?'+e),ed=await er.json();
    const entities=ids.map(id=>ed.entities?.[id]).filter(Boolean);
    const best=entities.find(x=>x.claims?.P373?.[0]?.mainsnak?.datavalue?.value)||entities[0];
    const instanceOf=(best?.claims?.P31||[]).map(c=>c?.mainsnak?.datavalue?.value?.id).filter(Boolean);
    const occupation=(best?.claims?.P106||[]).map(c=>c?.mainsnak?.datavalue?.value?.id).filter(Boolean);
    return{
      id:best?.id||'',
      category:best?.claims?.P373?.[0]?.mainsnak?.datavalue?.value||'',
      english:best?.labels?.en?.value||'',
      description:best?.descriptions?.en?.value||best?.descriptions?.he?.value||'',
      instanceOf,occupation,
      isPerson:instanceOf.includes('Q5')
    };
  }catch{return{id:'',category:'',english:'',description:'',instanceOf:[],occupation:[],isPerson:false}}
}
async function categoryFiles(category,limit=80){
  if(!category)return[];
  const p=new URLSearchParams({action:'query',generator:'categorymembers',gcmtitle:'Category:'+category,gcmtype:'file',gcmlimit:String(limit),prop:'imageinfo',iiprop:'url|mime|mediatype|commonmetadata|extmetadata',iiurlwidth:'600',format:'json',origin:'*'});
  const r=await fetch('https://commons.wikimedia.org/w/api.php?'+p),d=await r.json();
  return Object.values(d.query?.pages||{});
}
async function categorySubcategories(category,limit=50){
  if(!category)return[];
  const p=new URLSearchParams({action:'query',list:'categorymembers',cmtitle:'Category:'+category,cmtype:'subcat',cmlimit:String(limit),format:'json',origin:'*'});
  const r=await fetch('https://commons.wikimedia.org/w/api.php?'+p),d=await r.json();
  return (d.query?.categorymembers||[]).map(x=>(x.title||'').replace(/^Category:/,''));
}
async function findCategories(searchText,limit=20){
  const p=new URLSearchParams({action:'query',list:'search',srsearch:searchText,srnamespace:'14',srlimit:String(limit),format:'json',origin:'*'});
  const r=await fetch('https://commons.wikimedia.org/w/api.php?'+p),d=await r.json();
  return (d.query?.search||[]).map(x=>(x.title||'').replace(/^Category:/,''));
}
async function personRepresentationFiles(name){
  if(!name)return[];
  const groups=[
    {kind:'sculpture',terms:['busts','statues','sculptures','reliefs']},
    {kind:'portrait',terms:['portraits','paintings']},
    {kind:'engraving',terms:['engravings','etchings','prints']},
    {kind:'illustration',terms:['illustrations','drawings']}
  ];
  const buckets={sculpture:[],portrait:[],engraving:[],illustration:[]};
  const n=name.toLocaleLowerCase();
  for(const group of groups){
    for(const term of group.terms){
      const cats=await findCategories(`"${name}" ${term}`,12);
      for(const cat of cats){
        const lc=cat.toLocaleLowerCase();
        if(!lc.includes(n))continue;
        if(!/bust|statue|sculpture|portrait|painting|head|relief|engraving|etching|print|illustration|drawing/i.test(cat))continue;
        const direct=await categoryFiles(cat,50);
        for(const p of direct){
          p._personRepKind=group.kind;
          p._personRepCategory=cat;
        }
        addUniquePages(buckets[group.kind],direct);
        if(buckets[group.kind].length>=35)break;
      }
      if(buckets[group.kind].length>=35)break;
    }
  }
  const found=[];
  for(let i=0;i<35;i++){
    for(const group of groups){
      const p=buckets[group.kind][i];
      if(p)addUniquePages(found,[p]);
      if(found.length>=100)return found;
    }
  }
  return found;
}
function representationKind(text){
  const s=(text||'').toLocaleLowerCase();
  if(/\b(engraving|engravings|engraved|etching|etchings|print|prints)\b/i.test(s))return'engraving';
  if(/\b(portrait|portraits|painting|paintings)\b/i.test(s))return'portrait';
  if(/\b(illustration|illustrations|drawing|drawings)\b/i.test(s))return'illustration';
  if(/\b(bust|busts|statue|statues|sculpture|sculptures|relief|reliefs|marble|bronze)\b/i.test(s))return'sculpture';
  return'other';
}
async function commonsPages(searchText,limit=30){
  const p=new URLSearchParams({action:'query',generator:'search',gsrsearch:searchText,gsrnamespace:'6',gsrlimit:String(limit),prop:'imageinfo',iiprop:'url|mime|mediatype|commonmetadata|extmetadata',iiurlwidth:'600',format:'json',origin:'*'});
  const r=await fetch('https://commons.wikimedia.org/w/api.php?'+p),d=await r.json();
  return Object.values(d.query?.pages||{});
}
async function locPages(term,limit=12){
  try{
    const q=new URLSearchParams({q:term,fo:'json',c:String(limit)});
    const r=await fetch('https://www.loc.gov/photos/?'+q.toString());
    if(!r.ok)return[];
    const d=await r.json(),out=[];
    for(const x of (d.results||[])){
      const urls=Array.isArray(x.image_url)?x.image_url:[];
      const image=urls.find(u=>/^https?:/i.test(u||''));
      if(!image)continue;
      out.push({source:'loc',title:strip(x.title||''),image,itemUrl:x.id||x.url||'',rights:strip(x.rights||x.rights_advisory||''),creator:strip(x.creator||'Library of Congress')});
      if(out.length>=limit)break;
    }
    return out;
  }catch{return[]}
}
function relevanceScore(page,term){
  const needle=term.toLocaleLowerCase(),m=page.imageinfo?.[0]?.extmetadata||{};
  const title=(page.title||'').replace(/^File:/,'').toLocaleLowerCase();
  const desc=strip(m.ImageDescription?.value).toLocaleLowerCase();
  const object=strip(m.ObjectName?.value).toLocaleLowerCase();
  let score=0;
  if(title===needle)score+=100;
  if(title.includes(needle))score+=60;
  if(object.includes(needle))score+=45;
  if(desc.includes(needle))score+=30;
  return score;
}
function photoLikelihood(page,allowArt=false){
  const i=page.imageinfo?.[0]||{},m=i.extmetadata||{},cm=i.commonmetadata||{};
  const title=(page.title||'').replace(/^File:/,'').toLocaleLowerCase();
  const desc=strip(m.ImageDescription?.value).toLocaleLowerCase();
  const mime=(i.mime||'').toLocaleLowerCase();
  const metaText=[title,desc,strip(m.Categories?.value),strip(m.ObjectName?.value),strip(m.Credit?.value)].join(' ').toLocaleLowerCase();
  let score=0;

  // File format alone is only a weak hint: drawings and emblems can also be JPEGs.
  if(mime==='image/jpeg')score+=10;
  else if(mime==='image/webp')score+=8;
  else if(mime==='image/png')score+=2;
  else if(mime.includes('tiff')||mime.includes('djvu')||mime.includes('pdf'))score-=90;

  // Camera/EXIF metadata is much stronger evidence that the file is a photograph.
  const cameraKeys=['Make','Model','DateTimeOriginal','ExposureTime','FNumber','ISOSpeedRatings','FocalLength','LensModel'];
  const hasCamera=cameraKeys.some(k=>cm[k]||m[k]?.value);
  if(hasCamera)score+=120;

  const photoWords=/\b(photo|photograph|photography|camera|taken|shot|wildlife photography|zoo|safari)\b/i;
  if(photoWords.test(metaText))score+=35;

  const nonPhoto=/\b(emblem|emblems|logo|logos|coat of arms|coats of arms|heraldry|heraldic|symbol|symbols|icon|icons|seal|seals|flag|flags|badge|badges|crest|crests|clipart|vector|svg|silhouette|cartoon|anatomy|plate|plates|page|pages|book|journal|manuscript|scan|scanned|text|document|paper|article|catalogue|catalog|archive|map|diagram|chart|illustration|drawing|painting|engraving|lithograph|poster|cover|title page)\b/i;
  if(nonPhoto.test(metaText))score-=180;
  if(allowArt){
    const historicalRepresentation=/\b(bust|busts|statue|statues|sculpture|sculptures|portrait|portraits|relief|reliefs|coin|coins|medallion|marble|bronze|engraving|engravings|engraved|etching|etchings|print|prints|historical illustration|historical illustrations)\b/i;
    if(historicalRepresentation.test(metaText))score+=220;
  }

  return score;
}
function visualMatchScore(page,terms,allowArt=false){
  const m=page.imageinfo?.[0]?.extmetadata||{};
  const title=(page.title||'').replace(/^File:/,'').toLocaleLowerCase();
  const desc=strip(m.ImageDescription?.value).toLocaleLowerCase();
  const object=strip(m.ObjectName?.value).toLocaleLowerCase();
  const needles=terms.map(x=>x.toLocaleLowerCase()).filter(Boolean);
  let score=0;
  for(const n of needles){
    if(title===n||title.startsWith(n+' '))score=Math.max(score,100);
    else if(title.includes(n))score=Math.max(score,80);
    if(object.includes(n))score=Math.max(score,65);
    if(desc.includes(n))score=Math.max(score,45);
  }
  const indirect=allowArt
    ?/\b(entrance|shelter|sign|map|diagram|chart|logo|museum|gate|road|street|habitat|scape|landscape|karyotype|chromosome|footprint|track|tracks|enclosure|temple|wall|walls)\b/i
    :/\b(entrance|shelter|sign|map|diagram|chart|logo|statue|sculpture|museum|gate|road|street|habitat|scape|landscape|karyotype|chromosome|footprint|track|tracks|enclosure|temple|wall|walls|painting|drawing|illustration)\b/i;
  if(indirect.test(title))score-=55;
  if(allowArt&&/\b(bust|statue|sculpture|portrait|relief|marble|bronze)\b/i.test(title))score+=80;
  return score;
}
function addUniquePages(target,incoming){
  const seen=new Set(target.map(x=>x.pageid));
  for(const p of incoming)if(!seen.has(p.pageid)){seen.add(p.pageid);target.push(p)}
}
async function search(){const term=q.value.trim();if(!term)return;const t=T[lang];results.innerHTML='';filters.hidden=true;licenseFilter.innerHTML='';status.textContent=t.searching;try{
  let pages=[];
  if($('#exactSearch').checked){
    const entity=await resolveSearchEntity(term);
    const english=(entity.english||'').replace(/"/g,'').trim();
    const native=term.replace(/"/g,'').trim();
    const candidates=[];
    const allowArt=entity.isPerson;
    let categoryDirect=[];
    let representationDirect=[];
    if(allowArt&&english){
      // Historical people: trust only files taken directly from dedicated
      // Commons representation categories. No free-text fallback.
      representationDirect=await personRepresentationFiles(english);
      addUniquePages(candidates,representationDirect);
    }else{
      categoryDirect=await categoryFiles(entity.category,100);
      addUniquePages(candidates,categoryDirect);
      if(english)addUniquePages(candidates,await commonsPages(`intitle:"${english}" filetype:bitmap`,100));
      if(native&&native.toLocaleLowerCase()!==english.toLocaleLowerCase())addUniquePages(candidates,await commonsPages(`intitle:"${native}" filetype:bitmap`,60));
      if(english)addUniquePages(candidates,await commonsPages(`"${english}" filetype:bitmap`,100));
      if(native)addUniquePages(candidates,await commonsPages(`"${native}" filetype:bitmap`,60));
    }
    const directIds=new Set([...categoryDirect,...representationDirect].map(x=>x.pageid));
    const scoreTerms=[term,entity.english].filter(Boolean);
    const scored=candidates.map((page,index)=>{
      const title=(page.title||'').replace(/^File:/,'').toLocaleLowerCase();
      const m=page.imageinfo?.[0]?.extmetadata||{};
      const searchable=[title,strip(m.ObjectName?.value),strip(m.ImageDescription?.value),strip(m.Categories?.value)].join(' ').toLocaleLowerCase();
      const nameHit=scoreTerms.some(x=>{
        const q=x.toLocaleLowerCase().trim();
        return q&&searchable.includes(q);
      });
      const directName=scoreTerms.some(x=>title.includes(x.toLocaleLowerCase()));
      const photo=photoLikelihood(page,allowArt);
      const representation=/\b(bust|busts|statue|statues|sculpture|sculptures|portrait|portraits|relief|reliefs|marble|bronze|coin|coins|medallion|engraving|engravings|engraved|etching|etchings|print|prints|historical illustration|historical illustrations)\b/i.test(searchable);
      const repKind=page._personRepKind||representationKind(searchable);
      const representationCategory=allowArt?Boolean(page._personRepKind):representationDirect.some(x=>x.pageid===page.pageid);
      const contextEvent=/\b(celebration|festival|parade|ceremony|commemoration|anniversary|crowd|gathering|procession|event|unveiling|dedication|memorial service|street scene|square|plaza)\b/i.test(title);
      const documentScan=/\b(newspaper|newspapers|article|articles|page|pages|book|books|text|document|documents|manuscript|manuscripts|clipping|clippings|press|bulletin|journal|magazine|title page|front page|advertisement|advertisements)\b/i.test(searchable);
      const subjectPattern=/\b(bust|statue|sculpture|portrait|relief|head|marble|bronze|coin|medallion|engraving|etching|print|historical illustration)\b/i;
      const titleLooksLikeRepresentation=directName&&subjectPattern.test(title)&&!contextEvent;
      const personRelevant=!allowArt||(!documentScan&&!contextEvent&&representationCategory);
      let subjectPenalty=0;
      if(allowArt&&contextEvent)subjectPenalty-=220;
      if(allowArt&&documentScan)subjectPenalty-=500;
      if(allowArt&&nameHit&&!titleLooksLikeRepresentation&&!representationCategory)subjectPenalty-=120;
      return{page,index,photo,nameHit,representation,repKind,personRelevant,score:(directIds.has(page.pageid)?140:0)+(titleLooksLikeRepresentation?160:0)+(nameHit?70:0)+visualMatchScore(page,scoreTerms,allowArt)+photo+subjectPenalty};
    });
    scored.sort((a,b)=>b.score-a.score||b.photo-a.photo||a.index-b.index);

    // For people, a statue/bust/portrait must also identify the searched person.
    // This prevents unrelated Roman statues from entering merely because "statue" matched.
    const eligible=scored.filter(x=>x.personRelevant&&x.score>=90);
    let chosen=[];
    if(allowArt){
      const kinds=['sculpture','portrait','engraving','illustration'];
      const strict=eligible.filter(x=>kinds.includes(x.repKind));
      const buckets=Object.fromEntries(kinds.map(k=>[k,strict.filter(x=>x.repKind===k)]));
      // Diversify only among verified visual representations. Never pad with
      // generic event/document/other results merely to reach 30.
      for(let round=0;round<30&&chosen.length<30;round++){
        let added=false;
        for(const kind of kinds){
          const item=buckets[kind][round];
          if(item&&!chosen.includes(item)){
            chosen.push(item);added=true;
          }
          if(chosen.length>=30)break;
        }
        if(!added)break;
      }
    }else{
      const photos=eligible.filter(x=>x.photo>=35);
      const acceptable=eligible.filter(x=>x.photo>=10&&!photos.includes(x));
      chosen=[...photos];
      if(chosen.length<30)chosen.push(...acceptable.slice(0,30-chosen.length));
    }
    pages=chosen.slice(0,30).map(x=>x.page);
  }else{
    pages=await commonsPages(term+' filetype:bitmap',30);
  }status.textContent=pages.length?t.found(pages.length):t.none;const licenseNames=new Set();for(const x of pages){const i=x.imageinfo?.[0],m=i?.extmetadata||{};if(!i)continue;const li=licenseInfo(m),title=x.title.replace(/^File:/,'');const artist=strip(m.Artist?.value)||t.unknown,credit=strip(m.Credit?.value)||t.see;licenseNames.add(li.raw);const card=document.createElement('article');card.className='card';card.dataset.license=li.raw;card.innerHTML=`<img loading="lazy" src="${esc(i.thumburl||i.url)}" alt="${esc(strip(m.ImageDescription?.value)||title)}"><div class="info"><div class="title" title="${esc(title)}">${esc(title)}</div><div class="meta">${esc(li.raw)}</div><div class="creator">${esc(t.creator)}: ${esc(artist)}</div><div class="actions"><a href="${esc(i.descriptionurl)}" target="_blank" rel="noopener">${esc(t.file)}</a><button class="download" type="button">${esc(t.download)}</button><button class="lic" type="button">${esc(t.license)}</button></div></div>`;card.querySelector('img').onclick=()=>openImage(i.url,title,li.raw,i.descriptionurl);card.querySelector('img').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openImage(i.url,title,li.raw,i.descriptionurl)}};card.querySelector('img').tabIndex=0;card.querySelector('img').setAttribute('role','button');card.querySelector('.download').onclick=()=>downloadImage(i.url,title);card.querySelector('.lic').onclick=()=>{
  const licenseLink=li.url&&/^https?:\/\//i.test(li.url)?`<a href="${esc(li.url)}" target="_blank" rel="noopener">${esc(t.licensePage)}</a>`:'';
  body.innerHTML=`<h2>${esc(t.license)}: ${esc(li.raw)}</h2>
  <p class="license-note">${esc(li.note)}</p>
  ${li.version?`<section class="license-version"><h3>${esc(t.version)}: ${esc(li.version)}</h3><p><strong>${esc(t.versionMeaning)}</strong> ${esc(t.versionGeneric(li.version))}</p>${li.version==='4.0'?`<p>${esc(t.version40)}</p>`:''}</section>`:''}
  <h3>${esc(t.simple)}</h3>
  <div class="license-grid">
    ${licenseBadge(t.share,li.share)}
    ${licenseBadge(t.edit,li.edit)}
    ${licenseBadge(t.commercial,li.commercial)}
  </div>
  <h3>${esc(t.terms)}</h3>
  <div class="license-grid">
    ${licenseBadge(t.attribution,li.attribution,'requirement')}
    ${licenseBadge(t.sameLicense,li.sameLicense,'requirement')}
  </div>
  <p><strong>${esc(t.creator)}:</strong> ${esc(artist)}</p>
  <p><strong>${esc(t.credit)}:</strong> <span id="creditText">${esc(credit)}</span></p>
  <button id="copyCredit" class="copy-credit" type="button">${esc(t.copyCredit)}</button>
  <p class="license-links"><a href="${esc(i.descriptionurl)}" target="_blank" rel="noopener">${esc(t.original)}</a>${licenseLink?' · '+licenseLink:''}</p>
  <p class="license-notice">${esc(t.notice)}</p>`;
  dlg.showModal();
  $('#copyCredit').onclick=async()=>{try{await navigator.clipboard.writeText(credit);$('#copyCredit').textContent=t.copied}catch{}};
};results.append(card)}
if(pages.length){
  const all=document.createElement('option');all.value='';all.textContent=t.allLicenses;licenseFilter.append(all);
  [...licenseNames].sort((a,b)=>a.localeCompare(b,lang==='he'?'he':'en')).forEach(name=>{
    const o=document.createElement('option');o.value=name;o.textContent=name;licenseFilter.append(o);
  });
  filters.hidden=false;
}}catch(e){status.textContent=t.error}}
$('#go').onclick=search;q.addEventListener('keydown',e=>{if(e.key==='Enter')search()});$('.close').onclick=()=>dlg.close();applyLang();if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');
let imageZoom=1,pinchStartDistance=0,pinchStartZoom=1,currentImage={url:'',title:''};
function setImageZoom(v){
  imageZoom=Math.min(4,Math.max(1,v));
  imgPreview.style.width=(imageZoom*100)+'%';
  $('#zoomReset').textContent=Math.round(imageZoom*100)+'%';
}
function openImage(url,title,license,fileUrl){
  const t=T[lang];
  currentImage={url,title};
  imgPreview.src=url;
  imgPreview.alt=title;
  $('#imageTitle').textContent=title;
  $('#imageMeta').textContent=license;
  $('#imageFileLink').textContent=t.file;
  $('#imageFileLink').href=fileUrl;
  $('#imageDownload').textContent=t.download;
  setImageZoom(1);
  imgStage.scrollTop=0;imgStage.scrollLeft=0;
  imgDlg.showModal();
  $('.image-close').focus();
}
$('#zoomIn').onclick=()=>setImageZoom(imageZoom+.25);
$('#zoomOut').onclick=()=>setImageZoom(imageZoom-.25);
$('#zoomReset').onclick=()=>setImageZoom(1);
$('#imageDownload').onclick=()=>downloadImage(currentImage.url,currentImage.title);
$('.image-close').onclick=()=>imgDlg.close();
imgDlg.addEventListener('click',e=>{if(e.target===imgDlg)imgDlg.close()});
imgDlg.addEventListener('close',()=>{imgPreview.src='';setImageZoom(1)});
imgPreview.addEventListener('dblclick',()=>setImageZoom(imageZoom===1?2:1));
function touchDistance(t){
  const dx=t[0].clientX-t[1].clientX,dy=t[0].clientY-t[1].clientY;
  return Math.hypot(dx,dy);
}
imgStage.addEventListener('touchstart',e=>{
  if(e.touches.length===2){pinchStartDistance=touchDistance(e.touches);pinchStartZoom=imageZoom}
},{passive:true});
imgStage.addEventListener('touchmove',e=>{
  if(e.touches.length===2&&pinchStartDistance){
    e.preventDefault();
    setImageZoom(pinchStartZoom*(touchDistance(e.touches)/pinchStartDistance));
  }
},{passive:false});

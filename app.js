const $=s=>document.querySelector(s),results=$('#results'),status=$('#status'),q=$('#q'),dlg=$('#licenseDialog'),body=$('#licenseBody'),imgDlg=$('#imageDialog'),imgPreview=$('#imagePreview'),imgStage=$('#imageStage'),filters=$('#filters'),licenseFilter=$('#licenseFilter');
let lang=localStorage.getItem('oif-lang')||'he';
const T={he:{tag:'חיפוש תמונות חופשיות ב־Wikimedia Commons',label:'מה תרצה למצוא?',ph:'לדוגמה: Tyrannosaurus rex',go:'חיפוש',switch:'English',found:n=>`נמצאו ${n} תוצאות`,none:'לא נמצאו תוצאות.',searching:'מחפש…',error:'אירעה שגיאה בחיפוש. נסה שוב.',file:'דף הקובץ',license:'הסבר רישיון',download:'הורדת תמונה',creator:'יוצר',credit:'קרדיט',unknown:'לא צוין',see:'ראו בדף הקובץ',original:'פתיחת דף הקובץ המקורי',notice:'המידע הוא תקציר נוח בלבד. התנאים המחייבים הם אלה המופיעים בדף הקובץ ב־Wikimedia Commons.',aria:'תוצאות חיפוש',simple:'מה מותר לעשות?',share:'להעתיק ולשתף',edit:'לערוך וליצור גרסאות',commercial:'שימוש מסחרי',attribution:'חובה לתת קרדיט',sameLicense:'יצירה נגזרת באותו רישיון',required:'חובה',notRequired:'לא נדרש',checkFile:'יש לבדוק בדף הקובץ',yes:'מותר',no:'לא ידוע',copyCredit:'העתקת קרדיט',copied:'הקרדיט הועתק',terms:'תנאים חשובים',licensePage:'דף הרישיון',version:'גרסת הרישיון',versionMeaning:'מה פירוש המספר?',versionGeneric:v=>`המספר ${v} הוא גרסת הנוסח המשפטי של הרישיון — לא דירוג ולא רמת חופש. סוג הרישיון נקבע לפי האותיות (למשל BY או BY-SA), והמספר מציין איזו מהדורה של התנאים חלה על התמונה.`,version40:'גרסה 4.0 היא הגרסה הבינלאומית העדכנית של רישיונות Creative Commons. היא נועדה לפעול בצורה אחידה יותר במדינות שונות וכוללת עדכונים משפטיים לעומת גרסאות קודמות.',filterLabel:'סינון לפי רישיון',allLicenses:'כל הרישיונות',shown:(n,total)=>`מוצגות ${n} מתוך ${total} תוצאות`,exact:'חיפוש מדויק',exactHint:'נותן עדיפות חזקה לתמונות שמתאימות ישירות למונח שחיפשת.'},en:{tag:'Search freely licensed images on Wikimedia Commons',label:'What would you like to find?',ph:'Example: Tyrannosaurus rex',go:'Search',switch:'עברית',found:n=>`${n} results found`,none:'No results found.',searching:'Searching…',error:'Search failed. Please try again.',file:'File page',license:'License info',download:'Download image',creator:'Creator',credit:'Credit',unknown:'Not specified',see:'See file page',original:'Open original file page',notice:'This is a convenient summary only. The binding terms are those shown on the Wikimedia Commons file page.',aria:'Search results',simple:'What can I do with it?',share:'Copy and share',edit:'Edit and adapt',commercial:'Commercial use',attribution:'Attribution required',sameLicense:'Adaptations under same license',required:'Required',notRequired:'Not required',checkFile:'Check the file page',yes:'Allowed',no:'Unknown',copyCredit:'Copy credit',copied:'Credit copied',terms:'Important terms',licensePage:'License page',version:'License version',versionMeaning:'What does the number mean?',versionGeneric:v=>`The number ${v} is the version of the legal license text — not a rating or level of freedom. The letters (such as BY or BY-SA) identify the license type; the number identifies which edition of its terms applies to the image.`,version40:'Version 4.0 is the current international version of the Creative Commons license suite. It was designed to work more consistently across jurisdictions and includes legal updates compared with earlier versions.',filterLabel:'Filter by license',allLicenses:'All licenses',shown:(n,total)=>`Showing ${n} of ${total} results`,exact:'Focused search',exactHint:'Strongly prioritizes images that directly match what you searched for.'}};
const strip=s=>(s||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function licenseInfo(m){
  const raw=strip(m.LicenseShortName?.value||m.UsageTerms?.value||m.License?.value||T[lang].unknown);
  const url=(m.LicenseUrl?.value||'').trim();
  const l=raw.toLowerCase();
  const ccLike=/creative commons|\bcc\s*(?:by|0)|attribution/i.test(raw);
  const versionMatch=ccLike?(raw.match(/(?:^|\s)([1-4](?:\.0|\.5)?)(?:\s|$|international)/i)||url.match(/\/licenses\/[^/]+\/([1-4](?:\.0|\.5)?)\/?/i)):null;
  const version=versionMatch?.[1]||'';
  let share=null,edit=null,commercial=null,attribution=null,sameLicense=null;
  let he='יש לבדוק את תנאי הרישיון בדף הקובץ לפני שימוש.',en='Check the license terms on the file page before use.';
  if(/cc0|public domain|pd-old|pd-us|pd-art|pd-self/.test(l)){
    share=edit=commercial=true;attribution=false;sameLicense=false;
    he='התמונה מסומנת כנחלת הכלל או CC0. בדרך כלל מותר להעתיק, לערוך ולהשתמש גם מסחרית ללא בקשת רשות. מתן קרדיט עדיין מומלץ כשאפשר.';
    en='The image is marked Public Domain or CC0. Copying, adapting and commercial use are generally allowed without permission. Credit is still recommended when practical.';
  }else if(/cc by-sa|creative commons attribution-share alike|attribution-sharealike/.test(l)){
    share=edit=commercial=true;attribution=true;sameLicense=true;
    he='מותר להעתיק, לערוך ולהשתמש גם מסחרית, בתנאי שנותנים ייחוס מתאים ושומרים על אותו רישיון ביצירה נגזרת.';
    en='Copying, adapting and commercial use are allowed, provided proper attribution is given and adaptations use the same license.';
  }else if(/cc by(?!-sa)|creative commons attribution(?!-share)/.test(l)){
    share=edit=commercial=true;attribution=true;sameLicense=false;
    he='מותר להעתיק, לערוך ולהשתמש גם מסחרית, בתנאי שנותנים ייחוס מתאים ליוצר.';
    en='Copying, adapting and commercial use are allowed, provided proper attribution is given.';
  }else if(/gfdl|gnu free documentation/.test(l)){
    share=edit=commercial=true;attribution=true;sameLicense=true;
    he='בדרך כלל מותר להעתיק, לערוך ולהשתמש גם מסחרית, אך ל־GFDL יש דרישות ייחוס ושיתוף ברישיון זהה או תואם. מומלץ לבדוק את דף הקובץ.';
    en='Copying, adapting and commercial use are generally allowed, but GFDL has attribution and share-alike requirements. Check the file page for the exact terms.';
  }
  return{raw,url,note:lang==='he'?he:en,share,edit,commercial,attribution,sameLicense,version};
}
function licenseBadge(label,value,mode='permission'){
  const t=T[lang],state=value===true?'ok':value===false?'neutral':'warn',text=value===true?(mode==='requirement'?t.required:t.yes):value===false?t.notRequired:t.no;
  return `<div class="license-row"><span>${esc(label)}</span><strong class="${state}">${esc(text)}</strong></div>`;
}
function applyLang(){const t=T[lang];document.documentElement.lang=lang;document.documentElement.dir=lang==='he'?'rtl':'ltr';$('#tagline').textContent=t.tag;$('#searchLabel').textContent=t.label;q.placeholder=t.ph;$('#go').textContent=t.go;$('#lang').textContent=t.switch;$('#licenseFilterLabel').textContent=t.filterLabel;$('#exactSearchLabel').textContent=t.exact;$('#exactSearchHint').textContent=t.exactHint;if(licenseFilter.options.length)licenseFilter.options[0].textContent=t.allLicenses;results.setAttribute('aria-label',t.aria);$('.close').setAttribute('aria-label',lang==='he'?'סגירה':'Close');$('.image-close').setAttribute('aria-label',lang==='he'?'סגירה':'Close');$('#zoomIn').setAttribute('aria-label',lang==='he'?'הגדלה':'Zoom in');$('#zoomOut').setAttribute('aria-label',lang==='he'?'הקטנה':'Zoom out');$('#zoomReset').setAttribute('aria-label',lang==='he'?'איפוס הגדלה':'Reset zoom');localStorage.setItem('oif-lang',lang)}
$('#lang').onclick=()=>{lang=lang==='he'?'en':'he';applyLang();if(results.children.length)search()};
async function downloadImage(url,title){try{const r=await fetch(url);if(!r.ok)throw 0;const blob=await r.blob(),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=title;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}catch{window.open(url,'_blank','noopener')}}
function applyLicenseFilter(){
  const t=T[lang],value=licenseFilter.value;
  let visible=0,total=0;
  results.querySelectorAll('.card').forEach(card=>{
    total++;
    const show=!value||card.dataset.license===value;
    card.hidden=!show;
    if(show)visible++;
  });
  if(total)status.textContent=value?t.shown(visible,total):t.found(total);
}
licenseFilter.addEventListener('change',applyLicenseFilter);
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
    return{
      category:best?.claims?.P373?.[0]?.mainsnak?.datavalue?.value||'',
      english:best?.labels?.en?.value||''
    };
  }catch{return{category:'',english:''}}
}
async function commonsPages(searchText,limit=30){
  const p=new URLSearchParams({action:'query',generator:'search',gsrsearch:searchText,gsrnamespace:'6',gsrlimit:String(limit),prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'600',format:'json',origin:'*'});
  const r=await fetch('https://commons.wikimedia.org/w/api.php?'+p),d=await r.json();
  return Object.values(d.query?.pages||{});
}
function relevanceScore(page,term){
  const needle=term.toLocaleLowerCase(),m=page.imageinfo?.[0]?.extmetadata||{};
  const title=(page.title||'').replace(/^File:/,'').toLocaleLowerCase();
  const desc=strip(m.ImageDescription?.value).toLocaleLowerCase();
  const object=strip(m.ObjectName?.value).toLocaleLowerCase();
  let score=0;
  if(title===needle)score+=100;
  if(title.includes(needle))score+=50;
  if(object.includes(needle))score+=35;
  if(desc.includes(needle))score+=25;
  return score;
}
async function search(){const term=q.value.trim();if(!term)return;const t=T[lang];results.innerHTML='';filters.hidden=true;licenseFilter.innerHTML='';status.textContent=t.searching;try{
  let pages=[];
  if($('#exactSearch').checked){
    const entity=await resolveSearchEntity(term);
    if(entity.category)pages=await commonsPages(`incategory:"${entity.category}" filetype:bitmap`,30);
    if(pages.length<30&&entity.english){
      const english=await commonsPages(`"${entity.english.replace(/"/g,'')}" filetype:bitmap`,50);
      const seen=new Set(pages.map(x=>x.pageid));
      pages.push(...english.filter(x=>!seen.has(x.pageid)));
    }
    if(pages.length<12){
      const fallback=await commonsPages(`"${term.replace(/"/g,'')}" filetype:bitmap`,50);
      const seen=new Set(pages.map(x=>x.pageid));
      pages.push(...fallback.filter(x=>!seen.has(x.pageid)));
    }
    const scoreTerms=[term,entity.english].filter(Boolean);
    pages.sort((a,b)=>Math.max(...scoreTerms.map(x=>relevanceScore(b,x)))-Math.max(...scoreTerms.map(x=>relevanceScore(a,x))));
    pages=pages.slice(0,30);
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

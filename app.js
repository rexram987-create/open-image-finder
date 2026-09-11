const $=s=>document.querySelector(s),results=$('#results'),status=$('#status'),q=$('#q'),dlg=$('#licenseDialog'),body=$('#licenseBody'),imgDlg=$('#imageDialog'),imgPreview=$('#imagePreview'),imgStage=$('#imageStage');
let lang=localStorage.getItem('oif-lang')||'he';
const T={he:{tag:'חיפוש תמונות חופשיות ב־Wikimedia Commons',label:'מה תרצה למצוא?',ph:'לדוגמה: Tyrannosaurus rex',go:'חיפוש',switch:'English',found:n=>`נמצאו ${n} תוצאות`,none:'לא נמצאו תוצאות.',searching:'מחפש…',error:'אירעה שגיאה בחיפוש. נסה שוב.',file:'דף הקובץ',license:'הסבר רישיון',download:'הורדת תמונה',creator:'יוצר',credit:'קרדיט',unknown:'לא צוין',see:'ראו בדף הקובץ',original:'פתיחת דף הקובץ המקורי',notice:'המידע הוא תקציר נוח בלבד. התנאים המחייבים הם אלה המופיעים בדף הקובץ ב־Wikimedia Commons.',aria:'תוצאות חיפוש'},en:{tag:'Search freely licensed images on Wikimedia Commons',label:'What would you like to find?',ph:'Example: Tyrannosaurus rex',go:'Search',switch:'עברית',found:n=>`${n} results found`,none:'No results found.',searching:'Searching…',error:'Search failed. Please try again.',file:'File page',license:'License info',download:'Download image',creator:'Creator',credit:'Credit',unknown:'Not specified',see:'See file page',original:'Open original file page',notice:'This is a convenient summary only. The binding terms are those shown on the Wikimedia Commons file page.',aria:'Search results'}};
const strip=s=>(s||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
function licenseInfo(m){const raw=strip(m.LicenseShortName?.value||m.License?.value||T[lang].unknown);let he='יש לבדוק את תנאי הרישיון בדף הקובץ לפני שימוש.',en='Check the license terms on the file page before use.';if(/CC0|Public domain/i.test(raw)){he='בדרך כלל ניתן להשתמש ללא בקשת רשות; ייחוס עדיין מומלץ כשאפשר.';en='Generally reusable without permission; attribution is still recommended when practical.'}else if(/CC BY-SA/i.test(raw)){he='נדרש ייחוס ליוצר, וביצירה נגזרת יש להשתמש באותו רישיון.';en='Attribution is required, and adaptations must use the same license.'}else if(/CC BY/i.test(raw)){he='נדרש לתת קרדיט/ייחוס ליוצר בהתאם לתנאי הרישיון.';en='Attribution to the creator is required under the license terms.'}return{raw,note:lang==='he'?he:en}}
function applyLang(){const t=T[lang];document.documentElement.lang=lang;document.documentElement.dir=lang==='he'?'rtl':'ltr';$('#tagline').textContent=t.tag;$('#searchLabel').textContent=t.label;q.placeholder=t.ph;$('#go').textContent=t.go;$('#lang').textContent=t.switch;results.setAttribute('aria-label',t.aria);$('.close').setAttribute('aria-label',lang==='he'?'סגירה':'Close');$('.image-close').setAttribute('aria-label',lang==='he'?'סגירה':'Close');$('#zoomIn').setAttribute('aria-label',lang==='he'?'הגדלה':'Zoom in');$('#zoomOut').setAttribute('aria-label',lang==='he'?'הקטנה':'Zoom out');$('#zoomReset').setAttribute('aria-label',lang==='he'?'איפוס הגדלה':'Reset zoom');localStorage.setItem('oif-lang',lang)}
$('#lang').onclick=()=>{lang=lang==='he'?'en':'he';applyLang();if(results.children.length)search()};
async function downloadImage(url,title){try{const r=await fetch(url);if(!r.ok)throw 0;const blob=await r.blob(),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=title;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}catch{window.open(url,'_blank','noopener')}}
async function search(){const term=q.value.trim();if(!term)return;const t=T[lang];results.innerHTML='';status.textContent=t.searching;const p=new URLSearchParams({action:'query',generator:'search',gsrsearch:term+' filetype:bitmap',gsrnamespace:'6',gsrlimit:'24',prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'600',format:'json',origin:'*'});try{const r=await fetch('https://commons.wikimedia.org/w/api.php?'+p),d=await r.json(),pages=Object.values(d.query?.pages||{});status.textContent=pages.length?t.found(pages.length):t.none;for(const x of pages){const i=x.imageinfo?.[0],m=i?.extmetadata||{};if(!i)continue;const li=licenseInfo(m),title=x.title.replace(/^File:/,'');const artist=strip(m.Artist?.value)||t.unknown,credit=strip(m.Credit?.value)||t.see;const card=document.createElement('article');card.className='card';card.innerHTML=`<img loading="lazy" src="${i.thumburl||i.url}" alt="${strip(m.ImageDescription?.value)||title}"><div class="info"><div class="title" title="${title.replace(/"/g,'&quot;')}">${title}</div><div class="meta">${li.raw}</div><div class="creator">${t.creator}: ${artist}</div><div class="actions"><a href="${i.descriptionurl}" target="_blank" rel="noopener">${t.file}</a><button class="download" type="button">${t.download}</button><button class="lic" type="button">${t.license}</button></div></div>`;card.querySelector('img').onclick=()=>openImage(i.url,title,li.raw,i.descriptionurl);card.querySelector('img').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openImage(i.url,title,li.raw,i.descriptionurl)}};card.querySelector('img').tabIndex=0;card.querySelector('img').setAttribute('role','button');card.querySelector('.download').onclick=()=>downloadImage(i.url,title);card.querySelector('.lic').onclick=()=>{body.innerHTML=`<h2>${t.license}: ${li.raw}</h2><p>${li.note}</p><p><strong>${t.creator}:</strong> ${artist}</p><p><strong>${t.credit}:</strong> ${credit}</p><p>${t.notice}</p><p><a href="${i.descriptionurl}" target="_blank" rel="noopener">${t.original}</a></p>`;dlg.showModal()};results.append(card)}}catch(e){status.textContent=t.error}}
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

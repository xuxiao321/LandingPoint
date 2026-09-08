import { readFile, writeFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';
const dir = new URL('../.next-qa/photo-review/', import.meta.url);
await mkdir(dir, { recursive: true });
const old = JSON.parse(await readFile(new URL('../src/data/city-images.json', import.meta.url), 'utf8'));
const queries = {
 'manchester':'Manchester skyline Beetham', 'hamburg':'Speicherstadt abends', 'halifax':'Halifax skyline waterfront',
 'calgary':'Calgary skyline Saddledome', 'ottawa':'Ottawa Parliament canal', 'edmonton':'Edmonton skyline river',
 'montreal':'Montreal skyline Mount Royal', 'munich':'Munich Marienplatz panorama', 'brisbane':'Brisbane skyline Kangaroo Point',
 'new-york-city':'Manhattan skyline Brooklyn Bridge', 'seattle':'Seattle Kerry Park skyline', 'boston':'Boston skyline harbor',
 'austin':'Austin skyline Lou Neff', 'atlanta':'Atlanta skyline Jackson Street', 'toronto':'Toronto skyline islands',
 'vancouver':'Vancouver skyline False Creek', 'mexico-city':'Mexico City Palacio Bellas Artes', 'sao-paulo':'Sao Paulo skyline Ponte Estaiada',
 'london':'London Tower Bridge sunset', 'paris':'Paris Eiffel Tower Seine sunset', 'berlin':'Berlin skyline Spree cathedral',
 'amsterdam':'Amsterdam canal houses', 'dublin':'Dublin Samuel Beckett Bridge twilight', 'singapore':'Singapore Marina Bay skyline',
 'tokyo':'Tokyo skyline Tokyo Tower', 'seoul':'Seoul skyline Han river', 'sydney':'Sydney Opera House harbour',
 'melbourne':'Melbourne skyline Yarra twilight', 'dubai':'Dubai skyline Burj Khalifa', 'edinburgh':'Edinburgh Calton Hill skyline',
 'birmingham':'Birmingham skyline city centre', 'bristol':'Clifton Suspension Bridge panorama'
};
const clean = s => String(s ?? '').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
const results = {};
for (const [slug, query] of Object.entries(queries)) {
 const cache = new URL(slug+'.json',dir);
 try { results[slug] = JSON.parse(await readFile(cache,'utf8')); if(results[slug].length && !process.argv.includes('--refresh='+slug)) continue; } catch {}
 if(process.argv.includes('--sheets')) continue;
 const params = new URLSearchParams({action:'query',format:'json',generator:'search',gsrsearch:query,gsrnamespace:'6',gsrlimit:'25',prop:'imageinfo',iiprop:'url|extmetadata|size',iiurlwidth:'1600'});
 try {
 await new Promise(r=>setTimeout(r,6000));
 let response=await fetch('https://commons.wikimedia.org/w/api.php?'+params,{signal:AbortSignal.timeout(25000)});
 for(let attempt=0;response.status===429 && attempt<3;attempt++){
 console.log('Rate limited; waiting before retry: '+slug);
 await new Promise(r=>setTimeout(r,30000));
 response=await fetch('https://commons.wikimedia.org/w/api.php?'+params,{signal:AbortSignal.timeout(25000)});
 }
 if(!response.ok) throw Error('HTTP '+response.status);
 const json=await response.json();
 const candidates=Object.values(json.query?.pages??{}).sort((a,b)=>a.index-b.index).flatMap(p=>{
 const i=p.imageinfo?.[0], m=i?.extmetadata;
 if(!i||!/^CC (BY|BY-SA) [234]/.test(m?.LicenseShortName?.value??'')||i.width<1400||i.width/i.height<1.35||i.width/i.height>3||p.title===old[slug]?.title||! /\.jpe?g$/i.test(p.title)) return [];
 return [{title:p.title,sourcePageUrl:i.descriptionurl,creator:clean(m.Artist?.value),license:m.LicenseShortName.value,licenseUrl:m.LicenseUrl.value,width:i.width,height:i.height,attributionRequired:true,remoteUrl:i.thumburl??i.url,description:clean(m.ImageDescription?.value)}];
 }).slice(0,3);
 results[slug]=[];
 for(const p of candidates){
 try {const res=await fetch(p.remoteUrl,{signal:AbortSignal.timeout(20000)});if(!res.ok)continue;
 const bytes=Buffer.from(await res.arrayBuffer());await sharp(bytes).metadata();
 const file=slug+'-'+results[slug].length+'.jpg';await writeFile(new URL(file,dir),bytes);
 results[slug].push({...p,file});}catch(e){console.log(slug,e.message);}
 }
 await writeFile(cache,JSON.stringify(results[slug],null,2));console.log(slug+': '+results[slug].length);
 }catch(e){console.log(slug+': '+e.message);}
}
await writeFile(new URL('candidates.json',dir),JSON.stringify(results,null,2));
let group=[];let page=0;
for(const [slug,photos]of Object.entries(results)){
 for(let i=0;i<photos.length;i++){
 const thumbnail=await sharp(new URL(photos[i].file,dir).pathname.replace(/^\/(\w:)/,'$1')).resize(320,180,{fit:'cover'}).toBuffer();
 const label=Buffer.from(`<svg width="320" height="24"><rect width="320" height="24" fill="white"/><text x="8" y="17" font-size="14">${slug} / ${i}</text></svg>`);
 group.push({thumbnail,label});
 }
 if(group.length>=18){await sheet(group,page++);group=[];}
}
if(group.length)await sheet(group,page++);
async function sheet(items,page){const layers=items.flatMap((v,i)=>[{input:v.thumbnail,left:(i%3)*320,top:Math.floor(i/3)*204},{input:v.label,left:(i%3)*320,top:Math.floor(i/3)*204+180}]);await sharp({create:{width:960,height:Math.ceil(items.length/3)*204,channels:3,background:'#fff'}}).composite(layers).jpeg().toFile(new URL('sheet-'+page+'.jpg',dir).pathname.replace(/^\/(\w:)/,'$1'));}
console.log('Review sheets: '+page);

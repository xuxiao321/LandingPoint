import fs from 'node:fs/promises';
const file = new URL('../src/data/city-internet.json', import.meta.url);
const snapshot = JSON.parse(await fs.readFile(file, 'utf8'));
const catalog = JSON.parse(await fs.readFile(new URL('../src/data/global-city-metrics.json', import.meta.url), 'utf8')).cities;
const country = {CAN:'NA/CA',MEX:'NA/MX',BRA:'SA/BR',GBR:'EU/GB',FRA:'EU/FR',DEU:'EU/DE',NLD:'EU/NL',IRL:'EU/IE',SGP:'AS/SG',JPN:'AS/JP',KOR:'AS/KR',AUS:'OC/AU',ARE:'AS/AE'};
const aliases = {'mexico-city':['Mexico City','Mexico City City'],'sao-paulo':['São Paulo','Sao Paulo'],montreal:['Montreal','Montréal'],munich:['Munich','München']};
const root='https://statistics.measurementlab.net/';
async function listing(prefix) {
 let marker='',result=[];
 do {
 const r=await fetch(root+'?delimiter=/&prefix='+encodeURIComponent(prefix)+'&marker='+encodeURIComponent(marker));
 if(!r.ok) throw new Error(`Listing ${r.status}`);
 const xml=await r.text();
 result.push(...[...xml.matchAll(/<CommonPrefixes><Prefix>(.*?)<\/Prefix><\/CommonPrefixes>/g)].map(x=>x[1]));
 marker=xml.match(/<NextMarker>(.*?)<\/NextMarker>/)?.[1]??'';
 }while(marker);
 return result;
}
const cache={};
for(const city of catalog) {
 if(snapshot.cities[city.slug]) continue;
 try {
 const base='v0/'+country[city.worldBankCode]+'/';
 const regions=cache[base]??=await listing(base);
 let found=city.slug==='singapore'?base:undefined;
 for(const region of regions.filter(x=>!x.endsWith('/asn/'))) {
 if(found) break;
 const paths=cache[region]??=await listing(region);
 found=paths.find(p=>(aliases[city.slug]??[city.name]).some(n=>p.split('/').at(-2).toLowerCase()===n.toLowerCase()));
 if(found) break;
 }
 if(!found) throw new Error('City directory missing');
 const years=(await listing(found)).filter(x=>/\/\d{4}\/$/.test(x)).sort().reverse();
 const url=root+years[0]+'histogram_daily_stats.json';
 const r=await fetch(url); if(!r.ok) throw new Error(`Data ${r.status}`);
 const rows=await r.json();
 const daily=[...new Map(rows.map(row=>[row.date,row])).values()].sort((a,b)=>a.date.localeCompare(b.date));
 const valid=daily.filter(x=>x.dl_samples_day>0&&Number.isFinite(x.download_MED));
 const uploads=daily.filter(x=>x.ul_samples_day>0&&Number.isFinite(x.upload_MED));
 if(!valid.length||!uploads.length) throw new Error('No valid samples');
 const mean=(arr,key)=>Math.round(arr.reduce((s,x)=>s+x[key],0)/arr.length*100)/100;
 snapshot.cities[city.slug]={download:mean(valid,'download_MED'),upload:mean(uploads,'upload_MED'),latency:mean(valid,'download_minRTT_MED'),samples:valid.reduce((s,x)=>s+x.dl_samples_day,0),uploadSamples:uploads.reduce((s,x)=>s+x.ul_samples_day,0),period:valid[0].date+' – '+valid.at(-1).date,sourceUrl:url,source:'M-Lab statistics',method:'daily-medians',historical:true,geography:found,retrievedAt:new Date().toISOString().slice(0,10)};
 console.log(city.slug,snapshot.cities[city.slug].download,snapshot.cities[city.slug].period);
 }catch(e){console.error(city.slug,e.message);}
}
await fs.writeFile(file,JSON.stringify(snapshot,null,2)+'\n');
console.log('Coverage',Object.keys(snapshot.cities).length,'/',catalog.length);

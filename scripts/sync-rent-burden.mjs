import fs from 'node:fs/promises';
import env from '@next/env';
env.loadEnvConfig(process.cwd());
const key=process.env.CENSUS_API_KEY;
if(!key) throw new Error('CENSUS_API_KEY missing');
const catalog=JSON.parse(await fs.readFile('src/data/city-public-metrics.json','utf8'));
const result={};
for(const c of catalog.cities){
 const url=new URL(`https://api.census.gov/data/${catalog.datasetYear}/acs/acs5`);
 url.search=new URLSearchParams({get:'NAME,B25071_001E',for:`place:${c.geography.placeFips}`,in:`state:${c.geography.stateFips}`,key});
 const r=await fetch(url,{signal:AbortSignal.timeout(20000)}); if(!r.ok) throw new Error(`Census HTTP ${r.status}`);
 const body=await r.text(); if(!body.trim().startsWith('[')) throw new Error('Census did not return data');
 const rows=JSON.parse(body); const share=Number(rows[1][1]);
 if(!Number.isFinite(share)||share<=0||share>100) throw new Error('Invalid rent burden');
 result[c.slug]={share,geography:rows[1][0],period:`${catalog.datasetYear} ACS 5-year`,sourceUrl:`https://api.census.gov/data/${catalog.datasetYear}/acs/acs5/groups/B25071.html`};
}
await fs.writeFile('src/data/city-rent-burden.json',JSON.stringify(result,null,2)+'\n');
console.log('Saved rent burden for',Object.keys(result).length,'cities');

import { readFile, copyFile } from 'node:fs/promises';
const review = new URL('../.next-qa/photo-review/',import.meta.url);
const choiceArg = process.argv[2] ?? '{}';
const choices = JSON.parse(choiceArg.startsWith('@')
 ? await readFile(choiceArg.slice(1), 'utf8')
 : choiceArg);
const manifestUrl = new URL('../src/data/city-images.json',import.meta.url);
const before = await readFile(manifestUrl,'utf8');
const manifest = JSON.parse(before);
for(const [slug,index] of Object.entries(choices)){
 if(!Object.hasOwn(manifest,slug))throw Error('Unknown city '+slug);
 const candidates=JSON.parse(await readFile(new URL(slug+'.json',review),'utf8'));
 const {file,description,...photo}=candidates[index];
 if(!photo.sourcePageUrl.startsWith('https://commons.wikimedia.org/')||!/^CC (BY|BY-SA) [234]/.test(photo.license))throw Error('Unreviewed license');
 const filename=slug+'-editorial.jpg';
 await copyFile(new URL(file,review),new URL('../public/cities/'+filename,import.meta.url));
 manifest[slug]={...photo,url:'/cities/'+filename,reviewedAt:'2026-09-07'};
}
const after=JSON.stringify(manifest,null,2)+'\n';
console.log('*** Begin Patch\n*** Update File: C:/Users/Xu/Desktop/LandingPoint/src/data/city-images.json\n@@\n'+before.trimEnd().split(/\r?\n/).map(s=>'-'+s).join('\n')+'\n'+after.trimEnd().split('\n').map(s=>'+'+s).join('\n')+'\n*** End Patch');

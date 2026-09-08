import { mkdir, readFile, writeFile } from 'node:fs/promises';
const manifest = JSON.parse(await readFile(new URL('../src/data/city-images.json', import.meta.url), 'utf8'));
const directory = new URL('../public/cities/', import.meta.url);
const refresh = process.argv.find(arg => arg.startsWith('--refresh='))?.slice(10).split(',') ?? [];
await mkdir(directory, { recursive: true });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
for (const [slug, photo] of Object.entries(manifest)) {
  if (!/^[a-z0-9-]+$/.test(slug) || photo.license !== 'CC0' || photo.attributionRequired !== false) throw Error('Invalid photo metadata');
  if (!/^\/cities\/[a-z0-9-]+\.jpg$/.test(photo.url)) throw Error('Invalid local photo path');
  const target = new URL(photo.url.slice('/cities/'.length), directory);
  try { const data = await readFile(target); if (!refresh.includes(slug) && data.length > 5000 && data[0] === 255 && data[1] === 216) { console.log(slug + ': cached'); continue; } } catch {}
  let saved = false;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const response = await fetch(photo.remoteUrl, {signal: AbortSignal.timeout(60000), headers: {'User-Agent': 'LandingPoint/0.1 city-background-assets'}});
      if (!response.ok) throw Error('HTTP ' + response.status);
      const data = Buffer.from(await response.arrayBuffer());
      if (data.length < 5000 || data[0] !== 255 || data[1] !== 216) throw Error('Expected JPEG image');
      await writeFile(target, data);
      console.log(slug + ': ' + Math.round(data.length / 1024) + ' KB');
      saved = true; break;
    } catch (error) { console.log(slug + ': ' + error.message); if (attempt < 3) await sleep(10000); }
  }
  if (!saved) throw Error('Download failed for ' + slug);
  await sleep(1000);
}

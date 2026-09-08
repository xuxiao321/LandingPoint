import { readFile, writeFile } from "node:fs/promises";

const snapshot = JSON.parse(await readFile(new URL('../src/data/global-city-metrics.json', import.meta.url), 'utf8'));
const output = new URL('../src/data/city-image-candidates.json', import.meta.url);
const only = process.argv.find(arg => arg.startsWith('--only='))?.slice(7).split(',');
const results = only ? JSON.parse(await readFile(output, 'utf8')).filter(city => !only.includes(city.slug)) : [];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const clean = value => String(value ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
for (const city of snapshot.cities) {
  if (only && !only.includes(city.slug)) continue;
  const name = city.slug === 'new-york-city' ? 'New York' : city.name;
  const queries = [`intitle:"${name}" incategory:CC-Zero`, `"${name}" skyline incategory:CC-Zero`, `"${name}" city incategory:CC-Zero`];
  let candidates = [];
  for (const query of queries) {
    for (let attempt = 0; attempt < 4; attempt++) {
      const params = new URLSearchParams({ action: 'query', format: 'json', generator: 'search', gsrsearch: query, gsrnamespace: '6', gsrlimit: '12', prop: 'imageinfo', iiprop: 'url|extmetadata|size', iiurlwidth: '1600' });
      const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, { signal: AbortSignal.timeout(45000), headers: { 'User-Agent': 'LandingPoint/0.1 city-photo-license-review' } });
      if (response.status === 429 || response.status >= 500) { await sleep(10000); continue; }
      if (!response.ok) throw new Error(`${city.name}: ${response.status}`);
      const data = await response.json();
      candidates = Object.values(data.query?.pages ?? {}).sort((a,b) => a.index-b.index).flatMap(page => {
        const info = page.imageinfo?.[0];
        const meta = info?.extmetadata;
        if (!info || meta?.LicenseShortName?.value !== 'CC0' || meta?.AttributionRequired?.value === 'true' || info.width < 1200 || info.width / info.height < 1.25) return [];
        return [{ title: page.title, url: info.thumburl ?? info.url, sourcePageUrl: info.descriptionurl, creator: clean(meta.Artist?.value), license: 'CC0', licenseUrl: meta.LicenseUrl?.value, description: clean(meta.ImageDescription?.value), width: info.width, height: info.height, attributionRequired: false }];
      });
      break;
    }
    if (candidates.length) break;
    await sleep(1500);
  }
  results.push({ slug: city.slug, candidates });
  await writeFile(output, JSON.stringify(results, null, 2) + '\n');
  console.log(`${city.slug}: ${candidates.length} candidates`);
  await sleep(1500);
}

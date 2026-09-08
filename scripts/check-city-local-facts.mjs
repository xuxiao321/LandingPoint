import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (name) => JSON.parse(readFileSync(new URL(`../src/data/${name}`, import.meta.url), 'utf8'));
const catalog = read('global-city-metrics.json');
const acs = read('city-public-metrics.json');
const local = read('city-local-facts.json');
const acsBySlug = new Map(acs.cities.map(city => [city.slug, city]));
for (const city of catalog.cities) {
  const facts = local.cities[city.slug];
  if (facts) {
    for (const field of ['rent', 'migration']) {
      for (const property of ['label', 'value', 'geography', 'note', 'period', 'sourceUrl']) {
        assert.ok(facts[field][property]?.trim(), `${city.slug}: missing ${field}.${property}`);
      }
      assert.equal(new URL(facts[field].sourceUrl).protocol, 'https:');
      assert.match(facts[field].value, /\d/, `${city.slug}: no numeric observation`);
    }
    assert.match(facts.rent.value, /^(CAD|MXN|BRL|GBP|EUR|SGD|JPY|KRW|AUD|AED) /);
  } else {
    const official = acsBySlug.get(city.slug);
    assert.ok(official, `${city.slug}: missing city facts and ACS fallback`);
    assert.ok(official.medianGrossRent > 0);
    assert.ok(official.foreignBornShare >= 0 && official.foreignBornShare <= 100);
  }
}
assert.equal(new Set(catalog.cities.map(city => city.slug)).size, catalog.cities.length);
console.log(`${catalog.cities.length}/${catalog.cities.length} cities have housing and migration observations with sources.`);
console.log('Local housing references retain original currencies and are excluded from USD budget scoring.');

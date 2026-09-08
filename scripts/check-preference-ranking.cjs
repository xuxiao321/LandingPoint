/* eslint-disable @typescript-eslint/no-require-imports -- Node CommonJS test loader. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
const cache = new Map();
function load(name) {
  const file = path.resolve('src', name.replace(/^@\//, ''));
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'));
  if (cache.has(file)) return cache.get(file);
  const loaded = { exports: {} };
  const output = ts.transpileModule(fs.readFileSync(file + '.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 } }).outputText;
  new Function('require', 'module', 'exports', output)((id) => id.startsWith('@/') ? load(id) : require(id), loaded, loaded.exports);
  cache.set(file, loaded.exports);
  return loaded.exports;
}
const { cities } = load('@/lib/data');
const { populationByCity, populationLabel } = load('@/lib/population');
assert.deepEqual(Object.keys(populationByCity).sort(), cities.map(c => c.slug).sort());
for (const city of cities) {
  const observation = city.populationObservation;
  assert.ok(observation && observation.value > 0 && Number.isSafeInteger(observation.value));
  assert.ok(observation.period && observation.geography && observation.kind);
  assert.equal(city.population, populationLabel(observation));
  assert.ok(city.dataProvenance.sources.some(source => source.url === observation.sourceUrl && source.period === observation.period));
}
assert.ok(cities.find(c => c.slug === 'london').populationObservation.value > 9000000);
assert.equal(cities.find(c => c.slug === 'new-york-city').populationObservation.period, '2025-07-01');
assert.equal(populationByCity.dublin.geography, 'Dublin City · local authority');
console.log('All city population displays have reviewed sources, dates and boundaries.');
const { getRecommendations } = load('@/lib/recommendations');
const { communityScore } = load('@/lib/community-score');
const { employmentScore, employmentByCity } = load('@/lib/employment-score');
assert.equal(communityScore({ label: 'Residents with foreign citizenship', value: '92.2%' }), undefined);
assert.equal(communityScore({ label: 'Residents born abroad', value: '25%' }), 5);
assert.equal(employmentScore(undefined), undefined);
assert.ok(employmentScore(employmentByCity.manchester) > employmentScore(employmentByCity.birmingham));
// Isolate preference impact from unrelated baseline city differences.
const base = cities.find(c => c.slug === 'london');
for (const [preference, key] of [['Career Growth', 'career'], ['Immigrant Community', 'community']]) {
  const a = { ...base, slug: 'a', sourceBackedScoreKeys: ['transit', key], scores: { ...base.scores, transit: 8, [key]: 2 } };
  const b = { ...a, slug: 'b', scores: { ...a.scores, transit: 6, [key]: 10 } };
  const profile = { lifestyles: [], workType: 'Unspecified' };
  // Community is already a baseline signal, so verify score movement as well.
  const before = getRecommendations([a, b], profile);
  const after = getRecommendations([a, b], { ...profile, lifestyles: [preference] });
  assert.equal(after[0].slug, 'b');
  assert.notEqual(after.find(c => c.slug === 'a').matchScore, before.find(c => c.slug === 'a').matchScore);
}
assert.equal(cities.filter(c => c.sourceBackedScoreKeys.includes('career')).length, 5);
console.log('Preference ranking checks passed. Career: 5; community:', cities.filter(c => c.sourceBackedScoreKeys.includes('community')).length);
const { rentAffordabilityScore } = load('@/lib/rent-burden');
assert.equal(rentAffordabilityScore(20), 10);
assert.equal(rentAffordabilityScore(50), 0);
assert.equal(rentAffordabilityScore(NaN), undefined);
assert.ok(rentAffordabilityScore(27.4) > rentAffordabilityScore(31.3));
assert.equal(cities.filter(c => c.sourceBackedScoreKeys.includes('rent')).length, 0);
assert.ok(cities.every(c => !c.signals.some(s => s.key === 'rent')));
assert.ok(cities.every(c => c.sourceBackedScoreKeys.includes('costOfLiving')));
assert.ok(cities.every(c => c.livingCost?.monthlyUsd > 0 && c.livingCost.sourceUrl));
assert.equal(new Set(cities.map(c => c.livingCost.period)).size, 1);
assert.ok(cities.find(c => c.slug === 'new-york-city').livingCost.monthlyUsd > cities.find(c => c.slug === 'austin').livingCost.monthlyUsd);
console.log('Rent scoring is excluded; every city has a same-scope monthly living-cost estimate.');
assert.ok(cities.every(c => c.localFacts?.rent.rentDefinition));
assert.equal(cities.find(c => c.slug === 'london').localFacts.rent.value, 'GBP 1,752');
assert.equal(cities.find(c => c.slug === 'manchester').localFacts.rent.value, 'GBP 998');
assert.equal(cities.filter(c => c.localFacts.rent.rentDefinition.primary).length, 5);
for (const slug of ['toronto', 'tokyo', 'calgary', 'new-york-city']) {
  assert.equal(cities.find(c => c.slug === slug).localFacts.rent.rentDefinition.primary, false);
}
console.log('All cities have explicit rental definitions; 5 primary references, remaining references separated.');
const { normalizePriorities } = load('@/lib/priority-weights');
const { parsePreferences, parseDraft } = load('@/lib/account-validation');
const { parseReview } = load('@/lib/review-validation');
const { isUpcoming, safeEventUrl } = load('@/lib/event-types');
assert.deepEqual(normalizePriorities({ a: 100, b: 3, other: 1 }, ['a', 'b']), { a: 2, b: 3 });
const preferences = { budget: 3000, passport: 'United States', workType: 'Study', needsSponsorship: 'No', lifestyles: ['Career Growth'], priorities: { 'Career Growth': 3 } };
assert.equal(parsePreferences(preferences).priorities['Career Growth'], 3);
assert.throws(() => parsePreferences({ ...preferences, budget: -1 }));
assert.throws(() => parsePreferences({ ...preferences, lifestyles: ['injected'] }));
assert.throws(() => parseDraft({ citySlug: 'unknown', kind: 'experience', content: { notes: 'hi' } }));
assert.throws(() => parseReview({ displayName: 'A', body: 'short' }));
assert.equal(parseReview({ displayName: 'Resident', body: 'A useful detailed review of living in this city.', residency: 'Current resident', duration: '1–3 years' }).display_name, 'Resident');
assert.equal(isUpcoming({ startDate: '2026-01-01' }, '2026-09-07'), false);
assert.equal(safeEventUrl('javascript:alert(1)'), false);
assert.equal(safeEventUrl('https://example.com'), true);
const jobCity = { ...base, slug: 'jobs', costMetric: 'not-available', sourceBackedScoreKeys: ['career', 'community'], scores: { ...base.scores, career: 9, community: 2 } };
const communityCity = { ...jobCity, slug: 'community', scores: { ...jobCity.scores, career: 2, community: 9 } };
const priorityProfile = { workType: 'Unspecified', lifestyles: ['Career Growth', 'Immigrant Community'] };
assert.equal(getRecommendations([jobCity, communityCity], { ...priorityProfile, priorities: { 'Career Growth': 3, 'Immigrant Community': 1 } })[0].slug, 'jobs');
assert.equal(getRecommendations([jobCity, communityCity], { ...priorityProfile, priorities: { 'Career Growth': 1, 'Immigrant Community': 3 } })[0].slug, 'community');
assert.deepEqual(getRecommendations([jobCity], { ...priorityProfile, lifestyles: ['Career Growth', 'Career Growth'] }), getRecommendations([jobCity], { ...priorityProfile, lifestyles: ['Career Growth'] }));
console.log('Priority rank reversal, validation, event expiry and unsafe-link checks passed.');

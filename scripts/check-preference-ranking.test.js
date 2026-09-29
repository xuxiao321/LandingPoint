import assert from "node:assert/strict";
import { test } from "vitest";
import { cities, lifestyleOptions } from "@/lib/data";
import { populationByCity, populationLabel } from "@/lib/population";
import { getRecommendations } from "@/lib/recommendations";
import internetSnapshot from "@/data/city-internet.json";
import { communityScore } from "@/lib/community-score";
import { employmentScore, employmentByCity } from "@/lib/employment-score";
import { rentAffordabilityScore } from "@/lib/rent-burden";
import { normalizePriorities } from "@/lib/priority-weights";
import { parsePreferences, parseDraft } from "@/lib/account-validation";
import { parseReview } from "@/lib/review-validation";
import { isUpcoming, safeEventUrl } from "@/lib/event-types";

test("city evidence, weighted rankings, validation and event safety", () => {
  assert.deepEqual(
    Object.keys(populationByCity).sort(),
    cities.map((c) => c.slug).sort(),
  );
  for (const city of cities) {
    const observation = city.populationObservation;
    assert.ok(
      observation &&
        observation.value > 0 &&
        Number.isSafeInteger(observation.value),
    );
    assert.ok(observation.period && observation.geography && observation.kind);
    assert.equal(city.population, populationLabel(observation));
    assert.ok(
      city.dataProvenance.sources.some(
        (source) =>
          source.url === observation.sourceUrl &&
          source.period === observation.period,
      ),
    );
  }
  assert.ok(
    cities.find((c) => c.slug === "london").populationObservation.value >
      9000000,
  );
  assert.equal(
    cities.find((c) => c.slug === "new-york-city").populationObservation.period,
    "2025-07-01",
  );
  assert.equal(
    populationByCity.dublin.geography,
    "Dublin City · local authority",
  );
  console.log(
    "All city population displays have reviewed sources, dates and boundaries.",
  );
  assert.deepEqual(
    Object.keys(internetSnapshot.cities).sort(),
    cities.map((city) => city.slug).sort(),
  );
  assert.equal(
    new Set(Object.values(internetSnapshot.cities).map((item) => item.source))
      .size,
    1,
  );
  assert.equal(
    new Set(Object.values(internetSnapshot.cities).map((item) => item.period))
      .size,
    1,
  );
  assert.equal(
    new Set(Object.values(internetSnapshot.cities).map((item) => item.method))
      .size,
    1,
  );
  assert.match(
    internetSnapshot.cities["sao-paulo"].geography,
    /BR-SP\/São Paulo/,
  );
  const supportedSignals = {
    "Lower Living Costs": "costOfLiving",
    "University Access": "schools",
    "No-car Lifestyle": "transit",
    "Mild Weather": "weather",
    "Dining Access": "food",
    "Social & Cultural Access": "social",
    "Fast Internet": "internet",
  };
  for (const option of lifestyleOptions) {
    assert.ok(
      cities.every(
        (city) =>
          city.sourceBackedScoreKeys.includes(supportedSignals[option]) &&
          city.signals.some(
            (signal) =>
              signal.key === supportedSignals[option] &&
              signal.detailRows.length > 0,
          ),
      ),
      option + " needs evidence in every city",
    );
  }
  assert.ok(
    getRecommendations(cities, {
      lifestyles: ["Career Growth"],
      workType: "Unspecified",
    }).every((city) => city.preferenceMatches.length === 0),
  );
  assert.equal(
    communityScore({
      label: "Residents with foreign citizenship",
      value: "92.2%",
    }),
    undefined,
  );
  assert.equal(
    communityScore({ label: "Residents born abroad", value: "25%" }),
    5,
  );
  assert.equal(employmentScore(undefined), undefined);
  assert.ok(
    employmentScore(employmentByCity.manchester) >
      employmentScore(employmentByCity.birmingham),
  );
  // Isolate preference impact from unrelated baseline city differences.
  const base = cities.find((c) => c.slug === "london");
  for (const [preference, key] of [
    ["University Access", "schools"],
    ["Mild Weather", "weather"],
    ["Dining Access", "food"],
    ["Social & Cultural Access", "social"],
    ["Fast Internet", "internet"],
  ]) {
    const a = {
      ...base,
      slug: "a",
      sourceBackedScoreKeys: ["transit", key],
      scores: { ...base.scores, transit: 8, [key]: 2 },
    };
    const b = {
      ...a,
      slug: "b",
      scores: { ...a.scores, transit: 6, [key]: 10 },
    };
    const profile = { lifestyles: [], workType: "Unspecified" };
    // Community is already a baseline signal, so verify score movement as well.
    const before = getRecommendations([a, b], profile);
    const after = getRecommendations([a, b], {
      ...profile,
      lifestyles: [preference],
    });
    assert.equal(after[0].slug, "b");
    assert.notEqual(
      after.find((c) => c.slug === "a").matchScore,
      before.find((c) => c.slug === "a").matchScore,
    );
  }
  assert.equal(
    cities.filter((c) => c.sourceBackedScoreKeys.includes("career")).length,
    5,
  );
  console.log(
    "Preference ranking checks passed. Career: 5; community:",
    cities.filter((c) => c.sourceBackedScoreKeys.includes("community")).length,
  );
  assert.equal(rentAffordabilityScore(20), 10);
  assert.equal(rentAffordabilityScore(50), 0);
  assert.equal(rentAffordabilityScore(NaN), undefined);
  assert.ok(rentAffordabilityScore(27.4) > rentAffordabilityScore(31.3));
  assert.equal(
    cities.filter((c) => c.sourceBackedScoreKeys.includes("rent")).length,
    0,
  );
  assert.ok(cities.every((c) => !c.signals.some((s) => s.key === "rent")));
  assert.ok(
    cities.every((c) => c.sourceBackedScoreKeys.includes("costOfLiving")),
  );
  assert.ok(
    cities.every((c) => c.livingCost?.monthlyUsd > 0 && c.livingCost.sourceUrl),
  );
  assert.equal(new Set(cities.map((c) => c.livingCost.period)).size, 1);
  assert.ok(
    cities.find((c) => c.slug === "new-york-city").livingCost.monthlyUsd >
      cities.find((c) => c.slug === "austin").livingCost.monthlyUsd,
  );
  console.log(
    "Rent scoring is excluded; every city has a same-scope monthly living-cost estimate.",
  );
  assert.ok(cities.every((c) => c.localFacts?.rent.rentDefinition));
  assert.equal(
    cities.find((c) => c.slug === "london").localFacts.rent.value,
    "GBP 1,752",
  );
  assert.equal(
    cities.find((c) => c.slug === "manchester").localFacts.rent.value,
    "GBP 998",
  );
  assert.equal(
    cities.filter((c) => c.localFacts.rent.rentDefinition.primary).length,
    5,
  );
  for (const slug of ["toronto", "tokyo", "calgary", "new-york-city"]) {
    assert.equal(
      cities.find((c) => c.slug === slug).localFacts.rent.rentDefinition
        .primary,
      false,
    );
  }
  console.log(
    "All cities have explicit rental definitions; 5 primary references, remaining references separated.",
  );
  assert.deepEqual(
    normalizePriorities({ a: 100, b: 3, other: 1 }, ["a", "b"]),
    { a: 2, b: 3 },
  );
  const preferences = {
    budget: 3000,
    passport: "United States",
    workType: "Study",
    needsSponsorship: "No",
    lifestyles: ["University Access"],
    priorities: { "University Access": 3 },
  };
  assert.equal(
    parsePreferences(preferences).priorities["University Access"],
    3,
  );
  assert.throws(() => parsePreferences({ ...preferences, budget: -1 }));
  assert.throws(() =>
    parsePreferences({ ...preferences, lifestyles: ["injected"] }),
  );
  assert.throws(() =>
    parseDraft({
      citySlug: "unknown",
      kind: "experience",
      content: { notes: "hi" },
    }),
  );
  assert.throws(() => parseReview({ displayName: "A", body: "short" }));
  assert.equal(
    parseReview({
      displayName: "Resident",
      body: "A useful detailed review of living in this city.",
      residency: "Current resident",
      duration: "1–3 years",
    }).display_name,
    "Resident",
  );
  assert.equal(isUpcoming({ startDate: "2026-01-01" }, "2026-09-07"), false);
  assert.equal(safeEventUrl("javascript:alert(1)"), false);
  assert.equal(safeEventUrl("https://example.com"), true);
  const jobCity = {
    ...base,
    slug: "jobs",
    costMetric: "not-available",
    sourceBackedScoreKeys: ["schools", "weather"],
    scores: { ...base.scores, schools: 9, weather: 2 },
  };
  const communityCity = {
    ...jobCity,
    slug: "weather",
    scores: { ...jobCity.scores, schools: 2, weather: 9 },
  };
  const priorityProfile = {
    workType: "Unspecified",
    lifestyles: ["University Access", "Mild Weather"],
  };
  assert.equal(
    getRecommendations([jobCity, communityCity], {
      ...priorityProfile,
      priorities: { "University Access": 3, "Mild Weather": 1 },
    })[0].slug,
    "jobs",
  );
  assert.equal(
    getRecommendations([jobCity, communityCity], {
      ...priorityProfile,
      priorities: { "University Access": 1, "Mild Weather": 3 },
    })[0].slug,
    "weather",
  );
  assert.deepEqual(
    getRecommendations([jobCity], {
      ...priorityProfile,
      lifestyles: ["University Access", "University Access"],
    }),
    getRecommendations([jobCity], {
      ...priorityProfile,
      lifestyles: ["University Access"],
    }),
  );
  const higherFitLowerCoverage = {
    ...base,
    slug: "higher-fit",
    name: "Higher fit",
    costMetric: "not-available",
    sourceBackedScoreKeys: ["transit"],
    scores: { ...base.scores, transit: 9 },
  };
  const lowerFitFullCoverage = {
    ...base,
    slug: "lower-fit",
    name: "Lower fit",
    costMetric: "not-available",
    sourceBackedScoreKeys: [
      "job",
      "community",
      "costOfLiving",
      "safety",
      "transit",
    ],
    scores: {
      ...base.scores,
      job: 8,
      community: 8,
      costOfLiving: 8,
      safety: 8,
      transit: 8,
    },
  };
  assert.equal(
    getRecommendations([lowerFitFullCoverage, higherFitLowerCoverage], {
      workType: "Unspecified",
      lifestyles: [],
    })[0].slug,
    "higher-fit",
  );
  console.log(
    "Priority rank reversal, validation, event expiry and unsafe-link checks passed.",
  );
});

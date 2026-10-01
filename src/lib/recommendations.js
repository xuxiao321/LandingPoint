import { lifestyleOptions } from "@/lib/data";
import { priorityWeight } from "@/lib/priority-weights";
const lifestyleKeys = new Map([
  ["Lower Living Costs", ["costOfLiving"]],
  ["University Access", ["schools"]],
  ["No-car Lifestyle", ["transit"]],
  ["Mild Weather", ["weather"]],
  ["Dining Access", ["food"]],
  ["Social & Cultural Access", ["social"]],
  ["Fast Internet", ["internet"]],
]);
const goalKeys = new Map([
  ["Travel / Short Stay", ["transit", "social", "food"]],
  ["Study", ["schools", "costOfLiving", "transit"]],
  ["Settle / Family", ["safety", "schools", "costOfLiving"]],
  ["Work / Career", ["job", "career", "sponsor"]],
  ["Start a Business", ["career", "job", "social"]],
  ["Remote Work Base", ["internet", "costOfLiving", "weather"]],
]);
const baselineKeys = ["job", "community", "costOfLiving", "safety", "transit"];

// City costs come from sources with different scopes. Only like-for-like monthly
// estimates can be compared with a visitor's budget; the other values remain
// useful as their existing normalized affordability signal.
function parseCurrency(value) {
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}
function getBudgetScore(city, budget) {
  if (
    city.costMetric === "not-available" ||
    city.costMetric === "local-rent-reference"
  ) {
    return undefined;
  }
  if (city.costMetric === "housing-cost-proxy") {
    return city.scores.costOfLiving;
  }
  const cost = parseCurrency(city.monthlyCost);
  if (!budget || !cost || budget <= 0) {
    return city.scores.costOfLiving;
  }
  const target =
    city.costMetric === "median-gross-rent" ? budget * 0.45 : budget;
  const ratio = cost / target;
  if (ratio <= 0.8) return 10;
  if (ratio <= 1) return 8.5;
  if (ratio <= 1.2) return 6.5;
  if (ratio <= 1.5) return 4;
  return 1.5;
}
function addWeight(weights, key, amount) {
  weights.set(key, (weights.get(key) ?? 0) + amount);
}
export function getRecommendations(cities, profile) {
  const selectedLifestyles = [...new Set(profile.lifestyles)].filter((option) =>
    lifestyleOptions.includes(option),
  );
  const weights = new Map();
  baselineKeys.forEach((key) => addWeight(weights, key, 1));
  (goalKeys.get(profile.workType) ?? []).forEach((key) =>
    addWeight(weights, key, 2.2),
  );
  selectedLifestyles.forEach((lifestyle) => {
    const keys = lifestyleKeys.get(lifestyle) ?? [];
    keys.forEach((key) =>
      addWeight(
        weights,
        key,
        (1.8 * priorityWeight(profile.priorities, lifestyle)) / keys.length,
      ),
    );
  });
  if (profile.needsSponsorship === "Yes") {
    addWeight(weights, "sponsor", 3);
    addWeight(weights, "visa", 2);
  }
  const totalWeight = [...weights.values()].reduce(
    (total, weight) => total + weight,
    0,
  );
  return cities
    .map((city) => {
      // Do not treat a missing source as a low score. Re-normalizing against
      // available signals keeps incomplete city records from being penalized.
      const availableWeights = [...weights.entries()].filter(([key]) =>
        city.sourceBackedScoreKeys.includes(key),
      );
      const availableWeight = availableWeights.reduce(
        (total, [, weight]) => total + weight,
        0,
      );
      const weightedScore = availableWeights.reduce(
        (total, [key, weight]) => total + city.scores[key] * weight,
        0,
      );
      const budgetScore = getBudgetScore(city, profile.budget);
      const signalFit =
        availableWeight > 0 ? weightedScore / availableWeight : 0;
      const fit =
        budgetScore === undefined
          ? signalFit
          : signalFit * 0.85 + budgetScore * 0.15;
      const recommendationCoverage =
        totalWeight > 0 ? availableWeight / totalWeight : 0;
      return {
        ...city,
        matchScore: Math.round(fit * 10),
        migrationFit: Number(fit.toFixed(1)),
        recommendationCoverage,
        rankingValue: fit,
        preferenceMatches: selectedLifestyles
          .map((option) => {
            const keys = lifestyleKeys.get(option) ?? [];
            const available = keys.filter((key) =>
              city.sourceBackedScoreKeys.includes(key),
            );
            return {
              option,
              importance: priorityWeight(profile.priorities, option),
              score: available.length
                ? available.reduce((sum, key) => sum + city.scores[key], 0) /
                  available.length
                : null,
              partial: available.length < keys.length,
            };
          })
          .sort(
            (a, b) =>
              b.importance - a.importance || (b.score ?? -1) - (a.score ?? -1),
          ),
      };
    })
    .sort(
      (left, right) =>
        right.migrationFit - left.migrationFit ||
        left.name.localeCompare(right.name),
    );
}

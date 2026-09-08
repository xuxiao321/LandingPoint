import Link from "next/link";
import {
  Heart,
  Landmark,
  SlidersHorizontal,
  Target,
  WalletCards,
} from "lucide-react";
import { CityCard } from "@/components/city/city-card";
import { Badge } from "@/components/ui/badge";
import { cities, isSponsorshipRelevantGoal, lifestyleOptions } from "@/lib/data";
import { normalizePriorities, priorityLabels } from "@/lib/priority-weights";
import { getRecommendations } from "@/lib/recommendations";

type SearchParams = Record<string, string | string[] | undefined>;

function readParam(params: SearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function readParams(params: SearchParams, key: string) {
  const value = params[key];
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

export const metadata = {
  title: "Recommendations",
};

export default async function RecommendationsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = (await searchParams) ?? {};
  const budget = readParam(params, "budget") ?? "3000";
  const lifestyles = [...new Set(readParams(params, "lifestyle"))].filter(value => (lifestyleOptions as readonly string[]).includes(value));
  const priorities = normalizePriorities(Object.fromEntries(lifestyles.map(option => [option, Number(readParam(params, `priority:${option}`))])), lifestyles);
  const editParams = new URLSearchParams();
  for (const key of ["budget", "passport", "workType", "needsSponsorship"]) { const value = readParam(params, key); if (value) editParams.set(key, value); }
  lifestyles.forEach(option => { editParams.append("lifestyle", option); editParams.set(`priority:${option}`, String(priorities[option])); });
  const lifestyleLabel =
    lifestyles.length > 0 ? lifestyles.map(option => `${option} (${priorityLabels[priorities[option]]})`).join(", ") : "Open to all";
  const workType = readParam(params, "workType") ?? "Work / Career";
  const needsSponsorship = readParam(params, "needsSponsorship");
  const shouldShowSponsorship = isSponsorshipRelevantGoal(workType);
  const parsedBudget = Number(budget);
  const budgetLabel =
    budget && Number.isFinite(parsedBudget)
      ? `$${parsedBudget.toLocaleString("en-US")}/mo`
      : (budget ?? "Budget not set");
  const profileFilters = [
    { label: "Goal", value: workType, icon: Target },
    ...(shouldShowSponsorship
      ? [
          {
            label: "Sponsorship",
            value: needsSponsorship ?? "Not specified",
            icon: Landmark,
          },
        ]
      : []),
    { label: "Budget", value: budgetLabel, icon: WalletCards },
    { label: "Lifestyle", value: lifestyleLabel, icon: Heart },
  ];
  const rankingCopy = "Your shortlist is weighted by the priorities you selected. Open any city to see which signals helped, which risks lowered its fit, and where evidence is still missing.";
  const recommendations = getRecommendations(cities, {
    budget: Number.isFinite(parsedBudget) ? parsedBudget : undefined,
    lifestyles,
    priorities,
    workType,
    needsSponsorship,
  });

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-[#dce5e0] bg-white/80 p-6 sm:p-8">
        <div className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
              Detailed profile
            </Badge>
            {profileFilters.map(({ label, value, icon: Icon }) => (
              <Badge
                key={label}
                className="max-w-full flex-wrap gap-1.5 bg-[#f7f8f3]"
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="text-[#6d7872]">{label}:</span>
                <span className="break-words text-[#17201d]">{value}</span>
              </Badge>
            ))}
          </div>
          <div>
            <h1 className="text-4xl font-black text-[#17201d] sm:text-5xl">
              Find your next city
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-[#57635d]">
              {rankingCopy}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#e2eae5] pt-5">
          <p className="text-sm text-[#52685d]"><strong>{recommendations.length} cities</strong> · Ordered by your preferences</p>
          <Link href={`/?${editParams}`} className="edit-preferences rounded-xl px-5 py-3 text-sm font-semibold transition-colors">Edit preferences</Link>
        </div>
      </section>

      <div className="rounded-lg border border-[#b9ddd3] bg-[#eef9f5] p-4 text-sm leading-6 text-[#075e54]">
        Your selected priorities influence your city matches. View each city’s profile for the data and sources.
      </div>

      <section aria-label="City matches" className="grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {recommendations.map((city) => (
          <div key={city.slug} className="flex min-w-0 flex-col">
            <CityCard city={city} />
            {city.preferenceMatches.length > 0 && <details className="mt-3 rounded-xl border border-[var(--border)] bg-white p-3 text-sm"><summary className="cursor-pointer font-semibold text-[var(--accent)]">How this matches your priorities</summary><p className="mt-2 text-xs text-[var(--muted)]">Preference importance uses 1× / 2× / 3× weights. Goal, budget and evidence coverage also affect ranking. These are model signals, not guarantees.</p><ul className="mt-3 grid gap-2">{city.preferenceMatches.map(match => <li key={match.option}><span className="font-medium">{match.option}</span><span className="block text-xs text-[var(--muted)]">{priorityLabels[match.importance]} · {match.score === null ? "Comparable evidence missing" : `${match.score.toFixed(1)}/10 model signal${match.partial ? " · partial evidence" : ""}`}</span></li>)}</ul></details>}
            {lifestyles.includes("Career Growth") && !city.sourceBackedScoreKeys.includes("career") && <p className="mt-2 px-3 text-xs text-[var(--muted)]">Career Growth: comparable local job data not yet available.</p>}
            {lifestyles.includes("Immigrant Community") && !city.sourceBackedScoreKeys.includes("community") && <p className="mt-2 px-3 text-xs text-[var(--muted)]">Immigrant Community: population definition is not comparable for scoring.</p>}
          </div>
        ))}
      </section>
    </main>
  );
}

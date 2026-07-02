import Image from "next/image";
import {
  Clock,
  Heart,
  Landmark,
  SlidersHorizontal,
  Target,
  WalletCards,
} from "lucide-react";
import { CityCard } from "@/components/city/city-card";
import { Badge } from "@/components/ui/badge";
import { isSponsorshipRelevantGoal, topMatches } from "@/lib/data";

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
  const lifestyles = readParams(params, "lifestyle");
  const lifestyleLabel =
    lifestyles.length > 0 ? lifestyles.join(", ") : "Open to all";
  const workType = readParam(params, "workType") ?? "Work / Career";
  const needsSponsorship = readParam(params, "needsSponsorship");
  const shouldShowSponsorship = isSponsorshipRelevantGoal(workType);
  const timeline = readParam(params, "timeline") ?? "3-6 Months";
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
    { label: "Timeline", value: timeline, icon: Clock },
    { label: "Lifestyle", value: lifestyleLabel, icon: Heart },
  ];
  const rankingCopy = shouldShowSponsorship
    ? "Ranked by your moving goal, sponsorship needs, lifestyle, transit, housing, community, and relocation signals."
    : "Ranked by your moving goal, lifestyle, transit, housing, community, and relocation signals.";

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
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
              Migration-Friendly Matches
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-[#57635d]">
              {rankingCopy}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-[#d7ded4] bg-white shadow-sm">
          <Image
            src="/landingpoint-map.png"
            alt="LandingPoint recommendation map"
            width={1600}
            height={1000}
            className="h-64 w-full object-cover"
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {topMatches.map((city) => (
          <CityCard key={city.slug} city={city} />
        ))}
      </section>
    </main>
  );
}

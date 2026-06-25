import Image from "next/image";
import { SlidersHorizontal } from "lucide-react";
import { CityCard } from "@/components/city/city-card";
import { Badge } from "@/components/ui/badge";
import { topMatches } from "@/lib/data";

type SearchParams = Record<string, string | string[] | undefined>;

function readParam(params: SearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
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
  const lifestyle = readParam(params, "lifestyle") ?? "Career Growth";
  const workType = readParam(params, "workType") ?? "Software Engineering";
  const visaStatus = readParam(params, "visaStatus") ?? "Need Sponsorship";
  const timeline = readParam(params, "timeline") ?? "3-6 Months";

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <div className="grid gap-4">
          <Badge className="w-fit gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            {workType} / {visaStatus} / ${budget} / {timeline}
          </Badge>
          <div>
            <h1 className="text-4xl font-black text-[#17201d] sm:text-5xl">
              Migration-Friendly Matches
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-[#57635d]">
              Ranked by sponsor density, visa path fit, job market strength,
              immigrant community, rent pressure, and relocation experience.
            </p>
            <p className="mt-2 text-sm font-semibold text-[#6d7872]">
              Lifestyle priority: {lifestyle}
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

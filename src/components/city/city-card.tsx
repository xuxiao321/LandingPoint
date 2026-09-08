import Link from "next/link";
import Image from "next/image";
import { PhotoCredit } from "@/components/city/photo-credit";
import { PopulationFact } from "@/components/city/population-fact";
import { ArrowUpRight, Landmark, MapPin, Users, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreBar } from "@/components/score-bar";
import { DataProvenance } from "@/components/city/data-provenance";
import { LocalFactContent } from "@/components/city/local-fact";
import { LivingCostFact } from "@/components/city/living-cost-fact";
import type { City, SignalKey } from "@/lib/data";

export function CityCard({ city }: { city: City }) {
  const allCategoryScores: Array<{
    key: SignalKey;
    label: string;
    score: number;
  }> = [
    { key: "sponsor", label: "Work Paths", score: city.scores.sponsor },
    { key: "visa", label: "Visa Fit", score: city.scores.visa },
    { key: "job", label: "Job Market", score: city.scores.job },
    { key: "career", label: "Employment scale", score: city.scores.career },
    { key: "community", label: "Foreign-born share", score: city.scores.community },
    { key: "transit", label: "Transit", score: city.scores.transit },
    { key: "costOfLiving", label: "Living cost", score: city.scores.costOfLiving },
    { key: "food", label: "Dining Access", score: city.scores.food },
    { key: "safety", label: "Safety", score: city.scores.safety },
    { key: "weather", label: "Mild Weather", score: city.scores.weather },
  ];
  const categoryScores = allCategoryScores.filter((category) =>
    city.sourceBackedScoreKeys.includes(category.key),
  );

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-[#dce5e0] bg-white p-5 shadow-[0_12px_40px_-25px_rgba(15,40,30,.3)] transition-shadow hover:shadow-lg">
      {city.heroImage ? (
        <div className="-mx-5 -mt-5 mb-5"><div className="relative h-52 overflow-hidden bg-[#173d36]">
          <Image src={city.heroImage.url} alt={`${city.name} city view`} fill unoptimized sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 33vw" className="object-cover" />
        </div><PhotoCredit photo={city.heroImage} /></div>
      ) : null}
      <div className="grid min-h-24 grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="min-w-0">
          <Link
            href={`/city/${city.slug}`}
            className="block truncate text-2xl font-black text-[#17201d] hover:text-[var(--accent)]"
            title={city.name}
          >
            {city.name}
          </Link>
          <p className="mt-1 flex min-w-0 items-center gap-1.5 text-sm font-medium text-[#57635d]">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <span className="truncate" title={`${city.state}, ${city.country}`}>{city.state}, {city.country}</span>
          </p>
        </div>
        <div className="shrink-0 rounded-xl bg-[var(--accent-soft)] px-3 py-2 text-right text-[var(--ink)]">
          <p className="text-xs font-medium">Model fit</p>
          <p className="text-2xl font-black tabular-nums">
            {city.migrationFit.toFixed(1)}
          </p>
          <p className="text-xs font-medium">
            {Math.round(city.recommendationCoverage * 100)}% profile coverage
          </p>
        </div>
      </div>

      <details className="mt-4 min-h-7 text-sm leading-6 text-[#57635d]"><summary className="cursor-pointer font-semibold">About this city</summary><p className="mt-2">{city.summary}</p></details>

      <div className="mt-4 min-h-5">
        <DataProvenance provenance={city.dataProvenance} compact />
      </div>

      <div className="mt-4 hidden flex-wrap gap-2">
        {city.bestFor.map((item) => (
          <Badge key={item}>{item}</Badge>
        ))}
      </div>

      <details className="mt-5 border-y border-[var(--border)] py-3">
        <summary className="cursor-pointer py-1 text-sm font-semibold text-[var(--accent)]">View fit breakdown</summary>
        <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4 pb-2">
        {categoryScores.map((category) => (
          <ScoreBar
            key={category.label}
            label={category.label}
            score={category.score}
          />
        ))}
        {categoryScores.length === 0 ? (
          <p className="text-sm text-[#6d7872]">
            No comparable profile scores are available for this city yet.
          </p>
        ) : null}
        </div>
      </details>

      <div className="mt-5 grid flex-1 grid-cols-2 content-start gap-3 text-sm text-[#57635d]">
        <div className="min-h-56 rounded-md bg-[var(--surface-soft)] p-3">
          <WalletCards className="mb-2 h-4 w-4 text-[var(--accent)]" />
          <LivingCostFact city={city} compact />
        </div>
        <div className="min-h-56 rounded-md bg-[var(--surface-soft)] p-3">
          <Users className="mb-2 h-4 w-4 text-[var(--accent)]" />
          <PopulationFact city={city} compact />
        </div>
        <div className="col-span-2 min-h-48 rounded-md bg-[var(--surface-soft)] p-3">
          <Landmark className="mb-2 h-4 w-4 text-[var(--accent)]" />
          <p className="font-semibold text-[#17201d]">
            Work paths: {city.sponsorDensity}
          </p>
          {city.localFacts ? <div className="mt-3"><LocalFactContent fact={city.localFacts.migration} compact /></div> : <p>Residents born abroad: {city.foreignBornShare}</p>}
        </div>
      </div>

      <Button asChild variant="outline" className="mt-5 w-full rounded-xl bg-[#edf5f1] text-[#086957]">
        <Link href={`/city/${city.slug}`}>
          Explore {city.name}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </article>
  );
}

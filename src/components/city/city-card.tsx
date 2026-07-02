import Link from "next/link";
import { ArrowUpRight, Landmark, MapPin, WalletCards, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreBar } from "@/components/score-bar";
import type { City } from "@/lib/data";

export function CityCard({ city }: { city: City }) {
  const categoryScores = [
    { label: "Sponsors", score: city.scores.sponsor, accent: "#be4960" },
    { label: "Visa Fit", score: city.scores.visa, accent: "#008a7a" },
    { label: "Job Market", score: city.scores.job, accent: "#2563eb" },
    { label: "Community", score: city.scores.community, accent: "#917e1c" },
    { label: "Transit", score: city.scores.transit, accent: "#0f766e" },
    { label: "Rent", score: city.scores.rent, accent: "#f97316" },
    { label: "Food Cost", score: city.scores.food, accent: "#7c3aed" },
    { label: "Safety", score: city.scores.safety, accent: "#2563eb" },
  ];

  return (
    <article className="rounded-lg border border-[#d7ded4] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href={`/city/${city.slug}`}
            className="text-2xl font-black text-[#17201d] hover:text-[#008a7a]"
          >
            {city.name}
          </Link>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-[#57635d]">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {city.state}, {city.country}
          </p>
        </div>
        <div className="rounded-md bg-[#17201d] px-3 py-2 text-right text-white">
          <p className="text-xs font-semibold text-white/70">Migration Fit</p>
          <p className="text-2xl font-black tabular-nums">
            {city.migrationFit.toFixed(1)}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-[#57635d]">{city.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {city.bestFor.map((item) => (
          <Badge key={item}>{item}</Badge>
        ))}
      </div>

      <div className="mt-5 grid gap-3">
        <p className="text-xs font-black uppercase text-[#6d7872]">
          Fit Breakdown
        </p>
        {categoryScores.map((category) => (
          <ScoreBar
            key={category.label}
            label={category.label}
            score={category.score}
            accent={category.accent}
          />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-[#57635d]">
        <div className="rounded-md bg-[#f2f5f0] p-3">
          <WalletCards className="mb-2 h-4 w-4 text-[#008a7a]" />
          <p className="font-semibold text-[#17201d]">{city.monthlyCost}</p>
          <p>monthly cost</p>
        </div>
        <div className="rounded-md bg-[#f2f5f0] p-3">
          <Wifi className="mb-2 h-4 w-4 text-[#2563eb]" />
          <p className="font-semibold text-[#17201d]">{city.internetQuality}</p>
          <p>internet</p>
        </div>
        <div className="col-span-2 rounded-md bg-[#f2f5f0] p-3">
          <Landmark className="mb-2 h-4 w-4 text-[#be4960]" />
          <p className="font-semibold text-[#17201d]">
            Sponsors: {city.sponsorDensity}
          </p>
          <p>{city.foreignBornShare} foreign-born share</p>
        </div>
      </div>

      <Button asChild variant="outline" className="mt-5 w-full">
        <Link href={`/city/${city.slug}`}>
          Open City
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </article>
  );
}

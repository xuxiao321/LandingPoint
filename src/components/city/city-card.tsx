import Link from "next/link";
import Image from "next/image";
import { PhotoCredit } from "@/components/city/photo-credit";
import { PopulationFact } from "@/components/city/population-fact";
import type { CSSProperties } from "react";
import { ArrowUpRight, Landmark, MapPin, Users, WalletCards, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreBar } from "@/components/score-bar";
import { DataProvenance } from "@/components/city/data-provenance";
import { LocalFactContent } from "@/components/city/local-fact";
import { LivingCostFact } from "@/components/city/living-cost-fact";
import type { City, SignalKey } from "@/lib/data";

export function CityCard({ city, showFit = true }: { city: City; showFit?: boolean }) {
  const themes = [
    { accent: "#c85f4c", soft: "#fff0eb", wash: "#fff8f4", label: "Big city energy", icon: "L" },
    { accent: "#6574b8", soft: "#eef0ff", wash: "#f8f8ff", label: "Culture & calm", icon: "E" },
    { accent: "#4f70c9", soft: "#e9eeff", wash: "#f7f8ff", label: "A city in motion", icon: "M" },
    { accent: "#bc7440", soft: "#fff1e4", wash: "#fff9f1", label: "Warm & welcoming", icon: "T" },
    { accent: "#9b5fa7", soft: "#f7edfa", wash: "#fcf7fd", label: "Creative current", icon: "S" },
    { accent: "#347e9e", soft: "#e8f3f8", wash: "#f4fbfd", label: "Open horizons", icon: "V" },
  ];
  const themeIndex = [...city.slug].reduce((sum, character) => sum + character.charCodeAt(0), 0) % themes.length;
  const cityTheme = city.slug.includes("london")
    ? { accent: "#d45f47", soft: "#fff0eb", wash: "#fff8f4", label: "Big city energy", icon: "L" }
      : city.slug.includes("edinburgh")
        ? { accent: "#6574b8", soft: "#eef0ff", wash: "#f8f8ff", label: "Culture & calm", icon: "E" }
          : city.slug.includes("manchester")
            ? { accent: "#4f70c9", soft: "#e9eeff", wash: "#f7f8ff", label: "A city in motion", icon: "M" }
        : { ...themes[themeIndex], icon: city.name.slice(0, 1) };
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
    <article className="city-profile-card flex h-full min-w-0 flex-col overflow-hidden rounded-[1.35rem] border border-[#d9dfe7] bg-[#fffdf9] shadow-[0_8px_24px_-22px_rgba(38,53,72,.32)] transition-all hover:-translate-y-1 hover:border-[#c1cbd8] hover:shadow-[0_22px_42px_-28px_rgba(38,53,72,.34)]" style={{ "--city-accent": cityTheme.accent, "--city-soft": cityTheme.soft, "--city-wash": cityTheme.wash } as CSSProperties}>
      <div className="city-card-ribbon" />
      {city.heroImage ? (
        <div className="mb-5"><div className="city-image-frame relative h-44 overflow-hidden bg-[#27364c]">
          <Image src={city.heroImage.url} alt={`${city.name} city view`} fill unoptimized sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 33vw" className="object-cover" />
          <div className="city-image-wash" />
          <span className="city-image-tag"><Sparkles className="h-3.5 w-3.5" /> {cityTheme.label}</span>
        </div><PhotoCredit photo={city.heroImage} /></div>
      ) : <div className="city-color-header"><span>{cityTheme.icon}</span><small>{cityTheme.label}</small></div>}
      <div className="grid min-h-24 grid-cols-[minmax(0,1fr)_auto] items-start gap-4 px-6">
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
        {showFit ? <div className="city-fit-badge shrink-0 rounded-xl border px-3 py-2 text-right text-[var(--ink)]">
          <p className="text-xs font-medium">Model fit</p>
          <p className="text-2xl font-black tabular-nums">{city.migrationFit.toFixed(1)}</p>
          <p className="text-xs font-medium">{Math.round(city.recommendationCoverage * 100)}% profile coverage</p>
        </div> : null}
      </div>

      <details className="mx-6 mt-4 min-h-7 text-sm leading-6 text-[#57635d]"><summary className="cursor-pointer font-semibold">About this city</summary><p className="mt-2">{city.summary}</p></details>

      <div className="mx-6 mt-4 min-h-5">
        <DataProvenance provenance={city.dataProvenance} compact />
      </div>

      <div className="mt-4 hidden flex-wrap gap-2">
        {city.bestFor.map((item) => (
          <Badge key={item}>{item}</Badge>
        ))}
      </div>

      <details className="mx-6 mt-5 rounded-2xl border border-[#dce1e8] bg-[#eff1f5] p-3">
        <summary className="cursor-pointer py-1 text-sm font-semibold text-[var(--accent)]">View fit breakdown</summary>
        <div className="mt-4 grid gap-3 pb-2">
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

      <div className="mx-6 mt-5 grid flex-1 grid-cols-2 content-start gap-3 text-sm text-[#57635d]">
        <div className="city-metric-card min-h-56 rounded-xl border p-4">
          <WalletCards className="metric-icon mb-3 h-5 w-5" />
          <LivingCostFact city={city} compact />
        </div>
        <div className="city-metric-card min-h-56 rounded-xl border p-4">
          <Users className="metric-icon mb-3 h-5 w-5" />
          <PopulationFact city={city} compact />
        </div>
        <div className="city-metric-card col-span-2 min-h-48 rounded-xl border p-4">
          <div className="mb-3 flex items-center gap-2"><Landmark className="metric-icon h-5 w-5" /><span className="metric-caption">WORK PATHS</span></div>
          <p className="font-semibold text-[#17201d]">
            Work paths: {city.sponsorDensity}
          </p>
          {city.localFacts ? <div className="mt-3"><LocalFactContent fact={city.localFacts.migration} compact /></div> : <p>Residents born abroad: {city.foreignBornShare}</p>}
        </div>
      </div>

      <Button asChild variant="outline" className="city-explore-button mx-6 mb-6 mt-5 w-auto rounded-xl border font-semibold">
        <Link href={`/city/${city.slug}`}>
          Explore {city.name}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </article>
  );
}

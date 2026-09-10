import Link from "next/link";
import type { CSSProperties } from "react";
import { PhotoCredit } from "@/components/city/photo-credit";
import { PopulationFact } from "@/components/city/population-fact";
import { notFound } from "next/navigation";
import {
  ArrowRightLeft,
  Building2,
  Landmark,
  MapPin,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";
import { SignalList } from "@/components/city/signal-list";
import { RelocationContext } from "@/components/city/relocation-context";
import { LocalFactContent } from "@/components/city/local-fact";
import { LivingCostFact } from "@/components/city/living-cost-fact";
import { InternetFact } from "@/components/city/internet-fact";
import { DataProvenance } from "@/components/city/data-provenance";
import { SaveCityButton } from "@/components/city/save-city-button";
import { PrivateCityDraft } from "@/components/city/submission-forms";
import { CommunityReviews } from "@/components/city/community-reviews";
import { UpcomingEvents } from "@/components/city/upcoming-events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cities, getCity } from "@/lib/data";



export function generateStaticParams() {
  return cities.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = getCity(slug);

  return {
    title: city ? city.name : "City",
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = getCity(slug);

  if (!city) {
    notFound();
  }

  const compareRight = city.slug === "new-york-city" ? "seattle" : "new-york-city";
  const cityMigrationSource = city.dataProvenance.sources.find((source) => source.metrics.includes("Foreign-born share"));
  const theme = getCityTheme(city.slug, city.name);
  const themeStyle = { "--accent": theme.accent, "--accent-soft": theme.soft, "--city-accent": theme.accent, "--city-soft": theme.soft, "--city-wash": theme.wash, "--ink": theme.accent } as CSSProperties;

  return (
    <main className="city-detail-theme mx-auto grid w-full max-w-7xl gap-8 px-4 pb-16 pt-5 sm:gap-10 sm:px-6 lg:px-8" style={themeStyle}>
      <section className="city-detail-hero overflow-hidden rounded-3xl border border-[var(--city-accent)] bg-[var(--city-wash)] shadow-sm">
        <div className="grid md:grid-cols-[1fr_1.15fr]">
          <div className="order-2 flex flex-col justify-center p-6 sm:p-9 md:order-1">
            <p className="flex items-center gap-2 text-sm font-medium text-[var(--muted)]"><MapPin className="h-4 w-4" aria-hidden="true" />{[...new Set([city.state, city.country])].join(", ")}</p>
            <h1 className="mt-4 break-words text-4xl font-bold tracking-tight sm:text-6xl">{city.name}</h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-[var(--muted)]">Get to know the everyday costs, opportunities and people behind your next possible home.</p>
            <div className="mt-5 flex flex-wrap gap-2">{city.bestFor.map(item => <span key={item} className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium">{item}</span>)}</div>
            <p className="mt-2 text-xs text-[var(--muted)]">Editorial highlights · explore the evidence below</p>
            <div className="mt-7 flex flex-wrap items-start gap-3"><SaveCityButton citySlug={city.slug} cityName={city.name} /><Button asChild variant="outline"><Link href={`/compare?left=${city.slug}&right=${compareRight}`}><ArrowRightLeft className="h-4 w-4" aria-hidden="true" />Compare city</Link></Button></div>
          </div>
          <div className="flex flex-col md:order-2"><div role="img" aria-label={`Cityscape of ${city.name}`} className="city-detail-image min-h-64 flex-1 bg-[var(--accent-soft)] bg-cover bg-center sm:min-h-80 md:min-h-[390px]" style={city.heroImage ? { backgroundImage: `url("${city.heroImage.url}")` } : undefined} />{city.heroImage && <PhotoCredit photo={city.heroImage} />}</div>
        </div>
        <nav aria-label="City sections" className="flex flex-wrap gap-x-6 gap-y-3 border-t border-[var(--border)] bg-[var(--surface-soft)] px-6 py-4 text-sm font-semibold text-[var(--accent)]">
          <a href="#overview">At a glance</a><a href="#daily-life">Daily life</a><a href="#events">Upcoming events</a><a href="#community">Residents’ reviews</a><a href="#city-data">Data & sources</a>
        </nav>
      </section>
      <section id="overview" className="city-overview scroll-mt-24" aria-label="City at a glance">
        <div className="city-detail-metric min-w-0 bg-white p-5 sm:p-6"><Users className="mb-3 h-5 w-5 text-[var(--accent)]" aria-hidden="true" /><PopulationFact city={city} /></div>
        <div className="city-detail-metric min-w-0 bg-white p-5 sm:p-6"><WalletCards className="mb-3 h-5 w-5 text-[var(--accent)]" aria-hidden="true" /><LivingCostFact city={city} /></div>
        <InternetFact slug={city.slug} context={city.internetQuality} />
        <Metric icon={Landmark} label="Work permission" value="Check eligibility" note="Depends on your status and route" />
        {city.localFacts ? <div className="city-detail-metric min-w-0 bg-white p-5 sm:p-6"><ShieldCheck className="mb-3 h-5 w-5 text-[var(--accent)]" aria-hidden="true" /><LocalFactContent fact={city.localFacts.migration} /></div> : <Metric icon={ShieldCheck} label="Residents born abroad" value={city.foreignBornShare} note={cityMigrationSource?.period} />}
        <Metric icon={Building2} label="Profile coverage" value={`${Math.round(city.recommendationCoverage * 100)}%`} />
      </section>
      <div id="city-data" className="scroll-mt-24"><DataProvenance provenance={city.dataProvenance} /></div>
      {city.migrationSignals.length > 0 ? (
        <section className="grid gap-4">
          <SectionHeader
            eyebrow="Making the move"
            title="Work & relocation"
            action="Facts & eligibility checks · not scored"
          />
          <RelocationContext city={city} />
        </section>
      ) : null}

      <section id="daily-life" className="mx-auto grid w-full max-w-7xl scroll-mt-24 gap-5">
        <SectionHeader
          eyebrow="Living here"
          title="Everyday life"
          action="Model scores · 0–10"
        />
        <SignalList signals={city.signals} />
      </section>

      <UpcomingEvents slug={city.slug} />
      <CommunityReviews slug={city.slug} name={city.name} />
      <PrivateCityDraft citySlug={city.slug} />
    </main>
  );
}

function getCityTheme(slug: string, name: string) {
  const themes = [
    { accent: "#c85f4c", soft: "#fff0eb", wash: "#fff8f4" },
    { accent: "#6574b8", soft: "#eef0ff", wash: "#f8f8ff" },
    { accent: "#4f70c9", soft: "#e9eeff", wash: "#f7f8ff" },
    { accent: "#bc7440", soft: "#fff1e4", wash: "#fff9f1" },
    { accent: "#9b5fa7", soft: "#f7edfa", wash: "#fcf7fd" },
    { accent: "#347e9e", soft: "#e8f3f8", wash: "#f4fbfd" },
  ];
  const index = [...slug].reduce((sum, character) => sum + character.charCodeAt(0), 0) % themes.length;
  if (slug.includes("london")) return themes[0];
  if (slug.includes("edinburgh")) return themes[1];
  if (slug.includes("manchester")) return themes[2];
  return { ...themes[index], name };
}

function Metric({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="city-detail-metric min-w-0 bg-white p-5 sm:p-6">
      <Icon className="mb-3 h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-2 break-words text-base font-semibold leading-relaxed text-[var(--foreground)]">{value}</p>
      {note ? <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{note}</p> : null}
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action: string;
}) {
  return (
    <div className="city-detail-section-heading flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border)] pb-4">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.12em] text-[#d2664f]">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">{title}</h2>
      </div>
      <Badge>{action}</Badge>
    </div>
  );
}

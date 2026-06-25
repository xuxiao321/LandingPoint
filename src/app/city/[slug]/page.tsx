import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRightLeft,
  Building2,
  Check,
  Globe2,
  Landmark,
  MessageSquarePlus,
  ShieldCheck,
  Users,
  WalletCards,
  Wifi,
} from "lucide-react";
import { SignalList } from "@/components/city/signal-list";
import { SaveCityButton } from "@/components/city/save-city-button";
import {
  ExperienceSubmission,
  LocalSignalSubmission,
} from "@/components/city/submission-forms";
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

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 rounded-lg border border-[#d7ded4] bg-white p-5 shadow-sm lg:grid-cols-[1fr_auto] lg:p-7">
        <div className="grid gap-5">
          <div>
            <div className="flex flex-wrap gap-2">
              {city.bestFor.map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
            <h1 className="mt-4 text-5xl font-black text-[#17201d] sm:text-6xl">
              {city.name}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-[#57635d]">
              <Globe2 className="h-5 w-5" aria-hidden="true" />
              {city.state}, {city.country}
            </p>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#57635d]">
              {city.summary}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <Metric icon={Users} label="Population" value={city.population} />
            <Metric
              icon={WalletCards}
              label="Living Cost"
              value={`${city.monthlyCost}/mo`}
            />
            <Metric icon={Wifi} label="Internet" value={city.internetQuality} />
            <Metric
              icon={Landmark}
              label="Sponsors"
              value={city.sponsorDensity}
            />
            <Metric
              icon={ShieldCheck}
              label="Foreign Born"
              value={city.foreignBornShare}
            />
            <Metric
              icon={Building2}
              label="Migration Fit"
              value={city.migrationFit.toFixed(1)}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-3 lg:grid lg:min-w-44">
          <SaveCityButton citySlug={city.slug} cityName={city.name} />
          <Button asChild variant="outline">
            <Link href={`/compare?left=${city.slug}&right=${compareRight}`}>
              <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
              Compare City
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4">
        <SectionHeader
          eyebrow="Module 1"
          title="Migration Signals"
          action={`Data confidence: ${city.dataConfidence}`}
        />
        <SignalList signals={city.migrationSignals} />
        <div className="rounded-lg border border-[#d7ded4] bg-white p-4 shadow-sm">
          <p className="text-sm font-black uppercase text-[#008a7a]">
            Data Sources
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {city.dataSources.map((source) => (
              <Badge key={source}>{source}</Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        <SectionHeader
          eyebrow="Module 2"
          title="City Signals"
          action="0-10 living fit"
        />
        <SignalList signals={city.signals} />
      </section>

      <section className="grid gap-4">
        <SectionHeader
          eyebrow="Module 3"
          title="Real Experiences"
          action="Migration experience database"
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {city.experiences.map((experience) => (
            <article
              key={experience.user}
              className="rounded-lg border border-[#d7ded4] bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-md bg-[#17201d] text-sm font-black text-white">
                  {experience.avatar}
                </div>
                <div>
                  <p className="text-lg font-black text-[#17201d]">
                    {experience.user}
                  </p>
                  <p className="text-sm font-semibold text-[#57635d]">
                    {experience.duration}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <ListBlock title="Pros" items={experience.pros} />
                <ListBlock title="Cons" items={experience.cons} />
              </div>

              <p className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#e5f5ef] px-3 py-2 text-sm font-bold text-[#007365]">
                <Check className="h-4 w-4" aria-hidden="true" />
                Would Recommend: {experience.recommend ? "Yes" : "No"}
              </p>
            </article>
          ))}
        </div>
        <ExperienceSubmission />
      </section>

      <section className="grid gap-4">
        <SectionHeader
          eyebrow="Module 4"
          title="Local Signals"
          action={`${city.localSignals.submittedBy} local residents`}
        />
        <div className="grid gap-3 sm:grid-cols-4">
          <TrendTile label="Rent Trend" value={city.localSignals.rentTrend} />
          <TrendTile label="Safety Trend" value={city.localSignals.safetyTrend} />
          <TrendTile
            label="Traffic Trend"
            value={city.localSignals.trafficTrend}
          />
          <TrendTile
            label="Cost Of Living Trend"
            value={city.localSignals.costOfLivingTrend}
          />
        </div>
        <LocalSignalSubmission />
      </section>

      <section className="grid gap-4">
        <SectionHeader
          eyebrow="Module 5"
          title="People Like You"
          action="Similar user choices"
        />
        <div className="rounded-lg border border-[#d7ded4] bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold uppercase text-[#6d7872]">
                <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
                {city.peopleLikeYou.segment}
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#17201d]">
                Average Budget: {city.peopleLikeYou.averageBudget}
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {city.peopleLikeYou.topChoices.map((choice) => (
                <div
                  key={choice}
                  className="rounded-md border border-[#d7ded4] bg-[#f7f8f3] p-4"
                >
                  <p className="text-xs font-bold uppercase text-[#6d7872]">
                    Top Choice
                  </p>
                  <p className="mt-1 text-xl font-black text-[#17201d]">
                    {choice}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md bg-[#f2f5f0] p-4">
      <Icon className="mb-3 h-5 w-5 text-[#008a7a]" aria-hidden="true" />
      <p className="text-xs font-bold uppercase text-[#6d7872]">{label}</p>
      <p className="mt-1 text-xl font-black text-[#17201d]">{value}</p>
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
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-sm font-black uppercase text-[#008a7a]">{eyebrow}</p>
        <h2 className="mt-1 text-3xl font-black text-[#17201d]">{title}</h2>
      </div>
      <Badge>{action}</Badge>
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="font-black text-[#17201d]">{title}:</p>
      <ul className="mt-2 grid gap-2">
        {items.map((item) => (
          <li key={item} className="text-sm text-[#57635d]">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TrendTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#d7ded4] bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase text-[#6d7872]">{label}</p>
      <p className="mt-2 text-2xl font-black text-[#17201d]">{value}</p>
    </div>
  );
}

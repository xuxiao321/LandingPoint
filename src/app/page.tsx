import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Database, Heart, Landmark, Users } from "lucide-react";
import { HomeSearch } from "@/components/home-search";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { topMatches } from "@/lib/data";

const valueProps = [
  { label: "Visa sponsor density", icon: Landmark },
  { label: "Job market signals", icon: BriefcaseBusiness },
  { label: "Public data sources", icon: Database },
  { label: "Real migration experience", icon: Users },
  { label: "Saved city loop", icon: Heart },
];

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <div className="grid gap-6">
          <div className="flex flex-wrap gap-2">
            {valueProps.map(({ label, icon: Icon }) => (
              <Badge key={label} className="gap-1.5">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
              </Badge>
            ))}
          </div>

          <div className="grid gap-4">
            <h1 className="max-w-3xl text-5xl font-black leading-[1.04] text-[#17201d] sm:text-6xl">
              Where Should You Live Next?
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[#57635d]">
              Compare US cities by sponsorship density, job fit, immigrant
              community, rent pressure, safety, schools, and real relocation
              experience.
            </p>
          </div>

          <HomeSearch />
        </div>

        <div className="grid gap-4">
          <div className="overflow-hidden rounded-lg border border-[#d7ded4] bg-white shadow-sm">
            <Image
              src="/landingpoint-map.png"
              alt="LandingPoint map with migration fit markers"
              width={1600}
              height={1000}
              priority
              className="h-full min-h-[360px] w-full object-cover"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {topMatches.map((city) => (
              <Link
                key={city.slug}
                href={`/city/${city.slug}`}
                className="rounded-lg border border-[#d7ded4] bg-white p-4 shadow-sm transition hover:border-[#008a7a]"
              >
                <p className="text-sm font-bold text-[#57635d]">
                  Migration Fit: {city.migrationFit.toFixed(1)}
                </p>
                <p className="mt-1 text-xl font-black text-[#17201d]">
                  {city.name}
                </p>
                <p className="text-sm text-[#57635d]">
                  {city.state} / Sponsors: {city.sponsorDensity}
                </p>
              </Link>
            ))}
          </div>

          <Button asChild variant="outline" className="justify-self-start">
            <Link href="/recommendations">
              View Migration Matches
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

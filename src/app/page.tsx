import Image from "next/image";
import { PhotoCredit } from "@/components/city/photo-credit";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomeSearch } from "@/components/home-search";
import { CityQuickSearch } from "@/components/city-quick-search";
import { cities, topMatches } from "@/lib/data";

export default function Home() {
  return (
    <main className="home-backdrop">
      <div className="home-backdrop-grid" aria-hidden="true" />
      <section className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl content-start items-start gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:px-8">
        <div className="home-intro grid gap-6 lg:col-span-2">
          <div className="home-kicker"><span className="home-kicker-dot" />A clearer way to choose your next city</div>
          <div className="grid gap-4">
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.12] tracking-[-0.035em] text-[#17201d] sm:text-5xl">
              Find the place that feels <em>right.</em>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[#57635d]">
              A calm, evidence-led way to compare cities by budget, opportunity, and the details that shape everyday life.
            </p>
            <CityQuickSearch cities={cities.map(({ slug, name, state, country }) => ({ slug, name, state, country }))} />
          </div>
        </div>
        <HomeSearch />
        <section aria-labelledby="destinations-heading" className="min-w-0 rounded-3xl border border-white/80 bg-white/75 p-4 shadow-[0_12px_40px_-24px_rgba(18,62,52,.2)] sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <h2 id="destinations-heading" className="text-lg font-semibold tracking-tight">Somewhere new starts here</h2>
            <span className="text-sm text-[var(--muted)]">{cities.length} cities to explore</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {topMatches.map((city, index) => (
              <div
                key={city.slug}
                className={`group min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-white transition-colors hover:border-[var(--accent)] ${index === 0 ? "col-span-2" : ""}`}
              >
                <Link href={`/city/${city.slug}`}>
                <div className={`relative overflow-hidden bg-[var(--surface-soft)] ${index === 0 ? "aspect-[16/9]" : "aspect-[3/2]"}`}>
                  {city.heroImage ? <Image src={city.heroImage.url} alt={`${city.name} skyline`} fill unoptimized priority={index === 0} sizes={index === 0 ? "(min-width: 1024px) 560px, 90vw" : "(min-width: 1024px) 270px, 44vw"} className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]" /> : null}
                </div>
                <div className="flex items-center justify-between gap-2 p-3 sm:p-4">
                  <div className="min-w-0">
                    <h3 className={`${index === 0 ? "text-2xl" : "text-lg"} font-semibold tracking-tight text-[var(--foreground)]`}>{city.name}</h3>
                    <p className="mt-0.5 text-sm text-[var(--muted)]">{city.country}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[var(--accent)] transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
                </div>
                </Link>
                {city.heroImage && <PhotoCredit photo={city.heroImage} />}
              </div>
            ))}
          </div>
          <Link href="/recommendations" className="mt-5 flex min-h-11 items-center justify-between gap-3 rounded-lg px-1 text-sm font-semibold text-[var(--accent)] hover:underline underline-offset-4">
            Explore all {cities.length} cities<ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>
      </section>
    </main>
  );
}

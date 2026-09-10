import { CompareTool } from "@/components/compare-tool";
import { cities } from "@/lib/data";

type SearchParams = Record<string, string | string[] | undefined>;

function readParam(params: SearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export const metadata = {
  title: "Compare",
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = (await searchParams) ?? {};
  const leftSlug = readParam(params, "left") ?? "new-york-city";
  const rightSlug = readParam(params, "right") ?? "seattle";
  const leftCity = cities.find((city) => city.slug === leftSlug) ?? cities[0];
  const rightCity = cities.find((city) => city.slug === rightSlug) ?? cities[1];

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <p className="text-sm font-black uppercase text-[#d2664f]">
          City comparison
        </p>
        <h1 className="mt-2 text-4xl font-black text-[#17201d] sm:text-5xl">
          {leftCity.name} vs {rightCity.name}
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-8 text-[#57635d]">
          Compare sponsor density, visa friendliness, job market fit,
          immigrant community, transit, rent pressure, safety, and schools.
        </p>
      </section>

      <CompareTool
        initialLeft={leftCity.slug}
        initialRight={rightCity.slug}
      />
    </main>
  );
}

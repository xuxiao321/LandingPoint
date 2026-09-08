"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/field";

type SearchCity = {
  slug: string;
  name: string;
  state: string;
  country: string;
};

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export function CityQuickSearch({ cities }: { cities: SearchCity[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const matches = useMemo(() => {
    const needle = normalize(query);
    if (!needle) return [];
    return cities
      .filter((city) => normalize(`${city.name} ${city.state} ${city.country}`).includes(needle))
      .sort((a, b) => {
        const aStarts = normalize(a.name).startsWith(needle) ? 0 : 1;
        const bStarts = normalize(b.name).startsWith(needle) ? 0 : 1;
        return aStarts - bStarts || a.name.localeCompare(b.name);
      })
      .slice(0, 6);
  }, [cities, query]);

  function visit(slug: string) {
    setOpen(false);
    router.push(`/city/${slug}`);
  }

  return (
    <div className="relative max-w-2xl">
      <label htmlFor="city-quick-search" className="mb-2 block text-sm font-semibold text-[var(--foreground)]">Already have a city in mind?</label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted)]" aria-hidden="true" />
        <Input
          id="city-quick-search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="city-search-results"
          value={query}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && matches[0]) { event.preventDefault(); visit(matches[0].slug); }
            if (event.key === "Escape") setOpen(false);
          }}
          placeholder="Search London, Toronto, Tokyo…"
          className="h-14 rounded-2xl border-white bg-white/90 pl-12 pr-4 text-base shadow-[0_12px_35px_-20px_rgba(18,62,52,.35)]"
        />
      </div>
      {open && query ? (
        <div id="city-search-results" role="listbox" className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-1.5 shadow-xl">
          {matches.length ? matches.map((city) => (
            <button
              key={city.slug}
              type="button"
              role="option"
              aria-selected="false"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => visit(city.slug)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-[var(--surface-soft)] focus-visible:bg-[var(--surface-soft)]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]"><MapPin className="h-4 w-4" aria-hidden="true" /></span>
              <span className="min-w-0 flex-1"><span className="block font-semibold text-[var(--foreground)]">{city.name}</span><span className="block truncate text-xs text-[var(--muted)]">{[...new Set([city.state, city.country])].join(", ")}</span></span>
              <ArrowRight className="h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
            </button>
          )) : <p className="px-4 py-4 text-sm text-[var(--muted)]">No city found in the current {cities.length}-city catalog.</p>}
        </div>
      ) : null}
    </div>
  );
}

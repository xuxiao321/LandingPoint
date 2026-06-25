"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cities } from "@/lib/data";

const storageKey = "landingpoint.savedCities";

export function ProfileSavedCities() {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      setSavedSlugs(
        JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as string[],
      );
    } catch {
      setSavedSlugs([]);
    }
  }, []);

  const savedCities = cities.filter((city) => savedSlugs.includes(city.slug));

  if (savedCities.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[#cfd7cd] bg-white p-5 text-[#57635d]">
        <Bookmark className="mb-3 h-5 w-5 text-[#008a7a]" aria-hidden="true" />
        <p className="font-semibold text-[#17201d]">No saved cities yet.</p>
        <p className="mt-1 text-sm">Use Save City on a city page.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {savedCities.map((city) => (
        <div
          key={city.slug}
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#d7ded4] bg-white p-4 shadow-sm"
        >
          <div>
            <p className="text-lg font-black text-[#17201d]">{city.name}</p>
            <p className="text-sm font-medium text-[#57635d]">
              {city.state} / Migration fit {city.migrationFit.toFixed(1)}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/city/${city.slug}`}>
              Open
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const storageKey = "landingpoint.savedCities";

function readSavedCities() {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  try {
    return JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as string[];
  } catch {
    return [] as string[];
  }
}

export function SaveCityButton({
  citySlug,
  cityName,
}: {
  citySlug: string;
  cityName: string;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(readSavedCities().includes(citySlug));
  }, [citySlug]);

  function toggleSaved() {
    const savedCities = readSavedCities();
    const next = saved
      ? savedCities.filter((slug) => slug !== citySlug)
      : Array.from(new Set([...savedCities, citySlug]));

    window.localStorage.setItem(storageKey, JSON.stringify(next));
    setSaved(!saved);
  }

  return (
    <Button
      type="button"
      variant={saved ? "accent" : "outline"}
      onClick={toggleSaved}
      aria-pressed={saved}
      aria-label={`${saved ? "Remove" : "Save"} ${cityName}`}
    >
      <Heart
        className="h-4 w-4"
        fill={saved ? "currentColor" : "none"}
        aria-hidden="true"
      />
      {saved ? "Saved" : "Save City"}
    </Button>
  );
}

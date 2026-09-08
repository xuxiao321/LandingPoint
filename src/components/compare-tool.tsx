"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LivingCostFact } from "@/components/city/living-cost-fact";
import { Label, Select } from "@/components/ui/field";
import {
  cities,
  compareMetricKeys,
  scoreToPercent,
  signalLabels,
} from "@/lib/data";

export function CompareTool({
  initialLeft = "new-york-city",
  initialRight = "seattle",
}: {
  initialLeft?: string;
  initialRight?: string;
}) {
  const [leftSlug, setLeftSlug] = useState(initialLeft);
  const [rightSlug, setRightSlug] = useState(initialRight);

  const leftCity = useMemo(
    () => cities.find((city) => city.slug === leftSlug) ?? cities[0],
    [leftSlug],
  );
  const rightCity = useMemo(
    () => cities.find((city) => city.slug === rightSlug) ?? cities[1],
    [rightSlug],
  );

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 rounded-lg border border-[var(--border)] bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <div className="grid gap-2">
          <Label htmlFor="leftCity">First City</Label>
          <Select
            id="leftCity"
            value={leftCity.slug}
            onChange={(event) => setLeftSlug(event.target.value)}
          >
            {cities.map((city) => (
              <option key={city.slug} value={city.slug}>
                {city.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="hidden h-11 w-11 place-items-center rounded-md bg-[#eef3ef] text-[var(--accent)] sm:grid">
          <GitCompare className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="rightCity">Second City</Label>
          <Select
            id="rightCity"
            value={rightCity.slug}
            onChange={(event) => setRightSlug(event.target.value)}
          >
            {cities.map((city) => (
              <option key={city.slug} value={city.slug}>
                {city.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <section className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-sm lg:p-6">
        <div className="grid gap-4 border-b border-[#e4e9e1] pb-5 sm:grid-cols-2">
          {[leftCity, rightCity].map((city) => (
            <div key={city.slug}>
              <p className="text-sm font-bold uppercase text-[#6d7872]">
                {city.country}
              </p>
              <h2 className="mt-1 text-3xl font-black text-[#17201d]">
                {city.name}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold text-[#57635d]">
                <LivingCostFact city={city} />
                <span>{city.sponsorDensity}</span>
                <span>
                  {Math.round(city.recommendationCoverage * 100)}% profile coverage
                </span>
              </div>
              <p className="mt-2 text-xs font-semibold text-[#917e1c]">
                {city.dataProvenance.status === "demo"
                  ? "Prototype estimates"
                  : "Official observations + LandingPoint-derived scores"}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-5">
          {compareMetricKeys.map((key) => {
            const leftScore = leftCity.scores[key];
            const rightScore = rightCity.scores[key];
            const leftAvailable = leftCity.sourceBackedScoreKeys.includes(key);
            const rightAvailable = rightCity.sourceBackedScoreKeys.includes(key);

            return (
              <div key={key} className="grid gap-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-[#17201d]">
                    {signalLabels[key]}
                  </p>
                  <p className="text-sm font-semibold text-[#57635d]">
                    {leftAvailable ? leftScore.toFixed(1) : "N/A"} vs{" "}
                    {rightAvailable ? rightScore.toFixed(1) : "N/A"}
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="h-3 overflow-hidden rounded-md bg-[var(--surface-soft)]">
                    <div
                      className="h-full rounded-md bg-[var(--accent)]"
                      style={{ width: leftAvailable ? scoreToPercent(leftScore) : "0%" }}
                    />
                  </div>
                  <div className="h-3 overflow-hidden rounded-md bg-[var(--surface-soft)]">
                    <div
                      className="h-full rounded-md bg-[#526782]"
                      style={{ width: rightAvailable ? scoreToPercent(rightScore) : "0%" }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href={`/city/${leftCity.slug}`}>
              Open {leftCity.name}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/city/${rightCity.slug}`}>
              Open {rightCity.name}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

import { CircleHelp } from "lucide-react";
import type { City } from "@/lib/data";

export function LivingCostFact({
  city,
  compact = false,
}: {
  city: City;
  compact?: boolean;
}) {
  const observation = city.livingCost;

  if (!observation) {
    return (
      <div className="min-w-0">
        <p className="text-sm text-[var(--muted)]">Monthly living cost</p>
        <p className="mt-2 text-sm font-medium">Comparable data not yet available</p>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <p className="text-sm text-[var(--muted)]">Estimated monthly living cost</p>
      <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
        USD {observation.monthlyUsd.toLocaleString("en-US")}<span className="text-sm font-normal text-[var(--muted)]"> / month</span>
      </p>
      <p className="mt-1 text-xs leading-5 text-[var(--muted)]">One person · includes housing and everyday expenses</p>
      {!compact ? (
        <details className="mt-3 text-sm leading-6 text-[var(--muted)]">
          <summary className="flex cursor-pointer items-center gap-1.5 text-[var(--accent)]">
            <CircleHelp className="h-4 w-4" aria-hidden="true" />How this is calculated
          </summary>
          <dl className="mt-2 grid gap-2">
            <div><dt className="font-medium text-[var(--foreground)]">Includes</dt><dd>Rent and utilities, food, and local transport</dd></div>
            <div><dt className="font-medium text-[var(--foreground)]">Data date</dt><dd>{observation.period}</dd></div>
            <div><dt className="font-medium text-[var(--foreground)]">Method</dt><dd>{observation.methodology}</dd></div>
          </dl>
          <a href={observation.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block underline underline-offset-4">View source</a>
          <p className="mt-3 text-xs">This is a directional estimate for a moderate lifestyle, not a guaranteed personal budget.</p>
        </details>
      ) : null}
    </div>
  );
}

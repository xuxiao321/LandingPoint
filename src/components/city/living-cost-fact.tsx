import { CircleHelp } from "lucide-react";
import type { City } from "@/lib/data";

export function LivingCostFact({
  city,
  compact = false,
}: {
  city: City;
  compact?: boolean;
}) {
  const signal = city.signals.find((item) => item.key === "costOfLiving");
  const available = city.sourceBackedScoreKeys.includes("costOfLiving");

  if (!signal || !available) {
    return (
      <div className="min-w-0">
        <p className="text-sm text-[var(--muted)]">Living cost affordability</p>
        <p className="mt-2 text-sm font-medium">Comparable data not yet available</p>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <p className="text-sm text-[var(--muted)]">Living cost affordability</p>
      <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
        {signal.score.toFixed(1)}<span className="text-sm font-normal text-[var(--muted)]"> / 10</span>
      </p>
      <p className="mt-1 text-xs leading-5 text-[var(--muted)]">Higher means more affordable relative to the cities in this catalog.</p>
      {!compact ? (
        <details className="mt-3 text-sm leading-6 text-[var(--muted)]">
          <summary className="flex cursor-pointer items-center gap-1.5 text-[var(--accent)]">
            <CircleHelp className="h-4 w-4" aria-hidden="true" />How this is calculated
          </summary>
          <dl className="mt-2 grid gap-2">
            {signal.detailRows.map((row) => (
              <div key={`${row.label}-${row.value}`}>
                <dt className="font-medium text-[var(--foreground)]">{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs">This is a comparative affordability signal, not a personal monthly budget or a quoted rent.</p>
        </details>
      ) : null}
    </div>
  );
}

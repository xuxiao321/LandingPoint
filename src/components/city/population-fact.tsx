import type { City } from "@/lib/data";

export function PopulationFact({ city, compact = false }: { city: City; compact?: boolean }) {
  const fact = city.populationObservation;
  return <div className="min-w-0">
    <p className="text-sm text-[var(--muted)]">Population</p>
    <p className="mt-1 text-xl font-semibold tabular-nums text-[var(--foreground)]">{city.population}</p>
    {fact && <>
      <p className={`mt-2 text-xs leading-5 text-[var(--muted)] ${compact ? "line-clamp-2 min-h-10" : ""}`}>{fact.geography} · {fact.period}</p>
      <details className="mt-2 text-xs leading-5 text-[var(--muted)]">
        <summary className="cursor-pointer font-medium text-[var(--accent)]">Source & definition</summary>
        <p className="mt-2">{fact.kind}: {fact.kind === "Rounded estimate" ? "approximately " : ""}{fact.value.toLocaleString("en-US")} people. {fact.note}</p>
        <a className="mt-2 inline-block underline underline-offset-2" href={fact.sourceUrl} target="_blank" rel="noreferrer">View population source</a>
        <p>Source checked {fact.reviewedAt}</p>
      </details>
    </>}
  </div>;
}

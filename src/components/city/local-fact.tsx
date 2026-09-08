import type { LocalFact } from "@/lib/data";
import { approximateUsd, exchangeRateDate } from "@/lib/currency";

export function LocalFactContent({
  fact,
  compact = false,
}: {
  fact: LocalFact;
  compact?: boolean;
}) {
  const usd = approximateUsd(fact.value);
  return (
    <div className="min-w-0">
      <p className="text-sm text-[var(--muted)]">{fact.label}</p>
      <p className="mt-2 break-words text-base font-semibold text-[var(--foreground)]">{fact.value}</p>
      {usd && <p className="mt-1 text-sm font-medium text-[var(--accent)]">{usd}</p>}
      <p className={`mt-2 text-xs leading-5 text-[var(--muted)] ${compact ? "line-clamp-2 min-h-10" : ""}`}>{fact.geography} · {fact.period}</p>
      <details className="mt-2 text-sm leading-6 text-[var(--muted)]">
        <summary className="cursor-pointer text-[var(--accent)]">What this covers</summary>
        <p className="mt-2">{fact.note}</p>
        {usd && <p className="mt-2 text-xs">USD estimate using rates dated {exchangeRateDate} (UTC), not the rent observation date. Fees excluded. <a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer" className="underline">Rates By Exchange Rate API</a></p>}
        <a href={fact.sourceUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block underline underline-offset-4">View source</a>
      </details>
    </div>
  );
}

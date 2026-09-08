import type { LocalFact } from "@/lib/data";
import { approximateUsd, exchangeRateDate } from "@/lib/currency";

export function LocalFactContent({
  fact,
  monthly = false,
  compact = false,
}: {
  fact: LocalFact;
  monthly?: boolean;
  compact?: boolean;
}) {
  const usd = approximateUsd(fact.value);
  const definition = monthly ? fact.rentDefinition : undefined;
  if (monthly && !definition?.primary) {
    return (
      <div className="min-w-0">
        <p className="text-sm text-[var(--muted)]">One-bedroom whole-property rent</p>
        <p className="mt-2 text-sm font-medium">Verified figure not yet available</p>
        <details className="mt-3 text-sm leading-6 text-[var(--muted)]">
          <summary className="cursor-pointer text-[var(--accent)]">Other housing reference</summary>
          <p className="mt-2 font-medium">{definition?.category ?? "Housing type not verified"}</p>
          <p>{definition?.evidence}</p>
          <p className="mt-2 font-semibold">{fact.value} / month</p>
          {usd && <p>{usd} / month</p>}
          <p className="mt-2">{fact.geography} · {fact.period}</p>
          <p className="mt-2">Not a comparable citywide one-bedroom rent. {fact.note}</p>
          <a href={fact.sourceUrl} target="_blank" rel="noreferrer" className="underline">View source</a>
          {usd && <p className="mt-2 text-xs">USD estimate: rates dated {exchangeRateDate} (UTC), not the rent observation date. Fees excluded. <a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer" className="underline">Rates By Exchange Rate API</a></p>}
        </details>
      </div>
    );
  }
  return (
    <div className="min-w-0">
      <p className="text-sm text-[var(--muted)]">{fact.label}</p>
      <p className="mt-2 break-words text-base font-semibold text-[var(--foreground)]">{fact.value}{monthly ? <span className="text-sm font-normal"> / month</span> : null}</p>
      {usd && <p className="mt-1 text-sm font-medium text-[var(--accent)]">{usd}{monthly ? " / month" : ""}</p>}
      {definition && !compact ? <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{definition.category}<br />{definition.evidence}</p> : null}
      <p className={`mt-2 text-xs leading-5 text-[var(--muted)] ${compact ? "line-clamp-2 min-h-10" : ""}`}>{fact.geography} · {fact.period}</p>
      <details className="mt-2 text-sm leading-6 text-[var(--muted)]">
        <summary className="cursor-pointer text-[var(--accent)]">What this covers</summary>
        {definition && compact ? <p className="mt-2"><span className="font-medium">{definition.category}</span><br />{definition.evidence}</p> : null}
        <p className="mt-2">{fact.note}</p>
        {usd && <p className="mt-2 text-xs">USD estimate using rates dated {exchangeRateDate} (UTC), not the rent observation date. Fees excluded. <a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer" className="underline">Rates By Exchange Rate API</a></p>}
        <a href={fact.sourceUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block underline underline-offset-4">View source</a>
      </details>
    </div>
  );
}

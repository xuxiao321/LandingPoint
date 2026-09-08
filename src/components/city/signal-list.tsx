import { ChevronDown } from "lucide-react";
import { ScoreBar } from "@/components/score-bar";
import type { SignalMetric } from "@/lib/data";

type DetailRow = SignalMetric["detailRows"][number];

const contextLabels = new Set(["geography", "area measured", "search area", "climate period", "indicator year", "reviewed"]);
const noteLabels = new Set(["includes", "how to read this", "caution", "important"]);
const technicalLabels = new Set(["source", "primary source", "method", "score method"]);
const transitLabels = ["Core-area map records", "Wider-area map records", "Core density", "Wider-area density"];

function SignalDetails({ signal }: { signal: SignalMetric }) {
  const values = new Map(signal.detailRows.map((row) => [row.label, row.value]));
  const hasTransitComparison = signal.key === "transit" && transitLabels.every((label) => values.has(label));
  const observations: DetailRow[] = [];
  const context: DetailRow[] = [];
  const notes: DetailRow[] = [];
  const technical: DetailRow[] = [];

  for (const row of signal.detailRows) {
    const label = row.label.toLowerCase();
    if (hasTransitComparison && transitLabels.includes(row.label)) continue;
    if (contextLabels.has(label)) context.push(row);
    else if (noteLabels.has(label)) notes.push(row);
    else if (technicalLabels.has(label)) technical.push(row);
    else observations.push(row);
  }

  return (
    <div className="mt-5 space-y-5 border-t border-[var(--border)] pt-5">
      {context.length > 0 ? <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm leading-6 text-[var(--muted)]">
        {context.map((row) => <div key={row.label} className="flex flex-wrap gap-x-2"><dt>{row.label}:</dt><dd>{row.value}</dd></div>)}
      </dl> : null}

      {hasTransitComparison ? (
        <table className="w-full table-fixed text-left text-sm leading-6">
          <caption className="pb-3 text-left text-base font-semibold text-[var(--foreground)]">Public transport around the city center</caption>
          <thead><tr className="border-b border-[var(--border)] text-[var(--muted)]">
            <th scope="col" className="w-[28%] py-3 pr-3 font-medium">Measure</th>
            <th scope="col" className="px-2 py-3 font-medium">Core area</th>
            <th scope="col" className="pl-2 py-3 font-medium">Wider area</th>
          </tr></thead>
          <tbody>
            <tr className="border-b border-[var(--border)]">
              <th scope="row" className="py-4 pr-3 font-normal text-[var(--muted)]">Mapped records</th>
              <td className="px-2 py-4 font-semibold tabular-nums">{values.get("Core-area map records")}</td>
              <td className="py-4 pl-2 font-semibold tabular-nums">{values.get("Wider-area map records")}</td>
            </tr>
            <tr>
              <th scope="row" className="py-4 pr-3 font-normal text-[var(--muted)]">Density</th>
              <td className="px-2 py-4 tabular-nums">{values.get("Core density")}</td>
              <td className="py-4 pl-2 tabular-nums">{values.get("Wider-area density")}</td>
            </tr>
          </tbody>
        </table>
      ) : null}

      {observations.length > 0 ? <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
        {observations.map((row) => <div key={row.label} className="min-w-0">
          <dt className="text-sm leading-6 text-[var(--muted)]">{row.label}</dt>
          <dd className="mt-1 break-words text-lg font-semibold leading-7 text-[var(--foreground)]">{row.value}</dd>
        </div>)}
      </dl> : null}

      {notes.length > 0 ? <div className="space-y-2 border-l-2 border-[var(--border)] pl-4 text-sm leading-6 text-[var(--muted)]">
        {notes.map((row) => <p key={row.label}>{row.label === "Includes" ? `Includes ${row.value.charAt(0).toLowerCase()}${row.value.slice(1)}.` : row.value}</p>)}
      </div> : null}

      {technical.length > 0 ? <details className="group/method border-t border-[var(--border)] pt-3">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-1 text-sm font-medium text-[var(--muted)]">Sources & calculation<ChevronDown size={16} aria-hidden="true" className="shrink-0 transition-transform group-open/method:rotate-180" /></summary>
        <dl className="mt-3 space-y-3 text-sm leading-6">
          {technical.map((row) => <div key={row.label} className="grid gap-1 sm:grid-cols-[8rem_1fr]"><dt className="text-[var(--muted)]">{row.label}</dt><dd className="break-words text-[var(--foreground)]">{row.value}</dd></div>)}
        </dl>
      </details> : null}
    </div>
  );
}

export function SignalList({ signals }: { signals: SignalMetric[] }) {
  return (
    <div className="grid gap-3">
      {signals.map((signal) => (
        <details
          key={signal.key}
          className="group/signal min-w-0 rounded-2xl border border-[var(--border)] bg-white p-4 sm:p-6"
        >
          <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <ScoreBar
              label={signal.label}
              score={signal.score}
            />
            <ChevronDown
              className="h-5 w-5 justify-self-end text-[var(--muted)] transition-transform group-open/signal:rotate-180"
              aria-hidden="true"
            />
          </summary>

          <SignalDetails signal={signal} />
        </details>
      ))}
    </div>
  );
}

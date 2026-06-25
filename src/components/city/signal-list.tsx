import { ChevronDown } from "lucide-react";
import { ScoreBar } from "@/components/score-bar";
import type { SignalMetric } from "@/lib/data";

const accents = ["#008a7a", "#f97316", "#2563eb", "#be4960", "#917e1c"];

export function SignalList({ signals }: { signals: SignalMetric[] }) {
  return (
    <div className="grid gap-3">
      {signals.map((signal, index) => (
        <details
          key={signal.key}
          className="group rounded-lg border border-[#d7ded4] bg-white p-4 shadow-sm"
        >
          <summary className="grid cursor-pointer list-none gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <ScoreBar
              label={signal.label}
              score={signal.score}
              accent={accents[index % accents.length]}
            />
            <ChevronDown
              className="h-5 w-5 justify-self-end text-[#57635d] transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>

          <div className="mt-4 grid gap-3 border-t border-[#e4e9e1] pt-4 sm:grid-cols-2">
            {signal.detailRows.map((row) => (
              <div key={row.label} className="rounded-md bg-[#f2f5f0] p-3">
                <p className="text-xs font-semibold uppercase text-[#6d7872]">
                  {row.label}
                </p>
                <p className="mt-1 text-base font-black text-[#17201d]">
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

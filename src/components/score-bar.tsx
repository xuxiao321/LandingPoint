import { scoreToPercent } from "@/lib/data";
import { ChevronDown } from "lucide-react";

export function ScoreBar({
  label,
  score,
  accent = "var(--accent)",
}: {
  label: string;
  score: number;
  accent?: string;
}) {
  return (
    <div className="score-row grid gap-2 rounded-2xl border border-[#d9e4df] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(25,55,46,.03)] sm:px-5">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-[var(--foreground)]">{label}</span>
        <span className="flex items-center gap-4 font-semibold tabular-nums text-[var(--muted)]"><span>{score.toFixed(1)}</span><ChevronDown className="h-4 w-4" aria-hidden="true" /></span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#e7ebf1]">
        <div
          className="h-full rounded-full"
          style={{ width: scoreToPercent(score), backgroundColor: accent }}
        />
      </div>
    </div>
  );
}

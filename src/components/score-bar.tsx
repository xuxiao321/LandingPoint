import { scoreToPercent } from "@/lib/data";

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
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-[var(--foreground)]">{label}</span>
        <span className="font-semibold tabular-nums text-[var(--muted)]">{score.toFixed(1)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-soft)]">
        <div
          className="h-full rounded-md"
          style={{ width: scoreToPercent(score), backgroundColor: accent }}
        />
      </div>
    </div>
  );
}

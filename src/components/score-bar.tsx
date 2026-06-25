import { scoreToPercent } from "@/lib/data";

export function ScoreBar({
  label,
  score,
  accent = "#008a7a",
}: {
  label: string;
  score: number;
  accent?: string;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-[#2d3934]">{label}</span>
        <span className="tabular-nums text-[#57635d]">{score.toFixed(1)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-md bg-[#dfe6dc]">
        <div
          className="h-full rounded-md"
          style={{ width: scoreToPercent(score), backgroundColor: accent }}
        />
      </div>
    </div>
  );
}

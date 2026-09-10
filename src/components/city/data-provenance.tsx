import { ChevronDown, CircleAlert, ExternalLink, ShieldCheck } from "lucide-react";
import type { CityDataProvenance } from "@/lib/data";
import { cn } from "@/lib/utils";

export function DataProvenance({
  provenance,
  compact = false,
}: {
  provenance: CityDataProvenance;
  compact?: boolean;
}) {
  const isDemo = provenance.status === "demo";
  const usesCensus = provenance.sources.some((source) =>
    source.name.toLowerCase().includes("census"),
  );
  const Icon = isDemo ? CircleAlert : ShieldCheck;

  if (compact) {
    return <p className="flex items-center gap-2 text-xs leading-5 text-[#617080]"><Icon size={15} className="shrink-0" aria-hidden="true" />{isDemo ? "Prototype estimates" : "Public data · model-derived scores"}</p>;
  }

  return (
    <details
      className={cn(
        "group rounded-xl border",
        isDemo
          ? "border-[#e8d7a5] bg-[#fff9e8] text-[#6f5715]"
          : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--muted)]",
      )}
    >
      <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2.5 rounded-xl px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] [&::-webkit-details-marker]:hidden">
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="font-semibold">{isDemo ? "Prototype data — review before use" : "Data & sources"}</span>
        <span className="text-xs">{provenance.sources.length} sources</span>
        <span className="ml-auto hidden text-xs sm:inline">View details</span>
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
        <div className="min-w-0 border-t border-[var(--border)] px-4 pb-4 pt-3">
          {!compact && provenance.sources.length > 0 ? (
            <div className="grid gap-x-6 sm:grid-cols-2">
              {provenance.sources.map((source) => (
                <a
                  key={`${source.name}-${source.period}`}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-w-0 items-start justify-between gap-3 rounded-md px-2 py-2.5 text-sm transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                >
                  <span className="min-w-0 break-words"><span className="font-medium">{source.name}</span><span className="mt-0.5 block text-xs leading-5 opacity-80">{source.period}{source.license ? ` · ${source.license}` : ""}</span></span>
                  <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </a>
              ))}
            </div>
          ) : null}
          <p className="mt-3 border-t border-[var(--border)] pt-3 text-xs leading-5">{provenance.notice}</p>
          {!compact && usesCensus ? (
            <p className="mt-3 text-xs leading-5 opacity-80">
              This product uses the Census Bureau Data API but is not endorsed
              or certified by the Census Bureau.
            </p>
          ) : null}
        </div>
    </details>
  );
}

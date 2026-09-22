import { Wifi } from "lucide-react";
import snapshot from "@/data/city-internet.json";
type InternetObservation = {
  download: number; upload: number; latency: number; samples: number;
  uploadSamples?: number; period?: string; sourceUrl?: string; source?: string;
  historical?: boolean; measurementDays?: number; geography?: string;
};

export function InternetFact({ slug }: { slug: string }) {
  const fact = (snapshot.cities as Record<string, InternetObservation>)[slug];
  return (
    <div className="city-detail-metric min-w-0 bg-white p-5 sm:p-6">
      <Wifi className="mb-3 h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
      <p className="text-sm text-[var(--muted)]">City internet speeds</p>
      {fact ? <>
        {fact.historical && <p className="mt-2 text-xs font-semibold text-[var(--accent)]">Historical measurements · {fact.period}</p>}
        {slug === "singapore" && <p className="mt-1 text-xs text-[var(--muted)]">Singapore-wide · city-state</p>}
        <p className="mt-2 text-lg font-bold">{fact.download.toFixed(1)} Mbps download</p>
        <p className="mt-1 text-sm text-[var(--muted)]">{fact.upload.toFixed(1)} Mbps upload · {fact.latency.toFixed(0)} ms latency</p>
        <details className="mt-3 text-sm text-[var(--muted)]">
          <summary className="cursor-pointer">Measurement details</summary>
          <p className="mt-2">{fact.samples.toLocaleString("en-US")} download tests · {fact.period ?? snapshot.period}</p>
          {fact.uploadSamples && <p className="mt-1">{fact.uploadSamples.toLocaleString("en-US")} upload tests</p>}
          {fact.measurementDays && <p className="mt-1">{fact.measurementDays} daily observations · {fact.geography}</p>}
          <p className="mt-2">Mean of daily median download, upload, and minimum round-trip latency measurements. Voluntary tests are located by IP address and may reflect ISP equipment locations. Speeds at a specific address are not guaranteed.</p>
          <a className="mt-2 inline-block underline" href={fact.sourceUrl ?? snapshot.sourceUrl} target="_blank" rel="noreferrer">{fact.source ?? snapshot.source} source</a>
        </details>
      </> : <>
        <p className="mt-2 font-semibold">City speed data not yet available</p>
        <p className="mt-2 text-sm text-[var(--muted)]">This city is excluded from internet-speed matching.</p>
      </>}
    </div>
  );
}

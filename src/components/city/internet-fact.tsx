import { Wifi } from "lucide-react";
import snapshot from "@/data/city-internet.json";
type InternetObservation = {
  download: number; upload: number; latency: number; samples: number;
  uploadSamples?: number; period?: string; sourceUrl?: string; source?: string;
  historical?: boolean; queryCity?: string; region?: string;
};

export function InternetFact({ slug, context }: { slug: string; context: string }) {
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
          <p className="mt-2">{fact.samples.toLocaleString("en-US")} {fact.historical ? "download tests" : "measurements"} · {fact.period ?? snapshot.period}</p>
          {fact.uploadSamples && <p className="mt-1">{fact.uploadSamples.toLocaleString("en-US")} upload tests</p>}
          <p className="mt-2">{fact.historical ? "Average of daily median download, upload and minimum round-trip latency. Historical reference, not current performance." : "Median download and upload; mean latency."} Voluntary tests located by IP address, which can reflect ISP equipment locations. Not guaranteed speeds at your address. Connection types are not separated. Not used in rankings.</p>
          <a className="mt-2 inline-block underline" href={fact.sourceUrl ?? `https://www.speedtown.net/api/aggregates?city=${encodeURIComponent(fact.queryCity ?? "")}&region=${fact.region}`} target="_blank" rel="noreferrer">{fact.source ?? "SpeedTown / M-Lab"} source</a>
          <p className="mt-2">Country context: {context}</p>
        </details>
      </> : <>
        <p className="mt-2 font-semibold">City speed data not yet available</p>
        <p className="mt-2 text-sm text-[var(--muted)]">Country context: {context}</p>
      </>}
    </div>
  );
}

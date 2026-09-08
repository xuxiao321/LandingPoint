import type { City } from "@/lib/data";
import snapshot from "@/data/global-city-metrics.json";
import { LocalFactContent } from "@/components/city/local-fact";
import { employmentByCity } from "@/lib/employment-score";

export function RelocationContext({ city }: { city: City }) {
  const metric = snapshot.cities.find((entry) => entry.slug === city.slug);
  const portal = metric?.policy.sourceUrl;
  const unemployment = metric?.countryContext.unemploymentRate;
  const employment = employmentByCity[city.slug];
  const panels = [
    { title: "Permission to work", scope: `${city.country} · personal eligibility`,
      description: "Check whether your current status permits work and whether an employer must support your application.",
      checks: ["Passport and current residence status", "Job offer and employer requirements", "Occupation, qualifications and salary requirements"] },
    { title: "Visa & residence options", scope: `${city.country} · official guidance`,
      description: "Choose a route based on your purpose and circumstances. The number of routes alone does not tell you how likely you are to qualify.",
      checks: ["Work, study, family or other purpose", "Application fees and processing times", "Duration, renewal and family conditions"] },
  ];
  return <div className="grid gap-4 md:grid-cols-2">
    {panels.map((panel) => <article key={panel.title} className="rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6">
      <p className="text-xs font-medium text-[var(--muted)]">{panel.scope}</p>
      <h3 className="mt-2 text-xl font-semibold">{panel.title}</h3>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{panel.description}</p>
      <p className="mt-4 text-sm font-medium">What to check</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--muted)]">{panel.checks.map((check) => <li key={check}>{check}</li>)}</ul>
      {portal ? <a href={portal} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-medium text-[var(--accent)] underline underline-offset-4">Official {city.country} immigration guidance ↗</a> : null}
    </article>)}
    <article className="rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6">
      <p className="text-xs font-medium text-[var(--muted)]">Local population data</p>
      <h3 className="mb-4 mt-2 text-xl font-semibold">International community</h3>
      <p className="mb-3 text-sm text-[var(--muted)]">{city.sourceBackedScoreKeys.includes("community") ? `Community population score: ${city.scores.community}/10. Based on local foreign-born share; it does not rate support services or visa eligibility.` : "Context only: this population definition is not comparable with the foreign-born share used in rankings."}</p>
      {city.localFacts ? <LocalFactContent fact={city.localFacts.migration} /> : <p>Local population data is not available yet.</p>}
      <p className="mt-4 border-t border-[var(--border)] pt-4 text-sm leading-6 text-[var(--muted)]">Population composition gives context. To judge your own support network, also look for language communities, newcomer services and local organizations.</p>
    </article>
    <article className="rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6">
      <p className="text-xs font-medium text-[var(--muted)]">{employment ? `${employment.geography} · ${employment.period}` : "More local evidence needed"}</p>
      <h3 className="mt-2 text-xl font-semibold">Finding a job</h3>
      {employment && <div className="mt-4 rounded-xl bg-[var(--surface-soft)] p-4">
        <p className="font-semibold">{employment.totalJobs.toLocaleString("en-US")} total jobs</p>
        <p className="mt-2 font-semibold">{employment.jobsPerThousand.toLocaleString("en-US")} jobs per 1,000 residents aged 16–64</p>
        <p className="mt-2 text-sm">Existing workplace jobs, including commuters and self-employment. These are not current vacancies.</p>
        <details className="mt-3 text-sm"><summary className="cursor-pointer">Career Growth score: {city.scores.career}/10</summary><p className="mt-2">70% jobs density + 30% logarithmic job-market size. Density maps 400–1,400 jobs per 1,000 to 0–10; size maps 10,000–10 million jobs to 0–10. Values are capped. This is an employment-scale proxy, not growth, hiring demand or a personal career forecast.</p></details>
        <a className="mt-3 inline-block text-sm underline" href={employment.sourceUrl} target="_blank" rel="noreferrer">Source: Office for National Statistics / Nomis</a>
      </div>}
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">A personal job match needs your occupation, experience, working language and right to work, plus current vacancies and salaries in {city.name}.</p>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">City-level vacancies, occupation-specific pay and employer sponsorship evidence have not yet been verified for this comparison.</p>
      {unemployment ? <details className="mt-4 border-t border-[var(--border)] pt-4 text-sm leading-6">
        <summary className="cursor-pointer font-medium text-[var(--accent)]">National employment context</summary>
        <p className="mt-3">{city.country} unemployment: <strong>{unemployment.value.toFixed(1)}%</strong> · {unemployment.year}</p>
        <p className="mt-2 text-[var(--muted)]">This national observation does not measure vacancies in {city.name} or your likelihood of finding work.</p>
        <a className="mt-2 inline-block underline underline-offset-4" href={`https://data.worldbank.org/indicator/SL.UEM.TOTL.ZS?locations=${metric?.worldBankCode}`} target="_blank" rel="noreferrer">World Bank source ↗</a>
      </details> : null}
    </article>
  </div>;
}

import fs from "node:fs/promises";

const outputFile = new URL("../src/data/city-internet.json", import.meta.url);
const root = "https://statistics.measurementlab.net/";
const periodStart = "2024-01-01";
const periodEnd = "2024-03-26";

// Reviewed paths avoid matching a different city with the same name.
const geographyBySlug = {
  "new-york-city": "v0/NA/US/US-NY/New York/", seattle: "v0/NA/US/US-WA/Seattle/",
  boston: "v0/NA/US/US-MA/Boston/", austin: "v0/NA/US/US-TX/Austin/", atlanta: "v0/NA/US/US-GA/Atlanta/",
  vancouver: "v0/NA/CA/CA-BC/Vancouver/", "mexico-city": "v0/NA/MX/MX-CMX/Mexico City/",
  "sao-paulo": "v0/SA/BR/BR-SP/São Paulo/", paris: "v0/EU/FR/FR-IDF/Paris/", berlin: "v0/EU/DE/DE-BE/Berlin/",
  amsterdam: "v0/EU/NL/NL-NH/Amsterdam/", dublin: "v0/EU/IE/IE-L/Dublin/", tokyo: "v0/AS/JP/JP-13/Tokyo/",
  seoul: "v0/AS/KR/KR-11/Seoul/", melbourne: "v0/OC/AU/AU-VIC/Melbourne/", dubai: "v0/AS/AE/AE-DU/Dubai/",
  montreal: "v0/NA/CA/CA-QC/Montreal/", brisbane: "v0/OC/AU/AU-QLD/Brisbane/", calgary: "v0/NA/CA/CA-AB/Calgary/",
  ottawa: "v0/NA/CA/CA-ON/Ottawa/", edmonton: "v0/NA/CA/CA-AB/Edmonton/", hamburg: "v0/EU/DE/DE-HH/Hamburg/",
  halifax: "v0/NA/CA/CA-NS/Halifax/", edinburgh: "v0/EU/GB/GB-SCT/Edinburgh/", birmingham: "v0/EU/GB/GB-ENG/Birmingham/",
  toronto: "v0/NA/CA/CA-ON/Toronto/", london: "v0/EU/GB/GB-ENG/London/", sydney: "v0/OC/AU/AU-NSW/Sydney/",
  munich: "v0/EU/DE/DE-BY/Munich/", manchester: "v0/EU/GB/GB-ENG/Manchester/", bristol: "v0/EU/GB/GB-ENG/Bristol/",
  singapore: "v0/AS/SG/",
};

function mean(rows, key) {
  return Math.round((rows.reduce((sum, row) => sum + row[key], 0) / rows.length) * 100) / 100;
}

async function loadCity(slug, geography) {
  const sourceUrl = `${root}${geography}2024/histogram_daily_stats.json`;
  const response = await fetch(sourceUrl);
  if (!response.ok) throw new Error(`${slug}: M-Lab returned ${response.status}`);
  const rawRows = await response.json();
  const rows = [...new Map(rawRows.map((row) => [row.date, row])).values()]
    .filter((row) => row.date >= periodStart && row.date <= periodEnd)
    .sort((left, right) => left.date.localeCompare(right.date));
  const downloads = rows.filter((row) => row.dl_samples_day > 0 && Number.isFinite(row.download_MED) && Number.isFinite(row.download_minRTT_MED));
  const uploads = rows.filter((row) => row.ul_samples_day > 0 && Number.isFinite(row.upload_MED));
  if (!downloads.length || !uploads.length) throw new Error(`${slug}: no measurements in the common period`);
  return {
    download: mean(downloads, "download_MED"), upload: mean(uploads, "upload_MED"),
    latency: mean(downloads, "download_minRTT_MED"), samples: downloads.reduce((sum, row) => sum + row.dl_samples_day, 0),
    uploadSamples: uploads.reduce((sum, row) => sum + row.ul_samples_day, 0), measurementDays: downloads.length,
    period: `${periodStart} – ${periodEnd}`, sourceUrl, source: "M-Lab statistics archive", method: "mean of daily medians",
    geography, historical: true, retrievedAt: new Date().toISOString().slice(0, 10),
  };
}

const entries = await Promise.all(Object.entries(geographyBySlug).map(async ([slug, geography]) => [slug, await loadCity(slug, geography)]));
const snapshot = {
  source: "M-Lab statistics archive", sourceUrl: root, period: `${periodStart} – ${periodEnd}`,
  methodology: "For every city, take the mean of M-Lab daily median download, upload, and minimum round-trip latency observations within the same fixed period.",
  retrievedAt: new Date().toISOString().slice(0, 10), cities: Object.fromEntries(entries),
};
await fs.writeFile(outputFile, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Refreshed ${entries.length} cities from one M-Lab source and period.`);

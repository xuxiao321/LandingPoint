import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const snapshotPath = path.join(root, "src", "data", "global-city-metrics.json");

function plainText(value) {
  return String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchJson(url) {
  let lastError;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(30000),
        headers: {
          Accept: "application/json",
          "User-Agent": "LandingPoint/0.1 city-image-sync contact: local-development",
        },
      });
      if (response.status === 429 || response.status >= 500) {
        const retryAfter = Number(response.headers.get("retry-after"));
        await sleep(Number.isFinite(retryAfter) ? retryAfter * 1000 : 3000 * (attempt + 1));
        continue;
      }
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return response.json();
    } catch (error) {
      lastError = error;
      if (attempt < 4) await sleep(3000 * (attempt + 1));
    }
  }
  throw lastError ?? new Error("Image metadata request failed");
}

async function fetchCityImage(city) {
  const entityUrl = `https://www.wikidata.org/wiki/Special:EntityData/${city.wikidataId}.json`;
  const entityPayload = await fetchJson(entityUrl);
  const fileName = entityPayload.entities?.[city.wikidataId]?.claims?.P18?.[0]
    ?.mainsnak?.datavalue?.value;
  if (!fileName) throw new Error(`No Wikidata image for ${city.name}`);

  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    iiurlwidth: "1800",
    titles: `File:${fileName}`,
  });
  const commonsPayload = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`);
  const page = Object.values(commonsPayload.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!info?.thumburl && !info?.url) throw new Error(`No Commons image URL for ${city.name}`);
  const metadata = info.extmetadata ?? {};

  return {
    url: info.thumburl ?? info.url,
    sourcePageUrl: info.descriptionurl,
    title: plainText(metadata.ObjectName?.value) || fileName,
    creator: plainText(metadata.Artist?.value) || "Wikimedia Commons contributor",
    license: plainText(metadata.LicenseShortName?.value) || "See source page",
    licenseUrl: metadata.LicenseUrl?.value || info.descriptionurl,
  };
}

const snapshot = JSON.parse(await readFile(snapshotPath, "utf8"));
for (const city of snapshot.cities) {
  if (city.heroImage?.url) {
    console.log(`Keeping existing image for ${city.name}`);
    continue;
  }
  process.stdout.write(`Finding image for ${city.name}... `);
  city.heroImage = await fetchCityImage(city);
  console.log("done");
  await writeFile(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  await sleep(1200);
}
snapshot.generatedAt = new Date().toISOString();
await writeFile(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
console.log(`Updated ${snapshotPath}`);

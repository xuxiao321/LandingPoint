import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");
const outputPath = resolve(
  projectRoot,
  "src",
  "data",
  "city-public-metrics.json",
);

const cityGeographies = [
  { slug: "new-york-city", name: "New York City", state: "36", place: "51000" },
  { slug: "seattle", name: "Seattle", state: "53", place: "63000" },
  { slug: "boston", name: "Boston", state: "25", place: "07000" },
  { slug: "austin", name: "Austin", state: "48", place: "05000" },
  { slug: "atlanta", name: "Atlanta", state: "13", place: "04000" },
];

const censusVariables = {
  population: "B01003_001E",
  foreignBorn: "B05002_013E",
  medianGrossRent: "B25064_001E",
  commuters: "B08301_001E",
  publicTransitCommuters: "B08301_010E",
  bicycleCommuters: "B08301_018E",
  walkingCommuters: "B08301_019E",
  civilianLaborForce: "B23025_003E",
  unemployed: "B23025_005E",
  medianHouseholdIncome: "B19013_001E",
};

function parseEnvFile(contents) {
  return Object.fromEntries(
    contents
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const separator = line.indexOf("=");
        const key = line.slice(0, separator).trim();
        const value = line
          .slice(separator + 1)
          .trim()
          .replace(/^['"]|['"]$/g, "");
        return [key, value];
      }),
  );
}

async function loadLocalEnv() {
  try {
    return parseEnvFile(
      await readFile(resolve(projectRoot, ".env.local"), "utf8"),
    );
  } catch (error) {
    if (error && typeof error === "object" && error.code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

function requiredNumber(row, variable, cityName) {
  const value = Number(row[variable]);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(
      `Census returned an invalid ${variable} value for ${cityName}.`,
    );
  }
  return value;
}

function percentage(numerator, denominator) {
  return denominator > 0 ? Number(((numerator / denominator) * 100).toFixed(1)) : 0;
}

async function fetchCensusCity(city, apiKey, year) {
  const requestedVariables = ["NAME", ...Object.values(censusVariables)];
  const url = new URL(`https://api.census.gov/data/${year}/acs/acs5`);
  url.searchParams.set("get", requestedVariables.join(","));
  url.searchParams.set("for", `place:${city.place}`);
  url.searchParams.set("in", `state:${city.state}`);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      `Census request failed for ${city.name}: ${response.status} ${response.statusText}`,
    );
  }

  const payload = await response.json();
  if (!Array.isArray(payload) || payload.length < 2) {
    throw new Error(`Census returned no place data for ${city.name}.`);
  }

  const [headers, values] = payload;
  const row = Object.fromEntries(
    headers.map((header, index) => [header, values[index]]),
  );
  const population = requiredNumber(
    row,
    censusVariables.population,
    city.name,
  );
  const foreignBorn = requiredNumber(
    row,
    censusVariables.foreignBorn,
    city.name,
  );
  const commuters = requiredNumber(
    row,
    censusVariables.commuters,
    city.name,
  );
  const publicTransitCommuters = requiredNumber(
    row,
    censusVariables.publicTransitCommuters,
    city.name,
  );
  const bicycleCommuters = requiredNumber(
    row,
    censusVariables.bicycleCommuters,
    city.name,
  );
  const walkingCommuters = requiredNumber(
    row,
    censusVariables.walkingCommuters,
    city.name,
  );
  const civilianLaborForce = requiredNumber(
    row,
    censusVariables.civilianLaborForce,
    city.name,
  );
  const unemployed = requiredNumber(
    row,
    censusVariables.unemployed,
    city.name,
  );

  return {
    slug: city.slug,
    geographyName: row.NAME,
    geography: {
      type: "place",
      stateFips: city.state,
      placeFips: city.place,
    },
    population,
    foreignBornShare: percentage(foreignBorn, population),
    medianGrossRent: requiredNumber(
      row,
      censusVariables.medianGrossRent,
      city.name,
    ),
    medianHouseholdIncome: requiredNumber(
      row,
      censusVariables.medianHouseholdIncome,
      city.name,
    ),
    unemploymentRate: percentage(unemployed, civilianLaborForce),
    publicTransitShare: percentage(publicTransitCommuters, commuters),
    noCarCommuteShare: percentage(
      publicTransitCommuters + bicycleCommuters + walkingCommuters,
      commuters,
    ),
  };
}

const localEnv = await loadLocalEnv();
const censusApiKey = process.env.CENSUS_API_KEY || localEnv.CENSUS_API_KEY;
const censusYear =
  process.env.CENSUS_ACS_YEAR || localEnv.CENSUS_ACS_YEAR || "2024";

if (!censusApiKey) {
  console.error(
    "Missing CENSUS_API_KEY. Request a free key at https://api.census.gov/data/key_signup.html and add it to .env.local.",
  );
  process.exitCode = 1;
} else {
  const cities = [];
  for (const city of cityGeographies) {
    process.stdout.write(`Syncing ${city.name}... `);
    cities.push(await fetchCensusCity(city, censusApiKey, censusYear));
    console.log("done");
  }

  const snapshot = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    dataset: "Census ACS 5-Year",
    datasetYear: censusYear,
    sourceUrl: `https://api.census.gov/data/${censusYear}/acs/acs5`,
    termsUrl:
      "https://www.census.gov/data/developers/about/terms-of-service.html",
    variables: censusVariables,
    cities,
  };

  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  console.log(`Updated ${outputPath}`);
}

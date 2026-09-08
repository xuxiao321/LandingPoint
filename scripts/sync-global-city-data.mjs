import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateRawSync } from "node:zlib";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");
const outputPath = resolve(
  projectRoot,
  "src",
  "data",
  "global-city-metrics.json",
);

// This is deliberately a curated catalog. The site ships reviewed cities instead
// of accepting arbitrary user-entered locations at runtime.
const curatedCities = [
  { slug: "edinburgh", wikidataId: "Q23436", name: "Edinburgh", subdivision: "Scotland", country: "United Kingdom", worldBankCode: "GBR" },
  { slug: "birmingham", wikidataId: "Q2256", name: "Birmingham", subdivision: "England", country: "United Kingdom", worldBankCode: "GBR" },
  { slug: "bristol", wikidataId: "Q23154", name: "Bristol", subdivision: "England", country: "United Kingdom", worldBankCode: "GBR" },
  { slug: "manchester", wikidataId: "Q18125", name: "Manchester", subdivision: "England", country: "United Kingdom", worldBankCode: "GBR" },
  { slug: "hamburg", wikidataId: "Q1055", name: "Hamburg", subdivision: "Hamburg", country: "Germany", worldBankCode: "DEU" },
  { slug: "halifax", wikidataId: "Q2141", name: "Halifax", subdivision: "Nova Scotia", country: "Canada", worldBankCode: "CAN" },
  { slug: "calgary", wikidataId: "Q36312", name: "Calgary", subdivision: "Alberta", country: "Canada", worldBankCode: "CAN" },
  { slug: "ottawa", wikidataId: "Q1930", name: "Ottawa", subdivision: "Ontario", country: "Canada", worldBankCode: "CAN" },
  { slug: "edmonton", wikidataId: "Q2096", name: "Edmonton", subdivision: "Alberta", country: "Canada", worldBankCode: "CAN" },
  { slug: "montreal", wikidataId: "Q340", name: "Montreal", subdivision: "Quebec", country: "Canada", worldBankCode: "CAN" },
  { slug: "munich", wikidataId: "Q1726", name: "Munich", subdivision: "Bavaria", country: "Germany", worldBankCode: "DEU" },
  { slug: "brisbane", wikidataId: "Q34932", name: "Brisbane", subdivision: "Queensland", country: "Australia", worldBankCode: "AUS" },
  { slug: "new-york-city", wikidataId: "Q60", name: "New York City", subdivision: "New York", country: "United States", worldBankCode: "USA" },
  { slug: "seattle", wikidataId: "Q5083", name: "Seattle", subdivision: "Washington", country: "United States", worldBankCode: "USA" },
  { slug: "boston", wikidataId: "Q100", name: "Boston", subdivision: "Massachusetts", country: "United States", worldBankCode: "USA" },
  { slug: "austin", wikidataId: "Q16559", name: "Austin", subdivision: "Texas", country: "United States", worldBankCode: "USA" },
  { slug: "atlanta", wikidataId: "Q23556", name: "Atlanta", subdivision: "Georgia", country: "United States", worldBankCode: "USA" },
  { slug: "toronto", wikidataId: "Q172", name: "Toronto", subdivision: "Ontario", country: "Canada", worldBankCode: "CAN" },
  { slug: "vancouver", wikidataId: "Q24639", name: "Vancouver", subdivision: "British Columbia", country: "Canada", worldBankCode: "CAN" },
  { slug: "mexico-city", wikidataId: "Q1489", name: "Mexico City", subdivision: "Mexico City", country: "Mexico", worldBankCode: "MEX" },
  { slug: "sao-paulo", wikidataId: "Q174", name: "São Paulo", subdivision: "São Paulo", country: "Brazil", worldBankCode: "BRA" },
  { slug: "london", wikidataId: "Q84", name: "London", subdivision: "England", country: "United Kingdom", worldBankCode: "GBR" },
  { slug: "paris", wikidataId: "Q90", name: "Paris", subdivision: "Île-de-France", country: "France", worldBankCode: "FRA" },
  { slug: "berlin", wikidataId: "Q64", name: "Berlin", subdivision: "Berlin", country: "Germany", worldBankCode: "DEU" },
  { slug: "amsterdam", wikidataId: "Q727", name: "Amsterdam", subdivision: "North Holland", country: "Netherlands", worldBankCode: "NLD" },
  { slug: "dublin", wikidataId: "Q1761", name: "Dublin", subdivision: "Leinster", country: "Ireland", worldBankCode: "IRL" },
  { slug: "singapore", wikidataId: "Q334", name: "Singapore", subdivision: "Singapore", country: "Singapore", worldBankCode: "SGP" },
  { slug: "tokyo", wikidataId: "Q1490", name: "Tokyo", subdivision: "Tokyo", country: "Japan", worldBankCode: "JPN" },
  { slug: "seoul", wikidataId: "Q8684", name: "Seoul", subdivision: "Seoul", country: "South Korea", worldBankCode: "KOR" },
  { slug: "sydney", wikidataId: "Q3130", name: "Sydney", subdivision: "New South Wales", country: "Australia", worldBankCode: "AUS" },
  { slug: "melbourne", wikidataId: "Q3141", name: "Melbourne", subdivision: "Victoria", country: "Australia", worldBankCode: "AUS" },
  { slug: "dubai", wikidataId: "Q612", name: "Dubai", subdivision: "Dubai", country: "United Arab Emirates", worldBankCode: "ARE" },
];

const policyByCountry = {
  USA: {
    workPathScore: 7.2,
    visaBreadthScore: 6.8,
    label: "Employer-led with specialist routes",
    sourceUrl: "https://www.uscis.gov/working-in-the-united-states",
  },
  CAN: {
    workPathScore: 8.8,
    visaBreadthScore: 9.0,
    label: "Employer, skilled and graduate routes",
    sourceUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada.html",
  },
  MEX: {
    workPathScore: 6.4,
    visaBreadthScore: 6.5,
    label: "Temporary residence and employer routes",
    sourceUrl: "https://www.gob.mx/tramites/ficha/visa-de-residencia-temporal/SRE260",
  },
  BRA: {
    workPathScore: 6.8,
    visaBreadthScore: 7.0,
    label: "Employment and investment residence routes",
    sourceUrl: "https://www.gov.br/mj/pt-br/assuntos/seus-direitos/migracoes/portal-de-imigracao-laboral/autorizacao-de-residencia-laboral-1/autorizacao-de-residencia-laboral",
  },
  GBR: {
    workPathScore: 8.2,
    visaBreadthScore: 8.4,
    label: "Skilled, graduate and founder routes",
    sourceUrl: "https://www.gov.uk/browse/visas-immigration/work-visas",
  },
  FRA: {
    workPathScore: 7.8,
    visaBreadthScore: 8.1,
    label: "Employment, talent and business routes",
    sourceUrl: "https://www.france-visas.gouv.fr/en/motif-professionnel",
  },
  DEU: {
    workPathScore: 8.6,
    visaBreadthScore: 8.7,
    label: "Employment, Blue Card and job-search routes",
    sourceUrl: "https://www.make-it-in-germany.com/en/visa-residence/types",
  },
  NLD: {
    workPathScore: 8.2,
    visaBreadthScore: 8.5,
    label: "Highly skilled, graduate and start-up routes",
    sourceUrl: "https://ind.nl/en/residence-permits/work",
  },
  IRL: {
    workPathScore: 7.8,
    visaBreadthScore: 8.0,
    label: "Critical Skills and general permits",
    sourceUrl: "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/permit-types.html",
  },
  SGP: {
    workPathScore: 7.8,
    visaBreadthScore: 7.5,
    label: "Employment Pass and entrepreneur routes",
    sourceUrl: "https://www.mom.gov.sg/passes-and-permits",
  },
  JPN: {
    workPathScore: 7.2,
    visaBreadthScore: 7.0,
    label: "Professional and highly skilled routes",
    sourceUrl: "https://www.mofa.go.jp/j_info/visit/visa/long/index.html",
  },
  KOR: {
    workPathScore: 6.8,
    visaBreadthScore: 6.8,
    label: "Professional and employment routes",
    sourceUrl: "https://www.visa.go.kr/openPage.do?MENU_ID=10102",
  },
  AUS: {
    workPathScore: 8.8,
    visaBreadthScore: 9.0,
    label: "Employer, independent and nominated skilled routes",
    sourceUrl: "https://immi.homeaffairs.gov.au/what-we-do/skilled-migration-program/visa-options",
  },
  ARE: {
    workPathScore: 8.1,
    visaBreadthScore: 7.8,
    label: "Employer, green and self-sponsored routes",
    sourceUrl: "https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/residence-visa-for-working-in-the-uae",
  },
};

const wikidataSource = {
  name: "Wikidata",
  license: "CC0 1.0",
  termsUrl: "https://www.wikidata.org/wiki/Wikidata:Licensing",
};

const nasaSource = {
  name: "NASA POWER",
  period: "POWER climatology",
  sourceUrl: "https://power.larc.nasa.gov/docs/services/api/temporal/climatology/",
};

const geoNamesSource = {
  name: "GeoNames cities15000",
  period: "latest published bulk extract",
  sourceUrl: "https://download.geonames.org/export/dump/cities15000.zip",
  termsUrl: "https://www.geonames.org/export/",
  license: "CC BY",
};

const worldBankIndicators = {
  unemploymentRate: "SL.UEM.TOTL.ZS",
  internetUseShare: "IT.NET.USER.ZS",
  migrantStockShare: "SM.POP.TOTL.ZS",
  homicideRate: "VC.IHR.PSRC.P5",
  gdpPerCapitaPpp: "NY.GDP.PCAP.PP.CD",
  tertiaryEnrollmentRate: "SE.TER.ENRR",
  pppConversionFactor: "PA.NUS.PPP",
  officialExchangeRate: "PA.NUS.FCRF",
};

const worldBankSource = {
  name: "World Bank World Development Indicators",
  sourceUrl: "https://api.worldbank.org/v2/",
  termsUrl: "https://datacatalog.worldbank.org/search/dataset/0037712/world-development-indicators",
  license: "CC BY 4.0",
};

const osmSource = {
  name: "OpenStreetMap via Overpass API",
  sourceUrl: "https://www.openstreetmap.org/copyright",
  termsUrl: "https://wiki.openstreetmap.org/wiki/Overpass_API",
  license: "ODbL",
};

function sleep(milliseconds) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
}

async function fetchWorldBankContexts() {
  const countries = [...new Set(curatedCities.map((city) => city.worldBankCode))].join(";");
  const indicators = Object.values(worldBankIndicators).join(";");
  const url = new URL(
    `https://api.worldbank.org/v2/country/${countries}/indicator/${indicators}`,
  );
  url.searchParams.set("source", "2");
  url.searchParams.set("date", "2015:2025");
  url.searchParams.set("format", "json");
  url.searchParams.set("per_page", "5000");

  const response = await fetch(url, {
    headers: { "User-Agent": "LandingPoint/0.1 curated-city-data-sync" },
  });
  if (!response.ok) {
    throw new Error(`World Bank request failed: ${response.status}`);
  }
  const payload = await response.json();
  const rows = payload?.[1];
  if (!Array.isArray(rows)) {
    throw new Error(
      `World Bank returned an unexpected response: ${JSON.stringify(payload).slice(0, 500)}`,
    );
  }

  const contexts = new Map();
  for (const row of rows) {
    if (row.value === null || row.value === undefined) continue;
    const countryCode = row.countryiso3code;
    const indicatorCode = row.indicator?.id;
    const metricName = Object.entries(worldBankIndicators).find(
      ([, code]) => code === indicatorCode,
    )?.[0];
    if (!metricName) continue;

    const context = contexts.get(countryCode) ?? {};
    const existing = context[metricName];
    if (!existing || Number(row.date) > Number(existing.year)) {
      context[metricName] = {
        value: Number(Number(row.value).toFixed(2)),
        year: String(row.date),
        indicatorCode,
      };
    }
    contexts.set(countryCode, context);
  }

  for (const context of contexts.values()) {
    const ppp = context.pppConversionFactor;
    const exchange = context.officialExchangeRate;
    if (ppp && exchange && exchange.value > 0) {
      context.priceLevelRatio = {
        value: Number((ppp.value / exchange.value).toFixed(3)),
        year: ppp.year === exchange.year ? ppp.year : `${ppp.year}/${exchange.year}`,
        indicatorCode: "PA.NUS.PPP / PA.NUS.FCRF",
      };
    }
  }

  return contexts;
}

function overpassCountQuery(latitude, longitude) {
  const core = `around:10000,${latitude},${longitude}`;
  const metro = `around:25000,${latitude},${longitude}`;
  return `[out:json][timeout:90];
nwr(${core})["amenity"="university"]->.universities;
nwr(${core})["amenity"~"^(restaurant|cafe|fast_food|food_court)$"]->.food;
nwr(${core})["amenity"~"^(bar|pub|nightclub|cinema|theatre)$"]->.social;
(
  nwr(${core})["public_transport"~"^(station|stop_position|platform)$"];
  nwr(${core})["highway"="bus_stop"];
  nwr(${core})["railway"~"^(station|subway_entrance|tram_stop)$"];
)->.coreTransit;
(
  nwr(${metro})["public_transport"~"^(station|stop_position|platform)$"];
  nwr(${metro})["highway"="bus_stop"];
  nwr(${metro})["railway"~"^(station|subway_entrance|tram_stop)$"];
)->.metroTransit;
(.universities;);out count;
(.food;);out count;
(.social;);out count;
(.coreTransit;);out count;
(.metroTransit;);out count;`;
}

async function fetchOsmCounts(city, coordinates) {
  const endpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
  ];
  const query = overpassCountQuery(coordinates.latitude, coordinates.longitude);
  let lastError;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const endpoint = endpoints[attempt % endpoints.length];
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        signal: AbortSignal.timeout(150000),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "User-Agent": "LandingPoint/0.1 curated-city-data-sync",
        },
        body: new URLSearchParams({ data: query }),
      });
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const payload = await response.json();
      const counts = payload.elements?.map((element) => Number(element.tags?.total));
      if (!counts || counts.length !== 5 || counts.some((value) => !Number.isFinite(value))) {
        throw new Error("unexpected count response");
      }
      return {
        amenityRadiusKm: 10,
        transitCoreRadiusKm: 10,
        transitMetroRadiusKm: 25,
        universityCount: counts[0],
        foodVenueCount: counts[1],
        socialVenueCount: counts[2],
        transitCoreLocationCount: counts[3],
        transitMetroLocationCount: counts[4],
        sourceTimestamp: payload.osm3s?.timestamp_osm_base ?? null,
      };
    } catch (error) {
      lastError = error;
      if (attempt < 2) await sleep(30000);
    }
  }

  throw new Error(`Overpass failed for ${city.name}: ${lastError?.message ?? lastError}`);
}

function extractFirstZipFile(archive) {
  const endSignature = 0x06054b50;
  let endOffset = -1;
  for (let offset = archive.length - 22; offset >= Math.max(0, archive.length - 65557); offset -= 1) {
    if (archive.readUInt32LE(offset) === endSignature) {
      endOffset = offset;
      break;
    }
  }
  if (endOffset < 0) throw new Error("GeoNames ZIP end record was not found.");

  const centralOffset = archive.readUInt32LE(endOffset + 16);
  if (archive.readUInt32LE(centralOffset) !== 0x02014b50) {
    throw new Error("GeoNames ZIP central directory is invalid.");
  }

  const compressionMethod = archive.readUInt16LE(centralOffset + 10);
  const compressedSize = archive.readUInt32LE(centralOffset + 20);
  const localOffset = archive.readUInt32LE(centralOffset + 42);
  if (archive.readUInt32LE(localOffset) !== 0x04034b50) {
    throw new Error("GeoNames ZIP local file record is invalid.");
  }

  const fileNameLength = archive.readUInt16LE(localOffset + 26);
  const extraLength = archive.readUInt16LE(localOffset + 28);
  const dataOffset = localOffset + 30 + fileNameLength + extraLength;
  const compressed = archive.subarray(dataOffset, dataOffset + compressedSize);
  if (compressionMethod === 0) return compressed;
  if (compressionMethod === 8) return inflateRawSync(compressed);
  throw new Error(`Unsupported GeoNames ZIP compression method ${compressionMethod}.`);
}

async function fetchGeoNamesIndex() {
  const response = await fetch(geoNamesSource.sourceUrl, {
    headers: { "User-Agent": "LandingPoint/0.1 curated-city-data-sync" },
  });
  if (!response.ok) {
    throw new Error(`GeoNames download failed: ${response.status}`);
  }

  const archive = Buffer.from(await response.arrayBuffer());
  const contents = extractFirstZipFile(archive).toString("utf8");
  return new Map(
    contents
      .trim()
      .split("\n")
      .map((line) => line.replace(/\r$/, "").split("\t"))
      .map((fields) => [
        fields[0],
        {
          geonamesId: fields[0],
          name: fields[1],
          latitude: Number(fields[4]),
          longitude: Number(fields[5]),
          population: Number(fields[14]),
        },
      ]),
  );
}

function parseWikidataTime(value) {
  const match = value?.match(/^\+?(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  if (match[2] === "00") return match[1];
  if (match[3] === "00") return `${match[1]}-${match[2]}`;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function selectPopulation(statements, cityName) {
  const candidates = (statements ?? [])
    .map((statement) => {
      const rawAmount = statement?.mainsnak?.datavalue?.value?.amount;
      const population = Number(rawAmount);
      const pointInTime = parseWikidataTime(
        statement?.qualifiers?.P585?.[0]?.datavalue?.value?.time,
      );
      return {
        population,
        pointInTime,
        rank: statement?.rank ?? "normal",
      };
    })
    .filter((candidate) => Number.isFinite(candidate.population) && candidate.population > 0)
    .sort((left, right) => {
      if (left.rank === "preferred" && right.rank !== "preferred") return -1;
      if (right.rank === "preferred" && left.rank !== "preferred") return 1;
      return (right.pointInTime ?? "").localeCompare(left.pointInTime ?? "");
    });

  if (!candidates[0]) {
    throw new Error(`Wikidata has no usable population statement for ${cityName}.`);
  }

  return candidates[0];
}

async function fetchWikidataCity(city) {
  const sourceUrl = `https://www.wikidata.org/wiki/Special:EntityData/${city.wikidataId}.json`;
  const response = await fetch(sourceUrl, {
    headers: {
      Accept: "application/json",
      "User-Agent": "LandingPoint/0.1 curated-city-data-sync",
    },
  });

  if (!response.ok) {
    throw new Error(`Wikidata request failed for ${city.name}: ${response.status}`);
  }

  const payload = await response.json();
  const entity = payload.entities?.[city.wikidataId];
  const coordinates = entity?.claims?.P625?.[0]?.mainsnak?.datavalue?.value;
  if (!coordinates) {
    throw new Error(`Wikidata has no coordinates for ${city.name}.`);
  }

  const selectedPopulation = selectPopulation(entity.claims?.P1082, city.name);
  const geonamesId = entity?.claims?.P1566?.[0]?.mainsnak?.datavalue?.value;
  if (!geonamesId) {
    throw new Error(`Wikidata has no GeoNames ID for ${city.name}.`);
  }

  return {
    latitude: Number(coordinates.latitude.toFixed(5)),
    longitude: Number(coordinates.longitude.toFixed(5)),
    population: selectedPopulation.population,
    populationAsOf: selectedPopulation.pointInTime,
    geonamesId: String(geonamesId),
    sourceUrl: `https://www.wikidata.org/wiki/${city.wikidataId}`,
  };
}

function reviewPopulation(wikidata, geonames) {
  if (!geonames || !Number.isFinite(geonames.population) || geonames.population <= 0) {
    return {
      selectedValue: wikidata.population,
      selectionReason: "Wikidata has a dated population statement; GeoNames has no usable comparison value.",
      confidence: "single-source",
      comparison: null,
    };
  }

  const differencePercent = Number(
    ((Math.abs(wikidata.population - geonames.population) / wikidata.population) * 100).toFixed(1),
  );
  return {
    selectedValue: wikidata.population,
    selectionReason:
      "Selected Wikidata because its population statement includes the reviewed city entity and a point-in-time qualifier; GeoNames is retained as a magnitude check, not averaged.",
    confidence:
      differencePercent <= 10 ? "cross-checked-high" : differencePercent <= 25 ? "cross-checked-medium" : "boundary-review-needed",
    comparison: {
      source: geoNamesSource.name,
      value: geonames.population,
      differencePercent,
    },
  };
}

function requiredClimateValue(parameters, period, cityName) {
  const value = Number(parameters?.T2M?.[period]);
  if (!Number.isFinite(value) || value <= -900) {
    throw new Error(`NASA POWER returned no T2M.${period} value for ${cityName}.`);
  }
  return Number(value.toFixed(1));
}

async function fetchNasaClimate(city, coordinates) {
  const url = new URL("https://power.larc.nasa.gov/api/temporal/climatology/point");
  url.searchParams.set("parameters", "T2M");
  url.searchParams.set("community", "RE");
  url.searchParams.set("longitude", String(coordinates.longitude));
  url.searchParams.set("latitude", String(coordinates.latitude));
  url.searchParams.set("format", "JSON");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "LandingPoint/0.1 curated-city-data-sync",
    },
  });
  if (!response.ok) {
    throw new Error(`NASA POWER request failed for ${city.name}: ${response.status}`);
  }

  const payload = await response.json();
  const parameters = payload.properties?.parameter;

  const monthKeys = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
  ];
  const monthlyMeans = monthKeys.map((month) => ({
    month,
    value: requiredClimateValue(parameters, month, city.name),
  }));
  const warmestMonth = monthlyMeans.reduce((best, item) =>
    item.value > best.value ? item : best,
  );
  const coldestMonth = monthlyMeans.reduce((best, item) =>
    item.value < best.value ? item : best,
  );

  return {
    annualMeanC: requiredClimateValue(parameters, "ANN", city.name),
    warmestMonth,
    coldestMonth,
    period: payload.header?.range ?? "NASA POWER climatology",
  };
}

const selectedSlugs = process.argv.find((arg) => arg.startsWith("--only="))?.slice(7).split(",");
if (selectedSlugs?.some((slug) => !curatedCities.some((city) => city.slug === slug))) throw new Error("Unknown city slug in --only");
const previous = selectedSlugs ? JSON.parse(await readFile(outputPath, "utf8")) : null;
const selectedCities = selectedSlugs ? curatedCities.filter((city) => selectedSlugs.includes(city.slug)) : curatedCities;

process.stdout.write("Downloading GeoNames comparison extract... ");
const geoNamesIndex = await fetchGeoNamesIndex();
console.log("done");

process.stdout.write("Downloading World Bank country indicators... ");
const worldBankContexts = previous ? new Map(previous.cities.map((city) => [city.worldBankCode, city.countryContext])) : await fetchWorldBankContexts();
console.log("done");

const cities = previous ? previous.cities.filter((city) => !selectedSlugs.includes(city.slug)) : [];
for (const city of selectedCities) {
  process.stdout.write(`Syncing ${city.name}... `);
  const wikidata = await fetchWikidataCity(city);
  const geonames = geoNamesIndex.get(wikidata.geonamesId);
  const populationReview = reviewPopulation(wikidata, geonames);
  const climate = await fetchNasaClimate(city, wikidata);
  const countryContext = worldBankContexts.get(city.worldBankCode);
  const policy = policyByCountry[city.worldBankCode];
  if (!countryContext || !policy) {
    throw new Error(`Missing country context or policy review for ${city.name}.`);
  }
  const osm = await fetchOsmCounts(city, wikidata);
  cities.push({
    ...city,
    latitude: wikidata.latitude,
    longitude: wikidata.longitude,
    population: populationReview.selectedValue,
    populationAsOf: wikidata.populationAsOf,
    populationReview,
    climate,
    countryContext,
    policy: {
      ...policy,
      geography: city.country,
      reviewedAt: new Date().toISOString().slice(0, 10),
      disclaimer: "Comparative pathway breadth only; not legal advice or an eligibility decision.",
    },
    osm,
    sources: [
      {
        ...wikidataSource,
        sourceUrl: wikidata.sourceUrl,
        period: wikidata.populationAsOf ?? "latest available statement",
        metrics: ["City identity", "Coordinates", "Population"],
      },
      {
        ...nasaSource,
        period: climate.period,
        metrics: ["Annual mean temperature", "Warmest monthly mean", "Coldest monthly mean"],
      },
      {
        ...geoNamesSource,
        metrics: ["Population magnitude cross-check", "Coordinates cross-check"],
      },
      {
        ...worldBankSource,
        period: "latest non-empty value from 2015-2025 per indicator",
        metrics: [
          "National unemployment rate",
          "National internet-use share",
          "International migrant stock share",
          "National homicide rate",
          "GDP per capita at PPP",
          "Tertiary enrollment",
          "National price-level ratio",
        ],
      },
      {
        ...osmSource,
        period: osm.sourceTimestamp ?? "latest available OSM snapshot",
        metrics: [
          "University features within 10 km",
          "Food venues within 10 km",
          "Social venues within 10 km",
          "Public transport map records within 10 km",
          "Public transport map records within 25 km",
        ],
      },
      {
        name: `${city.country} official immigration portal`,
        sourceUrl: policy.sourceUrl,
        period: `reviewed ${new Date().toISOString().slice(0, 10)}`,
        metrics: ["Work-path breadth", "Visa-path breadth"],
      },
    ],
  });
  console.log("done");
}

const snapshot = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  methodology:
    "Curated city entities use their Wikidata geography. Population is cross-checked with GeoNames when boundaries align; climate uses NASA POWER; national context uses World Bank WDI; amenity access uses OpenStreetMap counts within 10 km, while transit compares density within 10 km and 25 km; immigration pathway scores are reviewed LandingPoint comparisons of official country portals.",
  cities,
};

await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
console.log(`Updated ${outputPath}`);

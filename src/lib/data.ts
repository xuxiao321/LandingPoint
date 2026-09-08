import publicMetricsSnapshot from "@/data/city-public-metrics.json";
import { populationByCity, populationLabel, type PopulationObservation } from "@/lib/population";
import globalMetricsSnapshot from "@/data/global-city-metrics.json";
import cityImageAssets from "@/data/city-images.json";
import localFactsSnapshot from "@/data/city-local-facts.json";
import rentDefinitions from "@/data/rent-definitions.json";
import { communityScore } from "@/lib/community-score";
import { employmentByCity, employmentScore } from "@/lib/employment-score";

export const lifestyleOptionGroups = [
  {
    label: "Budget & Daily Costs",
    options: [
      "Lower Living Costs",
      "Roommate Friendly",
      "High Savings Potential",
      "Predictable Utilities",
    ],
  },
  {
    label: "Career & Study",
    options: [
      "Career Growth",
      "University Access",
      "Internship Access",
      "Networking Events",
    ],
  },
  {
    label: "Community & Daily Life",
    options: [
      "Immigrant Community",
      "Food Diversity",
      "Family Friendly",
      "Quiet Neighborhoods",
    ],
  },
  {
    label: "Mobility & Climate",
    options: [
      "No-car Lifestyle",
      "Short Commute",
      "Mild Weather",
      "Outdoor Access",
    ],
  },
] as const;

export const lifestyleOptions = lifestyleOptionGroups.flatMap(
  (group) => group.options,
);

export const workTypes = [
  "Travel / Short Stay",
  "Study",
  "Settle / Family",
  "Work / Career",
  "Start a Business",
  "Remote Work Base",
] as const;

export const sponsorshipRelevantGoals = [
  "Work / Career",
] as const;

export function isSponsorshipRelevantGoal(goal: string) {
  return [
    ...sponsorshipRelevantGoals,
    "Find Work",
    "Advance Career",
  ].includes(goal);
}

const countryCodes = [
  "AD",
  "AE",
  "AF",
  "AG",
  "AI",
  "AL",
  "AM",
  "AO",
  "AQ",
  "AR",
  "AS",
  "AT",
  "AU",
  "AW",
  "AX",
  "AZ",
  "BA",
  "BB",
  "BD",
  "BE",
  "BF",
  "BG",
  "BH",
  "BI",
  "BJ",
  "BL",
  "BM",
  "BN",
  "BO",
  "BQ",
  "BR",
  "BS",
  "BT",
  "BV",
  "BW",
  "BY",
  "BZ",
  "CA",
  "CC",
  "CD",
  "CF",
  "CG",
  "CH",
  "CI",
  "CK",
  "CL",
  "CM",
  "CN",
  "CO",
  "CR",
  "CU",
  "CV",
  "CW",
  "CX",
  "CY",
  "CZ",
  "DE",
  "DJ",
  "DK",
  "DM",
  "DO",
  "DZ",
  "EC",
  "EE",
  "EG",
  "EH",
  "ER",
  "ES",
  "ET",
  "FI",
  "FJ",
  "FK",
  "FM",
  "FO",
  "FR",
  "GA",
  "GB",
  "GD",
  "GE",
  "GF",
  "GG",
  "GH",
  "GI",
  "GL",
  "GM",
  "GN",
  "GP",
  "GQ",
  "GR",
  "GS",
  "GT",
  "GU",
  "GW",
  "GY",
  "HK",
  "HM",
  "HN",
  "HR",
  "HT",
  "HU",
  "ID",
  "IE",
  "IL",
  "IM",
  "IN",
  "IO",
  "IQ",
  "IR",
  "IS",
  "IT",
  "JE",
  "JM",
  "JO",
  "JP",
  "KE",
  "KG",
  "KH",
  "KI",
  "KM",
  "KN",
  "KP",
  "KR",
  "KW",
  "KY",
  "KZ",
  "LA",
  "LB",
  "LC",
  "LI",
  "LK",
  "LR",
  "LS",
  "LT",
  "LU",
  "LV",
  "LY",
  "MA",
  "MC",
  "MD",
  "ME",
  "MF",
  "MG",
  "MH",
  "MK",
  "ML",
  "MM",
  "MN",
  "MO",
  "MP",
  "MQ",
  "MR",
  "MS",
  "MT",
  "MU",
  "MV",
  "MW",
  "MX",
  "MY",
  "MZ",
  "NA",
  "NC",
  "NE",
  "NF",
  "NG",
  "NI",
  "NL",
  "NO",
  "NP",
  "NR",
  "NU",
  "NZ",
  "OM",
  "PA",
  "PE",
  "PF",
  "PG",
  "PH",
  "PK",
  "PL",
  "PM",
  "PN",
  "PR",
  "PS",
  "PT",
  "PW",
  "PY",
  "QA",
  "RE",
  "RO",
  "RS",
  "RU",
  "RW",
  "SA",
  "SB",
  "SC",
  "SD",
  "SE",
  "SG",
  "SH",
  "SI",
  "SJ",
  "SK",
  "SL",
  "SM",
  "SN",
  "SO",
  "SR",
  "SS",
  "ST",
  "SV",
  "SX",
  "SY",
  "SZ",
  "TC",
  "TD",
  "TF",
  "TG",
  "TH",
  "TJ",
  "TK",
  "TL",
  "TM",
  "TN",
  "TO",
  "TR",
  "TT",
  "TV",
  "TW",
  "TZ",
  "UA",
  "UG",
  "UM",
  "US",
  "UY",
  "UZ",
  "VA",
  "VC",
  "VE",
  "VG",
  "VI",
  "VN",
  "VU",
  "WF",
  "WS",
  "XK",
  "YE",
  "YT",
  "ZA",
  "ZM",
  "ZW",
] as const;

type CountryCode = (typeof countryCodes)[number];

const countryAliases: Partial<Record<CountryCode, readonly string[]>> = {
  BO: ["Bolivia"],
  CN: ["PRC", "People's Republic of China", "Mainland China", "中国"],
  CZ: ["Czech Republic"],
  GB: ["UK", "U.K.", "United Kingdom", "Britain", "Great Britain", "England"],
  HK: ["Hong Kong"],
  IR: ["Iran"],
  KR: ["South Korea", "Korea"],
  KP: ["North Korea"],
  LA: ["Laos"],
  MD: ["Moldova"],
  MO: ["Macau", "Macao"],
  PS: ["Palestine"],
  RU: ["Russia"],
  SY: ["Syria"],
  TW: ["Taiwan"],
  TZ: ["Tanzania"],
  US: ["US", "USA", "United States of America", "America"],
  VE: ["Venezuela"],
  VN: ["Vietnam"],
  XK: ["Kosovo"],
};

const regionNames =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

export type PassportCountry = {
  code: CountryCode;
  name: string;
  aliases: readonly string[];
};

export const passportCountries: PassportCountry[] = countryCodes
  .map((code) => ({
    code,
    name: regionNames?.of(code) ?? code,
    aliases: countryAliases[code] ?? [],
  }))
  .sort((left, right) => left.name.localeCompare(right.name));

export const movingTimelineOptionGroups = [
  {
    label: "Ready Soon",
    options: ["0-1 Month", "1-3 Months", "3-6 Months"],
  },
  {
    label: "Planning Ahead",
    options: ["6-12 Months", "12+ Months", "Researching"],
  },
  {
    label: "Flexible",
    options: ["Depends On Job Offer", "Depends On School Offer", "Testing Cities"],
  },
] as const;

export const movingTimelineOptions = movingTimelineOptionGroups.flatMap(
  (group) => group.options,
);

export type Lifestyle = (typeof lifestyleOptions)[number];

export type SignalKey =
  | "sponsor"
  | "visa"
  | "job"
  | "community"
  | "transit"
  | "rent"
  | "schools"
  | "food"
  | "social"
  | "safety"
  | "career"
  | "weather"
  | "internet"
  | "costOfLiving";

export type SignalMetric = {
  key: SignalKey;
  label: string;
  score: number;
  detailRows: { label: string; value: string }[];
};

export type Experience = {
  user: string;
  avatar: string;
  duration: string;
  pros: string[];
  cons: string[];
  recommend: boolean;
};

export type LocalSignals = {
  rentTrend: string;
  safetyTrend: string;
  trafficTrend: string;
  costOfLivingTrend: string;
  submittedBy: number;
};

export type CityDataSource = {
  name: string;
  url: string;
  period: string;
  retrievedAt: string;
  metrics: string[];
  license?: string;
};

export type CityDataProvenance = {
  status: "demo" | "mixed" | "verified";
  methodologyVersion: string;
  notice: string;
  sources: CityDataSource[];
};

export type CityHeroImage = {
  url: string;
  sourcePageUrl: string;
  title: string;
  creator: string;
  license: string;
  licenseUrl: string;
  remoteUrl?: string;
  reviewedAt?: string;
  attributionRequired?: boolean;
};

export type LocalFact = {
  rentDefinition?: { primary: boolean; category: string; evidence: string };
  label: string;
  value: string;
  geography: string;
  note: string;
  sourceUrl: string;
  period: string;
};

export type City = {
  populationObservation?: PopulationObservation;
  localFacts?: { rent: LocalFact; migration: LocalFact };
  slug: string;
  name: string;
  state: string;
  country: string;
  heroImage?: CityHeroImage;
  population: string;
  monthlyCost: string;
  costMetric:
    | "estimated-monthly-cost"
    | "median-gross-rent"
    | "housing-cost-proxy"
    | "local-rent-reference"
    | "not-available";
  costMetricLabel: string;
  internetQuality: string;
  overallScore: number;
  matchScore: number;
  migrationFit: number;
  sponsorDensity: string;
  foreignBornShare: string;
  dataConfidence: string;
  summary: string;
  bestFor: string[];
  scores: Record<SignalKey, number>;
  sourceBackedScoreKeys: SignalKey[];
  recommendationCoverage: number;
  migrationSignals: SignalMetric[];
  signals: SignalMetric[];
  dataProvenance: CityDataProvenance;
  experiences: Experience[];
  localSignals: LocalSignals;
  peopleLikeYou: {
    segment: string;
    averageBudget: string;
    topChoices: string[];
  };
};

export const signalLabels: Record<SignalKey, string> = {
  sponsor: "Work Pathways",
  visa: "Visa Path Breadth",
  job: "Job Market Fit",
  community: "Immigrant Community",
  transit: "No-car Transit",
  rent: "Rent affordability",
  schools: "Higher Education Access",
  food: "Dining Access",
  social: "Social & Cultural Access",
  safety: "Safety",
  career: "Career",
  weather: "Weather",
  internet: "Internet",
  costOfLiving: "Living Cost Affordability",
};

const citySeedData: Array<
  Omit<
    City,
    | "costMetric"
    | "costMetricLabel"
    | "dataProvenance"
    | "sourceBackedScoreKeys"
    | "recommendationCoverage"
  >
> = [
  {
    slug: "new-york-city",
    name: "New York City",
    state: "New York",
    country: "United States",
    population: "8.3M",
    monthlyCost: "$4,900",
    internetQuality: "210 Mbps",
    overallScore: 8.8,
    matchScore: 94,
    migrationFit: 9.2,
    sponsorDensity: "Very High",
    foreignBornShare: "36%",
    dataConfidence: "High",
    summary:
      "The strongest all-around migration market: dense H-1B employers, deep immigrant communities, elite universities, and real no-car living with very high rent pressure.",
    bestFor: ["H-1B jobs", "Finance", "No-car lifestyle"],
    scores: {
      sponsor: 9.6,
      visa: 9.1,
      job: 9.5,
      community: 9.3,
      transit: 9.7,
      rent: 4.4,
      schools: 8.8,
      food: 6.9,
      social: 9.4,
      safety: 7.1,
      career: 9.6,
      weather: 6.5,
      internet: 9.1,
      costOfLiving: 4.5,
    },
    migrationSignals: [
      {
        key: "sponsor",
        label: "Sponsor Density",
        score: 9.6,
        detailRows: [
          { label: "Primary Source", value: "USCIS H-1B Hub" },
          { label: "Employer Mix", value: "Finance, tech, healthcare" },
          { label: "Best Visa Path", value: "H-1B / O-1 / OPT" },
          { label: "Data Confidence", value: "High" },
        ],
      },
      {
        key: "community",
        label: "Immigrant Community",
        score: 9.3,
        detailRows: [
          { label: "Foreign-born Share", value: "36%" },
          { label: "Language Support", value: "Very broad" },
          { label: "Integration Speed", value: "Fast" },
          { label: "Primary Source", value: "Census ACS" },
        ],
      },
      {
        key: "transit",
        label: "No-car Transit",
        score: 9.7,
        detailRows: [
          { label: "Car Need", value: "Very low" },
          { label: "Airport Access", value: "Strong" },
          { label: "Daily Commute", value: "Subway / rail" },
          { label: "Local Signal", value: "Stable" },
        ],
      },
    ],
    signals: [
      {
        key: "food",
        label: "Food Cost",
        score: 6.9,
        detailRows: [
          { label: "Average Meal Cost", value: "$18" },
          { label: "Monthly Grocery Cost", value: "$520" },
          { label: "Community Rating", value: "6.9" },
          { label: "Last Updated", value: "2 Days Ago" },
        ],
      },
      {
        key: "safety",
        label: "Safety",
        score: 7.1,
        detailRows: [
          { label: "Crime Source", value: "FBI CDE + local reports" },
          { label: "Walking At Night", value: "Neighborhood dependent" },
          { label: "Community Rating", value: "7.1" },
          { label: "Trend", value: "Stable" },
        ],
      },
      {
        key: "career",
        label: "Career",
        score: 9.6,
        detailRows: [
          { label: "Tech Hiring", value: "Very high" },
          { label: "Finance Market", value: "Very high" },
          { label: "Internship Depth", value: "Very high" },
          { label: "Primary Source", value: "BLS + USCIS" },
        ],
      },
      {
        key: "weather",
        label: "Weather",
        score: 6.5,
        detailRows: [
          { label: "Winter Comfort", value: "Cold" },
          { label: "Summer Humidity", value: "High" },
          { label: "Climate Source", value: "Open-Meteo" },
          { label: "Community Rating", value: "6.5" },
        ],
      },
    ],
    experiences: [
      {
        user: "Aarav",
        avatar: "AA",
        duration: "Stayed 3+ Years",
        pros: ["Huge sponsor market", "No car needed"],
        cons: ["Rent is intense"],
        recommend: true,
      },
      {
        user: "Lina",
        avatar: "LI",
        duration: "Stayed 1-3 Years",
        pros: ["Many immigrant communities", "Career density"],
        cons: ["Hard to save money"],
        recommend: true,
      },
    ],
    localSignals: {
      rentTrend: "Rising",
      safetyTrend: "Stable",
      trafficTrend: "Same",
      costOfLivingTrend: "Up",
      submittedBy: 58,
    },
    peopleLikeYou: {
      segment: "International Software Engineers",
      averageBudget: "$5200",
      topChoices: ["New York City", "Seattle", "Boston"],
    },
  },
  {
    slug: "seattle",
    name: "Seattle",
    state: "Washington",
    country: "United States",
    population: "755K",
    monthlyCost: "$3,750",
    internetQuality: "235 Mbps",
    overallScore: 8.7,
    matchScore: 91,
    migrationFit: 9.0,
    sponsorDensity: "Very High",
    foreignBornShare: "19%",
    dataConfidence: "High",
    summary:
      "A top technology relocation market with concentrated sponsor employers, strong salaries, improving transit, and high but more manageable rent than coastal mega cities.",
    bestFor: ["Big tech", "H-1B jobs", "High salary"],
    scores: {
      sponsor: 9.4,
      visa: 8.9,
      job: 9.6,
      community: 8.1,
      transit: 7.8,
      rent: 5.8,
      schools: 8.4,
      food: 7.2,
      social: 7.6,
      safety: 7.2,
      career: 9.5,
      weather: 6.7,
      internet: 9.4,
      costOfLiving: 5.8,
    },
    migrationSignals: [
      {
        key: "sponsor",
        label: "Sponsor Density",
        score: 9.4,
        detailRows: [
          { label: "Primary Source", value: "USCIS H-1B Hub" },
          { label: "Employer Mix", value: "Cloud, AI, retail tech" },
          { label: "Best Visa Path", value: "H-1B / L-1 / OPT" },
          { label: "Data Confidence", value: "High" },
        ],
      },
      {
        key: "job",
        label: "Job Market Fit",
        score: 9.6,
        detailRows: [
          { label: "Tech Hiring", value: "Very high" },
          { label: "Internship Market", value: "High" },
          { label: "Salary Ceiling", value: "Very high" },
          { label: "Primary Source", value: "BLS + job clusters" },
        ],
      },
      {
        key: "rent",
        label: "Rent Pressure",
        score: 5.8,
        detailRows: [
          { label: "Rent Trend", value: "Rising slowly" },
          { label: "Primary Source", value: "Zillow ZORI" },
          { label: "Roommate Market", value: "Strong" },
          { label: "Local Signal", value: "Manageable with salary" },
        ],
      },
    ],
    signals: [
      {
        key: "food",
        label: "Food Cost",
        score: 7.2,
        detailRows: [
          { label: "Average Meal Cost", value: "$16" },
          { label: "Monthly Grocery Cost", value: "$430" },
          { label: "Community Rating", value: "7.2" },
          { label: "Last Updated", value: "4 Days Ago" },
        ],
      },
      {
        key: "safety",
        label: "Safety",
        score: 7.2,
        detailRows: [
          { label: "Crime Source", value: "FBI CDE" },
          { label: "Walking At Night", value: "Area dependent" },
          { label: "Community Rating", value: "7.2" },
          { label: "Trend", value: "Stable" },
        ],
      },
      {
        key: "career",
        label: "Career",
        score: 9.5,
        detailRows: [
          { label: "Tech Hiring", value: "Very high" },
          { label: "Startup Density", value: "High" },
          { label: "English At Work", value: "Common" },
          { label: "Community Rating", value: "9.5" },
        ],
      },
      {
        key: "weather",
        label: "Weather",
        score: 6.7,
        detailRows: [
          { label: "Rain Season", value: "Long" },
          { label: "Summer Comfort", value: "Excellent" },
          { label: "Climate Source", value: "Open-Meteo" },
          { label: "Community Rating", value: "6.7" },
        ],
      },
    ],
    experiences: [
      {
        user: "Mei",
        avatar: "ME",
        duration: "Stayed 1-3 Years",
        pros: ["Sponsor employers everywhere", "Strong pay"],
        cons: ["Rain affects social life"],
        recommend: true,
      },
      {
        user: "Daniel",
        avatar: "DA",
        duration: "Stayed 3-12 Months",
        pros: ["Great for cloud engineers", "Easy outdoor access"],
        cons: ["Neighborhood choice matters"],
        recommend: true,
      },
    ],
    localSignals: {
      rentTrend: "Same",
      safetyTrend: "Stable",
      trafficTrend: "Worse",
      costOfLivingTrend: "Up",
      submittedBy: 36,
    },
    peopleLikeYou: {
      segment: "Cloud Engineers",
      averageBudget: "$4300",
      topChoices: ["Seattle", "Austin", "New York City"],
    },
  },
  {
    slug: "boston",
    name: "Boston",
    state: "Massachusetts",
    country: "United States",
    population: "650K",
    monthlyCost: "$4,100",
    internetQuality: "200 Mbps",
    overallScore: 8.5,
    matchScore: 89,
    migrationFit: 8.7,
    sponsorDensity: "High",
    foreignBornShare: "29%",
    dataConfidence: "High",
    summary:
      "A strong student-to-career bridge with universities, hospitals, biotech employers, international student density, and serious housing competition.",
    bestFor: ["Students", "Biotech", "Healthcare"],
    scores: {
      sponsor: 8.6,
      visa: 8.8,
      job: 8.7,
      community: 8.5,
      transit: 8.5,
      rent: 4.9,
      schools: 9.5,
      food: 6.8,
      social: 8.0,
      safety: 7.8,
      career: 8.8,
      weather: 6.1,
      internet: 8.8,
      costOfLiving: 5.1,
    },
    migrationSignals: [
      {
        key: "schools",
        label: "School Quality",
        score: 9.5,
        detailRows: [
          { label: "University Density", value: "Very high" },
          { label: "Internship Pipeline", value: "Strong" },
          { label: "Primary Source", value: "NCES + local clusters" },
          { label: "Data Confidence", value: "High" },
        ],
      },
      {
        key: "visa",
        label: "Visa Friendliness",
        score: 8.8,
        detailRows: [
          { label: "OPT Fit", value: "Very strong" },
          { label: "H-1B Sponsors", value: "High" },
          { label: "Industry Fit", value: "Healthcare, biotech, edtech" },
          { label: "Primary Source", value: "USCIS H-1B Hub" },
        ],
      },
      {
        key: "community",
        label: "Immigrant Community",
        score: 8.5,
        detailRows: [
          { label: "Foreign-born Share", value: "29%" },
          { label: "Student Community", value: "Very high" },
          { label: "Language Support", value: "Broad" },
          { label: "Primary Source", value: "Census ACS" },
        ],
      },
    ],
    signals: [
      {
        key: "food",
        label: "Food Cost",
        score: 6.8,
        detailRows: [
          { label: "Average Meal Cost", value: "$17" },
          { label: "Monthly Grocery Cost", value: "$480" },
          { label: "Community Rating", value: "6.8" },
          { label: "Last Updated", value: "5 Days Ago" },
        ],
      },
      {
        key: "safety",
        label: "Safety",
        score: 7.8,
        detailRows: [
          { label: "Crime Source", value: "FBI CDE" },
          { label: "Walking At Night", value: "Generally comfortable" },
          { label: "Community Rating", value: "7.8" },
          { label: "Trend", value: "Stable" },
        ],
      },
      {
        key: "career",
        label: "Career",
        score: 8.8,
        detailRows: [
          { label: "Biotech Hiring", value: "Very high" },
          { label: "Healthcare Hiring", value: "High" },
          { label: "Student Pipeline", value: "Very high" },
          { label: "Community Rating", value: "8.8" },
        ],
      },
      {
        key: "weather",
        label: "Weather",
        score: 6.1,
        detailRows: [
          { label: "Winter Comfort", value: "Cold" },
          { label: "Summer Comfort", value: "Good" },
          { label: "Climate Source", value: "Open-Meteo" },
          { label: "Community Rating", value: "6.1" },
        ],
      },
    ],
    experiences: [
      {
        user: "Nora",
        avatar: "NO",
        duration: "Stayed 3+ Years",
        pros: ["Student community", "Hospital jobs"],
        cons: ["Apartment search is brutal"],
        recommend: true,
      },
      {
        user: "Chen",
        avatar: "CH",
        duration: "Stayed 1-3 Years",
        pros: ["OPT pipeline", "Walkable core"],
        cons: ["Winter is hard"],
        recommend: true,
      },
    ],
    localSignals: {
      rentTrend: "Rising",
      safetyTrend: "Stable",
      trafficTrend: "Same",
      costOfLivingTrend: "Up",
      submittedBy: 44,
    },
    peopleLikeYou: {
      segment: "International Graduate Students",
      averageBudget: "$3600",
      topChoices: ["Boston", "New York City", "Atlanta"],
    },
  },
  {
    slug: "austin",
    name: "Austin",
    state: "Texas",
    country: "United States",
    population: "980K",
    monthlyCost: "$3,050",
    internetQuality: "220 Mbps",
    overallScore: 8.2,
    matchScore: 86,
    migrationFit: 8.1,
    sponsorDensity: "High",
    foreignBornShare: "19%",
    dataConfidence: "Medium High",
    summary:
      "A lower-tax tech relocation market with strong startup energy, growing sponsor density, car dependency, and rent that has cooled from peak pressure.",
    bestFor: ["Startups", "Lower tax", "Tech jobs"],
    scores: {
      sponsor: 8.1,
      visa: 7.7,
      job: 8.8,
      community: 7.3,
      transit: 4.7,
      rent: 6.8,
      schools: 7.9,
      food: 7.8,
      social: 8.5,
      safety: 7.0,
      career: 8.7,
      weather: 7.2,
      internet: 9.0,
      costOfLiving: 7.0,
    },
    migrationSignals: [
      {
        key: "job",
        label: "Job Market Fit",
        score: 8.8,
        detailRows: [
          { label: "Tech Hiring", value: "High" },
          { label: "Startup Density", value: "High" },
          { label: "Primary Source", value: "BLS + employer clusters" },
          { label: "Data Confidence", value: "Medium High" },
        ],
      },
      {
        key: "sponsor",
        label: "Sponsor Density",
        score: 8.1,
        detailRows: [
          { label: "H-1B Sponsors", value: "High and growing" },
          { label: "Employer Mix", value: "Enterprise tech, chips, startups" },
          { label: "Primary Source", value: "USCIS H-1B Hub" },
          { label: "Best Visa Path", value: "H-1B / OPT" },
        ],
      },
      {
        key: "transit",
        label: "No-car Transit",
        score: 4.7,
        detailRows: [
          { label: "Car Need", value: "High" },
          { label: "Commute Risk", value: "Area dependent" },
          { label: "Local Signal", value: "Traffic worse" },
          { label: "Decision Note", value: "Budget for a car" },
        ],
      },
    ],
    signals: [
      {
        key: "food",
        label: "Food Cost",
        score: 7.8,
        detailRows: [
          { label: "Average Meal Cost", value: "$14" },
          { label: "Monthly Grocery Cost", value: "$390" },
          { label: "Community Rating", value: "7.8" },
          { label: "Last Updated", value: "3 Days Ago" },
        ],
      },
      {
        key: "safety",
        label: "Safety",
        score: 7.0,
        detailRows: [
          { label: "Crime Source", value: "FBI CDE" },
          { label: "Walking At Night", value: "Neighborhood dependent" },
          { label: "Community Rating", value: "7.0" },
          { label: "Trend", value: "Stable" },
        ],
      },
      {
        key: "career",
        label: "Career",
        score: 8.7,
        detailRows: [
          { label: "Tech Hiring", value: "High" },
          { label: "Startup Density", value: "High" },
          { label: "Salary Growth", value: "Strong" },
          { label: "Community Rating", value: "8.7" },
        ],
      },
      {
        key: "weather",
        label: "Weather",
        score: 7.2,
        detailRows: [
          { label: "Summer Heat", value: "Very high" },
          { label: "Winter Comfort", value: "Mild" },
          { label: "Climate Source", value: "Open-Meteo" },
          { label: "Community Rating", value: "7.2" },
        ],
      },
    ],
    experiences: [
      {
        user: "Sara",
        avatar: "SA",
        duration: "Stayed 1-3 Years",
        pros: ["Startup scene", "More space for rent"],
        cons: ["Need a car"],
        recommend: true,
      },
      {
        user: "Miguel",
        avatar: "MI",
        duration: "Stayed 3-12 Months",
        pros: ["Tech meetups", "Good salaries"],
        cons: ["Summer heat"],
        recommend: true,
      },
    ],
    localSignals: {
      rentTrend: "Same",
      safetyTrend: "Stable",
      trafficTrend: "Worse",
      costOfLivingTrend: "Same",
      submittedBy: 31,
    },
    peopleLikeYou: {
      segment: "Startup Engineers",
      averageBudget: "$3600",
      topChoices: ["Austin", "Seattle", "Atlanta"],
    },
  },
  {
    slug: "atlanta",
    name: "Atlanta",
    state: "Georgia",
    country: "United States",
    population: "510K",
    monthlyCost: "$2,650",
    internetQuality: "190 Mbps",
    overallScore: 8.0,
    matchScore: 84,
    migrationFit: 7.9,
    sponsorDensity: "Medium High",
    foreignBornShare: "14%",
    dataConfidence: "Medium High",
    summary:
      "A cost-sensitive relocation option with logistics, healthcare, fintech, universities, and airport access, balanced by car dependency and neighborhood-level safety variance.",
    bestFor: ["Lower cost", "Logistics", "Healthcare"],
    scores: {
      sponsor: 7.5,
      visa: 7.4,
      job: 8.1,
      community: 7.2,
      transit: 5.2,
      rent: 7.3,
      schools: 8.0,
      food: 8.0,
      social: 8.1,
      safety: 6.4,
      career: 8.0,
      weather: 7.9,
      internet: 8.4,
      costOfLiving: 7.6,
    },
    migrationSignals: [
      {
        key: "rent",
        label: "Rent Pressure",
        score: 7.3,
        detailRows: [
          { label: "Rent Trend", value: "Moderate" },
          { label: "Primary Source", value: "Zillow ZORI" },
          { label: "Entry Budget", value: "Lower than coastal markets" },
          { label: "Data Confidence", value: "Medium High" },
        ],
      },
      {
        key: "job",
        label: "Job Market Fit",
        score: 8.1,
        detailRows: [
          { label: "Industry Fit", value: "Logistics, healthcare, fintech" },
          { label: "Internship Market", value: "Medium high" },
          { label: "Primary Source", value: "BLS + employer clusters" },
          { label: "Airport Access", value: "Very strong" },
        ],
      },
      {
        key: "schools",
        label: "School Quality",
        score: 8.0,
        detailRows: [
          { label: "University Density", value: "High" },
          { label: "Student Fit", value: "Strong" },
          { label: "Primary Source", value: "NCES" },
          { label: "Local Note", value: "Good for campus-to-job paths" },
        ],
      },
    ],
    signals: [
      {
        key: "food",
        label: "Food Cost",
        score: 8.0,
        detailRows: [
          { label: "Average Meal Cost", value: "$13" },
          { label: "Monthly Grocery Cost", value: "$360" },
          { label: "Community Rating", value: "8.0" },
          { label: "Last Updated", value: "6 Days Ago" },
        ],
      },
      {
        key: "safety",
        label: "Safety",
        score: 6.4,
        detailRows: [
          { label: "Crime Source", value: "FBI CDE" },
          { label: "Walking At Night", value: "Neighborhood dependent" },
          { label: "Community Rating", value: "6.4" },
          { label: "Trend", value: "Stable" },
        ],
      },
      {
        key: "career",
        label: "Career",
        score: 8.0,
        detailRows: [
          { label: "Logistics Hiring", value: "Very high" },
          { label: "Healthcare Hiring", value: "High" },
          { label: "Fintech Hiring", value: "Growing" },
          { label: "Community Rating", value: "8.0" },
        ],
      },
      {
        key: "weather",
        label: "Weather",
        score: 7.9,
        detailRows: [
          { label: "Winter Comfort", value: "Mild" },
          { label: "Summer Humidity", value: "High" },
          { label: "Climate Source", value: "Open-Meteo" },
          { label: "Community Rating", value: "7.9" },
        ],
      },
    ],
    experiences: [
      {
        user: "Jin",
        avatar: "JI",
        duration: "Stayed 1-3 Years",
        pros: ["Lower rent", "Airport access"],
        cons: ["Car dependent"],
        recommend: true,
      },
      {
        user: "Amara",
        avatar: "AM",
        duration: "Stayed 3+ Years",
        pros: ["Healthcare jobs", "Warm community"],
        cons: ["Safety varies by area"],
        recommend: true,
      },
    ],
    localSignals: {
      rentTrend: "Same",
      safetyTrend: "Stable",
      trafficTrend: "Worse",
      costOfLivingTrend: "Same",
      submittedBy: 28,
    },
    peopleLikeYou: {
      segment: "Healthcare And Logistics Workers",
      averageBudget: "$3100",
      topChoices: ["Atlanta", "Austin", "Boston"],
    },
  },
];

type PublicCityMetrics = {
  slug: string;
  geographyName: string;
  geography: {
    type: "place";
    stateFips: string;
    placeFips: string;
  };
  population: number;
  foreignBornShare: number;
  medianGrossRent: number;
  medianHouseholdIncome: number;
  unemploymentRate: number;
  publicTransitShare: number;
  noCarCommuteShare: number;
};

type PublicMetricsSnapshot = {
  generatedAt: string | null;
  dataset: string;
  datasetYear: string | null;
  sourceUrl?: string;
  cities: PublicCityMetrics[];
};

const syncedMetrics = publicMetricsSnapshot as PublicMetricsSnapshot;
const syncedMetricsBySlug = new Map(
  syncedMetrics.cities.map((city) => [city.slug, city]),
);

function clampScore(value: number) {
  return Number(Math.min(10, Math.max(0, value)).toFixed(1));
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString("en-US")}`;
}

function hydrateSignals(
  signals: SignalMetric[],
  scores: Record<SignalKey, number>,
  metric: PublicCityMetrics,
) {
  const detailRows: Partial<Record<SignalKey, SignalMetric["detailRows"]>> = {
    community: [
      { label: "Foreign-born share", value: `${metric.foreignBornShare}%` },
      { label: "Geography", value: metric.geographyName },
      { label: "Primary source", value: `${syncedMetrics.dataset} ${syncedMetrics.datasetYear}` },
    ],
    job: [
      { label: "Unemployment rate", value: `${metric.unemploymentRate}%` },
      {
        label: "Median household income",
        value: formatCurrency(metric.medianHouseholdIncome),
      },
      { label: "Primary source", value: `${syncedMetrics.dataset} ${syncedMetrics.datasetYear}` },
    ],
    transit: [
      { label: "Public-transit commute", value: `${metric.publicTransitShare}%` },
      { label: "Transit, bike, or walk", value: `${metric.noCarCommuteShare}%` },
      { label: "Primary source", value: `${syncedMetrics.dataset} ${syncedMetrics.datasetYear}` },
    ],
    rent: [
      { label: "Median gross rent", value: `${formatCurrency(metric.medianGrossRent)}/mo` },
      { label: "Geography", value: metric.geographyName },
      { label: "Primary source", value: `${syncedMetrics.dataset} ${syncedMetrics.datasetYear}` },
    ],
    costOfLiving: [
      { label: "Median gross rent", value: `${formatCurrency(metric.medianGrossRent)}/mo` },
      {
        label: "Median household income",
        value: formatCurrency(metric.medianHouseholdIncome),
      },
      { label: "Primary source", value: `${syncedMetrics.dataset} ${syncedMetrics.datasetYear}` },
    ],
  };

  return signals.map((signal) => ({
    ...signal,
    score: scores[signal.key],
    detailRows: detailRows[signal.key] ?? signal.detailRows,
  }));
}

function hydrateCity(
  seed: Omit<
    City,
    | "costMetric"
    | "costMetricLabel"
    | "dataProvenance"
    | "sourceBackedScoreKeys"
    | "recommendationCoverage"
  >,
): City {
  const metric = syncedMetricsBySlug.get(seed.slug);

  if (!metric || !syncedMetrics.generatedAt || !syncedMetrics.datasetYear) {
    return {
      ...seed,
      costMetric: "estimated-monthly-cost",
      costMetricLabel: "Estimated monthly cost",
      sourceBackedScoreKeys: [],
      recommendationCoverage: 0,
      dataProvenance: {
        status: "demo",
        methodologyVersion: "prototype",
        notice:
          "No official snapshot has been synced yet. Numbers, scores, experiences, and rankings on this city are prototype content and must not be treated as factual.",
        sources: [],
      },
    };
  }

  const rentScore = clampScore(10 - (metric.medianGrossRent - 700) / 230);
  const communityScore = clampScore((metric.foreignBornShare - 5) / 3.5);
  const transitScore = clampScore(metric.noCarCommuteShare / 4);
  const jobScore = clampScore(10 - (metric.unemploymentRate - 2) * 1.3);
  const rentToIncome =
    metric.medianGrossRent / (metric.medianHouseholdIncome / 12);
  const costOfLivingScore = clampScore((0.5 - rentToIncome) * 40);
  const scores = {
    ...seed.scores,
    community: communityScore,
    transit: transitScore,
    rent: rentScore,
    job: jobScore,
    costOfLiving: costOfLivingScore,
  };
  const sourceBackedScoreKeys: SignalKey[] = [
    "community",
    "transit",
    "rent",
    "job",
    "costOfLiving",
  ];
  const availableFit =
    sourceBackedScoreKeys.reduce((total, key) => total + scores[key], 0) /
    sourceBackedScoreKeys.length;
  const source: CityDataSource = {
    name: syncedMetrics.dataset,
    url:
      syncedMetrics.sourceUrl ??
      "https://www.census.gov/data/developers/data-sets/acs-5year.html",
    period: `${syncedMetrics.datasetYear} 5-year estimates`,
    retrievedAt: syncedMetrics.generatedAt,
    metrics: [
      "Population",
      "Foreign-born share",
      "Median gross rent",
      "Median household income",
      "Unemployment rate",
      "Commute mode share",
    ],
  };

  return {
    ...seed,
    population: formatCompactNumber(metric.population),
    monthlyCost: formatCurrency(metric.medianGrossRent),
    costMetric: "median-gross-rent",
    costMetricLabel: "Median gross rent",
    foreignBornShare: `${metric.foreignBornShare}%`,
    overallScore: Number(availableFit.toFixed(1)),
    matchScore: Math.round(availableFit * 10),
    migrationFit: Number(availableFit.toFixed(1)),
    scores,
    sourceBackedScoreKeys,
    recommendationCoverage: sourceBackedScoreKeys.length / 14,
    migrationSignals: hydrateSignals(seed.migrationSignals, scores, metric).filter(
      (signal) => sourceBackedScoreKeys.includes(signal.key),
    ),
    signals: hydrateSignals(seed.signals, scores, metric).filter((signal) =>
      sourceBackedScoreKeys.includes(signal.key),
    ),
    dataConfidence: "Medium High",
    dataProvenance: {
      status: "mixed",
      methodologyVersion: "lp-acs-v1",
      notice:
        "Population, rent, income, foreign-born share, unemployment, and commute metrics use official ACS estimates. Unsupported sponsor, safety, weather, internet, and other scores are excluded from recommendations.",
      sources: [source],
    },
  };
}

type MetricObservation = {
  value: number;
  year: string;
  indicatorCode: string;
};

type GlobalCityMetric = {
  slug: string;
  name: string;
  subdivision: string;
  country: string;
  heroImage?: CityHeroImage;
  wikidataId: string;
  population: number;
  populationAsOf: string | null;
  populationReview: {
    confidence: string;
    selectionReason: string;
    comparison: {
      source: string;
      value: number;
      differencePercent: number;
    } | null;
  };
  climate: {
    annualMeanC: number;
    warmestMonth: { month: string; value: number };
    coldestMonth: { month: string; value: number };
    period: string;
  };
  countryContext: {
    unemploymentRate: MetricObservation;
    internetUseShare: MetricObservation;
    migrantStockShare: MetricObservation;
    homicideRate: MetricObservation;
    gdpPerCapitaPpp: MetricObservation;
    tertiaryEnrollmentRate: MetricObservation;
    priceLevelRatio: MetricObservation;
  };
  policy: {
    workPathScore: number;
    visaBreadthScore: number;
    label: string;
    sourceUrl: string;
    geography: string;
    reviewedAt: string;
    disclaimer: string;
  };
  osm: {
    amenityRadiusKm: number;
    transitCoreRadiusKm: number;
    transitMetroRadiusKm: number;
    universityCount: number;
    foodVenueCount: number;
    socialVenueCount: number;
    transitCoreLocationCount: number;
    transitMetroLocationCount: number;
    sourceTimestamp: string;
  };
  sources: Array<{
    name: string;
    sourceUrl: string;
    period: string;
    metrics: string[];
    license?: string;
  }>;
};

type CityImageAsset = CityHeroImage & {
  attributionRequired: boolean;
};

const cityImagesBySlug = new Map(
  Object.entries(cityImageAssets as Record<string, CityImageAsset>).map(
    ([slug, image]) => [slug, image] as const,
  ),
);

type GlobalMetricsSnapshot = {
  generatedAt: string | null;
  cities: GlobalCityMetric[];
};

const globalMetrics = globalMetricsSnapshot as GlobalMetricsSnapshot;
const monthNames: Record<string, string> = {
  JAN: "January",
  FEB: "February",
  MAR: "March",
  APR: "April",
  MAY: "May",
  JUN: "June",
  JUL: "July",
  AUG: "August",
  SEP: "September",
  OCT: "October",
  NOV: "November",
  DEC: "December",
};

function weatherComfortScore(metric: GlobalCityMetric) {
  const coldPenalty = Math.max(0, 8 - metric.climate.coldestMonth.value) * 0.22;
  const heatPenalty = Math.max(0, metric.climate.warmestMonth.value - 26) * 0.28;
  return clampScore(10 - coldPenalty - heatPenalty);
}

function normalizedScore(
  value: number,
  values: number[],
  direction: "higher" | "lower" = "higher",
  logarithmic = false,
) {
  const transform = (item: number) => logarithmic ? Math.log1p(item) : item;
  const transformed = values.map(transform);
  const minimum = Math.min(...transformed);
  const maximum = Math.max(...transformed);
  const position = maximum === minimum
    ? 0.5
    : (transform(value) - minimum) / (maximum - minimum);
  return clampScore(2 + (direction === "higher" ? position : 1 - position) * 8);
}

const globalMetricValues = {
  unemployment: globalMetrics.cities.map((city) => city.countryContext.unemploymentRate.value),
  internet: globalMetrics.cities.map((city) => city.countryContext.internetUseShare.value),
  migrantStock: globalMetrics.cities.map((city) => city.countryContext.migrantStockShare.value),
  homicide: globalMetrics.cities.map((city) => city.countryContext.homicideRate.value),
  gdp: globalMetrics.cities.map((city) => city.countryContext.gdpPerCapitaPpp.value),
  tertiary: globalMetrics.cities.map((city) => city.countryContext.tertiaryEnrollmentRate.value),
  priceLevel: globalMetrics.cities.map((city) => city.countryContext.priceLevelRatio.value),
  universities: globalMetrics.cities.map((city) => city.osm.universityCount),
  food: globalMetrics.cities.map((city) => city.osm.foodVenueCount),
  social: globalMetrics.cities.map((city) => city.osm.socialVenueCount),
  transitCoreDensity: globalMetrics.cities.map((city) =>
    city.osm.transitCoreLocationCount / (Math.PI * city.osm.transitCoreRadiusKm ** 2)),
  transitMetroDensity: globalMetrics.cities.map((city) =>
    city.osm.transitMetroLocationCount / (Math.PI * city.osm.transitMetroRadiusKm ** 2)),
};

function scoreLabel(score: number) {
  if (score >= 8.5) return "Very broad";
  if (score >= 7) return "Broad";
  if (score >= 5.5) return "Moderate";
  if (score >= 4) return "Limited";
  return "Very limited";
}

function metricSignal(
  key: SignalKey,
  score: number,
  detailRows: SignalMetric["detailRows"],
): SignalMetric {
  return { key, label: signalLabels[key], score, detailRows };
}

function createGlobalCity(metric: GlobalCityMetric): City {
  const weatherScore = weatherComfortScore(metric);
  const context = metric.countryContext;
  const unemploymentScore = normalizedScore(context.unemploymentRate.value, globalMetricValues.unemployment, "lower");
  const gdpScore = normalizedScore(context.gdpPerCapitaPpp.value, globalMetricValues.gdp, "higher", true);
  const costScore = normalizedScore(context.priceLevelRatio.value, globalMetricValues.priceLevel, "lower");
  const cityPressure = normalizedScore(metric.population, globalMetrics.cities.map((city) => city.population), "lower", true);
  const jobScore = clampScore(unemploymentScore * 0.7 + gdpScore * 0.3);
  const schoolScore = clampScore(
    normalizedScore(metric.osm.universityCount, globalMetricValues.universities, "higher", true) * 0.65 +
    normalizedScore(context.tertiaryEnrollmentRate.value, globalMetricValues.tertiary) * 0.35,
  );
  const coreTransitDensity = metric.osm.transitCoreLocationCount /
    (Math.PI * metric.osm.transitCoreRadiusKm ** 2);
  const metroTransitDensity = metric.osm.transitMetroLocationCount /
    (Math.PI * metric.osm.transitMetroRadiusKm ** 2);
  const amenityAreaKm2 = Math.PI * metric.osm.amenityRadiusKm ** 2;
  const universityDensity = metric.osm.universityCount / amenityAreaKm2;
  const foodDensity = metric.osm.foodVenueCount / amenityAreaKm2;
  const socialDensity = metric.osm.socialVenueCount / amenityAreaKm2;
  const transitScore = clampScore(
    normalizedScore(coreTransitDensity, globalMetricValues.transitCoreDensity, "higher", true) * 0.6 +
    normalizedScore(metroTransitDensity, globalMetricValues.transitMetroDensity, "higher", true) * 0.4,
  );
  const scores: Record<SignalKey, number> = {
    sponsor: clampScore(metric.policy.workPathScore),
    visa: clampScore(metric.policy.visaBreadthScore),
    job: jobScore,
    community: normalizedScore(context.migrantStockShare.value, globalMetricValues.migrantStock),
    transit: transitScore,
    rent: clampScore(costScore * 0.7 + cityPressure * 0.3),
    schools: schoolScore,
    food: normalizedScore(metric.osm.foodVenueCount, globalMetricValues.food, "higher", true),
    social: normalizedScore(metric.osm.socialVenueCount, globalMetricValues.social, "higher", true),
    safety: normalizedScore(context.homicideRate.value, globalMetricValues.homicide, "lower", true),
    career: clampScore(jobScore * 0.55 + gdpScore * 0.45),
    weather: weatherScore,
    internet: normalizedScore(context.internetUseShare.value, globalMetricValues.internet),
    costOfLiving: costScore,
  };
  const sourceBackedScoreKeys = Object.keys(signalLabels) as SignalKey[];
  const comparison = metric.populationReview.comparison;
  const overallScore = clampScore(
    sourceBackedScoreKeys.reduce((total, key) => total + scores[key], 0) /
      sourceBackedScoreKeys.length,
  );
  const indexValue = Math.round(context.priceLevelRatio.value * 100);
  const nationalRow = (label: string, observation: MetricObservation) => ({
    label,
    value: `${observation.value.toLocaleString("en-US", { maximumFractionDigits: 1 })} · ${observation.year}`,
  });
  const cityRadius = `${metric.osm.amenityRadiusKm} km around city center`;
  const migrationSignals = [
    metricSignal("sponsor", scores.sponsor, [
      { label: "Official pathway review", value: metric.policy.label },
      { label: "Geography", value: metric.policy.geography },
      { label: "Reviewed", value: metric.policy.reviewedAt },
    ]),
    metricSignal("visa", scores.visa, [
      { label: "Comparative breadth", value: scoreLabel(scores.visa) },
      { label: "Official pathway review", value: metric.policy.label },
      { label: "Important", value: "Not an eligibility decision" },
    ]),
    metricSignal("community", scores.community, [
      nationalRow("National migrant stock (%)", context.migrantStockShare),
      { label: "Geography", value: metric.policy.geography },
      { label: "Source", value: "World Bank WDI" },
    ]),
    metricSignal("job", scores.job, [
      nationalRow("National unemployment (%)", context.unemploymentRate),
      nationalRow("GDP per capita, PPP (US$)", context.gdpPerCapitaPpp),
      { label: "Method", value: "70% unemployment + 30% GDP PPP" },
    ]),
  ];
  const signals = [
    metricSignal("transit", scores.transit, [
      { label: "Core-area map records", value: `${metric.osm.transitCoreLocationCount.toLocaleString("en-US")} within ${metric.osm.transitCoreRadiusKm} km` },
      { label: "Wider-area map records", value: `${metric.osm.transitMetroLocationCount.toLocaleString("en-US")} within ${metric.osm.transitMetroRadiusKm} km` },
      { label: "Core density", value: `${coreTransitDensity.toFixed(1)} records/km²` },
      { label: "Wider-area density", value: `${metroTransitDensity.toFixed(1)} records/km²` },
      { label: "Includes", value: "Stops, stations, platforms, and entrances" },
      { label: "Score method", value: "60% core density + 40% wider-area density" },
      { label: "How to read this", value: "Map records, not unique stations or a service-quality rating" },
      { label: "Source", value: "OpenStreetMap" },
    ]),
    metricSignal("rent", scores.rent, [
      { label: "National price-level index", value: `${indexValue} (US = 100)` },
      { label: "City pressure input", value: `${formatCompactNumber(metric.population)} population` },
      { label: "Method", value: "70% price level + 30% population pressure" },
    ]),
    metricSignal("schools", scores.schools, [
      { label: "Mapped higher-education locations", value: metric.osm.universityCount.toLocaleString("en-US") },
      { label: "Map-record density", value: `${universityDensity.toFixed(2)} records/km²` },
      nationalRow("National tertiary enrollment (%)", context.tertiaryEnrollmentRate),
      { label: "Area measured", value: cityRadius },
      { label: "How to read this", value: "Map records, not independent institutions or a quality ranking" },
      { label: "Source", value: "OpenStreetMap + World Bank WDI" },
    ]),
    metricSignal("food", scores.food, [
      { label: "Mapped places to eat", value: metric.osm.foodVenueCount.toLocaleString("en-US") },
      { label: "Map-record density", value: `${foodDensity.toFixed(1)} records/km²` },
      { label: "Area measured", value: cityRadius },
      { label: "Includes", value: "Restaurants, cafés, fast food, and food courts" },
      { label: "Score method", value: "Catalog-relative log scale within the same fixed area" },
      { label: "How to read this", value: "Dining availability proxy, not food price or quality" },
      { label: "Source", value: "OpenStreetMap" },
    ]),
    metricSignal("social", scores.social, [
      { label: "Mapped social & cultural venues", value: metric.osm.socialVenueCount.toLocaleString("en-US") },
      { label: "Map-record density", value: `${socialDensity.toFixed(1)} records/km²` },
      { label: "Area measured", value: cityRadius },
      { label: "Includes", value: "Bars, pubs, nightclubs, cinemas, and theatres" },
      { label: "Score method", value: "Catalog-relative log scale within the same fixed area" },
      { label: "How to read this", value: "Venue-access proxy, not a rating of social experience" },
      { label: "Source", value: "OpenStreetMap" },
    ]),
    metricSignal("safety", scores.safety, [
      nationalRow("National homicide rate / 100k", context.homicideRate),
      { label: "Geography", value: metric.policy.geography },
      { label: "Caution", value: "Not a neighborhood crime score" },
    ]),
    metricSignal("career", scores.career, [
      nationalRow("GDP per capita, PPP (US$)", context.gdpPerCapitaPpp),
      nationalRow("National unemployment (%)", context.unemploymentRate),
      { label: "Method", value: "Job context + GDP PPP" },
    ]),
    metricSignal("weather", scores.weather, [
      { label: "Annual mean", value: `${metric.climate.annualMeanC} C` },
      { label: "Warmest monthly mean", value: `${monthNames[metric.climate.warmestMonth.month]} · ${metric.climate.warmestMonth.value} C` },
      { label: "Coldest monthly mean", value: `${monthNames[metric.climate.coldestMonth.month]} · ${metric.climate.coldestMonth.value} C` },
      { label: "Climate period", value: metric.climate.period },
    ]),
    metricSignal("internet", scores.internet, [
      nationalRow("Population using internet (%)", context.internetUseShare),
      { label: "Geography", value: metric.policy.geography },
      { label: "Source", value: "World Bank WDI" },
    ]),
    metricSignal("costOfLiving", scores.costOfLiving, [
      { label: "National price-level index", value: `${indexValue} (US = 100)` },
      { label: "Indicator year", value: context.priceLevelRatio.year },
      { label: "Method", value: "PPP conversion factor / exchange rate" },
    ]),
  ];

  return {
    slug: metric.slug,
    name: metric.name,
    state: metric.subdivision,
    country: metric.country,
    heroImage: cityImagesBySlug.get(metric.slug) ?? metric.heroImage,
    population: formatCompactNumber(metric.population),
    monthlyCost: "City data unavailable",
    costMetric: "not-available",
    costMetricLabel: "Monthly living costs",
    internetQuality: `${context.internetUseShare.value}% national internet use`,
    overallScore,
    matchScore: Math.round(overallScore * 10),
    migrationFit: overallScore,
    sponsorDensity: `${scoreLabel(scores.sponsor)} · ${metric.policy.label}`,
    foreignBornShare: "City data unavailable",
    dataConfidence:
      metric.populationReview.confidence === "boundary-review-needed"
        ? "Boundary review needed"
        : "Multi-source, model-derived",
    summary:
      `${metric.name} is part of LandingPoint's reviewed global catalog. ` +
      "All comparison signals use traceable public observations. City-level map and climate data are combined with national context; cost and migration fit are transparent model-derived proxies, not quoted rent or legal advice.",
    bestFor: ["Global comparison", "Public-data context", "Reviewed pathways"],
    scores,
    sourceBackedScoreKeys,
    recommendationCoverage: sourceBackedScoreKeys.length / 14,
    migrationSignals,
    signals,
    dataProvenance: {
      status: "mixed",
      methodologyVersion: "lp-global-catalog-v1",
      notice:
        `Population uses the reviewed Wikidata city entity (${metric.wikidataId}) and is checked against GeoNames when the geography is comparable. ` +
        `${comparison ? `The comparison differs by ${comparison.differencePercent}%. ` : "No same-boundary GeoNames comparison was available. "}` +
        "Climate uses NASA POWER; local map counts use OpenStreetMap. World Bank indicators provide national context. Scores are LandingPoint calculations, not official ratings. Only eligible metrics contribute to rankings; immigration guidance is not scored. Each observation has its own date and geographic scope. Local rent references are not guaranteed prices, and scores do not establish neighborhood safety or personal visa eligibility.",
      sources: metric.sources.map((source) => ({
        name: source.name,
        url: source.sourceUrl,
        period: source.period,
        retrievedAt: globalMetrics.generatedAt ?? "Not synced",
        metrics: source.metrics,
        license: source.license,
      })),
    },
    experiences: [],
    localSignals: {
      rentTrend: "Not available",
      safetyTrend: "Not available",
      trafficTrend: "Not available",
      costOfLivingTrend: "Not available",
      submittedBy: 0,
    },
    peopleLikeYou: {
      segment: "No verified cohort yet",
      averageBudget: "Not available",
      topChoices: [],
    },
  };
}

const reviewedGlobalCities = globalMetrics.generatedAt
  ? globalMetrics.cities.map(createGlobalCity)
  : [];

const seedBySlug = new Map(citySeedData.map((city) => [city.slug, city]));
const globalBySlug = new Map(reviewedGlobalCities.map((city) => [city.slug, city]));
const usCities = citySeedData.map((seed) => {
  const acsCity = hydrateCity(seed);
  const globalCity = globalBySlug.get(seed.slug);
  if (!globalCity || acsCity.dataProvenance.status === "demo") return acsCity;
  const acsMetric = syncedMetricsBySlug.get(seed.slug)!;

  // Keep transit scoring and explanation on the same OSM-density basis for every city.
  const acsKeys: SignalKey[] = ["community", "rent", "job", "costOfLiving"];
  const scores = { ...globalCity.scores };
  acsKeys.forEach((key) => { scores[key] = acsCity.scores[key]; });
  const signalsByKey = new Map(
    [...globalCity.migrationSignals, ...globalCity.signals].map((signal) => [
      signal.key,
      signal,
    ]),
  );
  hydrateSignals(
    [...globalCity.migrationSignals, ...globalCity.signals],
    scores,
    acsMetric,
  )
    .filter((signal) => acsKeys.includes(signal.key))
    .forEach((signal) => signalsByKey.set(signal.key, signal));
  const transitSignal = signalsByKey.get("transit");
  if (transitSignal) {
    signalsByKey.set("transit", {
      ...transitSignal,
      detailRows: [
        ...transitSignal.detailRows,
        { label: "Commute by transit", value: `${acsMetric.publicTransitShare}%` },
        { label: "Transit, bike, or walk", value: `${acsMetric.noCarCommuteShare}%` },
        { label: "Commute data", value: "Supplementary context; not used in this score" },
      ],
    });
  }
  const overallScore = clampScore(
    (Object.keys(signalLabels) as SignalKey[]).reduce((sum, key) => sum + scores[key], 0) / 14,
  );

  return {
    ...globalCity,
    population: acsCity.population,
    monthlyCost: acsCity.monthlyCost,
    costMetric: acsCity.costMetric,
    costMetricLabel: acsCity.costMetricLabel,
    foreignBornShare: acsCity.foreignBornShare,
    scores,
    overallScore,
    matchScore: Math.round(overallScore * 10),
    migrationFit: overallScore,
    migrationSignals: ["sponsor", "visa", "community", "job"].map((key) => signalsByKey.get(key as SignalKey)!),
    signals: ["transit", "rent", "schools", "food", "social", "safety", "career", "weather", "internet", "costOfLiving"].map((key) => signalsByKey.get(key as SignalKey)!),
    dataConfidence: "Multi-source; OSM transit density + ACS city metrics where available",
    dataProvenance: {
      ...globalCity.dataProvenance,
      methodologyVersion: "lp-global-model-v2+acs-v1",
      notice: `${globalCity.dataProvenance.notice} For this U.S. city, ACS city-level population, rent, migration, and employment observations replace the corresponding national or proxy values. Commute percentages are supplementary context; No-car Transit scoring remains OSM density-based for every city.`,
      sources: [...acsCity.dataProvenance.sources, ...globalCity.dataProvenance.sources],
    },
  };
});

function attachLocalFacts(city: City): City {
  const reviewed = (localFactsSnapshot.cities as Record<string, { rent: LocalFact; migration: LocalFact }>)[city.slug];
  if (reviewed) {
    return {
      ...city,
      localFacts: reviewed,
      monthlyCost: reviewed.rent.value,
      costMetric: "local-rent-reference",
      costMetricLabel: reviewed.rent.label,
      foreignBornShare: reviewed.migration.value,
      dataProvenance: {
        ...city.dataProvenance,
        sources: [...Object.values(reviewed).map((fact) => ({
          name: `${fact.label} — ${new URL(fact.sourceUrl).hostname}`,
          url: fact.sourceUrl,
          period: fact.period,
          retrievedAt: localFactsSnapshot.reviewedAt,
          metrics: [fact.label, fact.geography],
        })), ...city.dataProvenance.sources],
      },
    };
  }
  const source = city.dataProvenance.sources.find((item) => item.metrics.includes("Median gross rent"));
  if (!source) return city;
  return {
    ...city,
    localFacts: {
      rent: { label: "Median monthly rent", value: `USD ${city.monthlyCost.replace(/^\$/, "")}`, geography: `${city.name} city boundaries`, note: "Median household gross rent including utilities. Not a total living budget or current asking rent.", sourceUrl: source.url, period: source.period },
      migration: { label: "Residents born abroad", value: city.foreignBornShare, geography: `${city.name} city boundaries`, note: "Residents born outside the country, under the ACS foreign-born definition.", sourceUrl: source.url, period: source.period },
    },
  };
}

// These observations do not establish individual eligibility, community support,
// or occupational fit. Career also reuses the unsupported job/GDP calculation.
const unscoredRelocationKeys = new Set<SignalKey>(["sponsor", "visa", "community", "job", "career"]);

function removeRelocationScores(city: City): City {
  const sourceBackedScoreKeys = city.sourceBackedScoreKeys.filter((key) => !unscoredRelocationKeys.has(key) && key !== "rent");
  const localCommunityScore = communityScore(city.localFacts?.migration);
  const scores = { ...city.scores };
  const careerScore = employmentScore(employmentByCity[city.slug]);
  if (careerScore !== undefined) {
    sourceBackedScoreKeys.push("career");
    scores.career = careerScore;
  }
  if (localCommunityScore !== undefined) {
    sourceBackedScoreKeys.push("community");
    scores.community = localCommunityScore;
  }
  const overallScore = sourceBackedScoreKeys.length
    ? Number((sourceBackedScoreKeys.reduce((sum, key) => sum + scores[key], 0) / sourceBackedScoreKeys.length).toFixed(1))
    : 0;
  return {
    ...city,
    scores,
    sponsorDensity: "Eligibility check required",
    dataProvenance: {
      ...city.dataProvenance,
      sources: city.dataProvenance.sources,
    },
    sourceBackedScoreKeys,
    overallScore,
    migrationFit: overallScore,
    matchScore: Math.round(overallScore * 10),
    recommendationCoverage: sourceBackedScoreKeys.length / 14,
    signals: city.signals.filter((signal) => !unscoredRelocationKeys.has(signal.key) && signal.key !== "rent"),
  };
}

export const cities: City[] = ([
  ...usCities,
  ...reviewedGlobalCities.filter((city) => !seedBySlug.has(city.slug)),
] as City[]).map(attachLocalFacts).map((city) => {
  const definition = (rentDefinitions as Record<string, { primary: boolean; category: string; evidence: string }>)[city.slug];
  if (!city.localFacts) return city;
  return { ...city, localFacts: { ...city.localFacts, rent: { ...city.localFacts.rent, rentDefinition: definition ?? { primary: false, category: "Unreviewed housing reference", evidence: "Housing definition has not been verified" } } } };
}).map(removeRelocationScores).map((city) => {
  const fact = populationByCity[city.slug];
  if (!fact) return city;
  return {
    ...city,
    population: populationLabel(fact),
    populationObservation: fact,
    dataProvenance: {
      ...city.dataProvenance,
      notice: `Headline population uses the separately reviewed population source, date and boundary shown above. Historical snapshots underpin other indicators; their denominators retain their original dates. ${city.dataProvenance.notice.replace(/Population uses[\s\S]*?Climate uses/, "Climate uses")}`,
      sources: [{
        name: "Population — " + new URL(fact.sourceUrl).hostname,
        url: fact.sourceUrl,
        period: fact.period,
        retrievedAt: fact.reviewedAt,
        metrics: ["Headline population", fact.geography, fact.kind],
      }, ...city.dataProvenance.sources],
    },
  };
});

export const topMatches = ["toronto", "london", "singapore"]
  .map((slug) => cities.find((city) => city.slug === slug))
  .filter((city): city is City => Boolean(city));

export const compareMetricKeys: SignalKey[] = [
  "transit",
  "costOfLiving",
  "safety",
  "schools",
  "weather",
];

export function getCity(slug: string) {
  return cities.find((city) => city.slug === slug);
}

export function scoreToPercent(score: number) {
  return `${Math.round(score * 10)}%`;
}

export const lifestyleOptionGroups = [
  {
    label: "Budget & Housing",
    options: [
      "Lower Rent",
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

export type City = {
  slug: string;
  name: string;
  state: string;
  country: string;
  population: string;
  monthlyCost: string;
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
  migrationSignals: SignalMetric[];
  signals: SignalMetric[];
  dataSources: string[];
  experiences: Experience[];
  localSignals: LocalSignals;
  peopleLikeYou: {
    segment: string;
    averageBudget: string;
    topChoices: string[];
  };
};

export const signalLabels: Record<SignalKey, string> = {
  sponsor: "Sponsor Density",
  visa: "Visa Friendliness",
  job: "Job Market Fit",
  community: "Immigrant Community",
  transit: "No-car Transit",
  rent: "Rent Pressure",
  schools: "School Quality",
  food: "Food Cost",
  social: "Social Life",
  safety: "Safety",
  career: "Career",
  weather: "Weather",
  internet: "Internet",
  costOfLiving: "Cost Of Living",
};

export const cities: City[] = [
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
    dataSources: ["USCIS H-1B", "Census ACS", "BLS LAUS", "FBI CDE", "Zillow"],
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
    dataSources: ["USCIS H-1B", "BLS LAUS", "Zillow", "Open-Meteo"],
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
    dataSources: ["NCES", "USCIS H-1B", "Census ACS", "BLS LAUS", "Zillow"],
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
    dataSources: ["USCIS H-1B", "BLS LAUS", "Zillow", "Open-Meteo"],
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
    dataSources: ["BLS LAUS", "Zillow", "FBI CDE", "NCES", "USCIS H-1B"],
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

export const topMatches = cities.slice(0, 3);

export const compareMetricKeys: SignalKey[] = [
  "sponsor",
  "visa",
  "job",
  "community",
  "transit",
  "rent",
  "costOfLiving",
  "safety",
  "schools",
];

export function getCity(slug: string) {
  return cities.find((city) => city.slug === slug);
}

export function scoreToPercent(score: number) {
  return `${Math.round(score * 10)}%`;
}

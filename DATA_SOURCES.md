# LandingPoint data policy

## Monthly living-cost estimate (supersedes the headline rent display)

Every catalog city displays a concrete USD monthly estimate for one person. The
32 observations use Livingcost.org's June 21, 2026 city pages and the same scope:
rent and utilities, food, and local transport for a moderate lifestyle. The
source describes its prices as partly crowdsourced and its total as a modeled
consumer basket, so the product labels these values as estimates rather than bills.

LandingPoint normalizes those same-scope amounts into an internal affordability
signal for matching and uses the concrete amount for budget compatibility. The
score is not the headline fact. The amount remains a directional estimate rather
than a guaranteed personal budget, a quoted rent, or an official statistic.

Legacy local housing observations and `src/data/rent-definitions.json` remain in
the data layer for traceability and future methodology work, but are no longer a
headline city-card fact or a ranking input.

## Career and community scoring update

Career Growth now uses verified ONS/Nomis 2024 workplace job totals and jobs
per 1,000 residents aged 16–64 for London, Edinburgh, Bristol, Manchester and
Birmingham. Counts are existing filled jobs, not vacancies. Density uses the
published same-period ONS ratio multiplied by 1,000, not today's population.
Product score: 70% density (400–1,400 maps to 0–10) plus 30% log10 total jobs
(10,000–10 million maps to 0–10), with components clamped. Other cities have
no career score until comparable evidence is available. This is employment
scale, not observed career growth. Sources are in city-employment.json.

Community scores use only explicitly labelled local foreign-born shares:
0–50% maps to 0–10, capped. Foreign citizenship, immigration status, migration
background and raw headcounts remain unscored context. Different local boundary
sizes and observation years are retained and shown. Visa/sponsor scores remain
excluded. Selecting Immigrant Community weights community only; Career Growth
weights career only. Missing evidence is disclosed in results; existing ranking
coverage adjustments still apply, so ranking is not evidence of absent jobs.

## City internet measurements

`src/data/city-internet.json` covers all 32 catalog destinations. Five US cities
use SpeedTown's M-Lab seed export for July 13–August 13, 2026 (median throughput,
mean latency). The other 27 use M-Lab's public statistics archive for the actual
2024 date ranges shown per city. They are explicitly historical, not live speeds.
Singapore uses the whole city-state because no separate city directory exists.

Historical values are the arithmetic mean of available daily medians, not a
pooled median. Daily histogram rows repeat daily statistics: deduplicate by date
before averaging or summing sample counts. Download and upload counts are separate.
Historical latency is the average daily median minimum RTT. IP-based geography
may describe ISP equipment rather than users' physical locations. These voluntary
tests do not distinguish fixed/mobile connections and are not used in rankings.
Source files and retrieval dates are retained per observation. Run
`node scripts/sync-city-internet.mjs` to fill missing catalog entries.
Official methodology: https://github.com/m-lab/stats-pipeline

LandingPoint separates official observations from product scores. Official
values keep their dataset, period, geography, retrieval time, and source URL.
Scores such as Migration Fit are LandingPoint-derived values and are not
government ratings.

## Recommendation methodology v1

- Every city starts with baseline weights for jobs, community, living-cost affordability,
  safety, and transit.
- The selected primary goal adds `2.2` weight to its related metrics.
- Each selected lifestyle priority adds `1.8` weight to its related metrics.
- Selecting "Need sponsorship: Yes" adds `3.0` to sponsor activity and `2.0`
  to visa fit.
- The displayed fit is 85% weighted signal score and 15% budget
  compatibility. Results are sorted by that value.

When an ACS snapshot is present, the first source-backed normalizations are:

- community: foreign-born share scaled from 5% (score 0) to 40% (score 10);
- transit: transit, bicycle, and walking commute share scaled from 0% to 40%;
- job: unemployment rate transformed from approximately 2% (score 10)
  downward by 1.3 points per percentage point;
- living-cost affordability: the 32 same-scope USD monthly estimates are
  normalized on a logarithmic lower-cost-is-better scale within this catalog;
- rent: excluded from recommendations because the catalog does not yet have a
  comparable city-level housing observation for every destination.

These thresholds are product choices, not Census Bureau methodology. They must
be versioned and reviewed before production use.

## Implemented source

### U.S. Census Bureau — ACS 5-Year

- Purpose: population, foreign-born share, median gross rent, median household
  income, unemployment rate, public-transit commute share, and no-car commute
  share.
- Geography: Census `place` (city), identified by state and place FIPS codes.
- Default release: 2024 ACS 5-Year. Override with `CENSUS_ACS_YEAR` after
  confirming that the desired release is available.
- API documentation:
  https://www.census.gov/data/developers/data-sets/acs-5year.html
- Terms:
  https://www.census.gov/data/developers/about/terms-of-service.html
- Required notice: "This product uses the Census Bureau Data API but is not
  endorsed or certified by the Census Bureau."

The sync uses published aggregate estimates only. Do not combine the data with
other sources in an attempt to identify a person, household, or establishment.

### Curated global catalog — Wikidata, GeoNames, and NASA POWER

- Scope: 15 preselected cities outside the United States. Visitors do not add
  arbitrary cities at runtime.
- Identity and selected population: the reviewed Wikidata city entity. The
  synchronizer selects the preferred/latest dated population statement.
- Population cross-check: GeoNames `cities15000` bulk extract. The values are
  not averaged. A difference above 25% is flagged as a likely geography or
  boundary mismatch; missing comparable populated-place records remain marked
  single-source.
- Climate: NASA POWER point climatology at the selected entity coordinates,
  using annual mean and the warmest/coldest monthly mean for January 2001
  through December 2020.
- Wikidata structured data is CC0. GeoNames is free under CC BY and requires
  attribution. NASA POWER requests must respect published service guidance.
- Source pages:
  https://www.wikidata.org/wiki/Wikidata:Licensing
  https://www.geonames.org/export/
  https://power.larc.nasa.gov/docs/services/api/temporal/climatology/

The displayed population is never a subjective average of city-proper,
municipality, metropolitan-area, and urban-area figures. LandingPoint keeps the
selected entity, date, comparison value, percentage difference, and selection
reason in `src/data/global-city-metrics.json`.

## Planned sources

- DOL OFLC disclosure files: LCA worksite and employer activity. Certified LCA
  activity must not be described as visas issued or workers actually hired.
- BLS Public Data API: metro employment, unemployment, and occupational wages.
- HUD Fair Market Rent API: bedroom-specific FMR benchmarks. FMR must not be
  described as listing rent or citywide average rent.
- FBI Crime Data Explorer: reported crime with agency coverage disclosed.
- NOAA Climate Data Online: climate normals and weather observations.
- FTA National Transit Database: transit supply and ridership.
- FCC Broadband Data Collection: advertised availability, not measured speed.

## Refresh process

Work and relocation (2026-09-06): work-path breadth, visa breadth, immigrant
population share and national job context no longer contribute to city scores,
recommendation ranking or numeric comparisons. Career scores that reuse national
job/GDP inputs are also excluded. The relocation section displays local migration
observations and official immigration links alongside eligibility questions.
Occupation-specific vacancies, pay and employer sponsorship remain unverified;
national unemployment is available only as labelled background context.

The catalog now includes 32 cities. Same-scope one-person monthly cost estimates
are stored in `src/data/city-living-costs.json`; this file is the source for the
headline cost amount, internal living-cost normalization, and budget compatibility.

Local migration and legacy housing references remain in
`src/data/city-local-facts.json` with their original source links, observation
periods and geographic boundaries. Housing definitions vary—examples include
two-bedroom advertised rent, net cold rent per square metre, and student guides—
so these legacy observations are not displayed as the monthly living-cost total
and do not enter budget matching. Migration geography can also differ between
local-authority and metropolitan measures and is labelled in the interface.
City photos are recorded separately in `src/data/city-images.json` under CC0.

To refresh selected existing catalog entries, run
`node scripts/sync-global-city-data.mjs --only=montreal,munich,brisbane`.
This keeps other cities unchanged and reuses the saved country indicators.
Run `node scripts/check-city-local-facts.mjs` to check local-fact coverage.

1. Request a free Census API key:
   https://api.census.gov/data/key_signup.html
2. Copy `.env.example` to `.env.local` and add the key.
3. Run `npm run data:sync`, or use `npm run data:sync:us` and
   `npm run data:sync:global` independently.
4. Review the generated diff in `src/data/city-public-metrics.json` before
   publishing.
5. Run `npm run lint` and `npm run build`.

Never commit `.env.local` or expose server-side keys with a `NEXT_PUBLIC_`
prefix.

## Rental definition audit (2026-09-07)

`src/data/rent-definitions.json` explicitly classifies all 32 cities. Only five
currently have dated whole-property one-bedroom references. The public interface
does not use these as its headline cost because comparable one-bedroom evidence is
not available across the full catalog. The audit remains for provenance and future
housing research rather than current display or ranking.
These five are not all methodologically interchangeable: Edinburgh uses council
guidance citing Citylets, while the four English entries use ONS averages covering
new and existing tenancies.

London is GBP 1,752 for July 2026, replacing a shared-room student budget.
The figure was checked in the secondary report at
https://www.harveywjames.com/news-london-average-rent-july-2026-ons
and is explicitly labelled as an ONS figure reproduced by that report; the underlying
workbook was not independently retrieved. Manchester is GBP 998 for the same month,
from https://www.ons.gov.uk/visualisations/housingpriceslocal/E08000003/ .
The London geography is Greater London, not the City of London district.
No new rent-to-income scores are inferred from these rental reference prices.

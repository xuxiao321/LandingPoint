# LandingPoint

LandingPoint helps immigrants, international students, and long-term movers compare a reviewed starter catalog of cities across multiple countries. Source-backed observations, derived scores, and unavailable fields are kept visibly separate.

## Stack

- Next.js 15
- TypeScript
- TailwindCSS
- shadcn/ui-style local components
- Supabase-ready PostgreSQL schema
- PostHog and MapLibre environment slots
- Supabase Auth, Postgres, Row Level Security, and REST endpoints

## Routes

- `/` - search form with Monthly Budget, Passport, Primary Goal, conditional Sponsorship Need, Lifestyle priorities, and Moving Timeline.
- `/recommendations` - profile-aware matches across the curated US and global catalog.
- `/city/[slug]` - city profile, Migration Signals, City Signals, Real Experiences, Local Signals, People Like You.
- `/compare` - two-city comparison across sponsor density, visa fit, jobs, community, transit, rent, safety, and schools.
- `/profile/[username]` - saved cities and contribution summary.

## Product Focus

The MVP is intentionally sharper than a generic city ranking site. It prioritizes:

- H-1B sponsor density and visa path fit
- international student and immigrant community strength
- job market fit by field
- rent pressure and cost of living
- no-car viability and local safety
- programmatic SEO pages backed by differentiated city data

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Supabase setup

1. Copy `.env.example` to `.env.local`.
2. Add Supabase project values.
3. Run `supabase/schema.sql` in the Supabase SQL editor.

The app clearly labels its bundled city content as prototype estimates. To
replace the supported metrics with official Census ACS estimates:

1. Request a free Census API key at
   `https://api.census.gov/data/key_signup.html`.
2. Add `CENSUS_API_KEY` to `.env.local`.
3. Run `npm run data:sync` to refresh both the US and global snapshots.

The catalog currently contains 32 reviewed cities across North America, South
America, Europe, and Asia-Pacific. Run npm run data:sync:global to refresh the
global snapshot; it requires no API key.

The US snapshot includes population, foreign-born share, median gross rent,
median household income, unemployment, and commute-mode metrics. The global
snapshot includes reviewed city identity, population, coordinates, population
cross-checks, NASA POWER climate observations, OSM amenity and transit
densities, employment signals, internet context, and source metadata. See
DATA_SOURCES.md for methodology, attribution, and limitations.

## Quality checks

Run npm run lint, npm test, and npm run build before shipping. Keep .env.local
private; never commit a service-role key or an API provider secret.
## What it does

LandingPoint is a transparent city-matching tool for people planning work, study, or long-term relocation. Users choose what matters most, receive a weighted shortlist, and can inspect the evidence behind each score.

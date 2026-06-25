# LandingPoint MVP

LandingPoint helps immigrants, international students, and long-term movers decide which US city to live in next by combining migration-friendly public data, real relocation experiences, local resident trend signals, city comparison, and a saved-city feedback loop.

## Stack

- Next.js 15
- TypeScript
- TailwindCSS
- shadcn/ui-style local components
- Supabase-ready PostgreSQL schema
- PostHog and MapLibre environment slots

## Routes

- `/` - search form with Monthly Budget, Passport, Visa Status, Sponsorship Need, Work Field, Lifestyle, and Moving Timeline.
- `/recommendations` - migration-friendly matches with New York City, Seattle, and Boston.
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

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Supabase

1. Copy `.env.example` to `.env.local`.
2. Add Supabase project values.
3. Run `supabase/schema.sql` in the Supabase SQL editor.

The current MVP uses seeded front-end data and localStorage for saved cities. The schema is ready for replacing those pieces with Supabase Auth, public data ETL, and database calls.

# LandingPoint

LandingPoint is a full-stack city discovery and relocation-planning product for immigrants, international students, and long-term movers. It combines a weighted city matcher with evidence-backed city profiles, events, resident reviews, saved cities, and authenticated accounts.

The catalog currently covers **32 cities** across North America, South America, Europe, and Asia-Pacific. Public observations, LandingPoint-derived scores, and unavailable data are presented separately.

## What users can do

- choose a passport, goal, budget, and lifestyle priorities;
- assign each selected priority a personal importance level;
- receive a ranked shortlist with per-city match explanations and coverage;
- browse city-card-style profiles with population, living-cost affordability, connectivity, relocation context, events, and resident reviews;
- compare two cities using the same displayed signals;
- register or sign in, save cities, manage preferences, and contribute local reviews.

## Data policy

The primary cost indicator is **Living Cost Affordability (0–10)**. A higher score means relatively more affordable within the LandingPoint catalog. It is a comparative model signal—not a quoted rent, guaranteed monthly budget, or personal affordability decision.

Unmatched housing references are not promoted as comparable one-bedroom rents and do not contribute a hidden rent score. Source, period, geography, calculation notes, and known limitations remain available in the data layer and source panels.

The catalog also includes:

- reviewed population observations and boundary definitions;
- city internet measurements for all 32 cities;
- fixed-radius OpenStreetMap access signals;
- NASA POWER climate observations;
- country-level World Bank context;
- official immigration pathway links;
- selected city-level employment and immigrant-community observations;
- live Ticketmaster events when configured, with curated fallback records;
- public resident reviews backed by Supabase and Row Level Security.

See [DATA_SOURCES.md](DATA_SOURCES.md) for methodology, licensing, limitations, and refresh notes.

## Stack

- Next.js 15 App Router, React 19, and TypeScript
- Tailwind CSS and local accessible UI components
- Supabase Auth and PostgreSQL with Row Level Security
- Ticketmaster Discovery API for upcoming events
- optional PostHog analytics and MapLibre map styling
- Census ACS and other public-data synchronization scripts

## Routes

- `/` — personalized city search and weighted priorities
- `/recommendations` — ranked matches and fit explanations
- `/city/[slug]` — city profile, events, sources, and resident reviews
- `/compare` — side-by-side city comparison
- `/account` — authentication, preferences, saved cities, and contributions
- `/profile/[username]` — public contribution profile
- `/api/cities/[slug]/events` — normalized upcoming events
- `/api/cities/[slug]/reviews` — public review reads and authenticated writes

## Local development

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Add the project URL and publishable key to `.env.local`.
4. Keep secret or service-role keys server-only; never use a `NEXT_PUBLIC_` prefix for them.

The app accepts the current Supabase publishable key and retains legacy anon-key compatibility:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Optional integrations:

```dotenv
TICKETMASTER_API_KEY=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_MAP_STYLE_URL=
CENSUS_API_KEY=
CENSUS_ACS_YEAR=2024
```

## Data refresh

```bash
npm run data:sync
npm run data:sync:images
```

`data:sync` refreshes the US and global public-data snapshots. Review generated changes and geographic boundaries before publishing them.

## Quality checks and deployment

```bash
npm test
npm run lint
npm run build
```

Deploy the repository to Vercel, add the same production environment variables, and configure the deployed URL in Supabase Authentication URL settings. Keep `.env.local`, database passwords, and provider secrets out of Git.

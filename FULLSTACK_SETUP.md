# LandingPoint full-stack setup

## 1. Connect Supabase

Create a Supabase project, then run **only**
`supabase/migrations/20260907_accounts_and_community.sql` in its SQL Editor.
This migration is standalone and repeatable. Do not run the historical
`supabase/schema.sql` city seed: it contains prototype scores, not current data.

Set these entries in `.env.local` (do not commit it):

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_PUBLISHABLE_KEY
TICKETMASTER_API_KEY=YOUR_DISCOVERY_API_KEY
```

The legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` is also supported. Never put a
Supabase service-role/secret key in any `NEXT_PUBLIC_` variable. This application
does not require a service-role key. Restart Next after configuration changes.

## 2. Enable registration and email codes

In Supabase Authentication:
- Enable Email and allow new signups.
- Set Site URL to your deployed HTTPS origin (localhost for development).
- Allow `/account` redirect URLs for the actual local/deployed origins used.
- Change the Magic Link email template to include `{{ .Token }}` for the code
  entry flow. Default email links also work with the browser Auth client.
- Configure production SMTP, email rate limits and CAPTCHA before a public launch.
  Built-in email delivery has restrictions; sending email requires a configured
  provider and is not verified by local unit tests.

New emails register on successful verification; existing users sign in. Browser
Auth manages token refresh. API routes independently call `auth.getUser(token)`;
they never trust a browser-supplied user ID. Database RLS is the second boundary.
Session tokens are stored by the Supabase browser SDK, not an HttpOnly-cookie
SSR session. Keep user content rendered as escaped text and protect against XSS.

## 3. Features and boundaries

- `/account`: registration/login/logout, private favorites, guest import, preferences,
  and private drafts. The old `/profile/:username` redirects here; fake stats removed.
- Homepage: select priorities and set 1× / 2× / 3× importance. Explicit save/restore
  controls persist them to the account. URL parameters preserve priorities when
  editing a recommendation. Importance is not a hard filter or guaranteed fit.
- City pages: city identity card, overview, evidence, upcoming events, public reviews,
  and private notes. No prototype comments or simulated submission success.
- Reviews: one per account per city; self-reported residency, no verified-resident badge.
  Authors can delete, all signed-in users can report. Email is never public.
  Public records contain an opaque author UUID for ownership UI (not a private secret).
- Reports: inspect `review_reports` in the Supabase dashboard and join its review ID
  to `city_reviews`. The operator must actually review reports and remove violating
  records. There is no automatic moderation or admin dashboard in this version.
- Community writes are limited to 20 successful inserts per account per clock hour
  across reviews and reports, including reviews subsequently deleted. Unique constraints
  limit one review per city and one report per review/user. Multi-account spam still
  requires provider CAPTCHA, email controls and operational monitoring.
- City metrics remain versioned source-backed JSON; cloud account data does not
  overwrite factual city records or affect the evidence-based scores.

## 4. Events

Optional Ticketmaster Discovery API supplies Music/Sports city+country listings.
The key is server-only. Requests time out after 8 seconds and successful results
are cached 15 minutes per server process. Only catalog cities are accepted.
Ticketmaster has geographic and inventory gaps; it does not guarantee that every
listing is a large event. No event-size ranking is claimed. Read and follow its
current API terms and quota before production use.

Business events and selected major events are maintained in `src/data/city-events.json`
with organizer links and verification dates. Update this file from official organizer
announcements. Past start dates disappear automatically; events may change after review.
Do not copy event descriptions or photos without appropriate rights. Displayed dates
are local-calendar dates; expiry filtering currently uses UTC day (possible boundary
difference on event day). This is disclosed here, not precise local-time availability.

## 5. Verify before calling it production-ready

```powershell
npm test
npm run lint
npm run build
```

`npm test` exercises weighted matching and validation, then executes the SQL migration
twice in an in-memory PostgreSQL-compatible PGlite instance, including two-user RLS,
anonymous access, owner deletion, private reports and rate-limit tests. It does NOT
prove that your remote project, SMTP, email verification or event API is connected.

Manually test with two real accounts after setup:
1. Register, verify, logout, login again; check expired/incorrect email codes.
2. Save a city and preferences; reload and open a second browser/device.
3. Verify account B cannot see account A's private data; switch accounts on same browser.
4. Import guest favorites twice; confirm no duplicates and local originals remain.
5. Publish a review, view signed out, report from B, delete as A.
6. Verify draft notes never appear publicly. Test network failures without false success.
7. Set event API key; verify city, category, date, source and cancelled-event exclusion.

Before launch: configure SMTP/CAPTCHA, monitor provider quotas and abuse, establish
report review, publish privacy/terms/contact information and an account-deletion request
process, configure database backups, and rerun the two-account tests against Supabase.
No external project or paid service is created by this code change.

References: https://supabase.com/docs/guides/auth/auth-email-passwordless
and https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/

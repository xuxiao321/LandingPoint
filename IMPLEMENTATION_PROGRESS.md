# Full-stack implementation — 2026-09-07

## Agreed scope
- Email registration, sign-in/sign-out.
- Cloud favorites, guest favorites import/removal, saved search preferences.
- Lifestyle priorities with user-controlled importance and explained ranking.
- City identity-card layout with quick navigation.
- Upcoming music/sports/business events with verified sources and dates.
- Public city reviews, self-reported residency, author deletion and reporting.
- Private city drafts, real loading/error states; no fake successful submissions.

## Implemented, live verification pending
- Supabase JS dependency, account bearer-token API with server getUser validation.
- Account provider/page and guest-compatible save button; old fake profile redirects.
- Preferences save/restore UI; API validation and payload limits.
- SQL migration: `supabase/migrations/20260907_accounts_and_community.sql`.
  Independent of obsolete `schema.sql` demo city seed. Private RLS, public reviews,
  owner deletion, private reports, database-enforced per-user write limits.
- Reviews API and city review component mounted on every city page.
- Supabase project migration applied successfully. Email sign-up is enabled; local
  Site URL and `http://localhost:3000/account` redirect are configured.

## Next work
1. Run a real email sign-in and a two-account review/RLS smoke test in the browser.
2. Configure production Site URL, redirect URLs, SMTP, CAPTCHA and moderation process
   before public launch.
3. Resolve the remaining non-breaking dependency audit advisory when a compatible
   upstream Next.js release is available.

## Latest completed work
- Reviews and event modules mounted on all city pages. City identity card uses
  a light two-column photo/header and section navigation. Prototype community
  blocks removed; private notes replace fake submission forms.
- Priority weights through form, URL, save/restore, validation, actual ranking,
  per-result explanations. Duplicate priorities do not amplify scoring.
- Events API: catalog validation, server key, timeout, per-process caching, expiry
  filters, Ticketmaster music/sports and four organizer-checked curated events
  (three Singapore, one London). Live API key still absent; not full coverage.
- FULLSTACK_SETUP.md written with deployment boundaries and manual checklist.
- npm test PASSED: ranking reversal, validation, rental regressions, PGlite SQL
  migration replay, two-user/anonymous RLS, author deletion, private reports,
  database-enforced write limits.
- npm run lint: 0 errors, one pre-existing unused-variable warning in
  scripts/select-city-image.mjs.
- Production QA build PASSED (Next 15.5.25) after Supabase configuration. It uses
  `.next-qa` because the user's active dev server may lock `.next\\trace` on Windows.
- Browser QA: Singapore identity card visually checked; guest save -> account
  -> refresh persistence verified; test favorite removed. Home priority 3/1 ->
  URL/result badges -> Edit preferences preserves 3/1 verified.
- QA server is agent-owned exec session 88048, localhost:3200, .next-qa output.
  Existing user's dev server not stopped. Browser test tab temporary.
- npm audit fix upgraded compatible dependencies incl. Next 15.5.25. Remaining
  2 advisories involve Next's nested PostCSS 8.4.31. Attempted nested override
  failed to resolve with this npm; removed invalid override. Do not claim audit clean.
  Native-module cleanup warnings affected npm temporary folders; not deleted manually.
- tsconfig now includes .next-qa/types (automatically added by build). QA distDir
  uses LANDINGPOINT_BUILD_DIR. .next-qa is git/eslint ignored.

## External blockers
- `.env.local` now contains the project URL and public publishable key; never print
  or commit it. A restarted development server is required to load it.
- Email delivery and the optional numeric OTP template have NOT been tested.
- Event API key not configured. No claims of full event coverage.
- No live account, RLS two-user, review or email end-to-end tests yet.

## Checks so far
- TypeScript passed after account page/provider/API additions (before review additions).
- npm install reported existing 7 vulnerabilities; audit still required.

## Working constraints
- Preserve existing dirty worktree and earlier city-data corrections.
- No agents requested; work locally. Use apply_patch for changes.
- Local Next docs absent; official Next route and Supabase docs consulted.
- Node commands need approved escalation (sandbox otherwise EPERM on parent path).

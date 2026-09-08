-- Run this standalone migration in Supabase SQL Editor. Do NOT run the old demo seed.
begin;
create table if not exists public.account_saved_cities (
  user_id uuid not null references auth.users(id) on delete cascade,
  city_slug text not null check (city_slug ~ '^[a-z0-9-]{1,80}$'),
  created_at timestamptz not null default now(),
  primary key (user_id, city_slug)
);
create table if not exists public.account_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  preferences jsonb not null check (jsonb_typeof(preferences) = 'object' and octet_length(preferences::text) <= 8000),
  updated_at timestamptz not null default now()
);
create table if not exists public.account_drafts (
  user_id uuid not null references auth.users(id) on delete cascade,
  city_slug text not null check (city_slug ~ '^[a-z0-9-]{1,80}$'),
  kind text not null check (kind in ('experience','local-signal')),
  content jsonb not null check (jsonb_typeof(content) = 'object' and octet_length(content::text) <= 16000),
  updated_at timestamptz not null default now(),
  primary key (user_id, city_slug, kind)
);
create table if not exists public.city_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  city_slug text not null check (city_slug ~ '^[a-z0-9-]{1,80}$'),
  display_name text not null check (char_length(trim(display_name)) between 2 and 40),
  residency text not null check (residency in ('Current resident','Former resident','Visitor')),
  duration text not null check (duration in ('Under 3 months','3–12 months','1–3 years','3+ years')),
  body text not null check (char_length(trim(body)) between 30 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, city_slug)
);
create index if not exists city_reviews_city_date on public.city_reviews(city_slug, created_at desc, id);
create table if not exists public.review_reports (
  review_id uuid not null references public.city_reviews(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check (reason in ('Spam','Harassment','Personal information','Misleading content')),
  created_at timestamptz not null default now(),
  primary key(review_id, user_id)
);

alter table public.account_saved_cities enable row level security;
alter table public.account_preferences enable row level security;
alter table public.account_drafts enable row level security;
alter table public.city_reviews enable row level security;
alter table public.review_reports enable row level security;
revoke all on public.account_saved_cities, public.account_preferences, public.account_drafts, public.city_reviews, public.review_reports from anon, authenticated;
grant select, insert, delete on public.account_saved_cities to authenticated;
grant select, insert, update, delete on public.account_preferences, public.account_drafts to authenticated;
grant select on public.city_reviews to anon, authenticated;
grant insert, delete on public.city_reviews to authenticated;
grant select, insert on public.review_reports to authenticated;

drop policy if exists "Account saved owner" on public.account_saved_cities;
create policy "Account saved owner" on public.account_saved_cities for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "Account preferences owner" on public.account_preferences;
create policy "Account preferences owner" on public.account_preferences for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "Account drafts owner" on public.account_drafts;
create policy "Account drafts owner" on public.account_drafts for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "Reviews public read" on public.city_reviews;
create policy "Reviews public read" on public.city_reviews for select using (true);
drop policy if exists "Review author insert" on public.city_reviews;
create policy "Review author insert" on public.city_reviews for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Review author delete" on public.city_reviews;
create policy "Review author delete" on public.city_reviews for delete to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Report own read" on public.review_reports;
create policy "Report own read" on public.review_reports for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Report own insert" on public.review_reports;
create policy "Report own insert" on public.review_reports for insert to authenticated with check ((select auth.uid()) = user_id);

-- Persistent rate limit, including deleted reviews. This table is not exposed to clients.
create table if not exists public.community_write_limits (
  user_id uuid not null references auth.users(id) on delete cascade,
  bucket timestamptz not null,
  writes integer not null default 0,
  primary key (user_id, bucket)
);
alter table public.community_write_limits enable row level security;
revoke all on public.community_write_limits from anon, authenticated;
create or replace function public.limit_community_writes() returns trigger
language plpgsql security definer set search_path = '' as $$
declare count_now integer;
begin
  if auth.uid() is null or new.user_id <> auth.uid() then raise exception 'Sign in required'; end if;
  insert into public.community_write_limits(user_id,bucket,writes)
    values(auth.uid(),date_trunc('hour',now()),1)
    on conflict(user_id,bucket) do update set writes = public.community_write_limits.writes + 1
    returning writes into count_now;
  if count_now > 20 then raise exception 'Too many submissions. Try again in the next hour.'; end if;
  new.created_at := now();
  return new;
end;
$$;
revoke all on function public.limit_community_writes() from public;
drop trigger if exists review_write_limit on public.city_reviews;
create trigger review_write_limit before insert on public.city_reviews for each row execute function public.limit_community_writes();
drop trigger if exists report_write_limit on public.review_reports;
create trigger report_write_limit before insert on public.review_reports for each row execute function public.limit_community_writes();
commit;

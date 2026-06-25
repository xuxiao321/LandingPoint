create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  username text not null unique,
  country text,
  created_at timestamptz not null default now()
);

create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  state text not null,
  country text not null default 'United States',
  population bigint,
  monthly_cost_usd integer,
  overall_score numeric(3, 1) not null check (overall_score between 0 and 10),
  migration_fit_score numeric(3, 1) not null check (migration_fit_score between 0 and 10),
  sponsor_density_score numeric(3, 1) not null check (sponsor_density_score between 0 and 10),
  visa_score numeric(3, 1) not null check (visa_score between 0 and 10),
  job_score numeric(3, 1) not null check (job_score between 0 and 10),
  immigrant_community_score numeric(3, 1) not null check (immigrant_community_score between 0 and 10),
  transit_score numeric(3, 1) not null check (transit_score between 0 and 10),
  rent_pressure_score numeric(3, 1) not null check (rent_pressure_score between 0 and 10),
  school_score numeric(3, 1) not null check (school_score between 0 and 10),
  food_score numeric(3, 1) not null check (food_score between 0 and 10),
  safety_score numeric(3, 1) not null check (safety_score between 0 and 10),
  social_score numeric(3, 1) not null check (social_score between 0 and 10),
  career_score numeric(3, 1) not null check (career_score between 0 and 10),
  weather_score numeric(3, 1) not null check (weather_score between 0 and 10),
  internet_score numeric(3, 1) not null check (internet_score between 0 and 10),
  cost_of_living_score numeric(3, 1) not null check (cost_of_living_score between 0 and 10),
  data_confidence text not null check (data_confidence in ('Low', 'Medium', 'Medium High', 'High')),
  created_at timestamptz not null default now()
);

create table if not exists public.city_data_sources (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities (id) on delete cascade,
  source_name text not null,
  source_kind text not null check (
    source_kind in ('USCIS', 'Census', 'BLS', 'FBI', 'Zillow', 'Open-Meteo', 'NCES', 'Community')
  ),
  metric_name text not null,
  last_synced_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  city_id uuid not null references public.cities (id) on delete cascade,
  duration text not null check (
    duration in ('1-3 Months', '3-12 Months', '1-3 Years', '3+ Years')
  ),
  visa_path text check (
    visa_path in ('F-1 / OPT', 'H-1B', 'Green Card', 'Citizen', 'No Visa Needed')
  ),
  sponsor_experience text check (
    sponsor_experience in ('Easy To Find', 'Possible But Competitive', 'Difficult', 'Not Applicable')
  ),
  cost_expectation text not null check (
    cost_expectation in ('Much Lower', 'Lower', 'Same', 'Higher', 'Much Higher')
  ),
  recommend boolean not null,
  pros text,
  cons text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.local_signals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  city_id uuid not null references public.cities (id) on delete cascade,
  years_in_city text not null check (years_in_city in ('1-3', '3-10', '10+')),
  rent_trend text not null check (rent_trend in ('Up', 'Same', 'Down')),
  safety_trend text not null check (safety_trend in ('Up', 'Same', 'Down')),
  traffic_trend text not null check (traffic_trend in ('Better', 'Same', 'Worse')),
  cost_trend text not null check (cost_trend in ('Up', 'Same', 'Down')),
  created_at timestamptz not null default now()
);

create table if not exists public.saved_cities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  city_id uuid not null references public.cities (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, city_id)
);

create index if not exists cities_state_idx on public.cities (state);
create index if not exists cities_migration_fit_idx on public.cities (migration_fit_score desc);
create index if not exists city_data_sources_city_id_idx on public.city_data_sources (city_id);
create index if not exists experiences_city_id_idx on public.experiences (city_id);
create index if not exists local_signals_city_id_idx on public.local_signals (city_id);
create index if not exists saved_cities_user_id_idx on public.saved_cities (user_id);

alter table public.users enable row level security;
alter table public.cities enable row level security;
alter table public.city_data_sources enable row level security;
alter table public.experiences enable row level security;
alter table public.local_signals enable row level security;
alter table public.saved_cities enable row level security;

create policy "Public city read"
  on public.cities for select
  using (true);

create policy "Public data source read"
  on public.city_data_sources for select
  using (true);

create policy "Public experience read"
  on public.experiences for select
  using (true);

create policy "Public local signal read"
  on public.local_signals for select
  using (true);

create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can create own profile"
  on public.users for insert
  with check (auth.uid() = id);

create policy "Users can insert own experiences"
  on public.experiences for insert
  with check (auth.uid() = user_id);

create policy "Users can update own experiences"
  on public.experiences for update
  using (auth.uid() = user_id);

create policy "Users can insert own local signals"
  on public.local_signals for insert
  with check (auth.uid() = user_id);

create policy "Users can update own local signals"
  on public.local_signals for update
  using (auth.uid() = user_id);

create policy "Users can read own saved cities"
  on public.saved_cities for select
  using (auth.uid() = user_id);

create policy "Users can save own cities"
  on public.saved_cities for insert
  with check (auth.uid() = user_id);

create policy "Users can remove own saved cities"
  on public.saved_cities for delete
  using (auth.uid() = user_id);

insert into public.cities (
  slug,
  name,
  state,
  population,
  monthly_cost_usd,
  overall_score,
  migration_fit_score,
  sponsor_density_score,
  visa_score,
  job_score,
  immigrant_community_score,
  transit_score,
  rent_pressure_score,
  school_score,
  food_score,
  safety_score,
  social_score,
  career_score,
  weather_score,
  internet_score,
  cost_of_living_score,
  data_confidence
) values
  ('new-york-city', 'New York City', 'New York', 8300000, 4900, 8.8, 9.2, 9.6, 9.1, 9.5, 9.3, 9.7, 4.4, 8.8, 6.9, 7.1, 9.4, 9.6, 6.5, 9.1, 4.5, 'High'),
  ('seattle', 'Seattle', 'Washington', 755000, 3750, 8.7, 9.0, 9.4, 8.9, 9.6, 8.1, 7.8, 5.8, 8.4, 7.2, 7.2, 7.6, 9.5, 6.7, 9.4, 5.8, 'High'),
  ('boston', 'Boston', 'Massachusetts', 650000, 4100, 8.5, 8.7, 8.6, 8.8, 8.7, 8.5, 8.5, 4.9, 9.5, 6.8, 7.8, 8.0, 8.8, 6.1, 8.8, 5.1, 'High'),
  ('austin', 'Austin', 'Texas', 980000, 3050, 8.2, 8.1, 8.1, 7.7, 8.8, 7.3, 4.7, 6.8, 7.9, 7.8, 7.0, 8.5, 8.7, 7.2, 9.0, 7.0, 'Medium High'),
  ('atlanta', 'Atlanta', 'Georgia', 510000, 2650, 8.0, 7.9, 7.5, 7.4, 8.1, 7.2, 5.2, 7.3, 8.0, 8.0, 6.4, 8.1, 8.0, 7.9, 8.4, 7.6, 'Medium High')
on conflict (slug) do nothing;

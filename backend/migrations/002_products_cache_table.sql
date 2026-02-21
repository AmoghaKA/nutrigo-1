-- Migration: create products_cache table
-- Run this ONCE in Supabase SQL editor (or via supabase db push).
-- This replaces the old filesystem products_cache.csv that got wiped on every deployment.

create table if not exists public.products_cache (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  brand        text not null default '',
  category     text default '',
  calories     numeric default 0,
  fat          numeric default 0,
  sugar        numeric default 0,
  protein      numeric default 0,
  carbs        numeric default 0,
  sodium       numeric default 0,
  fiber        numeric default 0,
  ingredients  jsonb  default '[]'::jsonb,
  warnings     jsonb  default '[]'::jsonb,
  health_score numeric default 0,
  created_at   timestamptz not null default now(),

  -- ensure one row per product+brand combination (upsert key)
  constraint products_cache_name_brand_key unique (name, brand)
);

-- Index for fast case-insensitive name lookups (used by lookupInCSV)
create index if not exists idx_products_cache_name
  on public.products_cache (lower(name));

create index if not exists idx_products_cache_name_brand
  on public.products_cache (lower(name), lower(brand));

-- Enable Row Level Security
alter table public.products_cache enable row level security;

-- Service role (backend) has full access
create policy "Service role full access on products_cache"
  on public.products_cache
  for all
  to service_role
  using (true)
  with check (true);

-- Authenticated users can read (for /api/cache endpoint)
create policy "Authenticated users can read products_cache"
  on public.products_cache for select
  to authenticated
  using (true);

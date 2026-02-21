-- Migration: create product_feedback table
-- Run this in the Supabase SQL editor (or via supabase db push)

create table if not exists public.product_feedback (
  id              uuid primary key default gen_random_uuid(),
  product_name    text not null,
  brand           text default '',
  scan_id         uuid references public.scans(id) on delete set null,
  feedback_type   text not null check (feedback_type in ('correct', 'incorrect')),
  corrections     jsonb default null,   -- { calories, fat, sugar, protein, carbs, sodium, fiber }
  comment         text default '',
  created_at      timestamptz not null default now()
);

-- Index for fast per-product look-ups
create index if not exists idx_product_feedback_name
  on public.product_feedback (lower(product_name));

-- Enable Row Level Security (read-only for anon, full access for service role)
alter table public.product_feedback enable row level security;

-- Allow anyone to INSERT feedback
create policy "Anyone can submit feedback"
  on public.product_feedback for insert
  to anon, authenticated
  with check (true);

-- Allow authenticated users to read feedback (for aggregate display)
create policy "Authenticated users can read feedback"
  on public.product_feedback for select
  to authenticated
  using (true);

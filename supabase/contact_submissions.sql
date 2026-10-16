-- House of Paradox: table for website contact-form enquiries.
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.

create table if not exists public.contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 1 and 100),
  email       text not null check (char_length(email) between 3 and 200),
  service     text,
  message     text not null check (char_length(message) between 1 and 5000),
  page_url    text,
  country     text,
  user_agent  text,
  status      text not null default 'new' check (status in ('new', 'contacted', 'won', 'lost', 'spam')),
  notes       text
);

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

-- Lock the table down: row-level security on, and no policies.
-- Only the website's server (using the secret key) can insert; the public
-- anon/publishable key can neither read nor write enquiries.
alter table public.contact_submissions enable row level security;

-- ── Quote brief builder fields (added 2026-10-16) ─────────────────────────
alter table public.contact_submissions
  add column if not exists phone text check (phone is null or char_length(phone) <= 20),
  add column if not exists company text check (company is null or char_length(company) <= 100),
  add column if not exists shoot_date date,
  add column if not exists date_flexible boolean not null default false,
  add column if not exists city text check (city is null or char_length(city) <= 80),
  add column if not exists budget text check (budget is null or char_length(budget) <= 40),
  add column if not exists reference_links text[] not null default '{}' check (cardinality(reference_links) <= 5),
  add column if not exists auto_reply_sent boolean not null default false;

create index if not exists contact_submissions_email_created_idx
  on public.contact_submissions (email, created_at desc);

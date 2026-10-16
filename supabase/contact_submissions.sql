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

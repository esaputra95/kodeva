-- Kodeva demo: lead storage and marketing access control.
-- Run once against the dedicated Supabase project after project creation.

begin;

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique,
  name text not null check (char_length(btrim(name)) between 1 and 120),
  email text,
  whatsapp text,
  campaign_id text not null check (char_length(btrim(campaign_id)) between 1 and 120),
  utm jsonb not null default '{}'::jsonb
    check (jsonb_typeof(utm) = 'object'),
  landing_path text not null check (landing_path like '/%'),
  referrer_host text,
  created_at timestamptz not null default now(),
  constraint leads_contact_required check (
    (email is not null and char_length(btrim(email)) > 0)
    or (whatsapp is not null and char_length(btrim(whatsapp)) > 0)
  ),
  constraint leads_email_length check (
    email is null or char_length(email) <= 254
  ),
  constraint leads_whatsapp_length check (
    whatsapp is null or char_length(whatsapp) <= 32
  )
);

create index leads_created_at_id_idx
  on public.leads (created_at desc, id desc);

create table public.marketing_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;
alter table public.marketing_users enable row level security;

revoke all on table public.leads from PUBLIC, anon, authenticated;
revoke all on table public.marketing_users from PUBLIC, anon, authenticated;

grant select on table public.leads to authenticated;
grant select on table public.marketing_users to authenticated;
grant select, insert on table public.leads to service_role;

create policy "active marketing can read leads"
  on public.leads
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.marketing_users as marketing_user
      where marketing_user.user_id = (select auth.uid())
        and marketing_user.active = true
    )
  );

create policy "marketing users can read their own membership"
  on public.marketing_users
  for select
  to authenticated
  using (user_id = (select auth.uid()));

comment on table public.leads is
  'Kodeva demo leads; insert through the validated server Route Handler.';
comment on table public.marketing_users is
  'Allowlist for marketing users who can read Kodeva leads.';

commit;

-- ====================================================================
-- HERSPACE 4.1 - ONBOARDING STATE (ADDITIVE, NOT YET APPLIED)
-- Review and approve before running against the HerSpace-RDGI project.
-- Does not touch member_identity / member_entitlement / claim_first_trial().
-- ====================================================================

create table if not exists public.member_onboarding (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tour_completed boolean not null default false,
  tour_skipped boolean not null default false,
  onboarding_completed boolean not null default false,
  preferred_lang text not null default 'en' check (preferred_lang in ('en', 'ta')),
  updated_at timestamptz not null default now()
);

alter table public.member_onboarding enable row level security;

drop policy if exists member_onboarding_select_own on public.member_onboarding;
create policy member_onboarding_select_own on public.member_onboarding
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists member_onboarding_insert_own on public.member_onboarding;
create policy member_onboarding_insert_own on public.member_onboarding
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists member_onboarding_update_own on public.member_onboarding;
create policy member_onboarding_update_own on public.member_onboarding
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

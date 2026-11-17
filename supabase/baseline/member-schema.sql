-- Clean staging baseline reconstructed from the active HerSpace schema.
-- Run on a fresh Supabase database before the existing admin migration.
begin;

create table public.member_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) between 2 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  date_of_birth date,
  eligibility_category text check (eligibility_category in ('woman', 'transgender_woman')),
  country text,
  city text,
  preferred_language text,
  onboarding_completed_at timestamptz
);

create table public.member_entitlements (
  user_id uuid primary key references auth.users(id) on delete restrict,
  trial_started_at timestamptz not null default now(),
  trial_ends_at timestamptz not null,
  welcome_call_expires_at timestamptz not null,
  welcome_call_used_at timestamptz,
  created_at timestamptz not null default now(),
  check (trial_ends_at > trial_started_at),
  check (welcome_call_expires_at > trial_started_at and welcome_call_expires_at <= trial_ends_at)
);

create function public.set_member_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

revoke all on function public.set_member_updated_at() from public, anon, authenticated;
create trigger trg_member_updated_at before update on public.member_profiles
  for each row execute function public.set_member_updated_at();

alter table public.member_profiles enable row level security;
alter table public.member_entitlements enable row level security;
revoke all on public.member_profiles, public.member_entitlements from public, anon, authenticated;
grant select on public.member_profiles, public.member_entitlements to authenticated;
grant insert (user_id, full_name, date_of_birth, eligibility_category, preferred_language)
  on public.member_profiles to authenticated;
grant select, insert, update, delete on public.member_profiles, public.member_entitlements to service_role;

create policy "Members read own profile" on public.member_profiles
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "Members create own profile" on public.member_profiles
  for insert to authenticated with check (
    (select auth.uid()) = user_id
    and date_of_birth is not null
    and date_of_birth <= (current_date - interval '18 years')::date
    and eligibility_category in ('woman', 'transgender_woman')
    and eligibility_category is not null
    and preferred_language in ('en', 'ta')
    and preferred_language is not null
  );

create policy "Members view own entitlements" on public.member_entitlements
  for select to authenticated using ((select auth.uid()) = user_id);

commit;

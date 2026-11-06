-- Target: inspected HerSpace-RDGI schema (member_profiles + member_entitlements).
-- Apply this file only after approval; do not replay legacy 001–005 on this database.
begin;
create schema if not exists herspace_private;
revoke all on schema herspace_private from public, anon, authenticated;
alter table public.member_profiles add column if not exists username text;
create unique index if not exists member_profiles_username_unique on public.member_profiles (username) where username is not null;
create table public.account_handles (
  username text primary key check (username ~ '^[a-z][a-z0-9_]{2,31}$'),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  terms_accepted_at timestamptz not null default now()
);
alter table public.account_handles enable row level security;
revoke all on public.account_handles from public, anon, authenticated;
grant select on public.account_handles to service_role;
create table public.account_login_limits (
  username text primary key check (char_length(username) <= 32),
  window_started_at timestamptz not null,
  attempts integer not null
);
alter table public.account_login_limits enable row level security;
revoke all on public.account_login_limits from public, anon, authenticated;

-- Atomic across function workers; unknown usernames are throttled identically.
create function public.herspace_allow_login(handle text) returns boolean
language plpgsql security definer set search_path = '' as $$
declare allowed boolean;
begin
  if handle !~ '^[a-z][a-z0-9_]{2,31}$' then return false; end if;
  insert into public.account_login_limits as limits (username, window_started_at, attempts)
  values (handle, now(), 1)
  on conflict (username) do update set
    attempts = case when limits.window_started_at < now() - interval '15 minutes' then 1 else limits.attempts + 1 end,
    window_started_at = case when limits.window_started_at < now() - interval '15 minutes' then now() else limits.window_started_at end
  returning attempts <= 10 into allowed;
  return allowed;
end;
$$;
revoke all on function public.herspace_allow_login(text) from public, anon, authenticated;
grant execute on function public.herspace_allow_login(text) to service_role;

-- Trigger-only privilege: creates the two server-owned member records atomically.
-- user_metadata supplies registration fields, never roles or paid entitlements.
create function herspace_private.create_member_account() returns trigger
language plpgsql security definer set search_path = '' as $$
declare handle text; age_value integer; category text;
begin
  handle := lower(trim(new.raw_user_meta_data->>'username'));
  if handle is null then return new; end if;
  if handle !~ '^[a-z][a-z0-9_]{2,31}$' then raise exception 'Invalid registration'; end if;
  age_value := (new.raw_user_meta_data->>'age')::integer;
  category := new.raw_user_meta_data->>'identity';
  if age_value is null or age_value < 18 or age_value > 120
     or category is null or category not in ('woman','trans_woman')
     or (new.raw_user_meta_data->>'terms_accepted') is distinct from 'true'
     or new.email is null then raise exception 'Invalid registration'; end if;
  insert into public.account_handles(username,user_id) values(handle,new.id);
  insert into public.member_profiles(user_id,full_name,username,eligibility_category)
    values(new.id,handle,handle,case when category='trans_woman' then 'transgender_woman' else 'woman' end);
  insert into public.member_entitlements(user_id,trial_started_at,trial_ends_at,welcome_call_expires_at)
    values(new.id,new.created_at,new.created_at + interval '3 months',new.created_at + interval '7 days');
  return new;
end;
$$;
revoke all on function herspace_private.create_member_account() from public, anon, authenticated;
create trigger herspace_member_signup after insert on auth.users for each row execute function herspace_private.create_member_account();

alter table public.member_profiles enable row level security;
alter table public.member_entitlements enable row level security;
revoke all on public.member_profiles, public.member_entitlements from anon, authenticated;
grant select on public.member_profiles, public.member_entitlements to authenticated;
create policy herspace_profile_self_read on public.member_profiles for select to authenticated using (user_id = (select auth.uid()));
create policy herspace_entitlement_self_read on public.member_entitlements for select to authenticated using (user_id = (select auth.uid()));
-- No client INSERT/UPDATE grants: trials, handles and eligibility are server-owned.
commit;

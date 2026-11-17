begin;

alter table public.member_profiles add column username text
  check (username is null or username ~ '^[a-z][a-z0-9_]{2,31}$');
create unique index member_profiles_username_unique
  on public.member_profiles(username) where username is not null;
grant insert (username) on public.member_profiles to authenticated;

create function herspace_private.require_verified_username_owner()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.username is not null and not exists (
    select 1 from auth.users u where u.id = new.user_id and u.email_confirmed_at is not null
  ) then raise exception 'Verify your email before choosing a username' using errcode = '42501'; end if;
  return new;
end;
$$;
revoke all on function herspace_private.require_verified_username_owner() from public, anon, authenticated;
create trigger require_verified_username_owner before insert on public.member_profiles
  for each row execute function herspace_private.require_verified_username_owner();

-- Existing members may choose a username once after signing in by email.
create function public.herspace_set_member_username(requested_username text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if requested_username is null or requested_username !~ '^[a-z][a-z0-9_]{2,31}$'
    then raise exception 'Invalid username' using errcode = '22023'; end if;
  update public.member_profiles p set username = requested_username
  from auth.users u
  where p.user_id = auth.uid() and u.id = p.user_id
    and u.email_confirmed_at is not null and p.username is null;
  if not found then
    if not exists (
      select 1 from public.member_profiles p join auth.users u on u.id = p.user_id
      where p.user_id = auth.uid() and u.email_confirmed_at is not null and p.username = requested_username
    ) then raise exception 'Username cannot be changed' using errcode = '42501'; end if;
  end if;
end;
$$;
revoke all on function public.herspace_set_member_username(text) from public, anon, authenticated;
grant execute on function public.herspace_set_member_username(text) to authenticated;

-- Bounded, atomic buckets for both known and unknown names. No raw login attempts are kept.
create table herspace_private.username_login_limits (
  bucket integer primary key check (bucket between 0 and 65535),
  starts_at timestamptz not null,
  attempts integer not null
);
alter table herspace_private.username_login_limits enable row level security;
revoke all on herspace_private.username_login_limits from public, anon, authenticated;

create function public.herspace_resolve_username_login(requested_username text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  attempt_count integer;
  recovery_email text;
begin
  if requested_username is null or requested_username !~ '^[a-z][a-z0-9_]{2,31}$' then
    return jsonb_build_object('allowed', false);
  end if;
  insert into herspace_private.username_login_limits as limiter
    values (hashtext(requested_username) & 65535, now(), 1)
    on conflict (bucket) do update set
      starts_at = case when limiter.starts_at <= now() - interval '15 minutes' then now() else limiter.starts_at end,
      attempts = case when limiter.starts_at <= now() - interval '15 minutes' then 1 else least(limiter.attempts + 1, 11) end
    returning attempts into attempt_count;
  if attempt_count > 10 then return jsonb_build_object('allowed', false); end if;
  select u.email into recovery_email from public.member_profiles p
    join auth.users u on u.id = p.user_id
    where p.username = requested_username and u.email_confirmed_at is not null
      and u.deleted_at is null and (u.banned_until is null or u.banned_until <= now());
  return jsonb_strip_nulls(jsonb_build_object('allowed', true, 'email', recovery_email));
end;
$$;
revoke all on function public.herspace_resolve_username_login(text) from public, anon, authenticated;
grant execute on function public.herspace_resolve_username_login(text) to service_role;

-- The production-only event trigger runs implicitly. Its function needs no API grants.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end;
$$;

commit;

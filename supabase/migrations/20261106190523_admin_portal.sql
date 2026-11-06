-- Additive admin login foundation; no account is made an admin by this migration.
-- Compatible with the two inspected member tables; does not require legacy migrations.
begin;
create schema if not exists herspace_private;
revoke all on schema herspace_private from public, anon;
grant usage on schema herspace_private to authenticated;
create table public.admin_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.admin_accounts enable row level security;
revoke all on public.admin_accounts from public, anon, authenticated;
grant select, insert, update on public.admin_accounts to service_role;

-- The role lives in a server-owned table, never editable user_metadata or browser storage.
create function herspace_private.is_staff() returns boolean
language sql stable security definer set search_path = '' as $$
  select (select auth.uid()) is not null and exists(
    select 1 from public.admin_accounts where user_id = (select auth.uid()) and enabled
  );
$$;
revoke all on function herspace_private.is_staff() from public, anon;
grant execute on function herspace_private.is_staff() to authenticated;

create function herspace_private.is_admin() returns boolean
language sql stable security invoker set search_path = '' as $$
  select herspace_private.is_staff() and coalesce((select auth.jwt())->>'aal','') = 'aal2';
$$;
revoke all on function herspace_private.is_admin() from public, anon;
grant execute on function herspace_private.is_admin() to authenticated;

-- Only self-status is exposed before MFA; it cannot reveal any other account's role.
create function public.herspace_staff_status() returns jsonb
language sql stable security invoker set search_path = '' as $$
  select jsonb_build_object('is_staff',herspace_private.is_staff(),'has_admin_access',herspace_private.is_admin());
$$;
revoke all on function public.herspace_staff_status() from public, anon;
grant execute on function public.herspace_staff_status() to authenticated;

-- This privileged reader always checks current role + MFA before touching member data.
create function herspace_private.admin_overview() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  if not herspace_private.is_admin() then raise exception 'Admin access denied' using errcode = '42501'; end if;
  return jsonb_build_object(
    'member_count',(select count(*) from public.member_profiles),
    'active_trial_count',(select count(*) from public.member_entitlements where trial_ends_at > now()),
    'welcome_calls_used',(select count(*) from public.member_entitlements where welcome_call_used_at is not null),
    'members',coalesce((select jsonb_agg(item order by item->>'joined_at' desc) from (
      select jsonb_build_object('user_id',p.user_id,'username',null,'display_name',p.full_name,'joined_at',p.created_at,'trial_ends_at',e.trial_ends_at) as item
      from public.member_profiles p left join public.member_entitlements e using(user_id)
      order by p.created_at desc limit 100
    ) recent),'[]'::jsonb)
  );
end;
$$;
revoke all on function herspace_private.admin_overview() from public, anon;
grant execute on function herspace_private.admin_overview() to authenticated;
create function public.herspace_admin_overview() returns jsonb
language sql stable security invoker set search_path = '' as $$
  select herspace_private.admin_overview();
$$;
revoke all on function public.herspace_admin_overview() from public, anon;
grant execute on function public.herspace_admin_overview() to authenticated;
commit;

-- Additive. Apply after the member and admin baselines.
begin;

create function herspace_private.complete_member_onboarding(expected_member uuid)
returns timestamptz language plpgsql security definer set search_path = '' as $$
declare
  completed_at timestamptz;
begin
  if auth.uid() is null or auth.uid() is distinct from expected_member then
    raise exception 'Member access denied' using errcode = '42501';
  end if;

  update public.member_profiles
     set onboarding_completed_at = coalesce(onboarding_completed_at, now())
   where user_id = expected_member
   returning onboarding_completed_at into completed_at;
  if not found then raise exception 'Member profile is required' using errcode = '42501'; end if;
  return completed_at;
end;
$$;

create function public.herspace_complete_member_onboarding(expected_member uuid)
returns timestamptz language sql security invoker set search_path = '' as $$
  select herspace_private.complete_member_onboarding(expected_member);
$$;

revoke all on function herspace_private.complete_member_onboarding(uuid),
  public.herspace_complete_member_onboarding(uuid) from public, anon, authenticated;
grant execute on function herspace_private.complete_member_onboarding(uuid),
  public.herspace_complete_member_onboarding(uuid) to authenticated;

commit;

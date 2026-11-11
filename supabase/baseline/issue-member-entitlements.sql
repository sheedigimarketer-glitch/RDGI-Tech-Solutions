-- Apply only to HerSpace-Staging after the member schema.
begin;

create function herspace_private.issue_member_entitlements() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  registered_at timestamptz;
begin
  select u.created_at into registered_at
    from auth.users u
    where u.id = new.user_id
      and u.email_confirmed_at is not null
      and u.phone_confirmed_at is not null
      and nullif(u.email, '') is not null
      and nullif(u.phone, '') is not null;

  if registered_at is not null
    and new.date_of_birth <= (current_date - interval '18 years')::date
    and new.eligibility_category in ('woman', 'transgender_woman')
  then
    insert into public.member_entitlements(
      user_id, trial_started_at, trial_ends_at, welcome_call_expires_at
    )
    values (
      new.user_id, registered_at,
      ((registered_at at time zone 'Asia/Kolkata') + interval '3 months') at time zone 'Asia/Kolkata',
      registered_at + interval '168 hours'
    )
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

revoke all on function herspace_private.issue_member_entitlements() from public, anon, authenticated;

create trigger issue_member_entitlements_after_profile
after insert on public.member_profiles
for each row execute function herspace_private.issue_member_entitlements();

commit;

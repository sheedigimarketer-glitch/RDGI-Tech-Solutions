-- Apply after the staging entitlement baseline. Production requires separate reconciliation.
begin;

create table herspace_private.member_claim_secret (
  singleton boolean primary key default true check (singleton),
  secret text not null default (gen_random_uuid()::text || gen_random_uuid()::text)
);

insert into herspace_private.member_claim_secret default values;

-- Retain claims independently of the Auth account and use keyed fingerprints.
create table herspace_private.member_identity_claims (
  member_id uuid primary key,
  email_fingerprint bytea not null unique,
  phone_fingerprint bytea not null unique
);

alter table herspace_private.member_claim_secret enable row level security;
alter table herspace_private.member_identity_claims enable row level security;
revoke all on herspace_private.member_claim_secret, herspace_private.member_identity_claims
  from public, anon, authenticated;

-- Abort on ambiguous historical verified identities so they can be reconciled.
insert into herspace_private.member_identity_claims
select e.user_id,
       extensions.hmac('email:' || lower(trim(u.email)), k.secret, 'sha256'),
       extensions.hmac('phone:' || ltrim(u.phone, '+'), k.secret, 'sha256')
from public.member_entitlements e
join auth.users u on u.id = e.user_id
cross join herspace_private.member_claim_secret k
where u.email_confirmed_at is not null and u.phone_confirmed_at is not null
  and nullif(trim(u.email), '') is not null and ltrim(u.phone, '+') ~ '^[1-9][0-9]{7,14}$';

create function herspace_private.claim_member_entitlements(member_id uuid)
returns boolean language plpgsql set search_path = '' as $$
declare
  verified_member record;
  claimed_id uuid;
begin
  if exists (select 1 from public.member_entitlements where user_id = member_id) then
    return true;
  end if;

  select u.created_at as registered_at, lower(trim(u.email)) as email, ltrim(u.phone, '+') as phone
    into verified_member
  from auth.users u
  join public.member_profiles p on p.user_id = u.id
  where u.id = member_id
    and u.email_confirmed_at is not null and u.phone_confirmed_at is not null
    and nullif(trim(u.email), '') is not null and ltrim(u.phone, '+') ~ '^[1-9][0-9]{7,14}$'
    and p.date_of_birth <= (current_date - interval '18 years')::date
    and p.eligibility_category in ('woman', 'transgender_woman');
  if not found then return false; end if;

  insert into herspace_private.member_identity_claims(member_id, email_fingerprint, phone_fingerprint)
  select member_id,
         extensions.hmac('email:' || verified_member.email, k.secret, 'sha256'),
         extensions.hmac('phone:' || verified_member.phone, k.secret, 'sha256')
  from herspace_private.member_claim_secret k
  on conflict do nothing
  returning member_identity_claims.member_id into claimed_id;

  if claimed_id is null then
    return exists (select 1 from public.member_entitlements where user_id = member_id);
  end if;

  insert into public.member_entitlements(user_id, trial_started_at, trial_ends_at, welcome_call_expires_at)
  values (
    member_id, verified_member.registered_at,
    ((verified_member.registered_at at time zone 'Asia/Kolkata') + interval '3 months') at time zone 'Asia/Kolkata',
    verified_member.registered_at + interval '168 hours'
  );
  return true;
end;
$$;

revoke all on function herspace_private.claim_member_entitlements(uuid) from public, anon, authenticated;

create or replace function herspace_private.issue_member_entitlements()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  perform herspace_private.claim_member_entitlements(new.user_id);
  return new;
end;
$$;

create function public.herspace_claim_member_entitlements()
returns boolean language sql security definer set search_path = '' as $$
  select herspace_private.claim_member_entitlements(auth.uid());
$$;

revoke all on function public.herspace_claim_member_entitlements() from public, anon, authenticated;
grant execute on function public.herspace_claim_member_entitlements() to authenticated;

commit;

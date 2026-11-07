begin;

create table herspace_private.communications_pilot_attempts (
  channel text primary key check (channel in ('call', 'whatsapp')),
  requested_at timestamptz not null default now()
);
alter table herspace_private.communications_pilot_attempts enable row level security;
revoke all on herspace_private.communications_pilot_attempts from public, anon, authenticated;

create function herspace_private.reserve_communications_test(requested_channel text)
returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  if not herspace_private.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;
  if requested_channel is null or requested_channel not in ('call', 'whatsapp') then
    raise exception 'Invalid test channel' using errcode = '22023';
  end if;
  insert into herspace_private.communications_pilot_attempts(channel)
  values (requested_channel)
  on conflict do nothing;
  return found;
end;
$$;

revoke all on function herspace_private.reserve_communications_test(text) from public, anon;
grant execute on function herspace_private.reserve_communications_test(text) to authenticated;

create function public.herspace_reserve_communications_test(channel text)
returns boolean
language sql security invoker set search_path = '' as $$
  select herspace_private.reserve_communications_test(channel);
$$;

revoke all on function public.herspace_reserve_communications_test(text) from public, anon;
grant execute on function public.herspace_reserve_communications_test(text) to authenticated;

commit;

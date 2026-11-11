-- Additive staging rehearsal. Apply after the member and admin baselines.
begin;

-- Only trusted operators can publish slots for approved trained human listeners.
create table herspace_private.welcome_listener_slots (
  id uuid primary key default gen_random_uuid(),
  listener_id uuid not null references auth.users(id),
  starts_at timestamptz not null,
  unique (listener_id, starts_at)
);

create table herspace_private.welcome_bookings (
  member_id uuid primary key references public.member_entitlements(user_id),
  slot_id uuid not null unique references herspace_private.welcome_listener_slots(id),
  booked_at timestamptz not null default now()
);

alter table herspace_private.welcome_listener_slots enable row level security;
alter table herspace_private.welcome_bookings enable row level security;
revoke all on herspace_private.welcome_listener_slots, herspace_private.welcome_bookings
  from public, anon, authenticated;

create function public.herspace_welcome_schedule()
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'booking', (
      select jsonb_build_object('starts_at', s.starts_at)
      from herspace_private.welcome_bookings b
      join herspace_private.welcome_listener_slots s on s.id = b.slot_id
      where b.member_id = auth.uid()
    ),
    'slots', coalesce((
      select jsonb_agg(jsonb_build_object('id', a.id, 'starts_at', a.starts_at) order by a.starts_at)
      from (
        select s.id, s.starts_at
        from herspace_private.welcome_listener_slots s
        join public.member_entitlements e on e.user_id = auth.uid()
        join auth.users u on u.id = e.user_id
        where e.welcome_call_used_at is null
          and u.email_confirmed_at is not null and u.phone_confirmed_at is not null
          and s.starts_at > now()
          and s.starts_at + interval '30 minutes' <= e.welcome_call_expires_at
          and not exists (select 1 from herspace_private.welcome_bookings b where b.member_id = e.user_id or b.slot_id = s.id)
        order by s.starts_at
        limit 50
      ) a
    ), '[]'::jsonb)
  );
$$;

create function public.herspace_book_welcome_session(requested_slot uuid)
returns timestamptz language plpgsql security definer set search_path = '' as $$
declare
  member uuid := auth.uid();
  benefit public.member_entitlements%rowtype;
  slot_start timestamptz;
begin
  select e.* into benefit from public.member_entitlements e
    where e.user_id = member for update;
  if not found or benefit.welcome_call_used_at is not null or benefit.welcome_call_expires_at <= now()
    or not exists (select 1 from auth.users u where u.id = member
                   and u.email_confirmed_at is not null and u.phone_confirmed_at is not null)
  then raise exception 'Welcome session is not available' using errcode = '42501'; end if;

  -- A retry for the same slot returns the original reservation.
  select s.starts_at into slot_start
    from herspace_private.welcome_bookings b
    join herspace_private.welcome_listener_slots s on s.id = b.slot_id
    where b.member_id = member and b.slot_id = requested_slot;
  if found then return slot_start; end if;

  select s.starts_at into slot_start from herspace_private.welcome_listener_slots s
    where s.id = requested_slot
      and s.starts_at > now()
      and s.starts_at + interval '30 minutes' <= benefit.welcome_call_expires_at;
  if not found then raise exception 'Slot is not available' using errcode = '22023'; end if;

  insert into herspace_private.welcome_bookings(member_id, slot_id) values (member, requested_slot);
  return slot_start;
end;
$$;

create function public.herspace_complete_welcome_session(member_id_to_complete uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not herspace_private.is_admin()
  then raise exception 'Admin access denied' using errcode = '42501'; end if;

  update public.member_entitlements e
     set welcome_call_used_at = now()
    from herspace_private.welcome_bookings b
    join herspace_private.welcome_listener_slots s on s.id = b.slot_id
   where e.user_id = member_id_to_complete and b.member_id = e.user_id
     and e.welcome_call_used_at is null
     and now() >= s.starts_at + interval '30 minutes'
     and s.starts_at + interval '30 minutes' <= e.welcome_call_expires_at;
  if not found then raise exception 'No completed unredeemed welcome booking' using errcode = '22023'; end if;
end;
$$;

revoke all on function public.herspace_welcome_schedule(),
  public.herspace_book_welcome_session(uuid), public.herspace_complete_welcome_session(uuid) from public, anon;
grant execute on function public.herspace_welcome_schedule(),
  public.herspace_book_welcome_session(uuid), public.herspace_complete_welcome_session(uuid) to authenticated;
commit;

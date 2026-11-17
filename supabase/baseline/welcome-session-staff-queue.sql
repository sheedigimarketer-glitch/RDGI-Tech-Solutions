-- Additive. Apply after welcome-session-booking.sql.
begin;

create function herspace_private.welcome_redemption_queue()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if not herspace_private.is_admin() then
    raise exception 'Admin access denied' using errcode = '42501';
  end if;

  return coalesce((
    select jsonb_agg(row_to_json(ready) order by ready.starts_at)
    from (
      select b.member_id, p.full_name as member_name, s.starts_at
      from herspace_private.welcome_bookings b
      join herspace_private.welcome_listener_slots s on s.id = b.slot_id
      join public.member_entitlements e on e.user_id = b.member_id
      join public.member_profiles p on p.user_id = b.member_id
      where e.welcome_call_used_at is null
        and s.starts_at + interval '30 minutes' <= now()
        and s.starts_at + interval '30 minutes' <= e.welcome_call_expires_at
      order by s.starts_at
      limit 50
    ) ready
  ), '[]'::jsonb);
end;
$$;

create function public.herspace_welcome_redemption_queue()
returns jsonb language sql stable security invoker set search_path = '' as $$
  select herspace_private.welcome_redemption_queue();
$$;

revoke all on function herspace_private.welcome_redemption_queue(),
  public.herspace_welcome_redemption_queue() from public, anon, authenticated;
grant execute on function herspace_private.welcome_redemption_queue(),
  public.herspace_welcome_redemption_queue() to authenticated;

commit;

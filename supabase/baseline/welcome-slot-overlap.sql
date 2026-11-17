-- Apply after the welcome-session booking baseline.
begin;

create extension if not exists btree_gist with schema extensions;

-- A listener can publish adjacent sessions, but no two 30-minute slots may overlap.
alter table herspace_private.welcome_listener_slots
  add constraint welcome_listener_slots_no_overlap
  exclude using gist (
    listener_id extensions.gist_uuid_ops with =,
    tsrange(
      starts_at at time zone 'UTC',
      (starts_at at time zone 'UTC') + interval '30 minutes',
      '[)'
    ) with &&
  );

commit;

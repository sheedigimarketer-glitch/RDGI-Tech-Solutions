-- ====================================================================
-- HERSPACE PREMIUM 2.0 - ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- 1. Enable RLS on all tables
alter table public.member_identity enable row level security;
alter table public.member_entitlement enable row level security;
alter table public.session_catalog enable row level security;
alter table public.membership_plan enable row level security;
alter table public.professional_profiles enable row level security;
alter table public.appointments enable row level security;

-- 2. Revoke default permissions
revoke all on public.member_identity from anon, authenticated;
revoke all on public.member_entitlement from anon, authenticated;
revoke all on public.session_catalog from anon;
revoke all on public.membership_plan from anon;
revoke all on public.professional_profiles from anon;
revoke all on public.appointments from anon, authenticated;

-- 3. Public Catalog & Plans (Read-only for authenticated & anon where appropriate)
grant select on public.session_catalog to authenticated, anon;
grant select on public.membership_plan to authenticated, anon;
create policy catalog_read on public.session_catalog for select using (enabled = true);
create policy plans_read on public.membership_plan for select using (true);

-- 4. Professional Directory (Approved professionals are public to browse)
grant select on public.professional_profiles to authenticated, anon;
create policy active_professionals_read on public.professional_profiles
  for select using (approval_status = 'approved');

-- 5. Member Identity & Entitlements (Strict self-isolation)
grant select, update on public.member_identity to authenticated;
grant select on public.member_entitlement to authenticated;

create policy member_reads_own_identity on public.member_identity
  for select to authenticated using ((select auth.uid()) = user_id);

create policy member_updates_own_identity on public.member_identity
  for update to authenticated using ((select auth.uid()) = user_id);

create policy member_reads_own_entitlement on public.member_entitlement
  for select to authenticated using ((select auth.uid()) = user_id);

-- 6. Appointments (Members read their own; Professionals read their assigned sessions)
grant select, insert, update on public.appointments to authenticated;

create policy member_reads_own_appointments on public.appointments
  for select to authenticated using (
    member_id = (select auth.uid())
    or professional_id in (select id from public.professional_profiles where user_id = (select auth.uid()))
  );

create policy member_books_appointment on public.appointments
  for insert to authenticated with check (
    member_id = (select auth.uid())
  );

create policy member_reschedules_own_appointment on public.appointments
  for update to authenticated using (
    member_id = (select auth.uid())
  ) with check (
    member_id = (select auth.uid())
  );

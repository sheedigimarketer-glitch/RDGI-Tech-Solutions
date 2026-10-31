-- ====================================================================
-- HERSPACE PREMIUM 2.0 - DATABASE FOUNDATION & BUSINESS ENFORCEMENT
-- RDGI Tech Solutions
-- ====================================================================

create extension if not exists pgcrypto;

-- 1. Member Identity Table (Strict Deduplication on Verified Phone & Email)
create table if not exists public.member_identity (
  user_id uuid primary key references auth.users(id) on delete restrict,
  email_normalized text not null unique,
  phone_e164 text not null unique,
  full_name text not null,
  age integer not null check (age >= 18),
  identity_category text not null check (identity_category in ('woman', 'trans_woman')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Member Entitlement Table (3-Month Free Trial & 7-Day Complimentary Call)
create table if not exists public.member_entitlement (
  user_id uuid primary key references public.member_identity(user_id) on delete restrict,
  first_trial_started_at timestamptz not null default now(),
  first_trial_ends_at timestamptz not null,
  welcome_call_expires_at timestamptz not null,
  welcome_call_status text not null default 'available'
    check (welcome_call_status in ('available', 'reserved', 'completed', 'expired')),
  paid_through timestamptz,
  auto_renew_enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  check (first_trial_ends_at > first_trial_started_at),
  check (welcome_call_expires_at > first_trial_started_at)
);

-- 3. Session Catalog (Strict Confirmed Business Pricing)
create table if not exists public.session_catalog (
  code text primary key,
  label text not null,
  price_paise integer not null check (price_paise >= 0),
  duration_minutes integer not null check (duration_minutes > 0),
  enabled boolean not null default true
);

insert into public.session_catalog (code, label, price_paise, duration_minutes) values
  ('welcome_listener', 'One-time Complimentary Welcome Listener Call', 0, 30),
  ('paid_listener', 'Trained Human Listener Session', 39900, 60),
  ('certified_counsellor', 'Certified Professional Counsellor Session', 99900, 60)
on conflict (code) do update set
  label = excluded.label,
  price_paise = excluded.price_paise,
  duration_minutes = excluded.duration_minutes;

-- 4. Membership Plans
create table if not exists public.membership_plan (
  code text primary key,
  label text not null,
  price_paise integer not null check (price_paise > 0),
  period_months integer not null check (period_months > 0)
);

insert into public.membership_plan (code, label, price_paise, period_months) values
  ('monthly', 'HerSpace Monthly Care Membership', 14900, 1)
on conflict (code) do update set
  price_paise = excluded.price_paise,
  period_months = excluded.period_months;

-- 5. Professional Directory & Clinical Credential Verification
create table if not exists public.professional_profiles (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  role text not null check (role in ('listener', 'counsellor')),
  primary_qualification text not null,
  rci_license_number text,
  experience_years integer not null check (experience_years >= 0),
  bio text not null,
  languages text[] not null default '{"English", "Tamil"}',
  specialties text[] not null default '{}',
  approval_status text not null default 'pending'
    check (approval_status in ('pending', 'approved', 'rejected')),
  approval_notes text,
  verified_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. Appointment Slots & Bookings
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.member_identity(user_id) on delete restrict,
  professional_id text not null references public.professional_profiles(id) on delete restrict,
  session_code text not null references public.session_catalog(code),
  scheduled_start timestamptz not null,
  scheduled_end timestamptz not null,
  communication_mode text not null check (communication_mode in ('Voice Call', 'Video Call', 'Private Chat')),
  status text not null default 'scheduled'
    check (status in ('scheduled', 'rescheduled', 'completed', 'refunded_due_to_provider_absence', 'no_show')),
  reschedule_allowed_until timestamptz not null,
  amount_paid_paise integer not null check (amount_paid_paise >= 0),
  payment_transaction_id text,
  refund_transaction_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (scheduled_end > scheduled_start)
);

-- 7. Atomic First-Time Free Trial Claim Stored Procedure
create or replace function public.claim_first_trial()
returns table(trial_ends_at timestamptz, welcome_expires_at timestamptz)
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_email text;
  v_phone text;
  v_start timestamptz;
  v_end timestamptz;
  v_welcome timestamptz;
begin
  if v_uid is null then
    raise exception 'Authentication required';
  end if;

  select lower(trim(u.email)), u.phone into v_email, v_phone
  from auth.users u where u.id = v_uid;

  if v_email is null and v_phone is null then
    raise exception 'A verified email or mobile number is required to claim trial';
  end if;

  -- Advisory Locks serialize overlapping concurrent identity claims
  if v_email is not null then
    perform pg_advisory_xact_lock(hashtextextended('email:' || v_email, 0));
  end if;
  if v_phone is not null then
    perform pg_advisory_xact_lock(hashtextextended('phone:' || v_phone, 0));
  end if;

  -- Strict deduplication: Check if identity already used a trial
  if exists (
    select 1 from public.member_identity i
    where (v_email is not null and i.email_normalized = v_email)
       or (v_phone is not null and i.phone_e164 = v_phone)
  ) then
    raise exception 'Existing membership found: use account recovery';
  end if;

  v_start := now();
  v_end := v_start + interval '3 months';
  v_welcome := v_start + interval '7 days';

  insert into public.member_identity (user_id, email_normalized, phone_e164, full_name, age, identity_category)
  values (v_uid, coalesce(v_email, 'phone_' || v_phone), coalesce(v_phone, 'email_' || v_email), 'HerSpace Member', 18, 'woman');

  insert into public.member_entitlement (user_id, first_trial_started_at, first_trial_ends_at, welcome_call_expires_at)
  values (v_uid, v_start, v_end, v_welcome);

  return query select v_end, v_welcome;
end $$;

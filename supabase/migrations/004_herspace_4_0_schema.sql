-- =============================================================================
-- HerSpace Premium 4.0 — Additive Database & Privacy Architecture Migration
-- Project: HerSpace-RDGI (RDGI Tech Solutions)
-- Strictly additive migration preserving existing profiles, entitlements, and bookings.
-- =============================================================================

-- 1. Women's Wellbeing Knowledge Base Tables (Categories A–K, Articles, Translations, Sources, Editorial Reviews)
CREATE TABLE IF NOT EXISTS public.wellbeing_categories (
  id TEXT PRIMARY KEY,
  category_code TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_ta TEXT NOT NULL,
  description_en TEXT,
  description_ta TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wellbeing_articles (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES public.wellbeing_categories(id) ON DELETE CASCADE,
  editorial_stage TEXT NOT NULL DEFAULT 'Draft' CHECK (editorial_stage IN ('Draft', 'Clinical Review', 'Translation Review', 'Approved', 'Published', 'Archived')),
  review_badge_en TEXT DEFAULT 'Approved Educational Content',
  review_badge_ta TEXT DEFAULT 'அங்கீகரிக்கப்பட்ட கல்வித் தகவல்',
  last_reviewed_date DATE DEFAULT CURRENT_DATE,
  synonyms TEXT[] DEFAULT '{}',
  related_article_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wellbeing_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id TEXT NOT NULL REFERENCES public.wellbeing_articles(id) ON DELETE CASCADE,
  lang TEXT NOT NULL CHECK (lang IN ('en', 'ta')),
  title TEXT NOT NULL,
  short_answer TEXT NOT NULL,
  detailed_explanation TEXT NOT NULL,
  self_care_tips TEXT[] DEFAULT '{}',
  red_flag_symptoms TEXT[] DEFAULT '{}',
  when_to_seek_care TEXT NOT NULL,
  UNIQUE (article_id, lang)
);

CREATE TABLE IF NOT EXISTS public.wellbeing_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id TEXT NOT NULL REFERENCES public.wellbeing_articles(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL, -- e.g. WHO, ICMR, NHM India, FOGSI, NIMHANS
  guideline_title TEXT NOT NULL,
  publication_year INTEGER,
  verified_public_source BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.content_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id TEXT NOT NULL REFERENCES public.wellbeing_articles(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id),
  reviewer_role TEXT NOT NULL,
  stage_completed TEXT NOT NULL,
  review_notes TEXT,
  reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Private Anonymous Topic Requests (Strictly isolated from professionals)
CREATE TABLE IF NOT EXISTS public.private_question_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category_id TEXT NOT NULL,
  question_text TEXT NOT NULL,
  moderation_status TEXT NOT NULL DEFAULT 'queued' CHECK (moderation_status IN ('queued', 'in_editorial_review', 'converted_to_article', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Optional Menstrual Cycle Tracker ("My Cycle") — Strictly Opt-In & Privacy-Isolated
CREATE TABLE IF NOT EXISTS public.period_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  opt_in_consent BOOLEAN NOT NULL DEFAULT FALSE,
  consented_at TIMESTAMPTZ,
  reminders_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  lock_screen_redacted BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.period_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  flow_intensity TEXT CHECK (flow_intensity IN ('spotting', 'light', 'medium', 'heavy')),
  symptoms TEXT[] DEFAULT '{}',
  mood TEXT,
  encrypted_personal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. HerSpace Calm — Music & Meditation Channel Tables
CREATE TABLE IF NOT EXISTS public.audio_licences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  licence_title TEXT NOT NULL,
  rights_holder TEXT NOT NULL,
  licence_type TEXT NOT NULL CHECK (licence_type IN ('Original Studio Master', 'Royalty-Free Commercial', 'Creative Commons Attribution', 'Public Domain')),
  valid_until DATE,
  verified_by_admin BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audio_tracks (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('meditation', 'instrumental', 'nature', 'sleep')),
  language TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_ta TEXT NOT NULL,
  artist_en TEXT NOT NULL,
  artist_ta TEXT NOT NULL,
  description_en TEXT,
  description_ta TEXT,
  duration_seconds INTEGER NOT NULL,
  artwork_path TEXT,
  licence_id UUID REFERENCES public.audio_licences(id),
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audio_playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_ta TEXT NOT NULL,
  track_ids TEXT[] DEFAULT '{}',
  is_system_playlist BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. HerSpace Live Melodies — Verified Live Singers
CREATE TABLE IF NOT EXISTS public.singer_profiles (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  display_name_en TEXT NOT NULL,
  display_name_ta TEXT NOT NULL,
  vocal_styles_en TEXT[] DEFAULT '{}',
  vocal_styles_ta TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{Tamil,English}',
  qualification TEXT NOT NULL,
  experience_years INTEGER DEFAULT 1,
  fee_status TEXT NOT NULL DEFAULT 'Pending Client Approval',
  fee_currency TEXT NOT NULL DEFAULT 'INR',
  admin_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.singer_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  singer_id TEXT NOT NULL REFERENCES public.singer_profiles(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  slot_time TEXT NOT NULL,
  is_available BOOLEAN DEFAULT TRUE
);

-- 6. Cloud Telephony & Exotel Two-Way Masked Calling Tables
CREATE TABLE IF NOT EXISTS public.call_queues (
  id TEXT PRIMARY KEY,
  service_role TEXT NOT NULL CHECK (service_role IN ('listener', 'counsellor', 'singer', 'admin')),
  virtual_bridge_number TEXT NOT NULL,
  max_wait_seconds INTEGER DEFAULT 180,
  two_way_masking_enforced BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.call_sessions (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL,
  member_id UUID REFERENCES auth.users(id),
  partner_id TEXT NOT NULL,
  queue_id TEXT NOT NULL REFERENCES public.call_queues(id),
  virtual_bridge_number TEXT NOT NULL,
  call_state TEXT NOT NULL CHECK (call_state IN ('authorizing', 'queued', 'connected', 'on_hold', 'parked', 'transferred', 'ended', 'failed')),
  park_slot_code TEXT,
  park_authorized_role TEXT,
  real_numbers_exposed BOOLEAN NOT NULL DEFAULT FALSE CHECK (real_numbers_exposed = FALSE),
  audio_recording_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  duration_seconds INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.call_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_session_id TEXT NOT NULL REFERENCES public.call_sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_detail TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Notification Preferences
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_lang TEXT NOT NULL DEFAULT 'en' CHECK (preferred_lang IN ('en', 'ta')),
  security_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  appointment_reminders BOOLEAN NOT NULL DEFAULT TRUE,
  membership_expiry_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  discreet_cycle_reminders BOOLEAN NOT NULL DEFAULT FALSE,
  lock_screen_redaction BOOLEAN NOT NULL DEFAULT TRUE,
  calm_content_updates BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- STRICT ROW-LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.wellbeing_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellbeing_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellbeing_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellbeing_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_question_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.period_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.period_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.singer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Public read access for published Wellbeing articles, Calm tracks & Verified Singers
CREATE POLICY "Public read wellbeing categories" ON public.wellbeing_categories FOR SELECT USING (true);
CREATE POLICY "Public read published wellbeing articles" ON public.wellbeing_articles FOR SELECT USING (editorial_stage = 'Published');
CREATE POLICY "Public read wellbeing translations" ON public.wellbeing_translations FOR SELECT USING (true);
CREATE POLICY "Public read wellbeing sources" ON public.wellbeing_sources FOR SELECT USING (true);
CREATE POLICY "Public read published audio tracks" ON public.audio_tracks FOR SELECT USING (is_published = true);
CREATE POLICY "Public read verified singers" ON public.singer_profiles FOR SELECT USING (admin_verified = true);

-- Strictly isolate Period Logs & Preferences to the owning member ONLY (Zero professional access)
CREATE POLICY "Members isolate own period preferences" ON public.period_preferences
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members isolate own period logs" ON public.period_logs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Strictly isolate Private Question Requests to the submitting member
CREATE POLICY "Members submit private questions" ON public.private_question_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Members view own private questions" ON public.private_question_requests
  FOR SELECT USING (auth.uid() = user_id);

-- Isolate Notification Preferences to owning member
CREATE POLICY "Members manage own notification preferences" ON public.notification_preferences
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

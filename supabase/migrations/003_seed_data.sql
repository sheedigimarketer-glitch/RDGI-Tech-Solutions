-- ====================================================================
-- HERSPACE PREMIUM 2.0 - INITIAL APPROVED SEED PROFILES
-- ====================================================================

insert into public.professional_profiles (
  id, full_name, role, primary_qualification, rci_license_number,
  experience_years, bio, languages, specialties, approval_status
) values
(
  'counsellor-anita',
  'Anita S.',
  'counsellor',
  'M.Sc. Counselling Psychology',
  'RCI-PSY-48291',
  12,
  'Specialized in compassionate cognitive and existential counselling with 12+ years helping women navigate identity, stress, and relational crossroads.',
  '{"English", "Tamil"}',
  '{"Mental Health", "Anxiety & Low Mood", "Life Guidance", "Grief & Loss"}',
  'approved'
),
(
  'listener-priya',
  'Priya M.',
  'listener',
  'Certified Trained Human Listener · Emotional First Aid',
  null,
  8,
  'A gentle, dedicated listener who holds non-judgmental space for your thoughts when you need an understanding ear without unsolicited advice.',
  '{"Tamil", "English"}',
  '{"Relationships", "Emotional Support", "Stress & Venting", "Work-Life Balance"}',
  'approved'
),
(
  'counsellor-neha',
  'Neha R.',
  'counsellor',
  'M.Phil Clinical Psychology',
  'RCI-CLIN-19830',
  10,
  'Evidence-based psychotherapist focusing on trauma-informed cognitive techniques and self-compassion tools for women facing demanding life pressures.',
  '{"English", "Tamil"}',
  '{"Career Anxiety", "Trauma-Informed Care", "Life Transitions", "Depression"}',
  'approved'
),
(
  'listener-meera',
  'Meera K.',
  'listener',
  'Certified Active Listener · Women’s Peer Support Lead',
  null,
  6,
  'Warm, reassuring companion for women experiencing changes in family life, motherhood, or unexpected feelings of isolation.',
  '{"Tamil", "English"}',
  '{"Motherhood & Postpartum", "Wellness", "Parenting Stress", "Loneliness"}',
  'approved'
)
on conflict (id) do nothing;

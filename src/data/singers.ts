import { LiveSinger } from '../types';

export const LIVE_SINGERS: LiveSinger[] = [
  {
    id: 'singer_1',
    name: 'Smt. Harini Sundaram',
    nameTa: 'திருமதி. ஹரிணி சுந்தரம்',
    role: 'singer',
    roleLabelEn: 'Verified Live Singer · HerSpace Live Melodies',
    roleLabelTa: 'சரிபார்க்கப்பட்ட நேரலைப் பாடகர்',
    stylesEn: ['Tamil Lullabies (Thaalattu)', 'Carnatic Acoustic', 'Soothing Devotional'],
    stylesTa: ['தமிழ் தாலாட்டு', 'கர்நாடக மெல்லிசை', 'மன அமைதிப் பாடல்கள்'],
    languages: ['Tamil', 'English'],
    experienceYears: 9,
    rating: 4.9,
    sessionsCompleted: 145,
    qualification: 'B.Mus (Carnatic Vocal), Madras University',
    qualificationTa: 'இசை இளங்கலை (B.Mus - கர்நாடக இசை), சென்னைப் பல்கலைக்கழகம்',
    priceStatus: 'Featured Tier: ₹99',
    demoFeeINR: 99,
    tiers: [
      { id: 'love_melody', name: 'Love melody', nameTa: 'அன்பு மெல்லிசை', durationMinutes: 15, priceDisplay: 99 },
      { id: 'peace_raga', name: 'Thaalattu & Raga Unwind', nameTa: 'தாலாட்டு மற்றும் ராக மெல்லிசை', durationMinutes: 25, priceDisplay: 149 }
    ],
    nextAvailable: 'Today, 6:30 PM',
    nextAvailableTa: 'இன்று மாலை 6:30',
    avatarColor: '#D86C9B',
    verified: true,
    bioEn: 'Trained vocalist offering private telephone melody sessions—gentle Tamil lullabies, soothing ragas, and dedicated love melodies (15 mins ₹99) to help members unwind from insomnia, grief, or loneliness.',
    bioTa: 'தனிமை மற்றும் மனச்சோர்விலிருந்து விடுபட, எண் மறைக்கப்பட்ட பாதுகாப்பான தொலைபேசி அழைப்பு வழியாகத் தாலாட்டு மற்றும் அன்பு மெல்லிசைப் பாடல்களைப் பாடும் இசைக் கலைஞர்.'
  },
  {
    id: 'singer_2',
    name: 'Charulatha Krishnan',
    nameTa: 'சாருலதா கிருஷ்ணன்',
    role: 'singer',
    roleLabelEn: 'Verified Live Singer · HerSpace Live Melodies',
    roleLabelTa: 'சரிபார்க்கப்பட்ட நேரலைப் பாடகர்',
    stylesEn: ['Acoustic Folk Melodies', 'Soft Light Music', 'Guided Hum & Relaxation'],
    stylesTa: ['நாட்டுப்புற மெல்லிசை', 'மென்மையான பாடல்கள்', 'இசை ஓய்வு'],
    languages: ['Tamil', 'English'],
    experienceYears: 6,
    rating: 4.8,
    sessionsCompleted: 98,
    qualification: 'Diploma in Vocal Music & Sound Relaxation',
    qualificationTa: 'குரலிசை மற்றும் இசை ஓய்வு சான்றிதழ்',
    priceStatus: 'Featured Tier: ₹99',
    demoFeeINR: 99,
    tiers: [
      { id: 'love_melody', name: 'Love melody', nameTa: 'அன்பு மெல்லிசை', durationMinutes: 15, priceDisplay: 99 },
      { id: 'soft_folk', name: 'Acoustic Folk Melodies', nameTa: 'நாட்டுப்புற மெல்லிசை', durationMinutes: 20, priceDisplay: 129 }
    ],
    nextAvailable: 'Tomorrow, 5:00 PM',
    nextAvailableTa: 'நாளை மாலை 5:00',
    avatarColor: '#7C5CBF',
    verified: true,
    bioEn: 'Specializes in warm acoustic folk and soothing Tamil & English melodies over scheduled masked telephone sessions. Includes 15-minute Love Melodies (₹99). Strictly musical comfort—not clinical therapy.',
    bioTa: 'திட்டமிடப்பட்ட தொலைபேசி அழைப்பின் மூலம் மனதிற்கு இதமான தமிழ் மற்றும் ஆங்கில மெல்லிசைப் பாடல்களைப் பாடுபவர்.'
  },
  {
    id: 'singer_3',
    name: 'Nithyashree V.',
    nameTa: 'நித்யஸ்ரீ வி.',
    role: 'singer',
    roleLabelEn: 'Verified Live Singer · HerSpace Live Melodies',
    roleLabelTa: 'சரிபார்க்கப்பட்ட நேரலைப் பாடகர்',
    stylesEn: ['Veena & Vocal Harmony', 'Evening Ragas (Neelambari / Kalyani)'],
    stylesTa: ['வீணை மற்றும் குரலிசை', 'மாலை நேர ராகங்கள் (நீலாம்பரி / கல்யாணி)'],
    languages: ['Tamil'],
    experienceYears: 11,
    rating: 5.0,
    sessionsCompleted: 210,
    qualification: 'Kalaimamani Youth Awardee · Veena & Vocal Artist',
    qualificationTa: 'வீணை மற்றும் குரலிசைக் கலைஞர்',
    priceStatus: 'Featured Tier: ₹99',
    demoFeeINR: 99,
    tiers: [
      { id: 'love_melody', name: 'Love melody', nameTa: 'அன்பு மெல்லிசை', durationMinutes: 15, priceDisplay: 99 },
      { id: 'veena_raga', name: 'Evening Veena Harmony', nameTa: 'மாலை நேர வீணை மெல்லிசை', durationMinutes: 25, priceDisplay: 149 }
    ],
    nextAvailable: 'Today, 8:00 PM',
    nextAvailableTa: 'இன்று இரவு 8:00',
    avatarColor: '#4EA898',
    verified: true,
    bioEn: 'Performs live calming veena and vocal melodies over HerSpace masked telephone bridge to bring peaceful closure to stressful days. Includes Love melody option at 15 mins ₹99.',
    bioTa: 'பரபரப்பான நாளின் முடிவில் மன அமைதி தரும் வீணை மற்றும் குரலிசைப் பாடல்களை நேரலையாக வழங்குபவர்.'
  }
];

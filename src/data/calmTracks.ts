import { CalmTrack } from '../types';

export const CALM_TRACKS: CalmTrack[] = [
  {
    id: 'calm_01_tamil_breath',
    category: 'meditation',
    language: 'Tamil',
    durationSeconds: 480,
    durationLabel: '8:00',
    baseFreq: 432,
    soundProfile: 'warm_pad',
    licence: 'HerSpace Original Studio Master (Royalty-Free)',
    artwork: '/assets/images/02_HerSpace_Calm_Cup.png',
    title: {
      en: 'Amaithi Moochu — Gentle Tamil Breathing Reset',
      ta: 'அமைதி மூச்சு — வழிகாட்டப்பட்ட தமிழ் தியானம்'
    },
    artist: {
      en: 'HerSpace Mindfulness Studio (Tamil)',
      ta: 'HerSpace தியானக் குழு (தமிழ்)'
    },
    description: {
      en: 'A soothing 8-minute Tamil guided breathing meditation to release chest tightness and anxious thoughts.',
      ta: 'மனப் பதற்றம் மற்றும் சோர்வை நீக்கும் 8 நிமிட வழிகாட்டப்பட்ட தமிழ் மூச்சுப் பயிற்சி தியானம்.'
    }
  },
  {
    id: 'calm_02_en_grounding',
    category: 'meditation',
    language: 'English',
    durationSeconds: 600,
    durationLabel: '10:00',
    baseFreq: 528,
    soundProfile: 'singing_bowl',
    licence: 'HerSpace Original Studio Master (Royalty-Free)',
    artwork: '/assets/images/02_HerSpace_Calm_Cup.png',
    title: {
      en: 'Safe Harbour — Evening Emotional Grounding',
      ta: 'பாதுகாப்பான மனம் — மாலை நேர உணர்வு சமநிலை (English)'
    },
    artist: {
      en: 'HerSpace Mindfulness Studio (English)',
      ta: 'HerSpace தியானக் குழு (ஆங்கிலம்)'
    },
    description: {
      en: 'Gentle body-scan meditation in English designed for women unwinding after a demanding workday.',
      ta: 'பணி முடிந்து திரும்பிய பின் மனதையும் உடலையும் ஆசுவாசப்படுத்தும் 10 நிமிட தியானம்.'
    }
  },
  {
    id: 'calm_03_veena_dawn',
    category: 'instrumental',
    language: 'Instrumental',
    durationSeconds: 720,
    durationLabel: '12:00',
    baseFreq: 396,
    soundProfile: 'harmonic_veena',
    licence: 'Licensed Carnatic Ambient Instrumental',
    artwork: '/assets/images/02_HerSpace_Calm_Cup.png',
    title: {
      en: 'Thanjavur Veena & Bansuri Serenity (Raga Neelambari)',
      ta: 'தஞ்சாவூர் வீணை & புல்லாங்குழல் மெல்லிசை (நீலாம்பரி ராகம்)'
    },
    artist: {
      en: 'Acoustic Ensemble · Instrumental',
      ta: 'பாரம்பரிய இசைக்கருவிகள்'
    },
    description: {
      en: 'Slow, comforting Neelambari raga chords traditionally played for emotional peace and restful sleep.',
      ta: 'மன அமைதியும் ஆழ்ந்த உறக்கமும் தரும் பாரம்பரிய நீலாம்பரி ராக வீணை இசை.'
    }
  },
  {
    id: 'calm_04_nilgiri_rain',
    category: 'nature',
    language: 'Ambient',
    durationSeconds: 900,
    durationLabel: '15:00',
    baseFreq: 285,
    soundProfile: 'rain_breeze',
    licence: 'HerSpace Field Recording (Public Domain / Original)',
    artwork: '/assets/images/03_HerSpace_Reflection_Outdoor.png',
    title: {
      en: 'Nilgiris Monsoon Rain & Eucalyptus Breeze',
      ta: 'நீலகிரி மழைச் சாரல் & இயற்கை ஒலி'
    },
    artist: {
      en: 'Nature Soundscape · Tamil Nadu Hills',
      ta: 'இயற்கை ஒலிப்பதிவு'
    },
    description: {
      en: 'Pure, continuous acoustic rainfall over misty hill leaves to mask background noise and calm the nervous system.',
      ta: 'மலைப்பகுதியின் மெல்லிய மழைத்துளிகள் மற்றும் தென்றல் காற்றின் இயற்கையான ஒலி.'
    }
  },
  {
    id: 'calm_05_deep_sleep_lullaby',
    category: 'sleep',
    language: 'Tamil / Instrumental',
    durationSeconds: 1200,
    durationLabel: '20:00',
    baseFreq: 432,
    soundProfile: 'sleep_drone',
    licence: 'HerSpace Original Studio Master (Royalty-Free)',
    artwork: '/assets/images/02_HerSpace_Calm_Cup.png',
    title: {
      en: 'Thaalattu — Deep Sleep Preparation & Night Comfort',
      ta: 'தாலாட்டு — ஆழ்ந்த உறக்கத்திற்கான இரவு இசை'
    },
    artist: {
      en: 'HerSpace Sleep Sanctuary',
      ta: 'HerSpace உறக்க இசை'
    },
    description: {
      en: 'Ultra-low tempo humming and warm delta-wave chords that gently fade out with your sleep timer.',
      ta: 'இரவு நேரக் கவலைகளை மறந்து நிம்மதியாக உறங்க உதவும் மென்மையான தாலாட்டு இசை.'
    }
  }
];

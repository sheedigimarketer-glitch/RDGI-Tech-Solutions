import { WellbeingCategory, WellbeingArticle } from '../types';

export const WELLBEING_CATEGORIES: WellbeingCategory[] = [
  {
    id: 'cat_periods',
    code: 'A',
    icon: 'calendar',
    color: '#D86C9B',
    en: 'A. Periods & Menstrual Health',
    ta: 'A. மாதவிடாய் மற்றும் சுழற்சி நலம்',
    descEn: 'Regular vs irregular cycles, PMS, cramps, heavy bleeding, PCOS awareness, and perimenopause/menopause.',
    descTa: 'சீரான மற்றும் சீரற்ற மாதவிடாய், வயிற்று வலி, அதிக உதிரப்போக்கு, PCOS விழிப்புணர்வு மற்றும் மெனோபாஸ்.'
  },
  {
    id: 'cat_hygiene',
    code: 'B',
    icon: 'shield',
    color: '#7C5CBF',
    en: 'B. Intimate Hygiene & Genital Care',
    ta: 'B. அந்தரங்க சுகாதாரம் மற்றும் பராமரிப்பு',
    descEn: 'External vulvar care, why internal douching is harmful, pad/cup hygiene, UTI prevention, and discharge awareness.',
    descTa: 'வெளிப்புற சுகாதாரம், சானிட்டரி பேட் / கப் பராமரிப்பு, சிறுநீர் பாதை தொற்று தடுப்பு மற்றும் வெள்ளைப்படுதல் விழிப்புணர்வு.'
  },
  {
    id: 'cat_body_changes',
    code: 'C',
    icon: 'sun',
    color: '#E07A5F',
    en: 'C. Life Stages & Body Changes (18+ Context)',
    ta: 'C. உடல் மாற்றங்கள் மற்றும் வளர்ச்சி நிலைகள்',
    descEn: 'Understanding hormonal shifts across early adulthood, post-pregnancy recovery, and body literacy.',
    descTa: 'இளமைக்கால ஹார்மோன் மாற்றங்கள், மகப்பேறுக்குப் பிந்தைய உடல் நலம் மற்றும் உடல் விழிப்புணர்வு.'
  },
  {
    id: 'cat_emotional',
    code: 'D',
    icon: 'heart',
    color: '#5B8BD9',
    en: 'D. Emotional Health & Mental Wellbeing',
    ta: 'D. மன நலம் மற்றும் உணர்வு சமநிலை',
    descEn: 'Stress, anxiety, loneliness, burnout, grief, self-worth, sleep hygiene, and when to speak to a listener or counsellor.',
    descTa: 'மன அழுத்தம், தனிமை, சோர்வு, சுயமதிப்பு, நல்ல உறக்கம் மற்றும் ஆலோசகரை அணுகும் முறை.'
  },
  {
    id: 'cat_relationships',
    code: 'E',
    icon: 'users',
    color: '#C85A8E',
    en: 'E. Love, Relationships & Happiness',
    ta: 'E. அன்பு, உறவுகள் மற்றும் மகிழ்ச்சி',
    descEn: 'Healthy communication, emotional boundaries, family stress, heartbreak recovery, and recognizing emotional abuse.',
    descTa: 'ஆரோக்கியமான உரையாடல், உணர்வு எல்லைகள், குடும்ப அழுத்தம், மனக்காயத்திலிருந்து மீளுதல் மற்றும் சுய மரியாதை.'
  },
  {
    id: 'cat_reproductive',
    code: 'F',
    icon: 'info',
    color: '#6C63FF',
    en: 'F. Sexual & Reproductive Health Education',
    ta: 'F. பாலியல் மற்றும் இனப்பெருக்க நலக்கல்வி',
    descEn: 'Consent, bodily autonomy, fertility basics, contraception education, STI prevention, and preparing for doctor visits.',
    descTa: 'தன்னார்வ ஒப்புதல், உடல் உரிமை, கருவுறுதல் அடிப்படை, தொற்று தடுப்பு மற்றும் மருத்துவரிடம் தயக்கமின்றிப் பேசுதல்.'
  },
  {
    id: 'cat_skincare',
    code: 'G',
    icon: 'feather',
    color: '#4EA898',
    en: 'G. Skin, Hair & Beauty Care',
    ta: 'G. சருமம், கூந்தல் மற்றும் இயற்கை பராமரிப்பு',
    descEn: 'Simple science-backed skincare, sun protection, hormonal acne, hair-fall causes, and avoiding unsafe bleaching products.',
    descTa: 'எளிய சரும பராமரிப்பு, வெயில் பாதுகாப்பு, ஹார்மோன் முகப்பரு, முடி உதிர்தல் காரணங்கள் மற்றும் பாதுகாப்பான பராமரிப்பு.'
  },
  {
    id: 'cat_nutrition',
    code: 'H',
    icon: 'coffee',
    color: '#D9822B',
    en: 'H. Food, Nutrition & Daily Energy',
    ta: 'H. உணவு, ஊட்டச்சத்து மற்றும் உடல் ஆற்றல்',
    descEn: 'Affordable iron-rich Indian foods, calcium, protein, hydration, menstrual nutrition, and avoiding extreme crash diets.',
    descTa: 'இரும்புச்சத்து நிறைந்த எளிய இந்திய உணவுகள், கால்சியம், புரதம், நீர்ச்சத்து மற்றும் மாதவிடாய் கால உணவுமுறை.'
  },
  {
    id: 'cat_fitness',
    code: 'I',
    icon: 'activity',
    color: '#3B9B78',
    en: 'I. Yoga, Exercise & Physical Fitness',
    ta: 'I. யோகா, உடற்பயிற்சி மற்றும் உடல் தகுதி',
    descEn: 'Beginner movement, walking, gentle yoga, breathing exercises, pelvic floor awareness, and safe exercise during periods.',
    descTa: 'தொடக்கநிலை உடற்பயிற்சிகள், நடைப்பயிற்சி, எளிய யோகா, மூச்சுப் பயிற்சி மற்றும் மாதவிடாய் கால பாதுகாப்பான அசைவுகள்.'
  },
  {
    id: 'cat_career',
    code: 'J',
    icon: 'briefcase',
    color: '#5C6BC0',
    en: 'J. Career, Profession & Life Balance',
    ta: 'J. தொழில், பணி மற்றும் வாழ்க்கைச் சமநிலை',
    descEn: 'Career confidence, returning after a break, workplace boundaries, financial independence basics, and managing imposter syndrome.',
    descTa: 'தொழில் தன்னம்பிக்கை, இடைவெளிக்குப் பின் பணிக்குத் திரும்புதல், பணியிட எல்லைகள் மற்றும் நிதித் தன்னிறைவு.'
  },
  {
    id: 'cat_transgender',
    code: 'K',
    icon: 'award',
    color: '#9C4DCC',
    en: 'K. Transgender Women’s Wellbeing',
    ta: 'K. திருநங்கைகள் நலம் மற்றும் ஆதரவு',
    descEn: 'Respectful, affirming emotional support, navigating healthcare safely, stress resilience, and inclusive community care.',
    descTa: 'மரியாதையான மனநல ஆதரவு, பாதுகாப்பான மருத்துவ வழிகாட்டல், சமூக அழுத்தங்களைக் கையாளுதல் மற்றும் தன்னம்பிக்கை.'
  }
];

export const WELLBEING_ARTICLES: WellbeingArticle[] = [
  {
    id: 'wb_01_late_period',
    categoryId: 'cat_periods',
    categoryCode: 'A',
    synonyms: ['late period', 'missed period', 'irregular cycle', 'pregnancy', 'stress', 'pcos', 'மாதவிடாய் தாமதம்'],
    lastReviewedDate: '2026-10-15',
    editorialStage: 'Published',
    reviewBadgeEn: 'Approved Educational Content · Public Health Guidelines',
    reviewBadgeTa: 'அங்கீகரிக்கப்பட்ட கல்வித் தகவல் · பொது நல வழிகாட்டுதல்',
    sources: ['World Health Organization (WHO) Reproductive Health', 'FOGSI Menstrual Health Guidelines', 'NHM India Women Wellness'],
    relatedIds: ['wb_02_period_pain', 'wb_12_iron_foods'],
    title: {
      en: 'Why is my period late?',
      ta: 'என் மாதவிடாய் ஏன் தாமதமாகிறது?'
    },
    shortAnswer: {
      en: 'A period can be delayed due to emotional stress, sleep changes, nutritional deficiencies, thyroid shifts, PCOS, travel, perimenopause, or pregnancy. A variation of a few days is common.',
      ta: 'மன அழுத்தம், தூக்கமின்மை, ஊட்டச்சத்து குறைபாடு, தைராய்டு மாற்றங்கள், PCOS, பயணம் அல்லது கர்ப்பம் போன்ற பல காரணங்களால் மாதவிடாய் தாமதமாகலாம். ஓரிரு நாட்கள் முன்னும் பின்னும் வருவது இயல்பானது.'
    },
    explanation: {
      en: 'A typical menstrual cycle ranges from 21 to 35 days, counted from the first day of one period to the first day of the next. Hormones produced by the brain and ovaries regulate ovulation. High stress, sudden weight changes, or conditions such as Polycystic Ovary Syndrome (PCOS) can temporarily delay ovulation.',
      ta: 'சராசரி மாதவிடாய் சுழற்சி 21 முதல் 35 நாட்கள் வரை இருக்கலாம். மூளை மற்றும் சினைப்பைகளுக்கு இடையிலான ஹார்மோன் சமநிலையால் இது கட்டுப்படுத்தப்படுகிறது. அதிக மன அழுத்தம், திடீர் எடை மாற்றம், இரவு கண்விழித்தல், PCOS அல்லது தைராய்டு சுரப்பி மாற்றங்கள் சினைமுட்டை வெளியாவதைத் தாமதப்படுத்தலாம்.'
    },
    selfCare: {
      en: [
        'Track your start dates privately in My Cycle to observe your personal pattern over 3 months.',
        'Prioritize 7–8 hours of restful sleep and balanced meals rich in iron and protein.',
        'If pregnancy is possible and your period is more than 7 days late, take a home urine pregnancy test.',
        'Avoid unprescribed "period-inducing" pills or harsh concoctions without medical advice.'
      ],
      ta: [
        'உங்கள் தனிப்பட்ட சுழற்சி முறையை அறிய My Cycle நாட்காட்டியில் தேதிகளைக் குறித்து வைக்கவும்.',
        'தினமும் 7–8 மணிநேர உறக்கம் மற்றும் சத்தான உணவை உறுதி செய்யவும்.',
        'கர்ப்பத்திற்கான வாய்ப்பு இருந்தால், மாதவிடாய் 7 நாட்களுக்கு மேல் தள்ளிப்போனால் வீட்டு பரிசோதனை செய்து கொள்ளலாம்.',
        'மருத்துவர் ஆலோசனையின்றி மாதவிடாய் வரவழைக்கும் மாத்திரைகளைத் தவிர்க்கவும்.'
      ]
    },
    redFlags: {
      en: [
        'Missed periods for 3 consecutive months (when not pregnant or breastfeeding).',
        'Severe lower abdominal or one-sided pelvic pain with dizziness or fainting.',
        'Sudden heavy bleeding soaking through a pad every hour for 2+ hours.'
      ],
      ta: [
        'தொடர்ந்து 3 மாதங்களுக்கு மேல் மாதவிடாய் வராமல் இருத்தல்.',
        'தாங்க முடியாத அடிவயிற்று வலி அல்லது மயக்கம்.',
        'மணிக்கு ஒரு சானிட்டரி பேட் நனையும் அளவுக்கு மிக அதிக உதிரப்போக்கு.'
      ]
    },
    whenToSeekCare: {
      en: 'Consult a qualified gynaecologist if your cycle regularly falls outside 21–35 days or if you miss 3 periods in a row. If emotional stress is impacting your cycle, reach out to a HerSpace listener or counsellor.',
      ta: 'உங்கள் சுழற்சி தொடர்ந்து 21–35 நாட்களுக்கு வெளியே இருந்தாலோ அல்லது 3 மாதங்கள் மாதவிடாய் வராமல் இருந்தாலோ மகப்பேறு மருத்துவரை அணுகவும். மன அழுத்தம் காரணமாக இருந்தால் HerSpace ஆலோசகரிடம் பேசலாம்.'
    }
  },
  {
    id: 'wb_02_period_pain',
    categoryId: 'cat_periods',
    categoryCode: 'A',
    synonyms: ['period pain', 'cramps', 'dysmenorrhea', 'stomach pain', 'வயிற்று வலி'],
    lastReviewedDate: '2026-10-15',
    editorialStage: 'Published',
    reviewBadgeEn: 'Approved Educational Content · Public Health Guidelines',
    reviewBadgeTa: 'அங்கீகரிக்கப்பட்ட கல்வித் தகவல் · பொது நல வழிகாட்டுதல்',
    sources: ['FOGSI Patient Guidance', 'WHO Menstrual Health Brief'],
    relatedIds: ['wb_01_late_period', 'wb_13_gentle_exercise'],
    title: {
      en: 'Is mild period pain normal?',
      ta: 'மாதவிடாயின் போது ஏற்படும் மிதமான வயிற்று வலி இயல்பானதா?'
    },
    shortAnswer: {
      en: 'Mild to moderate cramping during the first 1–2 days of a period is common due to uterine contractions triggered by prostaglandins. However, severe pain that stops you from daily life is not something you must silently endure.',
      ta: 'மாதவிடாயின் முதல் 1–2 நாட்களில் மிதமான அடிவயிற்று வலி ஏற்படுவது இயல்பானது. ஆனால், அன்றாடப் பணிகளைச் செய்ய முடியாத அளவுக்கு ஏற்படும் தீவிர வலியைத் தாங்கிக்கொள்ள வேண்டியதில்லை; மருத்துவ ஆலோசனை பெற வேண்டும்.'
    },
    explanation: {
      en: 'During menstruation, the uterus gently contracts to shed its lining, guided by natural hormone-like compounds called prostaglandins. Mild aching in the lower belly or back for 24–48 hours is typical. Severe pain can indicate treatable medical conditions like endometriosis or fibroids.',
      ta: 'மாதவிடாயின் போது கருப்பைச் சுவர் வெளியேற புரோஸ்டாக்ளாண்டின் (Prostaglandins) எனும் வேதிப்பொருள் சுரக்கிறது. இதனால் முதல் இரண்டு நாட்களுக்கு லேசான அடிவயிறு அல்லது முதுகு வலி ஏற்படலாம். ஆனால் தாங்க முடியாத வலி இருந்தால் எண்டோமெட்ரியோசிஸ் போன்ற காரணங்களைக் கண்டறிய மருத்துவப் பரிசோதனை அவசியம்.'
    },
    selfCare: {
      en: [
        'Apply a warm water bag or heating pad to your lower abdomen for 15–20 minutes.',
        'Sip warm ginger tea, jeera (cumin) water, or warm soups to ease abdominal spasms.',
        'Engage in gentle slow walks or the child’s pose (Balasana) yoga stretch.'
      ],
      ta: [
        'வெந்நீர் ஒத்தடம் அல்லது வெதுவெதுப்பான தண்ணீர் பையை அடிவயிற்றில் 15–20 நிமிடங்கள் வைக்கலாம்.',
        'சுக்கு மல்லி காபி, சீரகத் தண்ணீர் அல்லது வெதுவெதுப்பான சூப் அருந்தலாம்.',
        'எளிய நடைப்பயிற்சி மற்றும் பாலாசனா (குழந்தை நிலை) போன்ற யோகாசனங்கள் செய்யலாம்.'
      ]
    },
    redFlags: {
      en: [
        'Pain so severe that over-the-counter medication provides zero relief.',
        'Pain during urination, bowel movements, or sexual intercourse.',
        'Fever, nausea, or vomiting accompanying menstrual pain.'
      ],
      ta: [
        'வலி நிவாரணி மாத்திரைகள் எடுத்தும் வலி சற்றும் குறையாமல் இருத்தல்.',
        'சிறுநீர் அல்லது மலம் கழிக்கும் போது தீவிர வலி ஏற்படுதல்.',
        'வயிற்று வலியுடன் கூடிய காய்ச்சல் அல்லது வாந்தி.'
      ]
    },
    whenToSeekCare: {
      en: 'Consult a gynaecologist if menstrual pain forces you to miss work, study, or social life every single cycle.',
      ta: 'மாதவிடாய் வலி உங்கள் தினசரி வேலைகளைத் தொடர்ந்து முடக்குகிறது என்றால் உடனடியாக மகப்பேறு மருத்துவரை அணுகவும்.'
    }
  },
  {
    id: 'wb_04_intimate_wash',
    categoryId: 'cat_hygiene',
    categoryCode: 'B',
    synonyms: ['intimate wash', 'douching', 'vaginal wash', 'soap', 'vulva care', 'அந்தரங்க சுகாதாரம்'],
    lastReviewedDate: '2026-10-18',
    editorialStage: 'Published',
    reviewBadgeEn: 'Approved Educational Content · Clinical Hygiene Consensus',
    reviewBadgeTa: 'அங்கீகரிக்கப்பட்ட கல்வித் தகவல் · மருத்துவச் சுகாதாரம்',
    sources: ['ACOG Clinical Guidelines', 'FOGSI Patient Hygiene Primer', 'NHS Sexual Health Guidance'],
    relatedIds: ['wb_05_discharge'],
    title: {
      en: 'Do I need commercial intimate hygiene washes?',
      ta: 'அந்தரங்கப் பகுதிக்கு வாசனையுள்ள சோப்புகள் அல்லது வாஷ் அவசியமா?'
    },
    shortAnswer: {
      en: 'No. The vagina is self-cleaning and maintains a delicate acidic microflora. Commercial scented washes, sprays, and internal douching can disrupt this healthy balance and increase the risk of infections.',
      ta: 'அவசியமில்லை. யோனிப் பகுதி இயற்கையாகவே தன்னைத் தூய்மைப்படுத்திக் கொள்ளும் தன்மை கொண்டது. நறுமண வாஷ்கள் அல்லது உட்புறத்தைக் கழுவுதல் (Douching) நல்ல பாக்டீரியாக்களை அழித்து தொற்றுகளை ஏற்படுத்தலாம்.'
    },
    explanation: {
      en: 'The inner vagina maintains a protective acidic pH (3.8–4.5) populated by beneficial Lactobacillus bacteria. Scented cleansers and antiseptic solutions wash away these protective bacteria, leaving you vulnerable to bacterial vaginosis (BV) and yeast infections.',
      ta: 'யோனிப் பகுதியின் இயற்கையான அமிலத் தன்மை (pH 3.8 - 4.5) லாக்டோபாகிலஸ் எனும் நன்மை பயக்கும் பாக்டீரியாக்களால் பராமரிக்கப்படுகிறது. ரசாயன வாஷ்கள் மற்றும் கடுமையான சோப்புகள் இந்த அமிலத்தன்மையை மாற்றி அரிப்பு மற்றும் தொற்றுகளை உருவாக்குகின்றன.'
    },
    selfCare: {
      en: [
        'Wash only the outer vulva with plain warm water. Pat dry gently with a clean cotton towel.',
        'Always wipe from front to back after using the toilet to avoid transferring bacteria from the anus to the urethra.',
        'Wear breathable, loose 100% cotton underwear and avoid sitting in damp gym clothing or wet swimwear.'
      ],
      ta: [
        'வெளிப்புறப் பகுதியை மட்டும் வெதுவெதுப்பான சுத்தமான நீரால் கழுவி, மென்மையான பருத்தித் துணியால் துடைக்கவும்.',
        'கழிப்பறைக்குச் சென்ற பின் எப்போதும் முன்னிருந்து பின்னோக்கி (Front to Back) துடைக்க வேண்டும்.',
        'தூய பருத்தி (Cotton) உள்ளாடைகளை அணியுங்கள்; ஈரமான ஆடைகளை உடனடியாக மாற்றவும்.'
      ]
    },
    redFlags: {
      en: [
        'Persistent burning, intense itching, or redness around the vulva.',
        'Strong fishy or foul odour that does not go away with normal hygiene.',
        'Curd-like thick white discharge or greenish-yellow discharge with irritation.'
      ],
      ta: [
        'தொடர்ச்சியான எரிச்சல், கடுமையான அரிப்பு அல்லது சிவந்து போதல்.',
        'அழுகிய மீன் வாசனை போன்ற துர்நாற்றம் வீசுதல்.',
        'தயிர் போன்ற அடர்த்தியான வெள்ளைப்படுதல் அல்லது மஞ்சள்-பச்சை நிற திரவம் வெளியேறுதல்.'
      ]
    },
    whenToSeekCare: {
      en: 'See a gynaecologist or women’s health doctor promptly if you have burning or unusual discharge. Do not self-treat with home remedies or steroid creams.',
      ta: 'அரிப்பு, எரிச்சல் அல்லது துர்நாற்றத்துடன் வெள்ளைப்பட்டால் சுயமாக மருந்துகளை எடுக்காமல் உடனடியாக மருத்துவரை அணுகவும்.'
    }
  },
  {
    id: 'wb_06_stress_venting',
    categoryId: 'cat_emotional',
    categoryCode: 'D',
    synonyms: ['venting', 'stress', 'listening', 'anxiety', 'loneliness', 'மன அழுத்தம்', 'ஆறுதல்'],
    lastReviewedDate: '2026-10-20',
    editorialStage: 'Published',
    reviewBadgeEn: 'Approved Educational Content · Psychological Wellbeing',
    reviewBadgeTa: 'அங்கீகரிக்கப்பட்ட கல்வித் தகவல் · உளவியல் நலம்',
    sources: ['American Psychological Association (APA)', 'NIMHANS Community Mental Health Guidelines'],
    relatedIds: ['wb_07_boundaries', 'wb_14_imposter_syndrome'],
    title: {
      en: 'Why does venting to an empathetic listener help you heal?',
      ta: 'மனதில் உள்ளதை ஒருவரிடம் பகிர்வது மன அமைதிக்கு எவ்வாறு உதவுகிறது?'
    },
    shortAnswer: {
      en: 'Putting feelings into words calms the brain’s amygdala (fear centre) and activates the prefrontal cortex, bringing immediate emotional relief and clarity without unnecessary judgment.',
      ta: 'மனதில் தேங்கியிருக்கும் கவலைகளைப் பேசும்போது மூளையின் உணர்ச்சிப் பகுதி (Amygdala) அமைதியடைகிறது. தீர்ப்புகளற்ற கவனிப்பு மனப்பாரத்தைக் குறைத்து தெளிவான முடிவுகளை எடுக்க உதவுகிறது.'
    },
    explanation: {
      en: 'Neuroscience calls this "affect labelling" — expressing an emotion in spoken words decreases the intensity of stress responses. When family or friends jump in with unasked advice, criticism, or dismissive optimism ("just stay positive"), we tend to shut down. A Trained Human Listener provides unconditional presence, validating your reality without trying to fix you.',
      ta: 'உணர்ச்சிகளை வார்த்தைகளில் வெளிப்படுத்துவது உடலின் அழுத்த ஹார்மோனான கார்டிசோலைக் குறைக்கிறது. நண்பர்கள் அல்லது குடும்பத்தினர் சில சமயம் தவறான அறிவுரைகளையோ விமர்சனங்களையோ முன்வைக்கும்போது நாம் உள்வாங்கிக் கொள்கிறோம். ஒரு பயிற்சி பெற்ற கவனிப்பாளர் எவ்விதத் தீர்ப்புமின்றி உங்கள் நிலையைப் புரிந்து காதுகொடுத்துக் கேட்கும்போது ஆழ்ந்த அமைதி கிடைக்கிறது.'
    },
    selfCare: {
      en: [
        'Speak openly with a HerSpace Trained Human Listener (₹399 / 60 mins) or use your complimentary welcome voucher.',
        'Practice expressive writing: write freely in a private journal for 10 minutes, without editing or rereading.',
        'Listen to the Amaithi Moochu guided breathing meditation in our Calm Audio Sanctuary.'
      ],
      ta: [
        'HerSpace பயிற்சி பெற்ற கவனிப்பாளரிடம் (₹399) அல்லது உங்கள் இலவச 30 நிமிட அமர்வைப் பயன்படுத்திப் பேசுங்கள்.',
        'தினமும் 10 நிமிடங்கள் உங்கள் மன உணர்வுகளை ஒரு டைரியில் எவ்வித தயக்கமுமின்றி எழுதி வாருங்கள்.',
        'HerSpace Calm பகுதியில் உள்ள "அமைதி மூச்சு" தமிழ் தியானத்தைக் கேட்டு மனதை ஆசுவாசப்படுத்துங்கள்.'
      ]
    },
    redFlags: {
      en: [
        'Feeling hopeless, empty, or thinking that others would be better off without you.',
        'Inability to get out of bed, sleep, or eat for several weeks.',
        'Sudden panic attacks with chest pain, heart palpitations, or shortness of breath.'
      ],
      ta: [
        'வாழ்க்கையில் நம்பிக்கையின்மை, வெறுமை அல்லது வாழப் பிடிக்காத எண்ணங்கள் தோன்றுதல்.',
        'பல வாரங்களாகப் படுக்கையிலிருந்து எழ முடியாத சோர்வு, பசியின்மை அல்லது தூக்கமின்மை.',
        'நெஞ்சு வலி மற்றும் மூச்சுத் திணறலுடன் கூடிய தீவிர பதற்றத் தாக்குதல் (Panic Attack).'
      ]
    },
    whenToSeekCare: {
      en: 'If you experience symptoms of clinical depression or overwhelming anxiety, please book a session with a HerSpace Professional Counsellor (₹999) or reach out to 24/7 helplines like KIRAN (1800-599-0019) or Tele-MANAS (14416).',
      ta: 'தீவிர மன அழுத்தம் அல்லது பதற்றம் இருந்தால் உடனடியாக HerSpace தொழில்முறை உளவியல் ஆலோசகரை அணுகவும் அல்லது 24/7 உதவி எண்களான கிரண் (1800-599-0019) அல்லது டெலி-மானஸ் (14416)-ஐ அழைக்கவும்.'
    }
  },
  {
    id: 'wb_07_boundaries',
    categoryId: 'cat_relationships',
    categoryCode: 'E',
    synonyms: ['boundaries', 'people pleasing', 'saying no', 'family guilt', 'உறவு எல்லைகள்', 'சுய மரியாதை'],
    lastReviewedDate: '2026-10-22',
    editorialStage: 'Published',
    reviewBadgeEn: 'Approved Educational Content · Relationship Psychology',
    reviewBadgeTa: 'அங்கீகரிக்கப்பட்ட கல்வித் தகவல் · உறவு உளவியல்',
    sources: ['Gottman Relationship Institute', 'Indian Association of Clinical Psychologists'],
    relatedIds: ['wb_06_stress_venting'],
    title: {
      en: 'How to set healthy boundaries with family without feeling guilty?',
      ta: 'குடும்பத்தில் குற்ற உணர்ச்சியின்றி ஆரோக்கியமான எல்லைகளை அமைப்பது எப்படி?'
    },
    shortAnswer: {
      en: 'Setting boundaries is not selfish; it is self-preservation. You can say "no" with warmth and firmness, remembering that your mental wellbeing is essential to sustaining genuine care for others.',
      ta: 'எல்லைகளை அமைப்பது சுயநலமல்ல; அது உங்களைப் பாதுகாத்துக் கொள்ளும் உரிமை. மற்றவர்கள் மீது உண்மையான அன்பு செலுத்த உங்கள் மனநலம் முதலில் ஆரோக்கியமாக இருக்க வேண்டும்.'
    },
    explanation: {
      en: 'In Indian family culture, women are often conditioned to believe their worth depends on constant self-sacrifice. Saying no can trigger guilt, anxiety, or accusations of disrespect. Healthy boundaries simply define what is acceptable to you and what drains your spirit.',
      ta: 'நமது சமூகத்தில் பெண்கள் எப்போதும் தியாகம் செய்ய வேண்டும் என்ற எதிர்பார்ப்பு வளர்க்கப்படுகிறது. இதனால் மறுப்பு தெரிவிக்கும் போது குற்ற உணர்ச்சி ஏற்படுகிறது. ஆனால், ஆரோக்கியமான எல்லைகள் உங்கள் சுயமரியாதையையும் உறவின் நீண்டகால நிம்மதியையும் உறுதி செய்கின்றன.'
    },
    selfCare: {
      en: [
        'Use "I" statements rather than accusatory "You" statements (e.g., "I need some quiet time this evening to recharge").',
        'Pause before saying an automatic "Yes". Give yourself permission to say: "Let me check my schedule and get back to you."',
        'Recognize that you are responsible for your actions and kindness, but not for managing other adults’ emotional reactions.'
      ],
      ta: [
        'மற்றவர்களைக் குறை கூறாமல் உங்கள் தேவையைத் தெளிவாகக் கூறுங்கள் (உதாரணம்: "இன்று மாலை எனக்கு சிறிது ஓய்வு தேவைப்படுகிறது").',
        'உடனடியாக "சரி" என்று ஒப்புக்கொள்ளாமல், "நான் யோசித்துவிட்டுச் சொல்கிறேன்" என்று சிறிது நேரம் எடுத்துக் கொள்ளுங்கள்.',
        'மற்றவர்களின் அதிருப்திக்காக உங்கள் மன அமைதியை எப்போதும் இழக்க வேண்டியதில்லை என்பதை நினைவில் கொள்ளுங்கள்.'
      ]
    },
    redFlags: {
      en: [
        'Feeling constantly dread, walking on eggshells around family or partners.',
        'Physical, verbal, financial, or sexual coercion.',
        'Isolation from friends, work, or access to your own mobile and bank account.'
      ],
      ta: [
        'வீட்டில் எப்போதும் பயத்துடனும் பதற்றத்துடனும் இருத்தல்.',
        'உடல், வார்த்தை அல்லது நிதி ரீதியான வன்முறை மற்றும் அச்சுறுத்தல்கள்.',
        'நண்பர்களுடனான தொடர்பு அல்லது சொந்த வங்கிக் கணக்கு முடக்கப்படுதல்.'
      ]
    },
    whenToSeekCare: {
      en: 'If you are facing domestic abuse, emotional control, or relational burnout, connect with a HerSpace Counsellor for confidential safety planning or contact the National Women Helpline at 181.',
      ta: 'குடும்ப வன்முறை அல்லது மனரீதியான கொடுமைகளை எதிர்கொண்டால் HerSpace ஆலோசகரை அணுகவும் அல்லது தேசிய பெண்கள் உதவி எண் 181-ஐ அழைக்கவும்.'
    }
  },
  {
    id: 'wb_12_iron_foods',
    categoryId: 'cat_nutrition',
    categoryCode: 'H',
    synonyms: ['anemia', 'iron', 'fatigue', 'haemoglobin', 'ரத்த சோகை', 'இரும்புச்சத்து'],
    lastReviewedDate: '2026-10-24',
    editorialStage: 'Published',
    reviewBadgeEn: 'Approved Educational Content · Clinical Nutrition Standards',
    reviewBadgeTa: 'அங்கீகரிக்கப்பட்ட கல்வித் தகவல் · ஊட்டச்சத்து',
    sources: ['ICMR Dietary Guidelines for Indians', 'National Family Health Survey (NFHS-5) Anemia Reduction Protocols'],
    relatedIds: ['wb_01_late_period'],
    title: {
      en: 'Affordable, iron-rich Indian foods to fight fatigue and low haemoglobin',
      ta: 'உடல் சோர்வு மற்றும் ரத்த சோகையைப் போக்கும் எளிய, சத்தான இந்திய உணவுகள்'
    },
    shortAnswer: {
      en: 'Over 50% of Indian women experience mild to moderate anemia. Incorporating daily moringa (drumstick leaves), sundakkai, sesame seeds, lentils, and vitamin C dramatically improves iron absorption.',
      ta: 'இந்தியாவில் 50%-க்கும் அதிகமான பெண்களுக்கு ரத்த சோகை (குறைந்த ஹீமோகுளோபின்) காணப்படுகிறது. முருங்கைக்கீரை, சுண்டைக்காய், எள், சுண்டல் மற்றும் எலுமிச்சை போன்ற வைட்டமின் சி உணவுகள் இரும்புச்சத்தை அதிகரிக்கின்றன.'
    },
    explanation: {
      en: 'Plant-based iron (non-heme iron) requires vitamin C for optimal absorption in the gut. Drinking tea or coffee immediately before or after meals blocks iron absorption due to tannins and polyphenols.',
      ta: 'தாவர உணவுகளில் உள்ள இரும்புச்சத்து உடலில் சரியாக சேர வைட்டமின் சி அவசியம். உணவு உண்ட உடனேயே டீ அல்லது காபி குடிப்பது இரும்புச்சத்து உறிஞ்சப்படுவதைத் தடுக்கிறது.'
    },
    selfCare: {
      en: [
        'Include drumstick leaves (moringa soup, poriyal) or spinach 2–3 times a week.',
        'Snack on a small jaggery-sesame laddu (ellu urundai) or roasted chickpeas (pottu kadalai).',
        'Squeeze fresh lemon juice over cooked lentils and vegetables just before eating.',
        'Avoid drinking tea or coffee within 45 minutes before or after your main meals.'
      ],
      ta: [
        'வாரத்திற்கு 2–3 முறை முருங்கைக் கீரை சூப் அல்லது பொரியல் செய்து சாப்பிடுங்கள்.',
        'மாலை வேளையில் எள்ளு உருண்டை அல்லது பொட்டுக்கடலை வெல்லம் சாப்பிடுங்கள்.',
        'பருப்பு சாதம் அல்லது காய்கறிகளில் சிறிதளவு எலுமிச்சை சாறு சேர்த்துச் சாப்பிடுவது இரும்புச்சத்தை எளிதில் சேர்க்கும்.',
        'உணவு உண்பதற்கு 45 நிமிடங்களுக்கு முன்பும் பின்பும் டீ, காபி குடிப்பதைத் தவிர்க்கவும்.'
      ]
    },
    redFlags: {
      en: [
        'Extreme breathlessness while climbing stairs, severe pallor, or fainting spells.',
        'Craving strange non-food items like chalk, raw rice, or clay (Pica).',
        'Resting heart palpitations or extreme dizziness.'
      ],
      ta: [
        'படியேறும் போது தீவிர மூச்சுத்திணறல், தலைசுற்றல் அல்லது மயக்கம்.',
        'சுண்ணாம்பு, அரிசி அல்லது மண் சாப்பிடத் தோன்றும் விசித்திரமான ஆசை (Pica).',
        'அமர்ந்திருக்கும் போதே இதயம் வேகமாகத் துடித்தல்.'
      ]
    },
    whenToSeekCare: {
      en: 'Check your Complete Blood Count (CBC) and serum ferritin levels. If haemoglobin is below 10 g/dL, consult a physician for therapeutic iron supplements.',
      ta: 'ரத்தப் பரிசோதனை (CBC) செய்து ஹீமோகுளோபின் அளவை அறிந்து கொள்ளுங்கள். 10 g/dL-க்கு குறைவாக இருந்தால் மருத்துவரை அணுகி இரும்புச்சத்து மாத்திரைகளை முறையாக உட்கொள்ளவும்.'
    }
  },
  {
    id: 'wb_15_trans_support',
    categoryId: 'cat_transgender',
    categoryCode: 'K',
    synonyms: ['transgender', 'trans woman', 'gender identity', 'affirming care', 'திருநங்கை', 'சுயமரியாதை'],
    lastReviewedDate: '2026-10-25',
    editorialStage: 'Published',
    reviewBadgeEn: 'Approved Educational Content · Affirming Mental Health Care',
    reviewBadgeTa: 'அங்கீகரிக்கப்பட்ட கல்வித் தகவல் · திருநங்கைகள் மனநல ஆதரவு',
    sources: ['WPATH Standards of Care Version 8', 'National Mental Health Program (India) Transgender Inclusivity Directives'],
    relatedIds: ['wb_06_stress_venting', 'wb_07_boundaries'],
    title: {
      en: 'Safe, affirming emotional care for transgender women (18+)',
      ta: 'திருநங்கைகளுக்கான (18+) பாதுகாப்பான, மரியாதையான மனநல ஆதரவு'
    },
    shortAnswer: {
      en: 'HerSpace is explicitly inclusive of transgender women aged 18+. We guarantee zero-misgendering, trauma-informed care, and complete confidentiality on all telephone sessions and wellness features.',
      ta: 'HerSpace 18 வயதுக்கு மேற்பட்ட திருநங்கைகளுக்கான முழுமையான பாதுகாப்பான புகலிடமாகும். இங்கு உங்கள் சுயமரியாதை, ரகசியத்தன்மை மற்றும் உரிமைகள் முழுமையாகப் பாதுகாக்கப்படுகின்றன.'
    },
    explanation: {
      en: 'Transgender women face unique systemic stressors, including gender minority stress, family estrangement, and healthcare discrimination. Affirming psychological care recognizes your identity as whole and valid, without viewing gender transition as pathology.',
      ta: 'சமூகப் புறக்கணிப்பு, குடும்பப் பிரிவு மற்றும் மருத்துவக் களங்களில் எதிர்கொள்ளும் பாகுபாடுகள் திருநங்கைகளுக்கு பெரும் மன அழுத்தத்தை ஏற்படுத்துகின்றன. HerSpace-ல் உள்ள ஆலோசகர்கள் மற்றும் கவனிப்பாளர்கள் எவ்விதத் தீர்ப்புமின்றி உங்கள் அடையாளத்தை மதித்து கனிவான ஆதரவை வழங்குகின்றனர்.'
    },
    selfCare: {
      en: [
        'Speak to a HerSpace listener or counsellor who is trained in gender-affirmative and inclusive support.',
        'Connect with affirmative peer communities and cultivate safe social friendships.',
        'Prioritize daily emotional downtime: breathing exercises, soothing music, or reflective journaling.'
      ],
      ta: [
        'திருநங்கைகளுக்கான மனநல ஆதரவில் பயிற்சி பெற்ற HerSpace கவனிப்பாளர் அல்லது ஆலோசகரிடம் தயக்கமின்றிப் பேசுங்கள்.',
        'பாதுகாப்பான மற்றும் உங்கள் உணர்வுகளைப் புரிந்து கொள்ளும் நண்பர்களுடன் தொடர்பில் இருங்கள்.',
        'தினசரி தியானம், மன அமைதி இசை அல்லது மூச்சுப்பயிற்சி மூலம் மன அழுத்தத்தைக் குறைத்துக் கொள்ளுங்கள்.'
      ]
    },
    redFlags: {
      en: [
        'Acute suicidal ideation, hopelessness, or self-harm impulses.',
        'Severe gender dysphoria causing acute functional impairment.',
        'Immediate threat of physical violence or homelessness.'
      ],
      ta: [
        'தற்கொலை எண்ணங்கள், கடும் சோர்வு அல்லது சுய காய எண்ணங்கள்.',
        'அன்றாடப் பணிகளைச் செய்ய முடியாத அளவுக்கு மன உளைச்சல்.',
        'உடல் வன்முறை அல்லது இருப்பிடப் பாதுகாப்பின்மை அச்சுறுத்தல்.'
      ]
    },
    whenToSeekCare: {
      en: 'If you are in acute crisis, call Tele-MANAS (14416) or the National Transgender Helpline at 011-2436 8638. Our listeners and counsellors are also here to hold safe space.',
      ta: 'அவசர மன உளைச்சல் ஏற்பட்டால் 24/7 டெலி-மானஸ் (14416) அல்லது தேசிய திருநங்கைகள் உதவி எண் 011-2436 8638-ஐ அழைக்கவும்.'
    }
  }
];

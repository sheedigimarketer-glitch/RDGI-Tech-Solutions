/**
 * HerSpace Premium 4.0 — Women's Life & Wellbeing Knowledge Base (Categories A–K)
 * & Optional Menstrual Cycle Calculation Engine ("My Cycle")
 * Evidence-based health & emotional education in English and Tamil.
 * Strictly non-diagnostic, respectful, and backed by public WHO / ICMR / NHM India / FOGSI educational standards.
 */

window.HERSPACE_WELLBEING_CATEGORIES = [
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

window.HERSPACE_WELLBEING_ARTICLES = [
  {
    id: 'wb_01_late_period',
    categoryId: 'cat_periods',
    categoryCode: 'A',
    synonyms: ['late period', 'missed period', 'irregular cycle', 'pregnancy', 'stress', 'pcos', 'மாதவிடாய் தாமதம்', 'mathavidai', 'thalli poguthu'],
    lastReviewedDate: '2026-10-15',
    editorialStage: 'Published',
    reviewBadgeEn: 'Approved Educational Content · Public Health Guidelines',
    reviewBadgeTa: 'அங்கீகரிக்கப்பட்ட கல்வித் தகவல் · பொது நல வழிகாட்டுதல்',
    sources: ['World Health Organization (WHO) Reproductive Health', 'FOGSI Menstrual Health Education Guidelines', 'NHM India Women Wellness'],
    relatedIds: ['wb_02_period_pain', 'wb_03_menopause', 'wb_12_iron_foods'],
    title: {
      en: 'Why is my period late?',
      ta: 'என் மாதவிடாய் ஏன் தாமதமாகிறது?'
    },
    shortAnswer: {
      en: 'A period can be delayed due to emotional stress, sleep changes, nutritional deficiencies, thyroid shifts, PCOS, travel, perimenopause, or pregnancy. A variation of a few days is common.',
      ta: 'மன அழுத்தம், தூக்கமின்மை, ஊட்டச்சத்து குறைபாடு, தைராய்டு மாற்றங்கள், PCOS, பயணம் அல்லது கர்ப்பம் போன்ற பல காரணங்களால் மாதவிடாய் தாமதமாகலாம். ஓரிரு நாட்கள் முன்னும் பின்னும் வருவது இயல்பானது.'
    },
    explanation: {
      en: 'A typical menstrual cycle ranges from 21 to 35 days, counted from the first day of one period to the first day of the next. Hormones produced by the brain (hypothalamus and pituitary gland) and ovaries regulate ovulation. High emotional stress, sudden weight changes, intense workload, or conditions such as Polycystic Ovary Syndrome (PCOS) and thyroid imbalance can temporarily delay ovulation, making your period arrive later than expected.',
      ta: 'சராசரி மாதவிடாய் சுழற்சி 21 முதல் 35 நாட்கள் வரை இருக்கலாம். மூளை மற்றும் சினைப்பைகளுக்கு இடையிலான ஹார்மோன் சமநிலையால் இது கட்டுப்படுத்தப்படுகிறது. அதிக மன அழுத்தம், திடீர் எடை மாற்றம், இரவு கண்விழித்தல், PCOS அல்லது தைராய்டு சுரப்பி மாற்றங்கள் சினைமுட்டை வெளியாவதைத் தாமதப்படுத்தலாம்.'
    },
    selfCare: {
      en: [
        'Track your start dates privately in My Cycle to observe your personal pattern over 3 months.',
        'Prioritize 7–8 hours of restful sleep and balanced meals rich in iron and protein.',
        'If pregnancy is possible and your period is more than 7 days late, consider a home urine pregnancy test using morning urine.',
        'Avoid unprescribed "period-inducing" pills or harsh herbal concoctions without consulting a doctor.'
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
        'Sudden heavy bleeding soaking through a pad every hour for 2+ hours.',
        'Unexplained rapid weight change, severe acne, or excess facial hair growth.'
      ],
      ta: [
        'தொடர்ந்து 3 மாதங்களுக்கு மேல் மாதவிடாய் வராமல் இருத்தல்.',
        'தாங்க முடியாத அடிவயிற்று வலி அல்லது மயக்கம்.',
        'மணிக்கு ஒரு சானிட்டரி பேட் நனையும் அளவுக்கு மிக அதிக உதிரப்போக்கு.',
        'திடீர் உடல் எடை மாற்றம் அல்லது அதிகப்படியான முடி வளர்ச்சி.'
      ]
    },
    whenToSeekCare: {
      en: 'Consult a qualified gynaecologist if your cycle regularly falls outside 21–35 days or if you miss 3 periods in a row. If stress is affecting your cycle, you can also speak to a HerSpace Listener or Counsellor.',
      ta: 'உங்கள் சுழற்சி தொடர்ந்து 21–35 நாட்களுக்கு வெளியே இருந்தாலோ அல்லது 3 மாதங்கள் மாதவிடாய் வராமல் இருந்தாலோ மகப்பேறு மருத்துவரை அணுகவும். மன அழுத்தம் காரணமாக இருந்தால் HerSpace ஆலோசகரிடம் பேசலாம்.'
    }
  },
  {
    id: 'wb_02_period_pain',
    categoryId: 'cat_periods',
    categoryCode: 'A',
    synonyms: ['period pain', 'cramps', 'dysmenorrhea', 'stomach pain', 'வயிற்று வலி', 'மாதவிடாய் வலி', 'vayitru vali'],
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
      en: 'During menstruation, the uterus gently contracts to shed its lining, guided by natural hormone-like compounds called prostaglandins. Mild aching in the lower belly, lower back, or thighs for 24–48 hours is typical. However, debilitating pain can sometimes point to conditions like endometriosis, adenomyosis, or fibroids, which are treatable with proper medical care.',
      ta: 'மாதவிடாயின் போது கருப்பைச் சுவர் வெளியேற புரோஸ்டாக்ளாண்டின் (Prostaglandins) எனும் வேதிப்பொருள் சுரக்கிறது. இதனால் முதல் இரண்டு நாட்களுக்கு லேசான அடிவயிறு அல்லது முதுகு வலி ஏற்படலாம். ஆனால் தாங்க முடியாத வலி இருந்தால் எண்டோமெட்ரியோசிஸ் (Endometriosis) போன்ற காரணங்களைக் கண்டறிய மருத்துவப் பரிசோதனை அவசியம்.'
    },
    selfCare: {
      en: [
        'Place a warm water bag or heating pad on your lower abdomen or lower back for 15–20 minutes.',
        'Sip warm water, ginger tea, or jeera (cumin) water and stay hydrated.',
        'Try gentle restorative stretching or slow deep breathing.',
        'Rest without guilt when your body asks for recovery.'
      ],
      ta: [
        'அடிவயிறு அல்லது முதுகில் வெந்நீர் ஒத்தடம் (Heating pad) கொடுக்கலாம்.',
        'வெதுவெதுப்பான நீர், இஞ்சி அல்லது சீரகத் தண்ணீர் அருந்தலாம்.',
        'மென்மையான மூச்சுப் பயிற்சி மற்றும் போதிய ஓய்வு எடுக்கவும்.',
        'வலி அதிகமாக இருப்பின் மருத்துவர் பரிந்துரைத்த மாத்திரைகளை மட்டுமே பயன்படுத்தவும்.'
      ]
    },
    redFlags: {
      en: [
        'Pain so severe that you vomit, faint, or regularly miss work/college.',
        'Pelvic pain that occurs even when you are not on your period.',
        'Pain accompanied by high fever, chills, or foul-smelling discharge.',
        'Sudden worsening of cramps after age 25.'
      ],
      ta: [
        'வலியால் மயக்கம், வாந்தி அல்லது அன்றாடப் பணிகளைச் செய்ய இயலாமை.',
        'மாதவிடாய் இல்லாத நாட்களிலும் தொடரும் அடிவயிற்று வலி.',
        'காய்ச்சல் அல்லது துர்நாற்றத்துடன் கூடிய வெள்ளைப்படுதல்.',
        '25 வயதுக்குப் பிறகு திடீரென அதிகரிக்கும் தீவிர வலி.'
      ]
    },
    whenToSeekCare: {
      en: 'Please consult a gynaecologist if period pain disrupts your routine or worsens over time. You deserve compassionate pain relief.',
      ta: 'வலி உங்கள் அன்றாட வாழ்வைப் பாதித்தால் தயங்காமல் மகப்பேறு மருத்துவரை அணுகவும்.'
    }
  },
  {
    id: 'wb_03_menopause',
    categoryId: 'cat_periods',
    categoryCode: 'A',
    synonyms: ['menopause', 'perimenopause', 'hot flashes', 'age 45', 'மெனோபாஸ்', 'மாதவிடாய் நிற்கும் காலம்'],
    lastReviewedDate: '2026-10-15',
    editorialStage: 'Published',
    reviewBadgeEn: 'Approved Educational Content · Public Health Guidelines',
    reviewBadgeTa: 'அங்கீகரிக்கப்பட்ட கல்வித் தகவல் · பொது நல வழிகாட்டுதல்',
    sources: ['Indian Menopause Society (IMS) Educational Guidelines', 'WHO Healthy Ageing'],
    relatedIds: ['wb_01_late_period', 'wb_12_iron_foods'],
    title: {
      en: 'What changes should I expect around menopause?',
      ta: 'மெனோபாஸ் (மாதவிடாய் நிற்கும் காலம்) போது என்ன மாற்றங்களை எதிர்பார்க்கலாம்?'
    },
    shortAnswer: {
      en: 'Perimenopause (often starting in the 40s) brings gradual estrogen fluctuations causing irregular cycles, warm flushes, sleep shifts, vaginal dryness, and mood changes. Menopause is confirmed after 12 consecutive months without a period.',
      ta: '40 வயதுகளில் தொடங்கும் பெரிமெனோபாஸ் காலத்தில் ஈஸ்ட்ரோஜன் ஹார்மோன் மாற்றத்தால் சுழற்சி மாறுபாடு, உடல் வெப்பம் (Hot flashes), தூக்க மாற்றம் மற்றும் உணர்வு மாற்றங்கள் ஏற்படலாம். தொடர்ந்து 12 மாதங்கள் மாதவிடாய் வராமல் இருப்பதே மெனோபாஸ் ஆகும்.'
    },
    explanation: {
      en: 'In India, the average age of natural menopause is between 46 and 51 years. During the transition years (perimenopause), periods may become shorter, longer, lighter, or heavier before stopping completely. Lower estrogen levels also affect bone density and heart health, making calcium, Vitamin D, and strength movement especially important.',
      ta: 'இந்தியப் பெண்களுக்கு சராசரியாக 46 முதல் 51 வயதுக்குள் மெனோபாஸ் ஏற்படுகிறது. இக்காலத்தில் எலும்பு அடர்த்தி மற்றும் இருதய நலனில் கவனம் செலுத்துவது அவசியம். கால்சியம், வைட்டமின் D மற்றும் நடைப்பயிற்சி மிகவும் உதவும்.'
    },
    selfCare: {
      en: [
        'Wear breathable cotton clothing and keep your sleeping room cool and ventilated.',
        'Include calcium-rich foods (curd, ragi, sesame, greens) and regular morning sunlight for bone strength.',
        'Engage in 30 minutes of brisk walking and light resistance exercises.',
        'Share your feelings openly with a HerSpace Listener or Counsellor during emotional transitions.'
      ],
      ta: [
        'பருத்தி ஆடைகளை அணிவதும், காற்றோட்டமான அறையில் உறங்குவதும் உடல் வெப்பத்தைக் குறைக்கும்.',
        'ராகி, தயிர், எள், கீரை போன்ற கால்சியம் நிறைந்த உணவுகளை உட்கொள்ளவும்.',
        'தினமும் 30 நிமிட நடைப்பயிற்சி எலும்பு மற்றும் மன நலத்திற்கு நல்லது.',
        'மனநிலை மாற்றங்களுக்கு HerSpace கவனிப்பாளர் அல்லது ஆலோசகரிடம் மனம் விட்டுப் பேசலாம்.'
      ]
    },
    redFlags: {
      en: [
        'Any vaginal bleeding or spotting that occurs 12 months or more after your periods have completely stopped.',
        'Bleeding between periods or extremely heavy flooding during perimenopause.',
        'Severe depressive mood or persistent insomnia.'
      ],
      ta: [
        'மாதவிடாய் முழுமையாக நின்று 12 மாதங்களுக்குப் பிறகு ஏற்படும் எந்தவொரு உதிரப்போக்கும் (Postmenopausal bleeding).',
        'இரு மாதவிடாய்களுக்கு இடையில் ஏற்படும் அதிகப்படியான இரத்தப்போக்கு.',
        'தொடர் தூக்கமின்மை அல்லது தீவிர மனச்சோர்வு.'
      ]
    },
    whenToSeekCare: {
      en: 'Postmenopausal bleeding (even a few drops) must always be evaluated promptly by a gynaecologist.',
      ta: 'மாதவிடாய் நின்ற பிறகு ஒரு துளி இரத்தப்போக்கு ஏற்பட்டாலும் உடனடியாக மருத்துவரை அணுக வேண்டும்.'
    }
  },
  {
    id: 'wb_04_intimate_cleaning',
    categoryId: 'cat_hygiene',
    categoryCode: 'B',
    synonyms: ['intimate hygiene', 'wash', 'douching', 'soap', 'vulva', 'vagina', 'அந்தரங்க சுகாதாரம்', 'சுத்தம்'],
    lastReviewedDate: '2026-10-15',
    editorialStage: 'Published',
    reviewBadgeEn: 'Approved Educational Content · Public Health Guidelines',
    reviewBadgeTa: 'அங்கீகரிக்கப்பட்ட கல்வித் தகவல் · பொது நல வழிகாட்டுதல்',
    sources: ['FOGSI Hygiene Guidelines', 'WHO Reproductive Health'],
    relatedIds: ['wb_05_unusual_discharge', 'wb_15_ask_doctor'],
    title: {
      en: 'How should I clean my intimate area?',
      ta: 'என் அந்தரங்கப் பகுதியை எவ்வாறு பாதுகாப்பாகச் சுத்தம் செய்ய வேண்டும்?'
    },
    shortAnswer: {
      en: 'Wash only the external area (vulva) gently with plain lukewarm water. Never insert soap, antiseptic liquids, or douches inside the vagina, as the vagina cleans itself naturally and maintains a protective acidic pH.',
      ta: 'வெளிப்புறப் பகுதியை (Vulva) சுத்தமான சாதாரண அல்லது வெதுவெதுப்பான நீரால் மட்டுமே கழுவ வேண்டும். உட்புறப் பகுதியில் சோப்பு, வாசனைத் திரவங்கள் அல்லது ஆன்டிசெப்டிக் மருந்துகளைப் பயன்படுத்தக் கூடாது.'
    },
    explanation: {
      en: 'The internal vaginal canal hosts beneficial Lactobacilli bacteria that maintain a healthy acidic pH (around 3.8–4.5) to prevent infections. Commercial scented washes, harsh soaps, or internal douching destroy these protective bacteria and increase the risk of bacterial vaginosis and yeast infections.',
      ta: 'பெண்ணுறுப்பின் உட்புறம் இயற்கையாகவே தன்னைத்தானே சுத்தம் செய்துகொள்ளும் தன்மை கொண்டது. அங்குள்ள நல்ல பாக்டீரியாக்கள் தொற்று ஏற்படாமல் பாதுகாக்கின்றன. வாசனை சோப்புகள் அல்லது உட்புறக் கழுவுதல் (Douching) இந்தப் பாதுகாப்பைச் சிதைத்து தொற்றுகளை உண்டாக்கும்.'
    },
    selfCare: {
      en: [
        'Always wipe and wash from front to back after using the toilet to prevent urinary and vaginal infections.',
        'Wear breathable 100% cotton underwear and change out of damp or sweaty clothes promptly.',
        'During periods, change sanitary pads every 4–6 hours (or empty menstrual cups every 6–8 hours with clean hands).',
        'Dry the external area gently with a clean, soft towel.'
      ],
      ta: [
        'கழிவறை பயன்படுத்திய பின் எப்போதும் முன்பக்கத்திலிருந்து பின்பக்கமாகவே சுத்தம் செய்யவும்.',
        'காற்றோட்டமான பருத்தி உள்ளாடைகளை அணியவும்; ஈரமான ஆடைகளைத் தவிர்க்கவும்.',
        'மாதவிடாய் காலத்தில் 4–6 மணி நேரத்திற்கு ஒருமுறை சானிட்டரி பேடை மாற்றவும்.',
        'சுத்தமான மென்மையான துணியால் ஈரத்தை ஒற்றி எடுக்கவும்.'
      ]
    },
    redFlags: {
      en: [
        'Persistent itching, burning, swelling, or painful urination.',
        'Sores, blisters, or unusual lumps on the external genital area.',
        'Strong foul odour accompanied by greenish or greyish discharge.'
      ],
      ta: [
        'தொடர் அரிப்பு, எரிச்சல், வீக்கம் அல்லது சிறுநீர் கழிக்கும் போது வலி.',
        'புண்கள் அல்லது கட்டிகள் தென்படுதல்.',
        'துர்நாற்றத்துடன் கூடிய மஞ்சள்/பச்சை நிற வெள்ளைப்படுதல்.'
      ]
    },
    whenToSeekCare: {
      en: 'If you notice itching, burning, or pain while urinating, consult a doctor rather than applying over-the-counter steroid creams.',
      ta: 'அரிப்பு அல்லது எரிச்சல் இருந்தால் சுயமாக க்ரீம்களைப் பயன்படுத்தாமல் மருத்துவரை அணுகவும்.'
    }
  },
  {
    id: 'wb_05_unusual_discharge',
    categoryId: 'cat_hygiene',
    categoryCode: 'B',
    synonyms: ['discharge', 'white discharge', 'itching', 'infection', 'வெள்ளைப்படுதல்', 'vellaiokku', 'thotru'],
    lastReviewedDate: '2026-10-15',
    editorialStage: 'Published',
    reviewBadgeEn: 'Approved Educational Content · Public Health Guidelines',
    reviewBadgeTa: 'அங்கீகரிக்கப்பட்ட கல்வித் தகவல் · பொது நல வழிகாட்டுதல்',
    sources: ['WHO Sexually Transmitted & Reproductive Tract Infections Guide', 'ICMR Women Health'],
    relatedIds: ['wb_04_intimate_cleaning', 'wb_15_ask_doctor'],
    title: {
      en: 'What does unusual discharge mean?',
      ta: 'வழக்கத்திற்கு மாறான வெள்ளைப்படுதல் எதைக் குறிக்கிறது?'
    },
    shortAnswer: {
      en: 'Clear or milky-white discharge without itching or strong odour is completely normal and varies across your menstrual cycle. Discharge that is foul-smelling, greenish/yellowish, thick like cottage cheese with itching, or blood-stained outside periods needs medical evaluation.',
      ta: 'அரிப்பு அல்லது துர்நாற்றம் இல்லாத தெளிவான அல்லது வெண்மையான திரவம் சுரப்பது இயல்பான உடல் நிகழ்வு. ஆனால் துர்நாற்றம், அரிப்பு, எரிச்சல் அல்லது நிற மாற்றத்துடன் (மஞ்சள்/பச்சை) வெளியேறினால் மருத்துவ ஆலோசனை தேவை.'
    },
    explanation: {
      en: 'Healthy vaginal discharge keeps tissues moisturized and protected. Around ovulation (mid-cycle), discharge often becomes clear and stretchy like raw egg white. However, an overgrowth of yeast (Candida) can cause thick, curdy white discharge with intense itching, while bacterial imbalance can cause thin greyish discharge with a fishy odour.',
      ta: 'சுழற்சியின் நடுப்பகுதியில் (சினைமுட்டை வெளியாகும் நேரம்) தெளிவான திரவம் சுரப்பது ஆரோக்கியமான அறிகுறி. ஆனால் பூஞ்சைத் தொற்று (Yeast infection) இருந்தால் தயிர் போன்ற கெட்டியான வெள்ளைப்படுதலும் அரிப்பும் ஏற்படும். பாக்டீரியா தொற்று இருந்தால் துர்நாற்றம் ஏற்படலாம்.'
    },
    selfCare: {
      en: [
        'Observe whether the discharge correlates with mid-cycle ovulation or triggers symptoms like itching.',
        'Avoid tight synthetic clothing, scented panty liners, and harsh detergent residue on underwear.',
        'Drink plenty of water and include natural probiotic curd/buttermilk in your diet.'
      ],
      ta: [
        'அரிப்பு, எரிச்சல் அல்லது துர்நாற்றம் உள்ளதா என்பதைக் கவனிக்கவும்.',
        'இறுக்கமான செயற்கை இழை ஆடைகள் மற்றும் வாசனைத் திரவியங்களைத் தவிர்க்கவும்.',
        'நிறைய தண்ணீர் மற்றும் மோர்/தயிர் உணவில் சேர்த்துக்கொள்ளவும்.'
      ]
    },
    redFlags: {
      en: [
        'Greenish, yellowish, or frothy discharge with pelvic pain or fever.',
        'Thick curdy discharge with severe vulvar redness, burning, or swelling.',
        'Blood-tinged or brown discharge after intercourse or between periods.'
      ],
      ta: [
        'காய்ச்சல் மற்றும் அடிவயிற்று வலியுடன் கூடிய பச்சை/மஞ்சள் நிற திரவம்.',
        'தீவிர அரிப்பு மற்றும் எரிச்சலுடன் கூடிய கெட்டியான வெள்ளைப்படுதல்.',
        'மாதவிடாய் இல்லாத நேரங்களில் இரத்தம் கலந்த திரவம் வெளியேறுதல்.'
      ]
    },
    whenToSeekCare: {
      en: 'Visit a gynaecologist or general physician for a simple, targeted treatment—most vaginal infections clear quickly with the right prescription.',
      ta: 'சரியான மருத்துவ ஆலோசனை மூலம் ஒரு சில நாட்களில் இத்தொற்றுகளை எளிதில் குணப்படுத்த முடியும்.'
    }
  },
  {
    id: 'wb_06_hair_loss',
    categoryId: 'cat_skincare',
    categoryCode: 'G',
    synonyms: ['hair fall', 'hair loss', 'iron', 'thyroid', 'stress', 'முடி உதிர்தல்', 'mudi kottuthal', 'கூந்தல்'],
    lastReviewedDate: '2026-10-15',
    editorialStage: 'Published',
    reviewBadgeEn: 'Approved Educational Content · Public Health Guidelines',
    reviewBadgeTa: 'அங்கீகரிக்கப்பட்ட கல்வித் தகவல் · பொது நல வழிகாட்டுதல்',
    sources: ['ICMR Dietary & Micronutrient Guidelines', 'IADVL Patient Education'],
    relatedIds: ['wb_12_iron_foods', 'wb_07_skincare_routine'],
    title: {
      en: 'Why am I losing hair?',
      ta: 'எனக்கு ஏன் அதிகமாக முடி உதிர்கிறது?'
    },
    shortAnswer: {
      en: 'Shedding 50–100 strands daily is normal. Increased hair fall in women is commonly linked to low iron (ferritin), Vitamin D or B12 deficiency, thyroid changes, PCOS, post-illness/postpartum recovery, or high emotional stress.',
      ta: 'தினமும் 50–100 முடிகள் உதிர்வது இயல்பானது. அதற்கு மேல் முடி உதிர்ந்தால் இரும்புச்சத்து குறைபாடு, வைட்டமின் D/B12 பற்றாக்குறை, தைராய்டு, PCOS, காய்ச்சலுக்குப் பிந்தைய சோர்வு அல்லது மன அழுத்தம் காரணமாக இருக்கலாம்.'
    },
    explanation: {
      en: 'Hair follicles require steady oxygen, iron, protein, and hormonal balance. When the body experiences stress, heavy menstrual bleeding, crash dieting, or illness, many hair follicles shift prematurely into the resting/shedding phase (telogen effluvium) about 2–3 months after the trigger.',
      ta: 'கூந்தல் வளர்ச்சிக்குப் புரதம், இரும்புச்சத்து மற்றும் ஹார்மோன் சமநிலை அவசியம். அதிக மாதவிடாய் உதிரப்போக்கு, தீவிர டயட் அல்லது மன அழுத்தம் ஏற்பட்ட 2–3 மாதங்களுக்குப் பிறகு முடி உதிர்தல் அதிகரிக்கலாம்.'
    },
    selfCare: {
      en: [
        'Nourish from within: include dal, greens (murungai keerai), eggs/paneer, dates, amla, and nuts daily.',
        'Use a mild cleanser on your scalp 2–3 times a week and avoid tight hairstyles that pull the hairline.',
        'Minimize excessive heat styling or harsh chemical straightening.',
        'Manage daily stress with sleep and HerSpace Calm relaxation tracks.'
      ],
      ta: [
        'முருங்கைக்கீரை, பருப்பு, நெல்லிக்காய், பேரீச்சம்பழம், முட்டை/பனீர் போன்ற புரதம் மற்றும் இரும்புச்சத்து உணவுகளை உண்ணவும்.',
        'வாரத்திற்கு 2–3 முறை மென்மையான ஷாம்பூ கொண்டு தலையைச் சுத்தம் செய்யவும்.',
        'முடியை மிகவும் இறுக்கமாகக் கட்டுவதையும் அதிக வெப்பக் கருவிகளையும் தவிர்க்கவும்.'
      ]
    },
    redFlags: {
      en: [
        'Sudden coin-shaped bald patches on the scalp.',
        'Scalp pain, pus, crusting, or severe scaling.',
        'Rapid thinning at the crown alongside irregular periods and facial hair growth.'
      ],
      ta: [
        'தலையில் திட்டுத் திட்டாக முடி கொட்டுதல்.',
        'மண்டை ஓட்டில் புண், வலி அல்லது அதிகப்படியான பொடுகு.',
        'சீரற்ற மாதவிடாயுடன் கூடிய தீவிர முடி உதிர்தல்.'
      ]
    },
    whenToSeekCare: {
      en: 'A dermatologist or physician can check basic blood markers (Haemoglobin, Ferritin, TSH, Vitamin D/B12) before you spend money on expensive cosmetic serums.',
      ta: 'விலையுயர்ந்த தைலங்களை வாங்குவதற்கு முன் மருத்துவரை அணுகி இரத்தப் பரிசோதனை (Iron, Thyroid, Vitamin D) செய்து கொள்வது சிறந்தது.'
    }
  },
  {
    id: 'wb_07_skincare_routine',
    categoryId: 'cat_skincare',
    categoryCode: 'G',
    synonyms: ['skincare', 'sunscreen', 'acne', 'glow', 'சரும பராமரிப்பு', 'முகப்பரு', 'skin'],
    lastReviewedDate: '2026-10-15',
    editorialStage: 'Published',
    reviewBadgeEn: 'Approved Educational Content · Public Health Guidelines',
    reviewBadgeTa: 'அங்கீகரிக்கப்பட்ட கல்வித் தகவல் · பொது நல வழிகாட்டுதல்',
    sources: ['IADVL Safe Skincare Education', 'WHO UV Protection Guidance'],
    relatedIds: ['wb_06_hair_loss', 'wb_12_iron_foods'],
    title: {
      en: 'How can I create a simple skincare routine?',
      ta: 'எளிமையான மற்றும் பாதுகாப்பான சருமப் பராமரிப்பு முறை என்ன?'
    },
    shortAnswer: {
      en: 'A healthy skincare routine needs only three gentle essentials: a mild cleanser, a suitable moisturizer, and broad-spectrum sunscreen (SPF 30+) during the day. Never use unprescribed "fairness" or steroid creams.',
      ta: 'ஆரோக்கியமான சருமத்திற்கு மூன்று எளிய படிகள் போதும்: மென்மையான ஃபேஸ் வாஷ் (Cleanser), மாய்ஸ்சரைசர் (Moisturizer) மற்றும் பகலில் சன்ஸ்கிரீன் (Sunscreen SPF 30+). மருத்துவர் பரிந்துரைக்காத நிறம் கூட்டும் க்ரீம்களைத் தவிர்க்கவும்.'
    },
    explanation: {
      en: 'Healthy skin comes from a strong moisture barrier and sun protection—not skin-lightening chemicals. Every skin tone is natural and worthy of care. Over-scrubbing or applying topical steroid creams sold as "instant glow" creams can permanently thin the skin and cause stubborn pigmentation.',
      ta: 'சருமத்தின் இயற்கையான நிறம் அழகானது. சரும ஆரோக்கியம் என்பது அதன் ஈரப்பதத்தையும் வெயில் பாதுகாப்பையும் பொறுத்தது. உடனடிப் பொலிவு தருவதாகக் கூறப்படும் ஸ்டீராய்டு க்ரீம்கள் சருமத்தை நிரந்தரமாகப் பாதிக்கும்.'
    },
    selfCare: {
      en: [
        'Morning: Wash with water or a gentle cleanser → light moisturizer → SPF 30+ sunscreen.',
        'Night: Wash away sweat/dust with a mild cleanser → apply a soothing moisturizer on slightly damp skin.',
        'Change pillowcases weekly and avoid picking or squeezing pimples.',
        'Drink water consistently and eat colourful fruits and vegetables.'
      ],
      ta: [
        'காலை: மென்மையான கிளென்சர் → மாய்ஸ்சரைசர் → சன்ஸ்கிரீன் (SPF 30+).',
        'இரவு: முகத்தைச் சுத்தமாகக் கழுவி விட்டு மாய்ஸ்சரைசர் தடவவும்.',
        'முகப்பருக்களை நகத்தால் கிள்ளுவதைத் தவிர்க்கவும்; தலையணை உறையை வாரம் ஒருமுறை மாற்றவும்.'
      ]
    },
    redFlags: {
      en: [
        'Deep, painful cystic acne leaving scars.',
        'Sudden rash, swelling, or burning after applying a cosmetic product.',
        'A mole or dark spot that changes shape, colour, or bleeds.'
      ],
      ta: [
        'வலி மிகுந்த பெரிய முகப்பருக்கள் மற்றும் தழும்புகள்.',
        'அழகுசாதனப் பொருள் பயன்படுத்திய பின் ஏற்படும் எரிச்சல் அல்லது வீக்கம்.',
        'மச்சங்களின் அளவு அல்லது நிறம் திடீரென மாறுதல்.'
      ]
    },
    whenToSeekCare: {
      en: 'Consult a certified dermatologist for persistent acne, melasma, or eczema.',
      ta: 'தொடர் முகப்பரு அல்லது சருமப் பிரச்சினைகளுக்குத் தோல் மருத்துவரை அணுகவும்.'
    }
  },
  {
    id: 'wb_08_loneliness',
    categoryId: 'cat_emotional',
    categoryCode: 'D',
    synonyms: ['lonely', 'loneliness', 'alone', 'sad', 'emotional', 'தனிமை', 'மனக்கவலை', 'thanimai'],
    lastReviewedDate: '2026-10-15',
    editorialStage: 'Published',
    reviewBadgeEn: 'Approved Educational Content · Psychological Wellbeing',
    reviewBadgeTa: 'அங்கீகரிக்கப்பட்ட கல்வித் தகவல் · உளவியல் நலம்',
    sources: ['NIMHANS Mental Health Literacy', 'WHO Social Connection & Wellbeing'],
    relatedIds: ['wb_09_heartbreak', 'wb_11_work_stress'],
    title: {
      en: 'Why do I feel lonely even around people?',
      ta: 'பலர் சூழ்ந்திருந்தாலும் நான் ஏன் தனிமையாக உணர்கிறேன்?'
    },
    shortAnswer: {
      en: 'Loneliness is not about the number of people around you—it happens when you feel unseen, unheard, or unable to share your authentic feelings safely without judgment.',
      ta: 'தனிமை என்பது நம்மைச் சுற்றி எத்தனை பேர் இருக்கிறார்கள் என்பதைப் பொறுத்தது அல்ல; நம் உணர்வுகளைத் தயக்கமின்றிப் பகிர்ந்துகொள்ளவும், புரிந்துகொள்ளப்படவும் முடியாதபோது ஏற்படும் உணர்வாகும்.'
    },
    explanation: {
      en: 'Many women carry unspoken caregiving responsibilities, family expectations, or workplace pressure while hiding their own exhaustion. When interactions remain on the surface or when you constantly put others first, emotional disconnection builds up even in a crowded home or office.',
      ta: 'குடும்பம் மற்றும் பணியிடப் பொறுப்புகளைச் சுமக்கும் பல பெண்கள் தங்கள் சொந்த சோர்வையும் உணர்வுகளையும் வெளியில் சொல்வதில்லை. மற்றவர்களுக்காகவே தொடர்ந்து செயல்படும்போது, கூட்டத்தில் இருந்தாலும் மனம் தனிமையை உணரலாம்.'
    },
    selfCare: {
      en: [
        'Acknowledge your feelings gently without blaming yourself for feeling lonely.',
        'Write down what you truly wish someone would ask you today.',
        'Book a 1-on-1 session with a HerSpace Trained Human Listener (first 30-min session is ₹0) just to be heard without judgment.',
        'Listen to a guided relaxation track in HerSpace Calm before bedtime.'
      ],
      ta: [
        'உங்கள் தனிமை உணர்வை குற்ற உணர்வின்றி ஏற்றுக்கொள்ளுங்கள்.',
        'உங்கள் மனதில் உள்ளவற்றை நாட்குறிப்பில் எழுதுங்கள்.',
        'தீர்ப்பு வழங்காமல் அன்புடன் கேட்கும் HerSpace கவனிப்பாளரிடம் (முதல் 30 நிமிட அமர்வு ₹0) மனம் விட்டுப் பேசுங்கள்.',
        'HerSpace அமைதிப் பகுதியில் உள்ள தியான இசையைக் கேளுங்கள்.'
      ]
    },
    redFlags: {
      en: [
        'Persistent hopelessness or loss of interest in everything for more than 2 weeks.',
        'Inability to sleep or eat, or overwhelming thoughts of self-harm.'
      ],
      ta: [
        'இரண்டு வாரங்களுக்கு மேலாகத் தொடரும் தீவிர நம்பிக்கையின்மை மற்றும் விரக்தி.',
        'தூக்கமின்மை அல்லது தன்னைத்தானே வருத்திக்கொள்ளும் எண்ணங்கள்.'
      ]
    },
    whenToSeekCare: {
      en: 'Connect with a HerSpace Professional Counsellor (₹999) for structured emotional support, or call 14416 (Tele-MANAS) immediately if you feel in crisis.',
      ta: 'உளவியல் ஆலோசனைக்கு HerSpace ஆலோசகரை அணுகவும்; அவசர உதவிக்கு 14416 (Tele-MANAS) எண்ணை அழைக்கவும்.'
    }
  },
  {
    id: 'wb_09_heartbreak',
    categoryId: 'cat_relationships',
    categoryCode: 'E',
    synonyms: ['heartbreak', 'breakup', 'divorce', 'grief', 'love', 'காதல் தோல்வி', 'பிரிவு', 'மனக்காயம்'],
    lastReviewedDate: '2026-10-15',
    editorialStage: 'Published',
    reviewBadgeEn: 'Approved Educational Content · Psychological Wellbeing',
    reviewBadgeTa: 'அங்கீகரிக்கப்பட்ட கல்வித் தகவல் · உளவியல் நலம்',
    sources: ['NIMHANS Emotional Resilience Guide', 'APA Grief & Relationship Recovery'],
    relatedIds: ['wb_08_loneliness', 'wb_10_healthy_boundaries'],
    title: {
      en: 'How can I recover emotionally after heartbreak?',
      ta: 'உறவுப் பிரிவு அல்லது மனக்காயத்திலிருந்து நான் எவ்வாறு மீள்வது?'
    },
    shortAnswer: {
      en: 'Healing from heartbreak is a genuine grieving process. Give yourself permission to feel sad, pause repetitive contact or social-media checking, lean on safe support, and rebuild daily routines step by step.',
      ta: 'மனக்காயத்திலிருந்து மீள்வது என்பது படிப்படியான நிகழ்வு. உங்கள் வருத்தத்தை அடக்காமல் வெளிப்படுத்தவும், சமூக வலைதளங்களில் மீண்டும் மீண்டும் தேடுவதைத் தவிர்க்கவும், பாதுகாப்பான ஆதரவுடன் உங்கள் அன்றாடப் பழக்கங்களை மீட்டெடுக்கவும்.'
    },
    explanation: {
      en: 'Brain imaging studies show that emotional rejection activates similar neural pathways to physical pain. It is normal to experience waves of sadness, anger, longing, and relief. Healing is not a straight line, and your worth is never defined by one relationship.',
      ta: 'உணர்வுப்பூர்வமான பிரிவு உடல் வலிக்கு இணையான தாக்கத்தை ஏற்படுத்துகிறது என அறிவியல் கூறுகிறது. ஒரு உறவின் முடிவால் உங்கள் சுயமதிப்பு ஒருபோதும் குறைந்துவிடாது.'
    },
    selfCare: {
      en: [
        'Create a "digital boundary" by muting or archiving chats and photos that trigger acute distress.',
        'Keep basic body care steady: morning sunlight, warm meals, and hydration.',
        'Talk through the unspoken grief in a confidential session with a HerSpace Listener or Counsellor.'
      ],
      ta: [
        'மன வலியைத் தூண்டும் குறுஞ்செய்திகள் மற்றும் சமூக வலைதளப் பக்கங்களிலிருந்து தற்காலிக இடைவெளி எடுக்கவும்.',
        'சரியான நேரத்திற்கு உணவு மற்றும் உறக்கத்தைக் கைவிடாதீர்கள்.',
        'உங்கள் மனச்சுமையை HerSpace கவனிப்பாளர் அல்லது ஆலோசகரிடம் பகிர்ந்து ஆறுதல் பெறுங்கள்.'
      ]
    },
    redFlags: {
      en: [
        'Stalking, threats, blackmail, or coercion from a former partner.',
        'Severe panic attacks or thoughts that life is not worth living.'
      ],
      ta: [
        'மிரட்டல், வற்புறுத்தல் அல்லது பாதுகாப்பற்ற சூழல்.',
        'தீவிரப் பதற்றம் அல்லது வாழ்க்கையின் மீதான விரக்தி.'
      ]
    },
    whenToSeekCare: {
      en: 'If you face harassment or threats, call 112 or 181 (Women Helpline). For emotional trauma recovery, book a HerSpace Professional Counsellor.',
      ta: 'பாதுகாப்பு அச்சுறுத்தல் இருந்தால் 112 அல்லது 181 எண்ணை அழைக்கவும். மனநலச் சிகிச்சைக்கு HerSpace ஆலோசகரை அணுகவும்.'
    }
  },
  {
    id: 'wb_10_healthy_boundaries',
    categoryId: 'cat_relationships',
    categoryCode: 'E',
    synonyms: ['boundaries', 'family', 'marriage', 'respect', 'say no', 'எல்லைகள்', 'உறவுகள்', 'சுயமரியாதை'],
    lastReviewedDate: '2026-10-15',
    editorialStage: 'Published',
    reviewBadgeEn: 'Approved Educational Content · Psychological Wellbeing',
    reviewBadgeTa: 'அங்கீகரிக்கப்பட்ட கல்வித் தகவல் · உளவியல் நலம்',
    sources: ['NIMHANS Healthy Relationships', 'WHO Violence Prevention & Respect'],
    relatedIds: ['wb_09_heartbreak', 'wb_11_work_stress'],
    title: {
      en: 'What are healthy boundaries in a relationship?',
      ta: 'உறவுகளில் ஆரோக்கியமான எல்லைகள் (Healthy Boundaries) என்றால் என்ன?'
    },
    shortAnswer: {
      en: 'Healthy boundaries are clear, respectful limits that protect your emotional energy, physical safety, privacy, and dignity—allowing you to love and care for others without losing yourself.',
      ta: 'ஆரோக்கியமான எல்லைகள் என்பவை உங்கள் மன அமைதி, உடல் பாதுகாப்பு மற்றும் சுயமரியாதையைப் பாதுகாக்கும் தெளிவான வரம்புகளாகும். உங்களை இழக்காமல் மற்றவர்களிடம் அன்பு செலுத்த இது உதவுகிறது.'
    },
    explanation: {
      en: 'Many women are raised to believe that saying "no" or asking for personal space is selfish. In reality, healthy boundaries prevent resentment and burnout. Boundaries include emotional privacy, financial autonomy, bodily consent, and respectful speech.',
      ta: 'மற்றவர்களின் விருப்பத்திற்காகத் தனது தேவைகளை எப்போதும் தியாகம் செய்வது நாளடைவில் மனச்சோர்வைத் தரும். மரியாதையான பேச்சு, தனிப்பட்ட சுதந்திரம் மற்றும் ஒப்புதல் ஆகியவை ஆரோக்கியமான உறவின் அடிப்படை.'
    },
    selfCare: {
      en: [
        'Use calm "I" statements: "I need 30 minutes of quiet time after work before we discuss plans."',
        'Remember that saying "Let me think about it and tell you tomorrow" is a complete sentence.',
        'Notice where you feel chronic resentment—it often points to a boundary that needs care.'
      ],
      ta: [
        '"பணி முடிந்து வந்ததும் எனக்கு 30 நிமிட ஓய்வு தேவை" என்பது போல் அமைதியாகவும் உறுதியாகவும் உங்கள் தேவையைக் கூறுங்கள்.',
        '"இதைப் பற்றி யோசித்து நாளை சொல்கிறேன்" என்று கூறுவது உங்கள் உரிமை.',
        'உங்கள் சுயமரியாதையைக் காயப்படுத்தும் பேச்சுகளை அமைதியாகச் சுட்டிக்காட்டுங்கள்.'
      ]
    },
    redFlags: {
      en: [
        'A partner or family member who controls your phone, money, movement, or friendships.',
        'Physical intimidation, humiliation, or forced intimacy without consent.'
      ],
      ta: [
        'உங்கள் தொலைபேசி, பணம் அல்லது நட்புகளைக் கட்டுப்படுத்த நினைப்பது.',
        'உடல் ரீதியான மிரட்டல், அவமானப்படுத்துதல் அல்லது கட்டாயப்படுத்துதல்.'
      ]
    },
    whenToSeekCare: {
      en: 'Speak to a HerSpace Counsellor to practice boundary communication safely, or contact 181 / 112 if you feel unsafe at home.',
      ta: 'எல்லைகளை அமைப்பது குறித்துப் பேச HerSpace ஆலோசகரை அணுகவும்.'
    }
  },
  {
    id: 'wb_11_work_stress',
    categoryId: 'cat_career',
    categoryCode: 'J',
    synonyms: ['work stress', 'burnout', 'office', 'career', 'exhaustion', 'பணி அழுத்தம்', 'வேலை', 'சோர்வு'],
    lastReviewedDate: '2026-10-15',
    editorialStage: 'Published',
    reviewBadgeEn: 'Approved Educational Content · Workplace Wellbeing',
    reviewBadgeTa: 'அங்கீகரிக்கப்பட்ட கல்வித் தகவல் · பணியிட நலம்',
    sources: ['WHO Mental Health at Work Guidelines', 'NIMHANS Stress Management'],
    relatedIds: ['wb_14_professional_confidence', 'wb_08_loneliness'],
    title: {
      en: 'How can I manage work stress and burnout?',
      ta: 'பணி அழுத்தம் மற்றும் சோர்வை (Burnout) நான் எவ்வாறு கையாள்வது?'
    },
    shortAnswer: {
      en: 'Manage work stress by separating urgent tasks from perfectionism, taking micro-breaks for breathing, protecting a clear end-of-day transition ritual, and sharing the invisible load at home.',
      ta: 'அனைத்தையும் கச்சிதமாகச் செய்ய வேண்டும் என்ற அழுத்தத்தைக் குறைத்து, முக்கியப் பணிகளுக்கு முன்னுரிமை அளிப்பதும், பணி முடிந்த பின் ஓய்வு நேரத்தைப் பாதுகாப்பதும் பணிச் சோர்வைக் குறைக்கும்.'
    },
    explanation: {
      en: 'Women frequently shoulder a "double shift" of professional deadlines and household mental load. Chronic cortisol elevation leads to headaches, digestive distress, irritability, and sleep disruption.',
      ta: 'அலுவலகப் பணி மற்றும் குடும்பப் பொறுப்புகள் என இரட்டைச் சுமையைப் பெண்கள் அடிக்கடி எதிர்கொள்கின்றனர். தொடர் மன அழுத்தம் தலைவலி, தூக்கமின்மை மற்றும் சோர்வை ஏற்படுத்துகிறது.'
    },
    selfCare: {
      en: [
        'Take a 3-minute breathing reset between meetings using HerSpace Calm.',
        'Write down your top 3 realistic priorities each morning instead of an endless 20-item list.',
        'Create a 15-minute evening transition ritual (a warm shower, a cup of tea, or soothing music).'
      ],
      ta: [
        'பணிகளுக்கு இடையில் 3 நிமிடம் ஆழ்ந்த மூச்சுப் பயிற்சி செய்யுங்கள்.',
        'தினமும் மிக முக்கியமான 3 பணிகளைப் பட்டியலிட்டுச் செயல்படுங்கள்.',
        'மாலைப் பொழுதில் HerSpace அமைதி இசையுடன் 15 நிமிடம் மனதை ஆசுவாசப்படுத்துங்கள்.'
      ]
    },
    redFlags: {
      en: [
        'Chest tightness, frequent panic attacks, or dread every morning before work.',
        'Workplace harassment or unsafe working conditions.'
      ],
      ta: [
        'நெஞ்சு படபடப்பு, தொடர் பதற்றம் அல்லது பணியிடப் பாதுகாப்பின்மை.'
      ]
    },
    whenToSeekCare: {
      en: 'Book a HerSpace Listener or Counsellor session to decompress after tough weeks and build sustainable career boundaries.',
      ta: 'மன அழுத்தத்தைக் குறைக்க HerSpace கவனிப்பாளர் அல்லது ஆலோசகரிடம் உரையாடுங்கள்.'
    }
  },
  {
    id: 'wb_12_iron_foods',
    categoryId: 'cat_nutrition',
    categoryCode: 'H',
    synonyms: ['iron', 'anaemia', 'tired', 'fatigue', 'food', 'diet', 'இரும்புச்சத்து', 'உணவு', 'இரத்த சோகை', 'keerai'],
    lastReviewedDate: '2026-10-15',
    editorialStage: 'Published',
    reviewBadgeEn: 'Approved Educational Content · ICMR-NIN Nutrition',
    reviewBadgeTa: 'அங்கீகரிக்கப்பட்ட கல்வித் தகவல் · ICMR ஊட்டச்சத்து வழிகாட்டி',
    sources: ['ICMR-National Institute of Nutrition (NIN) Dietary Guidelines for Indians', 'NHM Anaemia Mukt Bharat'],
    relatedIds: ['wb_01_late_period', 'wb_06_hair_loss'],
    title: {
      en: 'What are simple iron-rich Indian foods?',
      ta: 'இரும்புச்சத்து நிறைந்த எளிய இந்திய உணவுகள் யாவை?'
    },
    shortAnswer: {
      en: 'Affordable everyday Indian iron sources include drumstick leaves (murungai keerai), amaranth (arai keerai), roasted Bengal gram (pottukadalai), horse gram (kollu), black sesame (ellu), ragi, dates, jaggery in moderation, and eggs/fish/lean meat—paired with Vitamin C (lemon/amla) for better absorption.',
      ta: 'முருங்கைக்கீரை, அரைக்கீரை, பொட்டுக்கடலை, கொள்ளு, கருப்பு எள், ராகி, பேரீச்சம்பழம், சுண்டல் மற்றும் முட்டை ஆகியவை சிறந்த இரும்புச்சத்து உணவுகள். இவற்றுடன் எலுமிச்சை அல்லது நெல்லிக்காய் (வைட்டமின் C) சேர்ப்பது இரும்புச்சத்து உடலில் சேர உதவும்.'
    },
    explanation: {
      en: 'Because of monthly menstrual blood loss, women require significantly more dietary iron than men. According to ICMR-NIN guidelines, pairing plant-based iron with Vitamin C (like squeezing lemon over dal/sundal or eating amla/guava) doubles iron absorption, while drinking tea or coffee immediately with meals blocks iron uptake.',
      ta: 'மாதவிடாய் காரணமாகப் பெண்களுக்கு இரும்புச்சத்து கூடுதலாகத் தேவைப்படுகிறது. உணவு உண்ட உடனேயே டீ அல்லது காபி குடிப்பது இரும்புச்சத்து உறிஞ்சப்படுவதைத் தடுக்கும் என்பதால், உணவுக்கு 1 மணிநேரத்திற்குப் பின் அருந்துவது நல்லது.'
    },
    selfCare: {
      en: [
        'Add a bowl of keerai (greens) or sprouted sundal with a squeeze of fresh lemon 3–4 times a week.',
        'Snack on roasted chana, groundnuts, or sesame-jaggery balls in moderation.',
        'Keep a 45–60 minute gap between your main meals and tea/coffee.'
      ],
      ta: [
        'வாரத்திற்கு 3–4 முறை கீரை மற்றும் முளைகட்டிய பயறு வகைகளை எலுமிச்சைச் சாறுடன் சேர்த்து உண்ணவும்.',
        'உணவு உண்டவுடன் டீ/காபி அருந்துவதைத் தவிர்த்து 45 நிமிட இடைவெளி விடவும்.'
      ]
    },
    redFlags: {
      en: [
        'Extreme breathlessness on climbing a few stairs, pale inner eyelids, or frequent dizziness.',
        'Heart palpitations, brittle spoon-shaped nails, or severe chronic fatigue.'
      ],
      ta: [
        'சிறிது நடந்தாலே மூச்சு வாங்குதல், கண் இமை வெளிறிப் போதல் அல்லது அடிக்கடி மயக்கம்.',
        'தொடர் உடல் சோர்வு மற்றும் படபடப்பு.'
      ]
    },
    whenToSeekCare: {
      en: 'Ask a doctor for a Complete Blood Count (CBC / Haemoglobin) test if you feel constantly exhausted.',
      ta: 'தொடர் சோர்வு இருந்தால் மருத்துவரை அணுகி இரத்தத்தில் ஹீமோகுளோபின் (Hb) அளவைப் பரிசோதிக்கவும்.'
    }
  },
  {
    id: 'wb_13_gentle_exercise',
    categoryId: 'cat_fitness',
    categoryCode: 'I',
    synonyms: ['yoga', 'exercise', 'fitness', 'walking', 'beginner', 'யோகா', 'உடற்பயிற்சி', 'நடைப்பயிற்சி'],
    lastReviewedDate: '2026-10-15',
    editorialStage: 'Published',
    reviewBadgeEn: 'Approved Educational Content · WHO Physical Activity',
    reviewBadgeTa: 'அங்கீகரிக்கப்பட்ட கல்வித் தகவல் · உடற்பயிற்சி நலம்',
    sources: ['WHO Guidelines on Physical Activity', 'Ministry of AYUSH Yoga Wellness'],
    relatedIds: ['wb_02_period_pain', 'wb_11_work_stress'],
    title: {
      en: 'Which gentle exercises can beginners try?',
      ta: 'தொடக்கநிலையாளர்கள் செய்யக்கூடிய எளிய உடற்பயிற்சிகள் யாவை?'
    },
    shortAnswer: {
      en: 'Start with 20 minutes of brisk walking, gentle joint mobility, Cat-Cow spinal stretches (Marjaryasana), Butterfly pose (Baddha Konasana), and slow diaphragmatic breathing—consistency matters far more than intensity.',
      ta: 'தினமும் 20 நிமிட நடைப்பயிற்சி, மூட்டு அசைவுப் பயிற்சிகள், எளிய யோகாசனங்கள் (பட்டாம்பூச்சி ஆசனம்) மற்றும் ஆழ்ந்த மூச்சுப் பயிற்சி ஆகியவை தொடங்குவதற்கு மிகச் சிறந்தவை.'
    },
    explanation: {
      en: 'You do not need an expensive gym membership to care for your body. Gentle daily movement improves insulin sensitivity (helpful in PCOS), strengthens bones, eases menstrual stiffness, and releases endorphins that lift mood.',
      ta: 'உடல் ஆரோக்கியத்திற்குக் கடினமான பயிற்சிகள் தேவையில்லை. தினசரி 20 நிமிட நடைப்பயிற்சியும் எளிய யோகாவும் ஹார்மோன் சமநிலைக்கும் மன மகிழ்ச்சிக்கும் பெரிதும் உதவுகின்றன.'
    },
    selfCare: {
      en: [
        'Start with just 15–20 minutes after breakfast or in the evening breeze.',
        'During your period, swap intense workouts for slow walking or child’s pose (Balasana).',
        'Practice pelvic floor relaxation and gentle core breathing.'
      ],
      ta: [
        'காலை அல்லது மாலை வேளையில் 15–20 நிமிட நடைப்பயிற்சியுடன் தொடங்குங்கள்.',
        'மாதவிடாய் நாட்களில் கடினமான பயிற்சிகளைத் தவிர்த்து மென்மையான ஓய்வு ஆசனங்களைச் செய்யலாம்.'
      ]
    },
    redFlags: {
      en: [
        'Sharp joint pain, chest pain, or dizziness during movement.',
        'Pelvic heaviness or urinary leakage during high-impact jumping.'
      ],
      ta: [
        'பயிற்சியின் போது நெஞ்சு வலி, மூச்சுத் திணறல் அல்லது மயக்கம்.',
        'கடுமையான மூட்டு வலி.'
      ]
    },
    whenToSeekCare: {
      en: 'If you are pregnant, recently postpartum, or recovering from surgery, check with your doctor before starting a new routine.',
      ta: 'கர்ப்ப காலம் அல்லது அறுவை சிகிச்சைக்குப் பிறகு மருத்துவர் ஆலோசனையுடன் பயிற்சிகளைத் தொடங்கவும்.'
    }
  },
  {
    id: 'wb_14_professional_confidence',
    categoryId: 'cat_career',
    categoryCode: 'J',
    synonyms: ['confidence', 'career', 'interview', 'imposter syndrome', 'return to work', 'தன்னம்பிக்கை', 'வேலை', 'தொழில்'],
    lastReviewedDate: '2026-10-15',
    editorialStage: 'Published',
    reviewBadgeEn: 'Approved Educational Content · Career Empowerment',
    reviewBadgeTa: 'அங்கீகரிக்கப்பட்ட கல்வித் தகவல் · தொழில் தன்னம்பிக்கை',
    sources: ['NIMHANS Life Skills & Self-Efficacy', 'ILO Women in Work Guidance'],
    relatedIds: ['wb_11_work_stress', 'wb_10_healthy_boundaries'],
    title: {
      en: 'How can I improve my professional confidence?',
      ta: 'என் தொழில் மற்றும் பணியிடத் தன்னம்பிக்கையை எவ்வாறு வளர்த்துக்கொள்வது?'
    },
    shortAnswer: {
      en: 'Build professional confidence by keeping an evidence log of problems you have solved, preparing 2 key points before meetings, separating learning curves from self-worth, and practising your voice in a safe space.',
      ta: 'நீங்கள் வெற்றிகரமாக முடித்த பணிகளைக் குறித்து வைப்பதும், கூட்டங்களுக்கு முன் முக்கியக் கருத்துகளைத் தயார் செய்வதும், தயக்கமின்றிப் பேசிப் பழகுவதும் உங்கள் தொழில் தன்னம்பிக்கையை உயர்த்தும்.'
    },
    explanation: {
      en: 'Whether you are a student, a working professional, or returning after a career break for family caregiving, self-doubt ("imposter syndrome") is common. Confidence comes from small repeated actions rather than waiting until you feel 100% fearless.',
      ta: 'கல்வி முடித்தவர்கள் அல்லது குடும்பத்திற்காகப் பணி இடைவெளி எடுத்த பெண்கள் மீண்டும் பணியைத் தொடங்கும்போது தயக்கம் ஏற்படுவது இயல்பு. சிறிய தொடர் முயற்சிகளே தன்னம்பிக்கையைத் தரும்.'
    },
    selfCare: {
      en: [
        'Maintain a private "Wins & Skills Notebook" listing every task or responsibility you handle well.',
        'Reframe career breaks honestly—caregiving and crisis management build real organization and resilience.',
        'Practice speaking through interview or workplace scenarios with a HerSpace Listener or Counsellor.'
      ],
      ta: [
        'உங்கள் திறமைகள் மற்றும் சிறிய வெற்றிகளை ஒரு குறிப்பேட்டில் எழுதி வையுங்கள்.',
        'நேர்காணல் அல்லது பணியிடத் தயக்கங்களைப் போக்க HerSpace ஆலோசகரிடம் பேசிப் பயிற்சி பெறுங்கள்.'
      ]
    },
    redFlags: {
      en: [
        'Severe performance anxiety causing panic or total avoidance of career opportunities.'
      ],
      ta: [
        'தீவிரப் பதற்றத்தால் வாய்ப்புகளைத் தொடர்ந்து தவிர்த்தல்.'
      ]
    },
    whenToSeekCare: {
      en: 'Book a Guidance & Clarity session on HerSpace to work through career transitions with an empathetic professional.',
      ta: 'தொழில் வழிகாட்டல் மற்றும் மனத் தெளிவிற்கு HerSpace ஆலோசகரை முன்பதிவு செய்யுங்கள்.'
    }
  },
  {
    id: 'wb_15_ask_doctor',
    categoryId: 'cat_reproductive',
    categoryCode: 'F',
    synonyms: ['doctor', 'gynaecologist', 'shy', 'embarrassed', 'intimate concern', 'மருத்துவர்', 'தயக்கம்', 'ஆலோசனை'],
    lastReviewedDate: '2026-10-15',
    editorialStage: 'Published',
    reviewBadgeEn: 'Approved Educational Content · Patient Advocacy',
    reviewBadgeTa: 'அங்கீகரிக்கப்பட்ட கல்வித் தகவல் · நோயாளி உரிமை வழிகாட்டி',
    sources: ['WHO Respectful Women’s Healthcare Charter', 'FOGSI Patient Empowerment'],
    relatedIds: ['wb_04_intimate_cleaning', 'wb_05_unusual_discharge'],
    title: {
      en: 'How can I ask a doctor about an intimate concern without embarrassment?',
      ta: 'அந்தரங்க நலக் கவலைகளைத் தயக்கமின்றி மருத்துவரிடம் கேட்பது எப்படி?'
    },
    shortAnswer: {
      en: 'Write down your symptoms, timeline, and 3 main questions on your phone before the appointment. Remember that doctors hear intimate health questions every single day, and you have the right to respectful, non-judgmental care.',
      ta: 'மருத்துவரைச் சந்திக்கும் முன்பே உங்கள் அறிகுறிகள், நாட்கள் மற்றும் 3 முக்கியக் கேள்விகளைத் தொலைபேசியில் குறித்துச் செல்லுங்கள். மருத்துவர்களிடம் தயக்கமின்றிப் பேசுவதும் மரியாதையான சிகிச்சையைப் பெறுவதும் உங்கள் அடிப்படை உரிமை.'
    },
    explanation: {
      en: 'Many women delay medical care for months due to shyness or fear of being judged—especially if unmarried, postmenopausal, or transgender. Preparing clear factual notes helps you communicate calmly even if you feel nervous in the clinic.',
      ta: 'கூச்சம் அல்லது தயக்கம் காரணமாகப் பல பெண்கள் மருத்துவ ஆலோசனையைத் தள்ளிப்போடுகிறார்கள். அறிகுறிகளைத் தெளிவாகக் குறித்துச் செல்வது பதற்றத்தைக் குறைக்க உதவும்.'
    },
    selfCare: {
      en: [
        'Note 4 facts before visiting: (1) When did the symptom start? (2) Date of last period (if applicable), (3) What makes it better or worse? (4) Any medications taken.',
        'If talking feels hard, you can hand your written phone note directly to the doctor.',
        'You always have the right to ask for a female attendant/chaperone during a physical examination.'
      ],
      ta: [
        'அறிகுறி எப்போது தொடங்கியது, கடைசி மாதவிடாய் தேதி, என்னென்ன சிரமங்கள் உள்ளன என்பதைக் குறித்து வைத்துக் கொள்ளுங்கள்.',
        'பேசத் தயக்கமாக இருந்தால் நீங்கள் எழுதி வைத்த குறிப்பை மருத்துவரிடம் காட்டலாம்.',
        'பரிசோதனையின் போது பெண் செவிலியர் உடனிருக்கக் கோருவது உங்கள் உரிமை.'
      ]
    },
    redFlags: {
      en: [
        'Delaying urgent symptoms (lumps, unexplained bleeding, severe pelvic pain) out of embarrassment.'
      ],
      ta: [
        'கூச்சத்தின் காரணமாகக் கட்டி, அதிக உதிரப்போக்கு அல்லது தீவிர வலியை மறைத்து வைத்தல்.'
      ]
    },
    whenToSeekCare: {
      en: 'If you feel anxious before a medical visit, speak with a HerSpace Listener or Counsellor to rehearse your questions calmly.',
      ta: 'மருத்துவரைச் சந்திக்கும் முன் பதற்றமாக இருந்தால் HerSpace கவனிப்பாளரிடம் பேசித் தெளிவு பெறலாம்.'
    }
  },
  {
    id: 'wb_16_transgender_wellbeing',
    categoryId: 'cat_transgender',
    categoryCode: 'K',
    synonyms: ['transgender', 'trans woman', 'thirunangai', 'hormone', 'affirming', 'திருநங்கை', 'திருநங்கைகள் நலம்'],
    lastReviewedDate: '2026-10-15',
    editorialStage: 'Published',
    reviewBadgeEn: 'Approved Educational Content · Inclusive Care',
    reviewBadgeTa: 'அங்கீகரிக்கப்பட்ட கல்வித் தகவல் · திருநங்கைகள் நல ஆதரவு',
    sources: ['WHO Gender-Affirming Health Guidance', 'ICMR / NACO Transgender Health Modules', 'Tamil Nadu Transgender Welfare Board Resources'],
    relatedIds: ['wb_08_loneliness', 'wb_15_ask_doctor'],
    title: {
      en: 'Affirming emotional & health support for transgender women',
      ta: 'திருநங்கைகளுக்கான மரியாதையான மனநல மற்றும் ஆரோக்கிய வழிகாட்டல்'
    },
    shortAnswer: {
      en: 'HerSpace warmly welcomes transgender women aged 18+. Every body and journey is unique—our platform never forces menstrual tracking, respects your chosen name and pronouns, and connects you with verified, non-judgmental listeners and counsellors.',
      ta: '18 வயதுக்கு மேற்பட்ட திருநங்கைகளை HerSpace அன்புடன் வரவேற்கிறது. ஒவ்வொருவரின் உடல் மற்றும் வாழ்க்கைப் பயணம் தனித்துவமானது. எவ்விதத் தீர்ப்புமின்றி உங்கள் உணர்வுகளைப் பகிர்ந்துகொள்ள எங்கள் கவனிப்பாளர்களும் ஆலோசகர்களும் தயாராக உள்ளனர்.'
    },
    explanation: {
      en: 'Transgender women often navigate social stigma, family rejection, workplace discrimination, and barriers to respectful healthcare. If you use gender-affirming hormone therapy (GAHT), it should always be monitored safely by a qualified endocrinologist rather than self-medicated, alongside emotional support that affirms your dignity.',
      ta: 'சமூக அழுத்தங்கள், குடும்பப் பிரிவு மற்றும் பணியிடச் சவால்களைக் கையாள பாதுகாப்பான மனநல ஆதரவு அவசியம். ஹார்மோன் சிகிச்சை (GAHT) எடுத்துக்கொள்பவர்கள் சுய மருத்துவம் செய்யாமல் தகுதியான நாளமில்லாச் சுரப்பி மருத்துவரின் (Endocrinologist) கண்காணிப்பில் மட்டுமே மேற்கொள்ள வேண்டும்.'
    },
    selfCare: {
      en: [
        'Use your preferred name and pronouns on HerSpace—your privacy and phone number are 100% masked.',
        'Never take unprescribed hormone dosages from informal sources; regular liver and lipid checkups with an affirming doctor protect your long-term health.',
        'Connect with a HerSpace Listener (first 30-min session ₹0) or Counsellor whenever you need a safe, affirming space.'
      ],
      ta: [
        'HerSpace-ல் உங்கள் விருப்பப் பெயரைப் பயன்படுத்தலாம்; உங்கள் தொலைபேசி எண் 100% மறைக்கப்பட்டுப் பாதுகாக்கப்படும்.',
        'மருத்துவர் பரிந்துரையின்றி ஹார்மோன் மருந்துகளைப் பயன்படுத்த வேண்டாம்.',
        'எப்போது வேண்டுமானாலும் HerSpace கவனிப்பாளர் அல்லது ஆலோசகரிடம் மனம் விட்டுப் பேசலாம்.'
      ]
    },
    redFlags: {
      en: [
        'Severe leg swelling, chest pain, or shortness of breath (especially if taking estrogen without supervision).',
        'Acute emotional distress, isolation, or thoughts of self-harm.'
      ],
      ta: [
        'கால் வீக்கம், நெஞ்சு வலி அல்லது மூச்சுத் திணறல்.',
        'தீவிரத் தனிமை அல்லது மன உளைச்சல்.'
      ]
    },
    whenToSeekCare: {
      en: 'Book a verified HerSpace Listener or Counsellor for affirming support, or reach out to Tele-MANAS (14416) / emergency services (112) in urgent distress.',
      ta: 'பாதுகாப்பான மனநல ஆதரவிற்கு HerSpace வல்லுநர்களை முன்பதிவு செய்யுங்கள்; அவசர உதவிக்கு 14416 அல்லது 112 ஐ அழைக்கவும்.'
    }
  }
];

/**
 * HerSpace Wellbeing Search & Filter Engine
 * Supports English, Tamil Unicode, Tamil transliterations, and category filtering.
 */
window.HerSpaceWellbeingEngine = {
  getCategories: function() {
    return window.HERSPACE_WELLBEING_CATEGORIES;
  },

  getArticleById: function(id) {
    return window.HERSPACE_WELLBEING_ARTICLES.find(function(a) { return a.id === id; }) || null;
  },

  search: function(query, categoryId) {
    const q = (query || '').trim().toLowerCase();
    const cat = categoryId && categoryId !== 'all' ? categoryId : null;

    const matched = window.HERSPACE_WELLBEING_ARTICLES.filter(function(article) {
      if (cat && article.categoryId !== cat) return false;
      if (!q) return true;

      const haystack = [
        article.title.en,
        article.title.ta,
        article.shortAnswer.en,
        article.shortAnswer.ta,
        article.explanation.en,
        article.explanation.ta,
        (article.synonyms || []).join(' ')
      ].join(' ').toLowerCase();

      if (haystack.indexOf(q) !== -1) return true;
      const tokens = q.split(/\s+/).filter(function(t) { return t.length >= 2; });
      if (tokens.length === 0) return true;
      return tokens.some(function(tok) { return haystack.indexOf(tok) !== -1; });
    });

    if (!q) return matched;

    // Rank title and synonym matches first for best search relevance
    return matched.slice().sort(function(a, b) {
      const aTitle = (a.title.en + ' ' + a.title.ta).toLowerCase().indexOf(q) !== -1 ? 2 : 0;
      const bTitle = (b.title.en + ' ' + b.title.ta).toLowerCase().indexOf(q) !== -1 ? 2 : 0;
      return bTitle - aTitle;
    });
  }
};

/**
 * HerSpace Optional Menstrual Cycle Calculation Engine ("My Cycle")
 * Strictly opt-in, privacy-isolated, and non-diagnostic.
 */
window.HerSpaceCycleEngine = {
  getDemoLogs: function() {
    // Realistic 3-month demonstration dataset relative to current date
    const now = new Date();
    const d1 = new Date(now.getTime() - (14 * 86400000));
    const d1End = new Date(d1.getTime() + (4 * 86400000));
    const d2 = new Date(d1.getTime() - (29 * 86400000));
    const d2End = new Date(d2.getTime() + (4 * 86400000));
    const d3 = new Date(d2.getTime() - (28 * 86400000));
    const d3End = new Date(d3.getTime() + (5 * 86400000));

    const fmt = function(d) { return d.toISOString().split('T')[0]; };

    return [
      {
        id: 'cyc_demo_1',
        startDate: fmt(d1),
        endDate: fmt(d1End),
        flow: 'medium',
        symptoms: ['Mild Cramps', 'Fatigue'],
        mood: 'Calm / Reflective',
        notes: 'Warm ginger tea and early rest helped on Day 1.'
      },
      {
        id: 'cyc_demo_2',
        startDate: fmt(d2),
        endDate: fmt(d2End),
        flow: 'medium',
        symptoms: ['Lower Back Ache', 'Bloating'],
        mood: 'Sensitive',
        notes: '29-day interval observed.'
      },
      {
        id: 'cyc_demo_3',
        startDate: fmt(d3),
        endDate: fmt(d3End),
        flow: 'heavy',
        symptoms: ['Cramps', 'Headache'],
        mood: 'Tired',
        notes: 'Included murungai keerai and dates this week.'
      }
    ];
  },

  calculateSummary: function(logs) {
    if (!Array.isArray(logs) || logs.length === 0) {
      return {
        totalLogged: 0,
        avgIntervalDays: null,
        avgDurationDays: null,
        nextPeriodEstimate: null,
        irregularityNotice: false
      };
    }

    // Sort descending by startDate
    const sorted = logs.slice().sort(function(a, b) {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });

    // Calculate intervals between consecutive start dates
    const intervals = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      const curr = new Date(sorted[i].startDate).getTime();
      const prev = new Date(sorted[i + 1].startDate).getTime();
      const diffDays = Math.round((curr - prev) / 86400000);
      if (diffDays >= 14 && diffDays <= 90) {
        intervals.push(diffDays);
      }
    }

    // Calculate period duration
    const durations = [];
    sorted.forEach(function(entry) {
      if (entry.startDate && entry.endDate) {
        const s = new Date(entry.startDate).getTime();
        const e = new Date(entry.endDate).getTime();
        const d = Math.round((e - s) / 86400000) + 1;
        if (d >= 1 && d <= 15) durations.push(d);
      }
    });

    const avgInterval = intervals.length > 0
      ? Math.round(intervals.reduce(function(a, b) { return a + b; }, 0) / intervals.length)
      : 28; // Default reference when only 1 entry exists

    const avgDuration = durations.length > 0
      ? Math.round(durations.reduce(function(a, b) { return a + b; }, 0) / durations.length)
      : 5;

    const latestStart = new Date(sorted[0].startDate);
    const nextEstDate = new Date(latestStart.getTime() + (avgInterval * 86400000));
    const nextPeriodEstimate = nextEstDate.toISOString().split('T')[0];

    const irregularityNotice = intervals.some(function(iv) { return iv < 21 || iv > 35; });

    return {
      totalLogged: sorted.length,
      avgIntervalDays: avgInterval,
      avgDurationDays: avgDuration,
      nextPeriodEstimate: nextPeriodEstimate,
      latestStartDate: sorted[0].startDate,
      irregularityNotice: irregularityNotice
    };
  }
};

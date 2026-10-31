import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HERSPACE_CONFIG } from '../data/config';

// -----------------------------------------------------------------------------------------------
// 1. REGISTRATION VIEW ('onb-register')
// -----------------------------------------------------------------------------------------------
export const RegisterView: React.FC = () => {
  const {
    t,
    isTa,
    sendPhoneOtp,
    verifyOtpAndRegister,
    navigate
  } = useApp();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState<number>(24);
  const [identity, setIdentity] = useState<'woman' | 'trans_woman'>('woman');
  const [otp, setOtp] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [demoCode, setDemoCode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Field-specific validation errors placed DIRECTLY underneath corresponding input fields
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSendCode = () => {
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 10) {
      setErrors(prev => ({
        ...prev,
        phone: isTa ? 'தயவுசெய்து சரியான 10-இலக்க மொபைல் எண்ணை உள்ளிடவும்.' : 'Please enter a valid 10-digit mobile number.'
      }));
      return;
    }

    setErrors(prev => {
      const next = { ...prev };
      delete next.phone;
      return next;
    });

    try {
      const res = sendPhoneOtp(phone);
      setCodeSent(true);
      setDemoCode(res.demoOtp);
      setOtp(res.demoOtp); // auto-fill in demo mode for convenience
    } catch (err: any) {
      setErrors(prev => ({ ...prev, phone: err.message }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = isTa ? 'உங்கள் பெயரை உள்ளிடவும்.' : 'Please enter your name or preferred alias.';
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      newErrors.phone = isTa ? '10-இலக்க மொபைல் எண்ணை உள்ளிடவும்.' : 'Please enter a valid 10-digit mobile number.';
    }

    if (!codeSent) {
      newErrors.phone = isTa ? 'முதலில் குறியீட்டை அனுப்பவும்.' : 'Please send the verification code first.';
    } else if (!otp.trim()) {
      newErrors.otp = isTa ? 'மொபைல் குறியீட்டை உள்ளிடவும்.' : 'Please enter the mobile code.';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      newErrors.email = isTa ? 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.' : 'Please enter a valid email address.';
    }

    if (password && password.length < 8) {
      newErrors.password = isTa ? 'கடவுச்சொல் குறைந்தது 8 எழுத்துக்கள் இருக்க வேண்டும்.' : 'Password must be at least 8 characters.';
    }

    if (isNaN(age) || age < 18) {
      newErrors.age = isTa ? '18 வயது அல்லது அதற்கு மேற்பட்ட பெண்களுக்கு மட்டுமே.' : 'HerSpace is strictly for women and transgender women aged 18+.';
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = isTa ? 'விதிமுறைகளை ஏற்க வேண்டும்.' : 'You must confirm eligibility and accept the Terms to proceed.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await verifyOtpAndRegister({
        fullName,
        phone,
        email,
        age,
        identity,
        otp,
        agreeTerms
      });
    } catch (err: any) {
      // If error relates to specific field, assign accordingly
      const msg = err.message || '';
      if (msg.toLowerCase().includes('otp') || msg.toLowerCase().includes('code')) {
        setErrors(prev => ({ ...prev, otp: msg }));
      } else if (msg.toLowerCase().includes('phone') || msg.toLowerCase().includes('mobile')) {
        setErrors(prev => ({ ...prev, phone: msg }));
      } else {
        setErrors(prev => ({ ...prev, general: msg }));
      }
    }
  };

  return (
    <section className="onb-page">
      <div className="container onb-narrow">
        <h1 className="onb-title">{t('regTitle')}</h1>
        <p className="onb-sub">{t('regSub')}</p>

        <form className="onb-card" onSubmit={handleSubmit} noValidate>
          {/* General error if any */}
          {errors.general && (
            <div className="form-field-error" style={{ marginBottom: '16px' }}>
              <span className="error-icon">⚠️</span>
              <span style={{ color: '#b91c1c', fontWeight: 600 }}>{errors.general}</span>
            </div>
          )}

          {/* 1. Name Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="regNameInput">{t('fldName')}</label>
            <input
              id="regNameInput"
              className="form-control"
              type="text"
              autoComplete="name"
              placeholder="Ananya"
              value={fullName}
              onChange={e => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors(prev => { const n = { ...prev }; delete n.fullName; return n; });
              }}
              required
            />
            {/* Validation message directly underneath field with solid, readable color and proper padding */}
            {errors.fullName && (
              <div className="form-field-error">
                <span className="error-icon">⚠️</span>
                <span style={{ color: '#b91c1c', fontWeight: 600 }}>{errors.fullName}</span>
              </div>
            )}
          </div>

          {/* 2. Phone Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="regPhoneInput">{t('fldPhone')}</label>
            <div className="onb-inline">
              <input
                id="regPhoneInput"
                className="form-control"
                type="tel"
                placeholder="98765 43210"
                value={phone}
                onChange={e => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors(prev => { const n = { ...prev }; delete n.phone; return n; });
                }}
                required
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleSendCode}
                style={{ whiteSpace: 'nowrap' }}
              >
                {t('btnSendCode')}
              </button>
            </div>

            {/* Validation message directly underneath phone input */}
            {errors.phone && (
              <div className="form-field-error">
                <span className="error-icon">⚠️</span>
                <span style={{ color: '#b91c1c', fontWeight: 600 }}>{errors.phone}</span>
              </div>
            )}

            {/* OTP Demo Banner & Input */}
            {codeSent && (
              <div style={{ marginTop: '12px' }}>
                <div className="onb-notice onb-notice-warn">
                  {t('otpTestBanner')}{' '}
                  <strong style={{ color: '#78350F' }}>
                    Demo Code: {demoCode} (Auto-filled)
                  </strong>
                </div>

                <label className="form-label" htmlFor="regOtpInput" style={{ marginTop: '10px' }}>
                  {t('fldOtp')}
                </label>
                <input
                  id="regOtpInput"
                  className="form-control"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={e => {
                    setOtp(e.target.value);
                    if (errors.otp) setErrors(prev => { const n = { ...prev }; delete n.otp; return n; });
                  }}
                />

                {/* Validation message directly underneath OTP input */}
                {errors.otp && (
                  <div className="form-field-error">
                    <span className="error-icon">⚠️</span>
                    <span style={{ color: '#b91c1c', fontWeight: 600 }}>{errors.otp}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Email Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="regEmailInput">{t('fldEmail')}</label>
            <input
              id="regEmailInput"
              className="form-control"
              type="email"
              autoComplete="email"
              placeholder="ananya@example.com"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => { const n = { ...prev }; delete n.email; return n; });
              }}
            />
            {errors.email ? (
              <div className="form-field-error">
                <span className="error-icon">⚠️</span>
                <span style={{ color: '#b91c1c', fontWeight: 600 }}>{errors.email}</span>
              </div>
            ) : (
              <div className="form-hint">Private notifications and booking receipts (optional).</div>
            )}
          </div>

          {/* 4. Password Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="regPasswordInput">Password (Optional / 8+ characters)</label>
            <input
              id="regPasswordInput"
              className="form-control"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => { const n = { ...prev }; delete n.password; return n; });
              }}
            />
            {errors.password && (
              <div className="form-field-error">
                <span className="error-icon">⚠️</span>
                <span style={{ color: '#b91c1c', fontWeight: 600 }}>{errors.password}</span>
              </div>
            )}
          </div>

          {/* 5. Age & Identity */}
          <div className="onb-two">
            <div className="form-group">
              <label className="form-label" htmlFor="regAgeInput">{t('fldAge')}</label>
              <input
                id="regAgeInput"
                className="form-control"
                type="number"
                min={18}
                max={100}
                value={age}
                onChange={e => {
                  setAge(parseInt(e.target.value, 10));
                  if (errors.age) setErrors(prev => { const n = { ...prev }; delete n.age; return n; });
                }}
                required
              />
              {errors.age && (
                <div className="form-field-error">
                  <span className="error-icon">⚠️</span>
                  <span style={{ color: '#b91c1c', fontWeight: 600 }}>{errors.age}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="regIdentitySelect">{t('fldIdentity')}</label>
              <select
                id="regIdentitySelect"
                className="form-control"
                value={identity}
                onChange={e => setIdentity(e.target.value as any)}
              >
                <option value="woman">{t('optWomanLabel')}</option>
                <option value="trans_woman">{t('optTransWomanLabel')}</option>
              </select>
            </div>
          </div>

          {/* 6. Terms Checkbox */}
          <div className="form-check onb-consent">
            <input
              id="regAgreeCheckbox"
              type="checkbox"
              checked={agreeTerms}
              onChange={e => {
                setAgreeTerms(e.target.checked);
                if (errors.agreeTerms) setErrors(prev => { const n = { ...prev }; delete n.agreeTerms; return n; });
              }}
            />
            <label htmlFor="regAgreeCheckbox">
              <span>{t('regConsent')}</span>
            </label>
          </div>
          {errors.agreeTerms && (
            <div className="form-field-error" style={{ marginBottom: '14px' }}>
              <span className="error-icon">⚠️</span>
              <span style={{ color: '#b91c1c', fontWeight: 600 }}>{errors.agreeTerms}</span>
            </div>
          )}

          {/* 3. Main button text cleanly reads "Create Account" */}
          <button type="submit" className="btn btn-primary btn-lg btn-block" id="regSubmit">
            Create Account
          </button>
        </form>

        <p className="onb-alt">
          {t('regHaveAccount')}{' '}
          <a
            href="#signin"
            onClick={e => {
              e.preventDefault();
              navigate('signin');
            }}
          >
            {t('btnSignInShort')}
          </a>
        </p>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------------------------
// 2. APP TOUR VIEW ('onb-tour')
// -----------------------------------------------------------------------------------------------
export const TourView: React.FC = () => {
  const { t, isTa, updateOnboardingStep, navigate } = useApp();
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: t('tourS1Title'),
      body: t('tourS1Body'),
      image: HERSPACE_CONFIG.images.heroSunrise
    },
    {
      title: t('tourS2Title'),
      body: t('tourS2Body'),
      image: HERSPACE_CONFIG.images.calmCup
    },
    {
      title: t('tourS3Title'),
      body: t('tourS3Body'),
      image: HERSPACE_CONFIG.images.reflectionOutdoor
    }
  ];

  const curr = slides[slide];

  const handleNext = () => {
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    } else {
      updateOnboardingStep('membership');
      navigate('onb-membership');
    }
  };

  const handleSkip = () => {
    updateOnboardingStep('membership');
    navigate('onb-membership');
  };

  return (
    <section className="onb-page">
      <div className="container onb-narrow">
        <div className="onb-tour-progress">
          {t('stepOf', { n: slide + 1 })}
        </div>
        <h1 className="onb-title onb-title-sm">{curr.title}</h1>

        <div className="onb-card" style={{ padding: '20px' }}>
          <div className="onb-tour-image">
            <img src={curr.image} alt={curr.title} />
          </div>

          <p style={{ fontSize: '0.94rem', lineHeight: 1.6, color: 'var(--color-text-body)', marginBottom: '18px' }}>
            {curr.body}
          </p>

          <div className="onb-dots">
            {slides.map((_, i) => (
              <span key={i} className={i === slide ? 'on' : ''}></span>
            ))}
          </div>

          <div className="onb-actions">
            <button className="btn btn-outline" onClick={handleSkip}>
              {t('btnSkipTour')}
            </button>
            <button className="btn btn-primary" onClick={handleNext}>
              {slide === slides.length - 1 ? t('btnFinishTour') : t('btnNext')} →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------------------------
// 3. MEMBERSHIP CONFIRMATION VIEW ('onb-membership')
// -----------------------------------------------------------------------------------------------
export const MembershipView: React.FC = () => {
  const { t, updateOnboardingStep, navigate } = useApp();
  const [autoRenew, setAutoRenew] = useState(false);

  const trialEndFormatted = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleContinue = () => {
    updateOnboardingStep('book');
    navigate('onb-book');
  };

  return (
    <section className="onb-page">
      <div className="container onb-narrow">
        <h1 className="onb-title">{t('memTitle')}</h1>
        <p className="onb-sub">{t('memSub')}</p>

        <div className="onb-card onb-mem">
          <div className="onb-mem-hero">
            <span className="badge" style={{ background: 'rgba(255,255,255,0.25)', color: '#FFF', marginBottom: '8px' }}>
              ENROLMENT BENEFIT
            </span>
            <h2 style={{ fontSize: '1.4rem', margin: '4px 0 6px', color: '#FFF' }}>{t('memCard1Title')}</h2>
            <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.95)', marginBottom: '8px' }}>{t('memCard1Desc')}</p>
            <div style={{ fontSize: '0.82rem', background: 'rgba(255,255,255,0.18)', padding: '6px 12px', borderRadius: '8px', display: 'inline-block' }}>
              🗓️ Free trial valid through: <strong>{trialEndFormatted}</strong>
            </div>
          </div>

          <div style={{ background: 'var(--color-bg-lavender)', border: '1px solid var(--color-lavender-soft)', padding: '16px', borderRadius: '12px' }}>
            <span className="badge badge-pink" style={{ marginBottom: '6px' }}>VALID FOR 7 DAYS</span>
            <h3 style={{ fontSize: '1.2rem', margin: '4px 0 4px', color: 'var(--color-primary-dark)' }}>{t('memCard2Title')}</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-muted)', margin: 0 }}>{t('memCard2Desc')}</p>
          </div>

          <div className="form-check" style={{ marginTop: '8px' }}>
            <input
              id="chkAutoRenew"
              type="checkbox"
              checked={autoRenew}
              onChange={e => setAutoRenew(e.target.checked)}
            />
            <label htmlFor="chkAutoRenew" style={{ fontSize: '0.82rem' }}>
              {t('memToggleAutoRenew')}
            </label>
          </div>

          <button className="btn btn-primary btn-lg btn-block" onClick={handleContinue}>
            {t('btnContinueToBook')}
          </button>
        </div>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------------------------
// 4. CHOOSE SERVICE & BOOK STEP ('onb-book')
// -----------------------------------------------------------------------------------------------
export const BookStepView: React.FC = () => {
  const { t, isTa, experts, singers, updateOnboardingStep, navigate, setBookingModalExpert } = useApp();
  const [hubTab, setHubTab] = useState<'listener' | 'counsellor' | 'singer'>('listener');

  const finishToSpace = () => {
    updateOnboardingStep('book', true);
    navigate('space');
  };

  return (
    <section className="onb-page onb-page-wide">
      <div className="container">
        <div style={{ maxWidth: '640px', margin: '0 auto 20px', textAlign: 'center' }}>
          <h1 className="onb-title">{isTa ? 'ஆதரவு முறையைத் தேர்வு செய்து முன்பதிவு செய்யுங்கள்' : 'Choose Your First Care Session'}</h1>
          <p className="onb-sub">
            {isTa ? 'உங்கள் தேவைகளுக்கு ஏற்ற ஆதரவைத் தேர்வு செய்யவும்.' : 'Your free trial includes 1 complimentary 30-min Trained Listener call.'}
          </p>

          <div className="service-tabs" style={{ maxWidth: '480px', margin: '0 auto 20px' }}>
            <button
              className={`service-tab ${hubTab === 'listener' ? 'active' : ''}`}
              onClick={() => setHubTab('listener')}
            >
              Trained Listeners (₹399)
            </button>
            <button
              className={`service-tab ${hubTab === 'counsellor' ? 'active' : ''}`}
              onClick={() => setHubTab('counsellor')}
            >
              Counsellors (₹999)
            </button>
            <button
              className={`service-tab ${hubTab === 'singer' ? 'active' : ''}`}
              onClick={() => setHubTab('singer')}
            >
              Live Melodies
            </button>
          </div>
        </div>

        {/* Directory for selected category */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '20px', maxWidth: '960px', margin: '0 auto 24px' }}>
          {hubTab === 'singer'
            ? singers.map(s => (
                <div key={s.id} className="expert-card">
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem' }}>{isTa && s.nameTa ? s.nameTa : s.name}</h3>
                    <div style={{ fontSize: '0.84rem', color: 'var(--color-primary)' }}>{s.qualification}</div>
                    <p className="expert-bio">{isTa && s.bioTa ? s.bioTa : s.bioEn}</p>
                  </div>
                  <button className="btn btn-primary btn-block" onClick={() => { setBookingModalExpert(s); finishToSpace(); }}>
                    Schedule Melody →
                  </button>
                </div>
              ))
            : experts.filter(e => e.role === hubTab).map(exp => (
                <div key={exp.id} className="expert-card">
                  <div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
                      <img src={exp.avatar} alt={exp.name} className="expert-avatar" />
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{isTa && exp.nameTa ? exp.nameTa : exp.name}</h3>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)' }}>{exp.qualification}</div>
                      </div>
                    </div>
                    <p className="expert-bio">{isTa && exp.bioTa ? exp.bioTa : exp.bio}</p>
                  </div>
                  <button className="btn btn-primary btn-block" onClick={() => { setBookingModalExpert(exp); finishToSpace(); }}>
                    {exp.role === 'listener' ? 'Book with Free Voucher (₹0)' : 'Book Session →'}
                  </button>
                </div>
              ))}
        </div>

        <div className="onb-later">
          <button className="btn btn-outline" onClick={finishToSpace}>
            I’ll book later — Go to My Personal Space →
          </button>
        </div>
      </div>
    </section>
  );
};

// -----------------------------------------------------------------------------------------------
// 5. SIGN IN VIEW ('signin')
// -----------------------------------------------------------------------------------------------
export const SigninView: React.FC = () => {
  const { t, isTa, sendPhoneOtp, verifyOtpAndSignIn, navigate } = useApp();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [demoCode, setDemoCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSendCode = () => {
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 10) {
      setErrors({ phone: isTa ? '10-இலக்க மொபைல் எண்ணை உள்ளிடவும்.' : 'Please enter a valid 10-digit mobile number.' });
      return;
    }
    setErrors({});
    try {
      const res = sendPhoneOtp(phone);
      setCodeSent(true);
      setDemoCode(res.demoOtp);
      setOtp(res.demoOtp);
    } catch (err: any) {
      setErrors({ phone: err.message });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.replace(/\D/g, '')) {
      setErrors({ phone: 'Please enter your mobile number.' });
      return;
    }
    if (!otp.trim()) {
      setErrors({ otp: 'Please enter the code sent to your phone.' });
      return;
    }

    try {
      await verifyOtpAndSignIn(phone, otp);
    } catch (err: any) {
      setErrors({ otp: err.message });
    }
  };

  return (
    <section className="onb-page">
      <div className="container onb-narrow">
        <h1 className="onb-title">{t('signinTitle')}</h1>
        <p className="onb-sub">{t('signinSub')}</p>

        <form className="onb-card" onSubmit={handleSignIn} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="siPhone">{t('fldPhone')}</label>
            <div className="onb-inline">
              <input
                id="siPhone"
                className="form-control"
                type="tel"
                placeholder="98765 43210"
                value={phone}
                onChange={e => {
                  setPhone(e.target.value);
                  setErrors({});
                }}
                required
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleSendCode}
                style={{ whiteSpace: 'nowrap' }}
              >
                {t('btnSendCode')}
              </button>
            </div>

            {errors.phone && (
              <div className="form-field-error">
                <span className="error-icon">⚠️</span>
                <span style={{ color: '#b91c1c', fontWeight: 600 }}>{errors.phone}</span>
              </div>
            )}
          </div>

          {codeSent && (
            <div className="form-group">
              <div className="onb-notice onb-notice-warn">
                Demo Code: <strong style={{ color: '#78350F' }}>{demoCode}</strong>
              </div>
              <label className="form-label" htmlFor="siOtp">{t('fldOtp')}</label>
              <input
                id="siOtp"
                className="form-control"
                type="text"
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={e => {
                  setOtp(e.target.value);
                  setErrors({});
                }}
                required
              />

              {errors.otp && (
                <div className="form-field-error">
                  <span className="error-icon">⚠️</span>
                  <span style={{ color: '#b91c1c', fontWeight: 600 }}>{errors.otp}</span>
                </div>
              )}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg btn-block" style={{ marginTop: '16px' }}>
            {t('signinSubmit')}
          </button>
        </form>

        <p className="onb-alt">
          {t('signinNew')}{' '}
          <a
            href="#register"
            onClick={e => {
              e.preventDefault();
              navigate('onb-register');
            }}
          >
            Create Account
          </a>
        </p>
      </div>
    </section>
  );
};

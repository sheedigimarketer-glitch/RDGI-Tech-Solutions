import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WELLBEING_CATEGORIES, WELLBEING_ARTICLES } from '../data/wellbeingData';
import { WellbeingArticle } from '../types';

export const WellbeingView: React.FC = () => {
  const {
    isTa,
    savedArticleIds,
    toggleSaveArticle,
    submitPrivateQuestion
  } = useApp();

  const [activeTab, setActiveTab] = useState<'browse' | 'saved' | 'ask'>('browse');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<WellbeingArticle | null>(null);

  // Private question form state
  const [askCat, setAskCat] = useState('cat_periods');
  const [askQuestion, setAskQuestion] = useState('');

  const filteredArticles = WELLBEING_ARTICLES.filter(a => {
    if (activeTab === 'saved' && !savedArticleIds.includes(a.id)) return false;
    if (selectedCategory !== 'all' && a.categoryId !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.title.en.toLowerCase().includes(q) || a.title.ta.toLowerCase().includes(q);
      const matchSyn = a.synonyms.some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchSyn) return false;
    }
    return true;
  });

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuestion.trim()) return;
    submitPrivateQuestion(askCat, askQuestion);
    setAskQuestion('');
    setActiveTab('browse');
  };

  const getCategoryIconSvg = (code: string) => {
    switch (code) {
      case 'A':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        );
      case 'B':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        );
      case 'C':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          </svg>
        );
      case 'D':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        );
      case 'E':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
    }
  };

  return (
    <div className="container" style={{ padding: '36px 16px', maxWidth: '1080px' }}>
      <div className="section-header" style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 32px' }}>
        <div className="eyebrow">HOLISTIC WOMEN'S WELLBEING</div>
        <h2 style={{ fontSize: '2.1rem', letterSpacing: '-0.025em', margin: '8px 0 12px' }}>
          {isTa ? 'வாழ்க்கை & நலம் அறிவுப் பெட்டகம்' : "Women's Life & Wellbeing Knowledge Hub"}
        </h2>
        <p style={{ fontSize: '1.02rem', color: 'var(--color-ink-muted)', lineHeight: 1.6 }}>
          {isTa
            ? 'அறிவியல் பூர்வமான கல்வி வழிகாட்டல். 11 ஆரோக்கிய தலைப்புகளில் தமிழ் மற்றும் ஆங்கிலத்தில்.'
            : 'Culturally grounded, evidence-based health and emotional guidance in English & Tamil. Completely confidential.'}
        </p>
      </div>

      {/* Main Tabs */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '28px', flexWrap: 'wrap' }}>
        <button
          className={`btn btn-sm ${activeTab === 'browse' ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderRadius: '9999px', minWidth: '140px' }}
          onClick={() => { setActiveTab('browse'); setActiveArticle(null); }}
        >
          {isTa ? 'அனைத்து தலைப்புகள்' : 'Browse Topics'} ({WELLBEING_ARTICLES.length})
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'saved' ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderRadius: '9999px', minWidth: '150px' }}
          onClick={() => { setActiveTab('saved'); setActiveArticle(null); }}
        >
          ⭐ {isTa ? 'சேமிக்கப்பட்டவை' : 'Saved Bookmarks'} ({savedArticleIds.length})
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'ask' ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderRadius: '9999px', minWidth: '160px' }}
          onClick={() => { setActiveTab('ask'); setActiveArticle(null); }}
        >
          ✉️ {isTa ? 'ரகசியமாகக் கேள்' : 'Ask a Private Question'}
        </button>
      </div>

      {activeTab === 'ask' ? (
        <div className="card" style={{ maxWidth: '640px', margin: '0 auto', padding: '32px', borderRadius: '18px' }}>
          <h3 style={{ fontSize: '1.45rem', marginBottom: '8px', color: 'var(--color-text-dark)' }}>
            {isTa ? 'உங்கள் கேள்வியை ரகசியமாக சமர்ப்பிக்கவும்' : 'Submit a Private, Confidential Question'}
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
            {isTa
              ? 'உங்கள் அடையாளம் முற்றிலும் பாதுகாக்கப்படுகிறது. எங்கள் மருத்துவ வழிகாட்டல் குழு பரிசீலித்து கட்டுரையாக வெளியிடும்.'
              : 'Zero identity disclosure. Our health editorial panel reviews anonymous inquiries to create new educational guidance for the community.'}
          </p>

          <form onSubmit={handleAskSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="askCategorySelect">Topic Category</label>
              <select
                id="askCategorySelect"
                className="form-control"
                value={askCat}
                onChange={e => setAskCat(e.target.value)}
              >
                {WELLBEING_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>
                    {isTa ? c.ta : c.en}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="askQuestionTextarea">Your Question (English or தமிழ்)</label>
              <textarea
                id="askQuestionTextarea"
                className="form-control"
                rows={4}
                placeholder={isTa ? 'உங்கள் சந்தேகத்தை இங்கு பதிவிடவும்...' : 'Type your question respectfully here...'}
                value={askQuestion}
                onChange={e => setAskQuestion(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              {isTa ? 'கேள்வியை சமர்ப்பி' : 'Submit Private Question'} →
            </button>
          </form>
        </div>
      ) : activeArticle ? (
        /* Detailed Article View */
        <div className="card" style={{ maxWidth: '820px', margin: '0 auto', padding: '32px', borderRadius: '20px' }}>
          <button
            className="btn btn-sm btn-outline"
            style={{ marginBottom: '20px', borderRadius: '9999px' }}
            onClick={() => setActiveArticle(null)}
          >
            ← {isTa ? 'பின்செல்' : 'Back to Articles'}
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
            <div>
              <span className="badge badge-verified" style={{ marginBottom: '8px' }}>
                {isTa ? activeArticle.reviewBadgeTa : activeArticle.reviewBadgeEn}
              </span>
              <h2 style={{ fontSize: '1.75rem', margin: '8px 0 12px', color: 'var(--color-text-dark)' }}>
                {isTa ? activeArticle.title.ta : activeArticle.title.en}
              </h2>
            </div>

            <button
              className={`btn btn-sm ${savedArticleIds.includes(activeArticle.id) ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: '9999px' }}
              onClick={() => toggleSaveArticle(activeArticle.id)}
            >
              {savedArticleIds.includes(activeArticle.id) ? '★ Bookmarked' : '☆ Bookmark'}
            </button>
          </div>

          {/* Quick takeaway */}
          <div style={{ background: 'var(--color-bg-lavender)', padding: '18px 20px', borderRadius: '14px', margin: '20px 0', borderLeft: '4px solid var(--color-primary)' }}>
            <strong style={{ fontSize: '0.86rem', color: 'var(--color-primary-dark)', display: 'block', marginBottom: '4px' }}>
              {isTa ? 'சுருக்கமான பதில்:' : 'Quick Answer:'}
            </strong>
            <p style={{ margin: 0, fontSize: '0.96rem', lineHeight: 1.6 }}>
              {isTa ? activeArticle.shortAnswer.ta : activeArticle.shortAnswer.en}
            </p>
          </div>

          {/* Detailed explanation */}
          <h3 style={{ fontSize: '1.25rem', marginTop: '28px', marginBottom: '10px' }}>
            {isTa ? 'விளக்கம் & காரணங்கள்' : 'Detailed Medical Understanding'}
          </h3>
          <p style={{ fontSize: '0.96rem', lineHeight: 1.7, color: 'var(--color-text-body)' }}>
            {isTa ? activeArticle.explanation.ta : activeArticle.explanation.en}
          </p>

          {/* Self-care points */}
          <h3 style={{ fontSize: '1.25rem', marginTop: '28px', marginBottom: '10px' }}>
            {isTa ? 'சுயபராமரிப்பு மற்றும் எளிய வழிமுறைகள்' : 'Evidence-Based Self-Care'}
          </h3>
          <ul style={{ paddingLeft: '22px', lineHeight: 1.8, fontSize: '0.94rem' }}>
            {(isTa ? activeArticle.selfCare.ta : activeArticle.selfCare.en).map((pt, i) => (
              <li key={i}>{pt}</li>
            ))}
          </ul>

          {/* Red flags */}
          <div style={{ background: '#FFF5F5', border: '1px solid #FED7D7', borderRadius: '14px', padding: '18px 20px', margin: '24px 0' }}>
            <h4 style={{ color: '#C53030', margin: '0 0 8px 0', fontSize: '1.05rem' }}>
              ⚠️ {isTa ? 'எச்சரிக்கை அறிகுறிகள் (Red Flags)' : 'Warning Signs (When to See a Doctor Promptly)'}
            </h4>
            <ul style={{ paddingLeft: '20px', lineHeight: 1.7, fontSize: '0.9rem', margin: 0, color: '#742A2A' }}>
              {(isTa ? activeArticle.redFlags.ta : activeArticle.redFlags.en).map((rf, i) => (
                <li key={i}>{rf}</li>
              ))}
            </ul>
          </div>

          {/* When to seek care */}
          <div style={{ fontSize: '0.9rem', color: 'var(--color-ink-muted)', fontStyle: 'italic', marginTop: '16px' }}>
            {isTa ? activeArticle.whenToSeekCare.ta : activeArticle.whenToSeekCare.en}
          </div>
        </div>
      ) : (
        <>
          {/* Search bar */}
          <div style={{ maxWidth: '640px', margin: '0 auto 24px' }}>
            <input
              type="text"
              className="form-control"
              placeholder={isTa ? 'மாதவிடாய், மன அழுத்தம், உணவு தேடுக...' : 'Search by keyword (e.g. late period, pcos, cramps, sleep)...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem' }}
            />
          </div>

          {/* HORIZONTAL / RESPONSIVE TOPICS DISPLAY (NO VERTICAL TABS) */}
          <div style={{ marginBottom: '28px' }}>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '8px',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none'
              }}
            >
              <button
                type="button"
                className={`slot-btn ${selectedCategory === 'all' ? 'selected' : ''}`}
                style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  whiteSpace: 'nowrap',
                  fontWeight: 600,
                  fontSize: '0.86rem'
                }}
                onClick={() => setSelectedCategory('all')}
              >
                All Topics ({WELLBEING_ARTICLES.length})
              </button>
              {WELLBEING_CATEGORIES.map(c => {
                const isSelected = selectedCategory === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`slot-btn ${isSelected ? 'selected' : ''}`}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '9999px',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.86rem',
                      fontWeight: isSelected ? 700 : 500
                    }}
                    onClick={() => setSelectedCategory(c.id)}
                  >
                    <span style={{ color: isSelected ? '#FFF' : c.color }}>●</span>
                    <span>{c.code}. {isTa ? (c.ta.split('.')[1] || c.ta).trim() : (c.en.split('.')[1] || c.en).trim()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Responsive Article Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '22px' }}>
            {filteredArticles.map(art => {
              const cat = WELLBEING_CATEGORIES.find(c => c.id === art.categoryId) || WELLBEING_CATEGORIES[0];
              return (
                <div
                  key={art.id}
                  className="card wellbeing-card"
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '100%',
                    background: '#ffffff',
                    padding: '24px',
                    borderRadius: '18px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 12px 24px -4px rgba(0, 0, 0, 0.08)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                  onClick={() => setActiveArticle(art)}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: `${cat.color}15`,
                            color: cat.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {getCategoryIconSvg(cat.code)}
                        </div>
                        <span className="badge badge-lavender" style={{ fontWeight: 600 }}>
                          Category {art.categoryCode}
                        </span>
                      </div>

                      <button
                        className="header-icon-btn"
                        style={{ width: '32px', height: '32px', padding: 0 }}
                        onClick={e => {
                          e.stopPropagation();
                          toggleSaveArticle(art.id);
                        }}
                        title="Bookmark Article"
                      >
                        {savedArticleIds.includes(art.id) ? '⭐' : '☆'}
                      </button>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', lineHeight: 1.35, color: 'var(--color-text-dark)' }}>
                      {isTa ? art.title.ta : art.title.en}
                    </h3>

                    <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-muted)', lineHeight: 1.6, margin: 0 }}>
                      {isTa ? art.shortAnswer.ta.slice(0, 140) + '...' : art.shortAnswer.en.slice(0, 140) + '...'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '14px', borderTop: '0.5px solid var(--color-border)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-ink-muted)' }}>
                      WHO / FOGSI Standards
                    </span>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.88rem' }}>
                      {isTa ? 'மேலும் வாசிக்க →' : 'Read Article →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

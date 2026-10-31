import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CALM_TRACKS } from '../data/calmTracks';

export const CalmView: React.FC = () => {
  const {
    isTa,
    calmState,
    playCalmTrack,
    pauseCalmTrack,
    setSleepTimer,
    toggleCalmFavourite
  } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredTracks = CALM_TRACKS.filter(t => {
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    return true;
  });

  const activeTrack = CALM_TRACKS.find(t => t.id === calmState.activeTrackId) || CALM_TRACKS[0];

  return (
    <div className="container" style={{ padding: '28px 16px', maxWidth: '960px' }}>
      <div className="section-header">
        <div className="eyebrow">HERSPACE CALM AUDIO SANCTUARY</div>
        <h2>{isTa ? 'மன அமைதி மற்றும் தியான இசை' : 'HerSpace Calm Audio Sanctuary'}</h2>
        <p>
          {isTa
            ? 'மென்மையான தமிழ் மூச்சுப்பயிற்சி தியானம், கர்நாடக வீணை மற்றும் மழை ஒலிகள்.'
            : 'Gentle guided breathing meditations, Carnatic acoustic ragas, and soothing nature soundscapes.'}
        </p>
      </div>

      {/* Featured Player Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #2D1A4E 0%, #4E2E80 100%)',
          color: '#FFF',
          padding: '28px',
          marginBottom: '28px',
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <img
          src={activeTrack.artwork}
          alt={activeTrack.title.en}
          style={{ width: '110px', height: '110px', borderRadius: '16px', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)' }}
        />

        <div style={{ flex: '1 1 260px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#FFF' }}>
              {activeTrack.category.toUpperCase()} · {activeTrack.language}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#D8B4FE' }}>
              {activeTrack.baseFreq}Hz Harmonic Pad
            </span>
          </div>

          <h3 style={{ color: '#FFF', fontSize: '1.4rem', margin: '4px 0 6px' }}>
            {isTa ? activeTrack.title.ta : activeTrack.title.en}
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.5 }}>
            {isTa ? activeTrack.description.ta : activeTrack.description.en}
          </p>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
            {calmState.isPlaying ? (
              <button
                className="btn btn-primary"
                style={{ background: '#FFF', color: 'var(--color-primary-dark)' }}
                onClick={pauseCalmTrack}
              >
                ⏸ Pause Soundscape
              </button>
            ) : (
              <button
                className="btn btn-primary"
                style={{ background: '#FFF', color: 'var(--color-primary-dark)' }}
                onClick={() => playCalmTrack(activeTrack.id)}
              >
                ▶ Listen Now ({activeTrack.durationLabel})
              </button>
            )}

            {/* Sleep Timer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Sleep Timer:</span>
              <select
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: '#FFF',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '0.8rem'
                }}
                value={calmState.sleepTimerMinutes}
                onChange={e => setSleepTimer(parseInt(e.target.value, 10))}
              >
                <option value={0} style={{ color: '#000' }}>Off</option>
                <option value={5} style={{ color: '#000' }}>5 Minutes</option>
                <option value={10} style={{ color: '#000' }}>10 Minutes</option>
                <option value={15} style={{ color: '#000' }}>15 Minutes</option>
                <option value={30} style={{ color: '#000' }}>30 Minutes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          className={`slot-btn ${filterCategory === 'all' ? 'selected' : ''}`}
          onClick={() => setFilterCategory('all')}
        >
          All Tracks
        </button>
        <button
          className={`slot-btn ${filterCategory === 'meditation' ? 'selected' : ''}`}
          onClick={() => setFilterCategory('meditation')}
        >
          Guided Meditation
        </button>
        <button
          className={`slot-btn ${filterCategory === 'instrumental' ? 'selected' : ''}`}
          onClick={() => setFilterCategory('instrumental')}
        >
          Carnatic & Veena
        </button>
        <button
          className={`slot-btn ${filterCategory === 'nature' ? 'selected' : ''}`}
          onClick={() => setFilterCategory('nature')}
        >
          Rain & Nature
        </button>
        <button
          className={`slot-btn ${filterCategory === 'sleep' ? 'selected' : ''}`}
          onClick={() => setFilterCategory('sleep')}
        >
          Thaalattu (Sleep)
        </button>
      </div>

      {/* Track List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredTracks.map(track => {
          const isCurrent = calmState.activeTrackId === track.id && calmState.isPlaying;
          return (
            <div
              key={track.id}
              className="card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderLeft: isCurrent ? '4px solid var(--color-primary)' : '1px solid var(--color-border)',
                background: isCurrent ? 'var(--color-bg-lavender)' : '#FFF'
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <img
                  src={track.artwork}
                  alt={track.title.en}
                  style={{ width: '52px', height: '52px', borderRadius: '10px', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '1.05rem' }}>
                    {isTa ? track.title.ta : track.title.en}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>
                    {isTa ? track.artist.ta : track.artist.en} · ⏱️ {track.durationLabel} · {track.baseFreq}Hz
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  className="header-icon-btn"
                  onClick={() => toggleCalmFavourite(track.id)}
                  title="Bookmark"
                >
                  {calmState.favourites.includes(track.id) ? '⭐' : '☆'}
                </button>

                <button
                  className={`btn btn-sm ${isCurrent ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={() => {
                    if (isCurrent) pauseCalmTrack();
                    else playCalmTrack(track.id);
                  }}
                >
                  {isCurrent ? '⏸ Pause' : '▶ Play'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

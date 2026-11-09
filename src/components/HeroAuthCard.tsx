import React from 'react';
import { useApp } from '../context/AppContext';

export const HeroAuthCard: React.FC = () => {
  const { t, navigate } = useApp();
  return (
    <div className="hero-auth-card w-full max-w-[380px] rounded-2xl bg-white/80 border border-white/40 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-1">HerSpace</h2>
      <div className="onb-actions">
        <button type="button" className="btn btn-primary" onClick={() => navigate('signin')}>{t('signinSubmit')}</button>
        <button type="button" className="btn btn-outline" onClick={() => navigate('onb-register')}>{t('regSubmit')}</button>
      </div>
    </div>
  );
};

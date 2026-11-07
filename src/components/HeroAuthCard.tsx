import React from 'react';
import { useApp } from '../context/AppContext';

export const HeroAuthCard: React.FC = () => {
  const { isTa } = useApp();
  return (
    <div className="hero-auth-card w-full max-w-[380px] rounded-2xl bg-white/80 border border-white/40 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-1">HerSpace</h2>
      <p className="text-sm text-slate-700" role="status">
        {isTa ? 'உறுப்பினர் பதிவு மற்றும் உள்நுழைவு தற்போது கிடைக்கவில்லை.' : 'Member registration and sign-in are currently unavailable.'}
      </p>
    </div>
  );
};

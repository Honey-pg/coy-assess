'use client';

import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12 animate-fadeIn">
      {/* Visual illustration */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-500/20 to-amber-500/20 flex items-center justify-center border border-white/10 backdrop-blur-md shadow-2xl">
          <Sparkles className="w-12 h-12 text-brand-400" />
        </div>
        <div className="absolute -inset-4 bg-brand-500/10 rounded-full blur-xl -z-10" />
      </div>

      <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
        You&apos;ve seen everyone for now!
      </h3>

      <p className="text-gray-400 text-sm max-w-xs leading-relaxed mb-8">
        Check back later for new profiles in your area, or reset the discovery deck to test interactions again.
      </p>

      {onReset && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-coy-surface hover:bg-coy-card border border-coy-border text-brand-400 text-sm font-semibold shadow-lg hover:border-brand-500/40 transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Discovery Deck</span>
        </button>
      )}
    </div>
  );
};

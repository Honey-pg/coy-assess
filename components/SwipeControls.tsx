'use client';

import React from 'react';
import { X, Heart, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwipeControlsProps {
  onSwipe: (action: 'LIKE' | 'PASS') => void;
  onReset?: () => void;
  disabled?: boolean;
}

export const SwipeControls: React.FC<SwipeControlsProps> = ({
  onSwipe,
  onReset,
  disabled = false,
}) => {
  return (
    <div className="flex items-center justify-center gap-6 py-4">
      {/* Reset Swipes button (For testing/demo) */}
      {onReset && (
        <button
          onClick={onReset}
          disabled={disabled}
          title="Reset discovery deck"
          className={cn(
            "w-11 h-11 rounded-full flex items-center justify-center bg-coy-surface border border-coy-border text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/40 transition-all duration-200 active:scale-95 shadow-md",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <RotateCcw className="w-5 h-5 stroke-[2.2px]" />
        </button>
      )}

      {/* PASS Button (Left / Cross) */}
      <button
        onClick={() => onSwipe('PASS')}
        disabled={disabled}
        aria-label="Pass"
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center bg-coy-surface border-2 border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-200 active:scale-90 shadow-xl shadow-rose-950/30 group",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <X className="w-8 h-8 stroke-[2.8px] transition-transform group-hover:scale-110" />
      </button>

      {/* LIKE Button (Right / Heart) */}
      <button
        onClick={() => onSwipe('LIKE')}
        disabled={disabled}
        aria-label="Like"
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-tr from-brand-600 to-rose-500 text-white border-2 border-brand-400/50 hover:from-brand-500 hover:to-rose-400 transition-all duration-200 active:scale-90 shadow-xl shadow-brand-900/40 group",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <Heart className="w-8 h-8 fill-current stroke-[2px] transition-transform group-hover:scale-110" />
      </button>
    </div>
  );
};

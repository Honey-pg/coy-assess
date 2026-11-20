'use client';

import React from 'react';
import { Compass, Home, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabType = 'home' | 'discover';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  matchesCount?: number;
  onOpenMatches?: () => void;
}

export const BottomNavigation: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  matchesCount = 0,
  onOpenMatches,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-coy-surface/90 backdrop-blur-md border-t border-coy-border/80 px-4 py-2 flex items-center justify-around max-w-lg mx-auto shadow-2xl transition-all">
      {/* Home Tab */}
      <button
        onClick={() => onTabChange('home')}
        className={cn(
          'flex flex-col items-center justify-center py-1.5 px-4 rounded-xl transition-all duration-200 group relative',
          currentTab === 'home'
            ? 'text-brand-500 font-semibold'
            : 'text-gray-400 hover:text-gray-200'
        )}
      >
        <Home className={cn('w-6 h-6 transition-transform group-hover:scale-110', currentTab === 'home' ? 'stroke-[2.5px]' : 'stroke-[1.8px]')} />
        <span className="text-[11px] mt-1 font-medium tracking-wide">Home</span>
        {currentTab === 'home' && (
          <span className="absolute -bottom-1 w-6 h-0.5 bg-brand-500 rounded-full" />
        )}
      </button>

      {/* Discover Tab (Core) */}
      <button
        onClick={() => onTabChange('discover')}
        className={cn(
          'flex flex-col items-center justify-center py-1.5 px-4 rounded-xl transition-all duration-200 group relative',
          currentTab === 'discover'
            ? 'text-brand-500 font-semibold'
            : 'text-gray-400 hover:text-gray-200'
        )}
      >
        <div className="relative">
          <Compass className={cn('w-6 h-6 transition-transform group-hover:scale-110', currentTab === 'discover' ? 'stroke-[2.5px]' : 'stroke-[1.8px]')} />
        </div>
        <span className="text-[11px] mt-1 font-medium tracking-wide">Discover</span>
        {currentTab === 'discover' && (
          <span className="absolute -bottom-1 w-6 h-0.5 bg-brand-500 rounded-full" />
        )}
      </button>

      {/* Matches Shortcut (Accessible within Discover) */}
      {onOpenMatches && (
        <button
          onClick={onOpenMatches}
          className="flex flex-col items-center justify-center py-1.5 px-4 rounded-xl text-gray-400 hover:text-brand-400 transition-all duration-200 group relative"
          title="View Mutual Matches"
        >
          <div className="relative">
            <Heart className="w-6 h-6 transition-transform group-hover:scale-110 stroke-[1.8px]" />
            {matchesCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-gradient-to-r from-rose-500 to-brand-500 text-white text-[10px] font-bold h-4 min-w-4 px-1 flex items-center justify-center rounded-full shadow-lg ring-2 ring-coy-surface animate-pulse">
                {matchesCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1 font-medium tracking-wide">Matches</span>
        </button>
      )}
    </nav>
  );
};

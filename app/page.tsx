'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Heart, ShieldCheck, Flame, Loader2, AlertCircle } from 'lucide-react';
import { ProfileCard } from '@/components/ProfileCard';
import { SwipeControls } from '@/components/SwipeControls';
import { MatchModal } from '@/components/MatchModal';
import { EmptyState } from '@/components/EmptyState';
import { MatchesList } from '@/components/MatchesList';
import { BottomNavigation, TabType } from '@/components/BottomNavigation';
import { Profile, SwipeAction, SwipeResponse } from '@/lib/types';

export default function DiscoverApp() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<TabType>('discover');
  const [showMatchesView, setShowMatchesView] = useState(false);

  // Discovery Deck State
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwiping, setIsSwiping] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Matches State
  const [matches, setMatches] = useState<any[]>([]);
  const [matchedProfile, setMatchedProfile] = useState<any | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  // Load feed from backend
  const loadFeed = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/feed?limit=40');
      if (!res.ok) {
        throw new Error(`Feed fetch failed: ${res.statusText}`);
      }
      const data = await res.json();
      setProfiles(data.profiles || []);
      setCurrentIndex(0);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Could not load discovery feed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load matches from backend
  const loadMatches = useCallback(async () => {
    try {
      const res = await fetch('/api/matches');
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches || []);
      }
    } catch (err) {
      console.error('Failed to load matches:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadFeed();
    loadMatches();
  }, [loadFeed, loadMatches]);

  // Handle Swipe Action
  const handleSwipe = async (action: SwipeAction) => {
    if (isSwiping || currentIndex >= profiles.length) return;

    const targetProfile = profiles[currentIndex];
    if (!targetProfile) return;

    setIsSwiping(true);

    try {
      const res = await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: targetProfile.id,
          action,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to record swipe');
      }

      const result: SwipeResponse = await res.json();

      // Check if mutual match occurred
      if (result.matched && result.match) {
        setMatchedProfile(result.match.profile);
        setShowMatchModal(true);
        // Refresh matches list
        loadMatches();
      }

      // Advance deck index
      setCurrentIndex((prev) => prev + 1);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Swipe action failed. Please try again.');
    } finally {
      setIsSwiping(false);
    }
  };

  // Reset deck for demo testing
  const handleResetDeck = async () => {
    try {
      setIsLoading(true);
      await fetch('/api/dev/reset', { method: 'POST' });
      await loadFeed();
      await loadMatches();
    } catch (err) {
      console.error('Reset failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Current visible cards (render top 2 cards for smooth stacking)
  const currentCard = profiles[currentIndex];
  const nextCard = profiles[currentIndex + 1];
  const hasFinishedCards = currentIndex >= profiles.length && !isLoading;

  return (
    <main className="min-h-screen bg-coy-bg text-gray-100 flex flex-col justify-between items-center relative overflow-hidden">
      {/* Top Header Bar */}
      <header className="w-full max-w-lg px-4 py-3 flex items-center justify-between border-b border-coy-border/60 bg-coy-surface/50 backdrop-blur-md z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-rose-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight text-white">
            Coy<span className="text-brand-500">.</span>
          </span>
        </div>

        {/* Privacy & Matches Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Zero-Leak Privacy</span>
          </div>

          <button
            onClick={() => setShowMatchesView(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-coy-card hover:bg-coy-border border border-coy-border text-xs font-semibold text-gray-200 transition-colors shadow-sm"
          >
            <Heart className="w-4 h-4 text-brand-500 fill-brand-500" />
            <span>{matches.length} Matches</span>
          </button>
        </div>
      </header>

      {/* Main Body View Switching */}
      <div className="w-full max-w-lg flex-1 flex flex-col relative px-4 pb-20 pt-2">
        {/* Error notification banner */}
        {errorMessage && (
          <div className="mb-2 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 underline font-semibold ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Matches View (Accessible within Discover) */}
        {showMatchesView ? (
          <MatchesList
            matches={matches}
            onBack={() => setShowMatchesView(false)}
          />
        ) : currentTab === 'home' ? (
          /* Home Tab - Minimal placeholder as per requirement */
          <div className="flex flex-col items-center justify-center flex-1 text-center py-20 px-6">
            <div className="w-16 h-16 rounded-2xl bg-coy-surface border border-coy-border flex items-center justify-center text-gray-400 mb-4">
              <Flame className="w-8 h-8 text-brand-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Home Feed</h2>
            <p className="text-gray-400 text-xs max-w-xs leading-relaxed mb-6">
              Welcome to Coy. This is the minimal Home placeholder. All swipe and discovery interactions are in the Discover tab.
            </p>
            <button
              onClick={() => setCurrentTab('discover')}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-600 to-rose-500 text-white font-semibold text-xs shadow-lg hover:from-brand-500 hover:to-rose-400 transition-all active:scale-95"
            >
              Switch to Discover Tab
            </button>
          </div>
        ) : (
          /* Discover Tab - The Core Swipe Experience */
          <div className="flex-1 flex flex-col justify-between items-center w-full relative">
            {/* Card Deck Area */}
            <div className="relative w-full aspect-[3/4.4] sm:aspect-[3/4.2] max-h-[580px] my-auto">
              {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-coy-card rounded-3xl border border-coy-border">
                  <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-3" />
                  <p className="text-sm font-medium text-gray-400">Loading discovery feed...</p>
                </div>
              ) : hasFinishedCards ? (
                <EmptyState onReset={handleResetDeck} />
              ) : (
                <div className="relative w-full h-full">
                  <AnimatePresence>
                    {/* Render next card in stack underneath */}
                    {nextCard && (
                      <ProfileCard
                        key={nextCard.id}
                        profile={nextCard}
                        onSwipe={() => {}}
                        isFrontCard={false}
                      />
                    )}

                    {/* Render top card with full gesture interactions */}
                    {currentCard && (
                      <ProfileCard
                        key={currentCard.id}
                        profile={currentCard}
                        onSwipe={handleSwipe}
                        isFrontCard={true}
                      />
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Bottom Swipe Action Buttons */}
            {!isLoading && !hasFinishedCards && (
              <SwipeControls
                onSwipe={handleSwipe}
                onReset={handleResetDeck}
                disabled={isSwiping}
              />
            )}
          </div>
        )}
      </div>

      {/* Match Announcement Modal */}
      <MatchModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        matchedProfile={matchedProfile}
        onViewMatches={() => {
          setShowMatchModal(false);
          setShowMatchesView(true);
        }}
      />

      {/* Bottom Navigation */}
      <BottomNavigation
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (showMatchesView) setShowMatchesView(false);
        }}
        matchesCount={matches.length}
        onOpenMatches={() => setShowMatchesView(true)}
      />
    </main>
  );
}

'use client';

import React, { useState } from 'react';
import { ArrowLeft, Heart, MapPin, Sparkles, Calendar } from 'lucide-react';
import { Profile } from '@/lib/types';

interface MatchItem {
  id: string;
  matchedAt: string;
  profile: Profile;
}

interface MatchesListProps {
  matches: MatchItem[];
  onBack: () => void;
  isLoading?: boolean;
}

export const MatchesList: React.FC<MatchesListProps> = ({
  matches,
  onBack,
  isLoading = false,
}) => {
  const [selectedMatch, setSelectedMatch] = useState<MatchItem | null>(null);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="flex flex-col h-full bg-coy-bg pb-20">
      {/* Top Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-coy-surface/80 backdrop-blur-md border-b border-coy-border">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-white/10 text-gray-300 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Discover</span>
        </button>
        <div className="flex items-center gap-1.5">
          <Heart className="w-5 h-5 text-brand-500 fill-brand-500" />
          <h1 className="text-base font-bold text-white">Mutual Matches</h1>
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30">
            {matches.length}
          </span>
        </div>
        <div className="w-14" /> {/* Spacer */}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 max-w-lg mx-auto w-full">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
            Loading mutual matches...
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-coy-surface border border-coy-border flex items-center justify-center text-gray-500 mb-4">
              <Heart className="w-8 h-8 stroke-[1.5px]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No matches yet</h3>
            <p className="text-gray-400 text-xs max-w-xs leading-relaxed mb-6">
              When someone you like also likes you back, they will appear here. Remember: Coy keeps likes private until they are mutual!
            </p>
            <button
              onClick={onBack}
              className="px-5 py-2 rounded-full bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              Back to Swiping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {matches.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedMatch(item)}
                className="group relative rounded-2xl overflow-hidden bg-coy-card border border-coy-border hover:border-brand-500/50 cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-brand-900/10"
              >
                {/* Photo Thumbnail */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900">
                  <img
                    src={item.profile.photo}
                    alt={item.profile.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-coy-bg via-black/20 to-transparent" />

                  {/* Match status badge */}
                  <div className="absolute top-2 right-2 bg-brand-500/90 backdrop-blur-sm text-white p-1 rounded-full shadow">
                    <Heart className="w-3.5 h-3.5 fill-white" />
                  </div>

                  {/* Details Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-extrabold text-white text-base truncate">
                        {item.profile.name}
                      </span>
                      <span className="text-gray-300 text-sm font-semibold">
                        {item.profile.age}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-gray-300 truncate mt-0.5">
                      <MapPin className="w-3 h-3 text-brand-400 shrink-0" />
                      <span className="truncate">{item.profile.location}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-brand-300 mt-1">
                      <Calendar className="w-2.5 h-2.5" />
                      <span>Matched {formatDate(item.matchedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Detail Modal */}
      {selectedMatch && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setSelectedMatch(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl bg-coy-card border border-coy-border overflow-hidden shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square w-full">
              <img
                src={selectedMatch.profile.photo}
                alt={selectedMatch.profile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-coy-card via-transparent to-transparent" />
            </div>

            <div className="p-5">
              <div className="flex items-baseline gap-2 mb-1">
                <h2 className="text-2xl font-bold text-white">
                  {selectedMatch.profile.name}
                </h2>
                <span className="text-xl text-gray-400 font-semibold">
                  {selectedMatch.profile.age}
                </span>
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-300 mb-3">
                <MapPin className="w-4 h-4 text-brand-500" />
                <span>{selectedMatch.profile.location}</span>
              </div>

              <p className="text-sm text-gray-200 leading-relaxed mb-4">
                {selectedMatch.profile.bio}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {selectedMatch.profile.interests.map((interest, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full text-xs bg-white/10 text-gray-200 border border-white/10 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-brand-400" />
                    {interest}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setSelectedMatch(null)}
                className="w-full py-2.5 rounded-xl bg-coy-surface hover:bg-white/10 border border-coy-border text-white text-sm font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

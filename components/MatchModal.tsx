'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, X, ArrowRight } from 'lucide-react';
import { DEMO_USER } from '@/lib/constants';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchedProfile: {
    id: string;
    name: string;
    age: number;
    photo: string;
  } | null;
  onViewMatches?: () => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  isOpen,
  onClose,
  matchedProfile,
  onViewMatches,
}) => {
  if (!isOpen || !matchedProfile) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 260 }}
          className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-coy-surface via-coy-card to-coy-bg border border-brand-500/30 p-6 text-center shadow-2xl overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Title */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-amber-400 animate-bounce" />
            <span className="text-xs font-bold tracking-widest uppercase text-brand-400">
              Mutual Connection
            </span>
            <Sparkles className="w-6 h-6 text-amber-400 animate-bounce" />
          </div>

          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-brand-500 to-amber-300 tracking-tight mb-2">
            It&apos;s a Match!
          </h2>

          <p className="text-gray-300 text-sm mb-6 font-medium">
            You and <span className="text-white font-semibold">{matchedProfile.name}</span> liked each other.
          </p>

          {/* Both Profile Avatars */}
          <div className="relative flex items-center justify-center gap-0 my-6">
            {/* User photo */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-coy-surface shadow-2xl ring-4 ring-brand-500/40 z-10 -mr-3"
            >
              <img
                src={DEMO_USER.photo}
                alt={DEMO_USER.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Heart Badge in between */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="absolute z-30 w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-rose-500 text-white flex items-center justify-center shadow-lg border-2 border-white/20"
            >
              <Heart className="w-5 h-5 fill-current" />
            </motion.div>

            {/* Matched Profile photo */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-coy-surface shadow-2xl ring-4 ring-amber-500/40 z-20 -ml-3"
            >
              <img
                src={matchedProfile.photo}
                alt={matchedProfile.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-6">
            {onViewMatches && (
              <button
                onClick={() => {
                  onClose();
                  onViewMatches();
                }}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-600 to-rose-500 hover:from-brand-500 hover:to-rose-400 text-white shadow-lg shadow-brand-900/30 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>View All Matches</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/15 text-gray-200 transition-colors"
            >
              Keep Swiping
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

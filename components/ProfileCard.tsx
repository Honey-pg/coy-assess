'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { MapPin, Info, Sparkles, Check, X } from 'lucide-react';
import { Profile } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  profile: Profile;
  onSwipe: (action: 'LIKE' | 'PASS') => void;
  isFrontCard: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onSwipe,
  isFrontCard,
}) => {
  const [imageError, setImageError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Motion values for gesture tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Dynamic transforms based on drag
  const rotate = useTransform(x, [-250, 250], [-18, 18]);
  const opacity = useTransform(x, [-300, -200, 0, 200, 300], [0.5, 1, 1, 1, 0.5]);

  // Stamp opacity badges
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const passOpacity = useTransform(x, [-20, -100], [0, 1]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;

    if (info.offset.x > threshold || velocity > 500) {
      onSwipe('LIKE');
    } else if (info.offset.x < -threshold || velocity < -500) {
      onSwipe('PASS');
    }
  };

  // Fallback image URL
  const displayPhoto = imageError || !profile.photo
    ? `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80`
    : profile.photo;

  return (
    <motion.div
      style={isFrontCard ? { x, y, rotate, opacity } : { scale: 0.95, y: 12, opacity: 0.7 }}
      drag={isFrontCard ? true : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={isFrontCard ? handleDragEnd : undefined}
      className={cn(
        "absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing select-none border border-coy-border/60 bg-coy-card",
        !isFrontCard && "pointer-events-none"
      )}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: isFrontCard ? 1 : 0.95, opacity: isFrontCard ? 1 : 0.7, y: isFrontCard ? 0 : 12 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      {/* Background Profile Photo */}
      <div className="relative w-full h-full bg-neutral-900">
        <img
          src={displayPhoto}
          alt={profile.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover pointer-events-none transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-coy-bg via-coy-bg/40 to-black/20 pointer-events-none" />

        {/* Swipe Stamp Badges */}
        {isFrontCard && (
          <>
            {/* LIKE STAMP (GREEN) */}
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-8 left-8 z-20 border-4 border-emerald-400 text-emerald-400 rounded-xl px-4 py-1.5 font-black text-2xl tracking-wider uppercase rotate-[-15deg] shadow-lg bg-emerald-950/40 backdrop-blur-sm pointer-events-none flex items-center gap-1.5"
            >
              <Check className="w-7 h-7 stroke-[3px]" />
              <span>LIKE</span>
            </motion.div>

            {/* PASS STAMP (ROSE/RED) */}
            <motion.div
              style={{ opacity: passOpacity }}
              className="absolute top-8 right-8 z-20 border-4 border-rose-500 text-rose-500 rounded-xl px-4 py-1.5 font-black text-2xl tracking-wider uppercase rotate-[15deg] shadow-lg bg-rose-950/40 backdrop-blur-sm pointer-events-none flex items-center gap-1.5"
            >
              <X className="w-7 h-7 stroke-[3px]" />
              <span>PASS</span>
            </motion.div>
          </>
        )}

        {/* Card Content Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col justify-end text-left pointer-events-auto">
          {/* Header Info */}
          <div className="flex items-baseline justify-between mb-1.5">
            <div className="flex items-baseline gap-2.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                {profile.name}
              </h2>
              <span className="text-xl sm:text-2xl font-semibold text-gray-300">
                {profile.age}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(!showDetails);
              }}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-gray-200 transition-colors"
              title="More details"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>

          {/* Location / Campus */}
          <div className="flex items-center gap-1.5 text-gray-300 text-sm font-medium mb-3">
            <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
            <span>{profile.location}</span>
          </div>

          {/* Bio Preview or Expanded */}
          <p className={cn(
            "text-gray-200 text-sm leading-relaxed mb-4 font-normal drop-shadow-sm transition-all",
            showDetails ? "line-clamp-none" : "line-clamp-2"
          )}>
            {profile.bio}
          </p>

          {/* Interests Tags */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {profile.interests.slice(0, showDetails ? profile.interests.length : 4).map((interest, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/15 backdrop-blur-md text-gray-100 border border-white/10 flex items-center gap-1 shadow-sm"
                >
                  <Sparkles className="w-3 h-3 text-brand-400" />
                  {interest}
                </span>
              ))}
              {!showDetails && profile.interests.length > 4 && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-md text-gray-300">
                  +{profile.interests.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

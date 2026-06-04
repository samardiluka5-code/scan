import React, { useState } from 'react';
import { Camera, Crown, MapPin, Trophy, Sparkles, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { UserProfile } from '../types';

interface HomeScreenProps {
  user: UserProfile;
  onScanPress: () => void;
  onUpgradePress: () => void;
}

export function HomeScreen({ user, onScanPress, onUpgradePress }: HomeScreenProps) {
  const daysSinceLastScan = user.lastScanDate 
    ? Math.floor((new Date().getTime() - new Date(user.lastScanDate).getTime()) / (1000 * 3600 * 24))
    : Infinity;
  const showReminder = daysSinceLastScan > 3;

  return (
    <div className="flex flex-col h-full bg-[#111] overflow-y-auto pb-24 text-white">
      {/* Header text */}
      <div className="px-4 pt-6 pb-2 text-[10px] uppercase tracking-[2px] opacity-50 font-bold flex justify-between items-center z-10">
        <span>Dashboard</span>
        {!user.isPremium && (
            <button 
              onClick={onUpgradePress}
              className="flex items-center space-x-1"
            >
              <Crown size={12} className="text-amber-400" />
              <span className="text-amber-400">PRO</span>
            </button>
          )}
      </div>

      <div className="px-4 z-10 flex-1">
        {showReminder && (
          <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-3 mb-4 mt-2 flex items-start space-x-3">
            <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-amber-400/90 font-bold leading-relaxed">
              {user.lastScanDate 
                ? `It's been ${daysSinceLastScan} days since your last scan. Keep your profile up to date.`
                : "You haven't scanned yet. Take your first scan to unlock personalized insights."}
            </div>
          </div>
        )}

        {/* Streak Pill */}
        <div className={`inline-block px-3 py-1 bg-emerald-500 text-black rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 ${showReminder ? 'mt-0' : 'mt-2'}`}>
          Active Streak: {user.streakCounter} Days
        </div>

        {/* Huge Rank Title */}
        <div className="text-[48px] font-black leading-[0.9] tracking-[-2px] mb-6">
          DIAMOND<br/>MASTER
        </div>

        {/* Stat Box */}
        <div className="bg-[#1a1a1a] rounded-xl p-4 mb-4 transition-all">
          <div className="text-[10px] opacity-50 mb-1 font-bold uppercase tracking-wider">Current Score</div>
          <div className="text-2xl font-black">{Math.floor(Math.random() * 200) + 700}</div>
        </div>

        {/* Description */}
        <div className="text-xs opacity-70 leading-relaxed font-medium">
          {user.isPremium 
              ? `Your last scan was recently. Keep the streak alive for the Amethyst badge, ${user.displayName}.` 
              : `You have 1 free scan remaining today. Upgrade for unlimited access.`}
        </div>
      </div>

      {/* Main Action Area */}
      <button 
        onClick={onScanPress}
        className="absolute bottom-6 left-4 right-4 bg-emerald-500 text-black text-center p-4 rounded-xl font-extrabold uppercase tracking-widest text-[13px] active:scale-95 transition-transform z-20"
      >
        Start New Scan
      </button>      
    </div>
  );
}

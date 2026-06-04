import React, { useState } from 'react';
import { UserProfile, LeaderboardEntry } from '../types';
import { Crown, Info } from 'lucide-react';
import { cn } from '../lib/utils';

interface LeaderboardScreenProps {
  user: UserProfile;
  onUpgradePress: () => void;
}

const mockGlobalData: LeaderboardEntry[] = [
  { userId: '1', displayName: 'Alexander T.', photoURL: null, currentFootScore: 985, rankTitle: 'Legend' },
  { userId: '2', displayName: 'Sofia V.', photoURL: null, currentFootScore: 978, rankTitle: 'Legend' },
  { userId: '3', displayName: 'Marcus R.', photoURL: null, currentFootScore: 942, rankTitle: 'Elite' },
];

const mockRegionalData: LeaderboardEntry[] = [
  { userId: '4', displayName: 'Emily Wong', photoURL: null, currentFootScore: 890, rankTitle: 'Elite' },
  { userId: '5', displayName: 'David S.', photoURL: null, currentFootScore: 855, rankTitle: 'Master' },
  { userId: 'test_user', displayName: 'You', photoURL: null, currentFootScore: 780, rankTitle: 'Diamond' },
  { userId: '6', displayName: 'James L.', photoURL: null, currentFootScore: 710, rankTitle: 'Diamond' },
];

type TabType = 'regional' | 'global' | 'type';

export function LeaderboardScreen({ user, onUpgradePress }: LeaderboardScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>('regional');

  const isLocked = activeTab === 'global' && !user.isPremium;
  const data = activeTab === 'regional' ? mockRegionalData : mockGlobalData;

  return (
    <div className="flex flex-col h-full bg-[#111] overflow-hidden text-white">
      {/* Header */}
      <div className="px-4 pt-6 pb-2 text-[10px] uppercase tracking-[2px] opacity-50 font-bold z-10 shrink-0">
        Global Leaderboard
      </div>

      <div className="px-4 pt-2 shrink-0 z-10">
        {/* Segmented Tabs (Pills) */}
        <div className="flex gap-2 mb-4">
          {(['regional', 'global', 'type'] as TabType[]).map((tab) => {
             const isActive = activeTab === tab;
             return (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={cn(
                   "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center space-x-1",
                   isActive ? "bg-emerald-500 text-black" : "bg-[#222] text-white/50 hover:bg-[#333]"
                 )}
               >
                 {tab === 'global' && !user.isPremium && <Crown size={12} className={isActive ? "text-black" : "text-white/50"} />}
                 <span>{tab}</span>
               </button>
             )
          })}
        </div>
      </div>

      {/* List Container */}
      <div className="flex-1 relative overflow-y-auto px-4 pb-[100px]">
        <div className="flex flex-col">
          {data.map((entry, index) => {
            const isMe = entry.userId === 'test_user';
            return (
              <div 
                key={entry.userId}
                className={cn(
                  "flex items-center py-4 border-b border-[#222]",
                  isMe ? "bg-emerald-500/10 -mx-4 px-4 border-l-4 border-l-emerald-500" : ""
                )}
              >
                <div className="w-8 text-xs opacity-50 font-bold">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0",
                  isMe ? "bg-emerald-500 text-black" : "bg-[#333] text-white"
                )}>
                   <span className="font-bold text-xs">
                    {entry.displayName.charAt(0)}
                   </span>
                </div>

                <div className="flex-1 font-semibold text-[13px]">
                    {entry.displayName}
                </div>

                <div className="font-extrabold text-emerald-500 text-[14px]">
                    {entry.currentFootScore}
                </div>
              </div>
            )
          })}
        </div>

        {/* Paywall Overlay for Locked Tabs */}
        {isLocked && (
          <div className="absolute inset-0 z-10 bg-[#111]/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-4">
              <Crown size={32} className="text-amber-400" />
            </div>
            <h3 className="text-2xl font-black mb-2 text-white">Unlock Global Ranks</h3>
            <p className="opacity-70 text-[13px] font-medium mb-6">See how your feet compare against millions worldwide. Exclusively for Premium members.</p>
            <button 
              onClick={onUpgradePress}
              className="bg-emerald-500 text-black font-extrabold uppercase tracking-widest text-[13px] px-6 py-4 rounded-xl active:scale-95 transition-transform"
            >
              Upgrade to Premium
            </button>
          </div>
        )}
      </div>

      {!isLocked && (
        <button className="absolute bottom-6 left-4 right-4 bg-transparent border border-[#333] text-white text-center p-4 rounded-xl font-extrabold uppercase tracking-widest text-[13px] active:scale-95 transition-transform z-20 hover:bg-[#222]">
          View All Ranks
        </button>
      )}
    </div>
  );
}

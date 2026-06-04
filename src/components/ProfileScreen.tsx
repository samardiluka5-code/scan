import React from 'react';
import { Crown, Settings, Zap, History, UserCircle, ChevronRight, Activity } from 'lucide-react';
import { UserProfile, ScanRecord } from '../types';
import { cn } from '../lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ProfileScreenProps {
  user: UserProfile;
  onUpgradePress: () => void;
}

const mockProgressData = [
  { date: 'Mon', score: 720 },
  { date: 'Tue', score: 735 },
  { date: 'Wed', score: 730 },
  { date: 'Thu', score: 755 },
  { date: 'Fri', score: 760 },
  { date: 'Sat', score: 785 },
  { date: 'Sun', score: 842 },
];

const mockPastScans = [
  { id: '1', date: 'Today, 2:45 PM', score: 842, type: 'Egyptian' },
  { id: '2', date: 'Yesterday, 10:15 AM', score: 785, type: 'Egyptian' },
  { id: '3', date: 'Fri, 8:00 AM', score: 760, type: 'Egyptian' },
];

export function ProfileScreen({ user, onUpgradePress }: ProfileScreenProps) {
  return (
    <div className="flex flex-col h-full bg-[#111] overflow-y-auto text-white">
      {/* Header */}
      <div className="px-4 pt-6 pb-2 text-[10px] uppercase tracking-[2px] opacity-50 font-bold flex justify-between items-center z-10 sticky top-0 bg-[#111]">
        <span>Profile</span>
        <button className="p-1 active:scale-95 opacity-80 hover:opacity-100">
          <Settings size={18} />
        </button>
      </div>

      <div className="px-4 pb-[100px] flex-1">
        {/* User Info */}
        <div className="flex items-center space-x-4 mt-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-[#222] border-2 border-emerald-500 overflow-hidden flex items-center justify-center">
             {user.photoURL ? (
               <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
             ) : (
               <UserCircle size={40} className="text-[#444]" />
             )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black">{user.displayName}</h1>
            <p className="text-xs font-bold uppercase tracking-widest text-[#888] mt-1 mb-2">Member since '23</p>
            {user.isPremium ? (
              <div className="inline-flex items-center space-x-1 bg-amber-400/10 border border-amber-400 text-amber-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <Crown size={12} />
                <span>Premium Active</span>
              </div>
            ) : (
              <button 
                onClick={onUpgradePress}
                className="inline-flex items-center space-x-1 bg-[#222] text-white/70 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider active:scale-95 transition-transform hover:bg-[#333]"
              >
                <span>Upgrade to Pro</span>
                <ChevronRight size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#1a1a1a] rounded-2xl p-4 flex flex-col justify-center border border-[#222]">
            <div className="flex items-center space-x-2 text-emerald-500 mb-2">
              <Zap size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Streak</span>
            </div>
            <div className="text-3xl font-black">{user.streakCounter} <span className="text-sm text-[#666] font-bold">Days</span></div>
          </div>
          <div className="bg-[#1a1a1a] rounded-2xl p-4 flex flex-col justify-center border border-[#222]">
            <div className="flex items-center space-x-2 text-emerald-500 mb-2">
              <Activity size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Total Scans</span>
            </div>
            <div className="text-3xl font-black">{user.totalScans}</div>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <h2 className="text-[10px] uppercase font-bold tracking-[2px] opacity-50 ml-1">Score Progression</h2>
          </div>
          <div className="h-[200px] w-full bg-[#1a1a1a] rounded-2xl p-4 border border-[#222]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockProgressData}>
                <XAxis 
                  dataKey="date" 
                  stroke="#555" 
                  tick={{ fill: '#888', fontSize: 10, fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  dot={{ fill: '#111', stroke: '#10b981', strokeWidth: 2, r: 4 }} 
                  activeDot={{ r: 6, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* History List */}
        <div>
          <div className="flex items-center justify-between mb-4 ml-1">
            <h2 className="text-[10px] uppercase font-bold tracking-[2px] opacity-50">Recent History</h2>
            <button className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">View All</button>
          </div>
          
          <div className="space-y-3">
            {mockPastScans.map((scan) => (
              <div key={scan.id} className="bg-[#1a1a1a] rounded-2xl p-4 flex items-center justify-between border border-[#222] active:scale-[0.98] transition-transform cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <History size={18} className="text-emerald-500" />
                  </div>
                  <div>
                    <div className="font-extrabold text-[13px]">{scan.type} Foot</div>
                    <div className="text-[11px] font-medium opacity-50 mt-0.5">{scan.date}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-black text-emerald-400 text-[16px]">{scan.score}</span>
                  <span className="text-[9px] uppercase font-bold tracking-widest opacity-50">Score</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Crown, Check, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { UserProfile } from '../types';

interface PaywallScreenProps {
  onClose: () => void;
  onSubscribe: (isAnnual: boolean) => void;
}

export function PaywallScreen({ onClose, onSubscribe }: PaywallScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#1a1a1a] to-[#050505] text-white overflow-y-auto">
      {/* Header */}
      <div className="px-4 pt-6 pb-2 text-[10px] uppercase tracking-[2px] opacity-50 font-bold flex justify-between items-center z-20 sticky top-0">
        <span>Premium</span>
        <button onClick={onClose} className="p-1 active:scale-95 hover:bg-white/10 rounded-full">
          <X size={16} />
        </button>
      </div>

      <div className="px-4 flex-1 pb-[100px]">
        <div className="text-[42px] font-black leading-[0.9] tracking-[-2px] mt-8 mb-8">
          UNLIMIT<br/>YOUR<br/>SCORE.
        </div>

        {/* Feature List */}
        <ul className="list-none p-0 m-0 mb-10 text-[13px] opacity-80 space-y-4 font-medium tracking-wide">
          <li>✦ Unlimited daily scans</li>
          <li>✦ Detailed medical-grade insights</li>
          <li>✦ PDF Certificate of Aesthetic</li>
          <li>✦ Full Global Leaderboard access</li>
        </ul>

        {/* Pricing Cards */}
        <div className="space-y-3">
          <button
            onClick={() => setSelectedPlan('annual')}
            className={cn(
              "w-full text-left rounded-xl p-4 flex justify-between items-center transition-all",
              selectedPlan === 'annual' 
                ? "bg-emerald-500/5 border border-emerald-500" 
                : "bg-[#1a1a1a] border border-transparent"
            )}
          >
            <div>
              <div className="font-extrabold text-[14px]">Annual Pro</div>
              <div className="text-[10px] opacity-60 font-bold mt-1 uppercase tracking-wider text-emerald-400">Save 33%</div>
            </div>
            <div className="text-[18px] font-black tracking-tight">€39.99</div>
          </button>

          <button
             onClick={() => setSelectedPlan('monthly')}
            className={cn(
              "w-full text-left rounded-xl p-4 flex justify-between items-center transition-all",
              selectedPlan === 'monthly' 
                ? "bg-emerald-500/5 border border-emerald-500" 
                : "bg-[#1a1a1a] border border-transparent"
            )}
          >
            <div>
              <div className="font-extrabold text-[14px]">Monthly</div>
            </div>
            <div className="text-[18px] font-black tracking-tight">€4.99</div>
          </button>
        </div>
      </div>
      
      {/* Action */}
      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#050505] to-transparent pt-12 pb-6 z-20">
        <button 
          onClick={() => onSubscribe(selectedPlan === 'annual')}
          className="w-full bg-emerald-500 text-black text-center p-4 rounded-xl font-extrabold uppercase tracking-widest text-[13px] active:scale-95 transition-transform"
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
}

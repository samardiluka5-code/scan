import React, { useEffect, useState } from 'react';
import { Share2, ArrowLeft, Download, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { ScanRecord } from '../types';
import { getRankTitle } from '../lib/scoring';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';

interface ResultsScreenProps {
  scan: ScanRecord | null;
  onBack: () => void;
}

function StatBar({ label, value, colorClass = "bg-emerald-500", textClass = "text-emerald-400" }: { label: string, value: number, colorClass?: string, textClass?: string }) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div>
      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider mb-2">
        <span className="opacity-70">{label}</span>
        <span className={textClass}>{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-[#222] rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-1000 ease-out", colorClass)} 
          style={{ width: `${animatedValue}%` }} 
        />
      </div>
    </div>
  );
}

export function ResultsScreen({ scan, onBack }: ResultsScreenProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (!scan) return;
    const duration = 1500;
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setAnimatedScore(Math.round(easeProgress * scan.footScore));

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedScore(scan.footScore);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [scan]);

  if (!scan) return null;

  const rank = getRankTitle(scan.footScore);

  return (
    <div className="flex flex-col h-full bg-[#111] overflow-y-auto text-white">
      {/* Header */}
      <div className="px-4 pt-6 pb-2 flex items-center justify-between z-20 shrink-0 sticky top-0 bg-[#111]">
        <div className="flex items-center space-x-2">
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center opacity-80 active:scale-95 transition-transform">
            <ArrowLeft size={16} />
          </button>
          <span className="text-[10px] uppercase tracking-[2px] opacity-50 font-bold">Analysis Result</span>
        </div>
      </div>

      <div className="px-4 pb-[100px] flex flex-col items-center flex-1">
        
        {/* Progress Circle container */}
        <div className="relative w-40 h-40 border-[12px] border-[#222] rounded-full mx-auto my-5 flex items-center justify-center shrink-0">
           {/* Progress Ring approximation using conic gradient in older setups, but here we just show the score for style match */}
           <svg className="absolute inset-[-12px] w-[calc(100%+24px)] h-[calc(100%+24px)] transform -rotate-90" viewBox="0 0 100 100">
             <circle 
                cx="50" 
                cy="50" 
                r="44" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="12" 
                strokeLinecap="round"
                strokeDasharray="276"
                strokeDashoffset={276 - (276 * (animatedScore / 1000))}
                className="transition-all duration-300 ease-out"
              />
           </svg>
           <div className="text-[32px] font-black z-10">{animatedScore}</div>
        </div>

        <div className="w-full text-center mt-2 flex-1 relative">
          <div className="inline-block px-3 py-1 bg-amber-400 text-black rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
             {scan.aestheticMetrics.toeType} Type {scan.aestheticMetrics.toeType === 'Egyptian' ? '👑' : '🏛️'}
          </div>
          
          <div className="text-[38px] md:text-[40px] font-black leading-[0.9] tracking-[-2px] mb-6">
            {rank.toUpperCase()}<br/>CLASS
          </div>

          <div className="w-full mt-2 mb-6 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="75%"
                data={[
                  { subject: 'Shape', A: scan.aestheticMetrics.shape, fullMark: 100 },
                  { subject: 'Symmetry', A: scan.aestheticMetrics.symmetry, fullMark: 100 },
                  { subject: 'Lines', A: scan.aestheticMetrics.lineClarity, fullMark: 100 },
                  { subject: 'Arch', A: scan.healthMetrics.plantarArch, fullMark: 100 },
                  { subject: 'Joints', A: scan.healthMetrics.halluxValgus, fullMark: 100 },
                  { subject: 'Pronation', A: scan.healthMetrics.pronation, fullMark: 100 },
                ]}
              >
                <PolarGrid stroke="#333" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }} 
                />
                <Radar
                  name="Metrics"
                  dataKey="A"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="#10b981"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full text-left mt-4">
            <div className="text-[10px] uppercase font-bold tracking-[2px] opacity-50 mb-3 ml-1">Aesthetic Profile</div>
            <div className="bg-[#1a1a1a] rounded-2xl p-5 space-y-5">
              <StatBar label="Shape & Structure" value={scan.aestheticMetrics.shape} colorClass="bg-emerald-500" textClass="text-emerald-400" />
              <StatBar label="Proportions" value={scan.aestheticMetrics.proportions} colorClass="bg-emerald-500" textClass="text-emerald-400" />
              <StatBar label="Symmetry" value={scan.aestheticMetrics.symmetry} colorClass="bg-emerald-500" textClass="text-emerald-400" />
              <StatBar label="Line Clarity" value={scan.aestheticMetrics.lineClarity} colorClass="bg-emerald-500" textClass="text-emerald-400" />
            </div>

            <div className="text-[10px] uppercase font-bold tracking-[2px] opacity-50 mb-3 mt-8 ml-1">Health Indicators</div>
            <div className="bg-[#1a1a1a] rounded-2xl p-5 space-y-5">
              <StatBar label="Plantar Arch" value={scan.healthMetrics.plantarArch} colorClass="bg-blue-500" textClass="text-blue-400" />
              <StatBar label="Pronation Quality" value={scan.healthMetrics.pronation} colorClass="bg-blue-500" textClass="text-blue-400" />
              <StatBar label="Deformity Resistance" value={scan.healthMetrics.halluxValgus} colorClass="bg-blue-500" textClass="text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="fixed sm:absolute bottom-6 left-4 right-4 z-30">
        <button className="w-full bg-white text-black text-center p-4 rounded-xl font-extrabold uppercase tracking-widest text-[13px] active:scale-[0.98] transition-transform shadow-xl">
          Share Card
        </button>
      </div>
    </div>
  );
}

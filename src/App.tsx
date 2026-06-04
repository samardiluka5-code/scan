import React, { useState } from 'react';
import { Home, Trophy, Camera, Sun, MoveHorizontal, Focus, User } from 'lucide-react';
import { HomeScreen } from './components/HomeScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { PaywallScreen } from './components/PaywallScreen';
import { CameraScreen } from './components/CameraScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { UserProfile, ScanRecord } from './types';
import { calculateFootScore } from './lib/scoring';
import { cn } from './lib/utils';

// Mock initial data
const initialUser: UserProfile = {
  userId: 'test_user',
  displayName: 'Alex',
  photoURL: null,
  isPremium: false,
  streakCounter: 3,
  lastScanDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  totalScans: 4,
  badges: []
};

type ViewState = 'home' | 'scan' | 'results' | 'leaderboard' | 'profile';

export default function App() {
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [showPaywall, setShowPaywall] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [currentScan, setCurrentScan] = useState<ScanRecord | null>(null);

  const handleScanIntent = () => {
    if (!user.isPremium && user.lastScanDate === new Date().toISOString().split('T')[0]) {
      // Stub for 'already scanned today on free plan'
      setShowPaywall(true);
      return;
    }
    setShowTips(true);
  };

  const handleScanConfirm = () => {
    setShowTips(false);
    setCurrentView('scan'); // Go to camera screen
  };

  const handleCapture = (scanData: any) => {
    // Merge real scan data into the record
    const realScan: ScanRecord = {
      scanId: Math.random().toString(),
      userId: user.userId,
      timestamp: Date.now(),
      imageUrl: 'generated-scan',
      aestheticMetrics: scanData.aestheticMetrics,
      healthMetrics: scanData.healthMetrics,
      footScore: scanData.footScore || 0
    };

    // If API didn't return footScore, calculate it locally as fallback
    if (!realScan.footScore) {
      realScan.footScore = calculateFootScore(realScan.aestheticMetrics, realScan.healthMetrics);
    }
    
    setCurrentScan(realScan);
    setUser(prev => ({
      ...prev,
      lastScanDate: new Date().toISOString().split('T')[0],
      totalScans: prev.totalScans + 1
    }));
    setCurrentView('results');
  };

  const handleSubscribe = (isAnnual: boolean) => {
    setUser(prev => ({ ...prev, isPremium: true }));
    setShowPaywall(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] sm:flex sm:items-center sm:justify-center p-0 sm:p-6 font-sans text-white">
      {/* Mobile Device Constraint Simulation */}
      <div className="relative w-full h-[100dvh] sm:h-[800px] sm:max-h-[90vh] sm:w-[414px] bg-[#111] sm:rounded-[32px] sm:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden sm:border-8 sm:border-[#222]">
        
        {/* Dynamic View rendering */}
        <div className="absolute inset-0 pb-[80px]">
          {showPaywall ? (
            <PaywallScreen onClose={() => setShowPaywall(false)} onSubscribe={handleSubscribe} />
          ) : showTips ? (
            <div className="absolute inset-0 bg-[#111] z-[100] flex flex-col pt-12">
              <div className="px-4 pb-2 text-[10px] uppercase tracking-[2px] opacity-50 font-bold z-10 shrink-0">
                Pre-Scan Checklist
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center px-4">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                  <Camera size={32} className="text-emerald-500" />
                </div>
                <div className="text-[32px] font-black leading-[1.1] tracking-[-1px] mb-8 text-center">
                  OPTIMIZE<br/>YOUR SCAN
                </div>

                <div className="space-y-4 w-full">
                  <div className="bg-[#1a1a1a] rounded-xl p-4 flex items-center space-x-4">
                    <Sun size={24} className="text-emerald-500 shrink-0" />
                    <div>
                      <div className="font-extrabold text-[13px] mb-0.5">Good Lighting</div>
                      <div className="text-[11px] opacity-60 font-medium w-full">Avoid dark shadows for accurate aesthetics.</div>
                    </div>
                  </div>
                  <div className="bg-[#1a1a1a] rounded-xl p-4 flex items-center space-x-4">
                    <MoveHorizontal size={24} className="text-emerald-500 shrink-0" />
                    <div>
                      <div className="font-extrabold text-[13px] mb-0.5">Bare, Flat Surface</div>
                      <div className="text-[11px] opacity-60 font-medium">Remove socks and stand naturally on the floor.</div>
                    </div>
                  </div>
                  <div className="bg-[#1a1a1a] rounded-xl p-4 flex items-center space-x-4">
                    <Focus size={24} className="text-emerald-500 shrink-0" />
                    <div>
                      <div className="font-extrabold text-[13px] mb-0.5">Clear Contrast</div>
                      <div className="text-[11px] opacity-60 font-medium">A floor that contrasts with your skin tone helps AI edges.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 mt-auto">
                <button onClick={handleScanConfirm} className="w-full bg-emerald-500 text-black text-center p-4 rounded-xl font-extrabold uppercase tracking-widest text-[13px] active:scale-95 transition-transform mb-3">
                  I'm Ready
                </button>
                <button onClick={() => setShowTips(false)} className="w-full text-white/50 text-center p-4 rounded-xl font-extrabold uppercase tracking-widest text-[13px] active:scale-95 transition-transform hover:bg-white/5">
                  Cancel
                </button>
              </div>
            </div>
          ) : currentView === 'home' ? (
             <HomeScreen user={user} onScanPress={handleScanIntent} onUpgradePress={() => setShowPaywall(true)} />
          ) : currentView === 'scan' ? (
             <CameraScreen onCapture={handleCapture} onClose={() => setCurrentView('home')} />
          ) : currentView === 'results' ? (
             <ResultsScreen scan={currentScan} onBack={() => setCurrentView('home')} />
          ) : currentView === 'leaderboard' ? (
             <LeaderboardScreen user={user} onUpgradePress={() => setShowPaywall(true)} />
          ) : currentView === 'profile' ? (
             <ProfileScreen user={user} onUpgradePress={() => setShowPaywall(true)} />
          ) : null}
        </div>

        {/* Bottom Navigation */}
        {!showPaywall && !showTips && currentView !== 'results' && currentView !== 'scan' && (
          <div className="absolute bottom-0 inset-x-0 h-[80px] bg-[#111] border-t border-[#222] flex items-center justify-around px-4 z-50">
            <button 
              onClick={() => setCurrentView('home')}
              className={cn("flex flex-col items-center space-y-1 transition-colors w-[60px]", currentView === 'home' ? "text-emerald-500" : "text-white/50 hover:text-white/80")}
            >
              <Home size={24} className={currentView === 'home' ? 'text-emerald-500' : ''} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
            </button>
            
            <button 
              onClick={() => setCurrentView('leaderboard')}
              className={cn("flex flex-col items-center space-y-1 transition-colors w-[60px]", currentView === 'leaderboard' ? "text-emerald-500" : "text-white/50 hover:text-white/80")}
            >
              <Trophy size={24} className={currentView === 'leaderboard' ? 'text-emerald-500' : ''} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Rank</span>
            </button>
            
            <button 
              onClick={handleScanIntent}
              className={cn("flex flex-col items-center space-y-1 transition-colors w-[60px]", currentView === 'scan' ? "text-emerald-500" : "text-white/50 hover:text-white/80")}
            >
              <Camera size={24} className={currentView === 'scan' ? 'text-emerald-500' : ''} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Scan</span>
            </button>

            <button 
              onClick={() => setCurrentView('profile')}
              className={cn("flex flex-col items-center space-y-1 transition-colors w-[60px]", currentView === 'profile' ? "text-emerald-500" : "text-white/50 hover:text-white/80")}
            >
              <User size={24} className={currentView === 'profile' ? 'text-emerald-500' : ''} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

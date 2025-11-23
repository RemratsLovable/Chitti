
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Brain, Play, Trophy, Share2, Wallet, 
  Settings, Award, Lock, Battery, Wifi, Activity,
  ShieldCheck, ShieldAlert, Watch, HeartPulse, Zap,
  HeartHandshake, Calendar, ChevronRight, Gift, Users
} from 'lucide-react';
import Navigation from './components/Navigation';
import SessionChart from './components/SessionChart';
import { generateSessionAnalysis, getDailyQuote } from './services/geminiService';
import { BrainWaveState, SessionDataPoint, ViewState, AISessionInsight, Charity, DonationConfig, CalendarEvent } from './types';

// --- MOCK DATA ---
const MOCK_FEED_DATA = [
  { id: '1', user: 'Elena R.', avatar: 'https://picsum.photos/40/40', timeAgo: '2h ago', duration: 45, avgTheta: 72, earnedLtc: 0.004, earnedDoge: 2.1, kudos: 24, comments: 3, verified: true },
  { id: '2', user: 'Marcus Chen', avatar: 'https://picsum.photos/41/41', timeAgo: '4h ago', duration: 20, avgTheta: 55, earnedLtc: 0.001, earnedDoge: 0.5, kudos: 12, comments: 1, verified: true },
  { id: '3', user: 'Sarah L.', avatar: 'https://picsum.photos/42/42', timeAgo: '6h ago', duration: 60, avgTheta: 81, earnedLtc: 0.008, earnedDoge: 5.0, kudos: 89, comments: 12, verified: true },
];

const CHARITIES: Charity[] = [
  { id: '1', name: 'Mind & Life Institute', cause: 'Neuroscience Research' },
  { id: '2', name: 'The Trevor Project', cause: 'Mental Health Support' },
  { id: '3', name: 'Cool Earth', cause: 'Climate Action' },
  { id: '4', name: 'GiveDirectly', cause: 'Poverty Relief' },
];

const UPCOMING_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Theta Flow State', instructor: 'Dr. K', date: 'Today', time: '6:00 PM', attendees: 142, type: 'Live' },
  { id: '2', title: 'Morning Breathwork', instructor: 'Sarah J.', date: 'Tomorrow', time: '7:00 AM', attendees: 89, type: 'Live' },
  { id: '3', title: 'Deep Sleep Hypnosis', instructor: 'Marcus C.', date: 'Tomorrow', time: '9:30 PM', attendees: 320, type: 'Encore' },
];

export default function App() {
  // --- STATE ---
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [quote, setQuote] = useState<string>("Loading daily wisdom...");
  
  // Session State
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // seconds
  const [sessionData, setSessionData] = useState<SessionDataPoint[]>([]);
  const [sessionResult, setSessionResult] = useState<AISessionInsight | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [selectedWearable, setSelectedWearable] = useState<'Apple' | 'Garmin' | 'None'>('Apple');

  // User Stats State
  const [wallet, setWallet] = useState({ ltc: 0.1420, doge: 420.69 });
  const [sessionMining, setSessionMining] = useState({ ltc: 0, doge: 0 });

  // Charity State
  const [donationConfig, setDonationConfig] = useState<DonationConfig>({
    enabled: false,
    charityId: '1',
    threshold: 500
  });
  const [showDonationSetup, setShowDonationSetup] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);

  // Refs for loop management
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- EFFECTS ---

  // Load quote on mount
  useEffect(() => {
    getDailyQuote().then(setQuote);
  }, []);

  // Simulator Logic
  const startSimulation = useCallback(() => {
    setIsRecording(true);
    setElapsedTime(0);
    setSessionData([]);
    setSessionMining({ ltc: 0, doge: 0 });
    setSessionResult(null);
    setShowResult(false);

    intervalRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
      
      // --- SIMULATION ENGINE ---
      const timeFactor = Math.min(1, elapsedTime / 120); // Ramp up over 2 mins
      
      // 1. Simulate Brainwaves (EEG)
      const baseAlpha = 50 + Math.random() * 30;
      const baseTheta = 30 + (timeFactor * 40) + (Math.random() * 20);
      
      // 2. Simulate Biometrics (HRV & Motion)
      // If Theta is high (Deep State), Motion should be LOW and HRV should be HIGH/STABLE.
      // We introduce slight noise to mimic real sensors.
      const isDeepState = baseTheta > 60;
      
      // Accelerometer (0 = Still, 100 = Running)
      // If deep, motion is usually < 10.
      let simMotion = isDeepState ? Math.random() * 5 : Math.random() * 20; 
      // Randomly simulate a "Scratch" or "Shift" event occasionally
      if (Math.random() > 0.95) simMotion += 40; 

      // HRV (ms) - Higher is usually better/more relaxed
      const simHrv = isDeepState ? 60 + Math.random() * 15 : 40 + Math.random() * 20;

      // 3. Calculate INTEGRITY SCORE (Anti-Fraud)
      // Base score 100. Penalize for Mismatches.
      // Scenario: High Theta (Meditation) but High Motion (Jogging/Faking) = Low Integrity
      let integrity = 100;
      
      if (baseTheta > 60 && simMotion > 15) {
          integrity -= (simMotion * 1.5); // Heavy penalty for moving while "deep"
      }
      
      // Clamp Integrity
      integrity = Math.max(0, Math.min(100, integrity));

      const newDataPoint: SessionDataPoint = {
        timestamp: Date.now(),
        alpha: Math.min(100, baseAlpha),
        theta: Math.min(100, baseTheta),
        coherence: Math.min(100, (baseAlpha + baseTheta) / 2),
        hrv: simHrv,
        motion: simMotion,
        integrity: integrity
      };

      setSessionData(prev => [...prev, newDataPoint]);

      // 4. Mining Logic (Proof-of-Meditation)
      // STRICT: Only mine if Theta > 60 AND Integrity > 80
      if (newDataPoint.theta > 60 && newDataPoint.integrity > 80) {
        setSessionMining(prev => ({
          ltc: prev.ltc + 0.000005, 
          doge: prev.doge + (newDataPoint.theta > 80 ? 0.01 : 0.001)
        }));
      }

    }, 1000);
  }, [elapsedTime]);

  const stopSimulation = useCallback(async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRecording(false);
    
    // Add mined amount to wallet
    setWallet(prev => ({
      ltc: prev.ltc + sessionMining.ltc,
      doge: prev.doge + sessionMining.doge
    }));

    // Calculate avgs for AI
    const avgAlpha = sessionData.reduce((acc, curr) => acc + curr.alpha, 0) / (sessionData.length || 1);
    const avgTheta = sessionData.reduce((acc, curr) => acc + curr.theta, 0) / (sessionData.length || 1);
    const avgIntegrity = sessionData.reduce((acc, curr) => acc + curr.integrity, 0) / (sessionData.length || 1);
    const avgHrv = sessionData.reduce((acc, curr) => acc + curr.hrv, 0) / (sessionData.length || 1);
    const avgMotion = sessionData.reduce((acc, curr) => acc + curr.motion, 0) / (sessionData.length || 1);
    
    setShowResult(true);
    
    const analysis = await generateSessionAnalysis(
      Math.floor(elapsedTime / 60), 
      avgAlpha, 
      avgTheta, 
      avgIntegrity,
      avgHrv,
      avgMotion
    );
    setSessionResult(analysis);

  }, [sessionMining, sessionData, elapsedTime]);

  // Clean up
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleDonate = () => {
    if (wallet.doge >= donationConfig.threshold) {
      setWallet(prev => ({ ...prev, doge: prev.doge - donationConfig.threshold }));
      setDonationSuccess(true);
      setTimeout(() => setDonationSuccess(false), 3000);
    }
  };


  // --- HELPERS ---
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCharityName = (id: string) => CHARITIES.find(c => c.id === id)?.name || 'Unknown Charity';

  // --- VIEWS ---

  const renderHeader = () => (
    <header className="fixed top-0 left-0 right-0 z-40 bg-neuro-900/80 backdrop-blur-md px-4 py-3 border-b border-neuro-800 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="bg-neuro-accent/20 p-2 rounded-lg">
            <Brain size={20} className="text-neuro-accent" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neuro-cyan to-neuro-purple">
          Chitti
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {/* Connection Status Mock */}
        <div className="flex items-center gap-2 text-[10px] bg-neuro-800 px-3 py-1.5 rounded-full border border-neuro-700">
            <div className="flex items-center gap-1 text-neuro-cyan">
                <Wifi size={10} />
                <span>Neuro</span>
            </div>
            <div className="w-px h-3 bg-neuro-700"></div>
            <div className="flex items-center gap-1 text-green-400">
                <Watch size={10} />
                <span>{selectedWearable}</span>
            </div>
        </div>
        <img 
          src="https://picsum.photos/100/100" 
          alt="Profile" 
          className="w-8 h-8 rounded-full ring-2 ring-neuro-700"
        />
      </div>
    </header>
  );

  const DashboardView = () => (
    <div className="pt-20 pb-24 px-4 space-y-6">
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-neuro-800 to-neuro-900 p-6 rounded-2xl border border-neuro-700 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <ShieldCheck size={120} />
        </div>
        <h2 className="text-slate-400 text-sm font-medium mb-1">Meditation Integrity</h2>
        <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1 text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs font-bold border border-green-400/20">
                <ShieldCheck size={12} /> Secured
            </div>
            <span className="text-xs text-slate-500">Multi-Modal Verification Active</span>
        </div>
        <p className="text-lg italic text-slate-100 mb-6 font-light">"{quote}"</p>
        <button 
          onClick={() => { setCurrentView('session'); }}
          className="bg-neuro-accent text-neuro-900 font-bold py-3 px-6 rounded-xl w-full flex items-center justify-center gap-2 hover:bg-neuro-cyan transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)]"
        >
          <Play size={20} fill="currentColor" />
          Start Secure Session
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neuro-800 p-4 rounded-xl border border-neuro-700">
          <div className="flex items-center gap-2 mb-2 text-neuro-purple">
            <Activity size={18} />
            <span className="text-xs font-bold uppercase">Weekly Zen</span>
          </div>
          <p className="text-2xl font-bold">142 <span className="text-xs text-slate-500 font-normal">mins</span></p>
        </div>
        <div className="bg-neuro-800 p-4 rounded-xl border border-neuro-700">
          <div className="flex items-center gap-2 mb-2 text-yellow-500">
            <Trophy size={18} />
            <span className="text-xs font-bold uppercase">Streak</span>
          </div>
          <p className="text-2xl font-bold">5 <span className="text-xs text-slate-500 font-normal">days</span></p>
        </div>
      </div>

      {/* Recent Activity Mini Feed */}
      <div>
        <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-3">Verified Sessions</h3>
        <div className="space-y-3">
            {MOCK_FEED_DATA.slice(0, 2).map((post) => (
                <div key={post.id} className="bg-neuro-800/50 p-3 rounded-xl border border-neuro-700/50 flex items-center gap-3">
                    <img src={post.avatar} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{post.user}</p>
                            {post.verified && <ShieldCheck size={12} className="text-green-400" />}
                        </div>
                        <p className="text-xs text-neuro-accent">Deep Theta State • {post.duration}m</p>
                    </div>
                    <div className="text-right">
                         <span className="text-xs font-bold text-crypto-doge block">+{post.earnedDoge} DOGE</span>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Schedule Button / Section */}
      <div className="border-t border-neuro-800 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <Calendar size={16} /> Upcoming Live Sessions
          </h3>
          <button className="text-neuro-accent text-xs font-bold hover:text-white transition-colors">See All</button>
        </div>
        
        <div className="grid gap-3">
          {UPCOMING_EVENTS.map(event => (
            <div key={event.id} className="bg-neuro-800 p-4 rounded-xl border border-neuro-700 flex justify-between items-center group hover:border-neuro-accent/50 transition-colors">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${event.type === 'Live' ? 'bg-red-500/20 text-red-400' : 'bg-neuro-purple/20 text-neuro-purple'}`}>
                      {event.type}
                    </span>
                    <span className="text-xs text-slate-400">{event.date} • {event.time}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{event.title}</h4>
                  <p className="text-xs text-slate-500">with {event.instructor} • {event.attendees} attending</p>
               </div>
               <button className="bg-neuro-700 hover:bg-neuro-accent hover:text-neuro-900 text-white p-2 rounded-full transition-colors">
                 <ChevronRight size={20} />
               </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SessionView = () => {
    // Get latest data point
    const lastPoint = sessionData.length > 0 ? sessionData[sessionData.length - 1] : null;
    const integrity = lastPoint ? lastPoint.integrity : 100;
    const isCompromised = integrity < 60;

    return (
        <div className="flex flex-col h-screen pt-16 bg-neuro-900">
        {/* Top Controls */}
        <div className="px-6 py-4 flex justify-between items-end">
            <div>
            <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Session Time</h2>
            <p className="text-4xl font-mono text-white font-light">{formatTime(elapsedTime)}</p>
            </div>
            <div className="text-right">
            <div className="flex items-center gap-1 justify-end text-crypto-doge">
                    <span className="text-xs font-bold">DOGE</span>
                    <span className="font-mono">{sessionMining.doge.toFixed(3)}</span>
            </div>
            <div className="flex items-center gap-1 justify-end text-crypto-ltc">
                    <span className="text-xs font-bold">LTC</span>
                    <span className="font-mono">{sessionMining.ltc.toFixed(6)}</span>
            </div>
            </div>
        </div>

        {/* Visualization */}
        <div className="flex-1 px-4 flex flex-col justify-center gap-4 relative">
            {/* Integrity Status Overlay */}
            <div className="absolute top-0 right-6 z-10 flex flex-col items-end gap-2">
                {isRecording && (
                    <div className="flex items-center gap-2 animate-pulse">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-xs text-red-400 uppercase font-bold">Live Recording</span>
                    </div>
                )}
                <div className={`transition-all duration-500 flex items-center gap-2 px-3 py-1 rounded-full border ${
                    isCompromised 
                    ? 'bg-red-500/10 border-red-500 text-red-400' 
                    : 'bg-green-500/10 border-green-500/30 text-green-400'
                }`}>
                    {isCompromised ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                    <span className="text-xs font-bold uppercase">
                        {isCompromised ? 'Motion Detect' : 'Bio-Sync Verified'}
                    </span>
                </div>
            </div>
            
            <SessionChart data={sessionData} />
            
            {/* Live Biometrics Panel */}
            <div className="grid grid-cols-3 gap-2 px-2">
                <div className="bg-neuro-800/30 border border-neuro-700/30 p-3 rounded-xl flex flex-col items-center">
                    <Activity size={16} className="text-neuro-purple mb-1" />
                    <span className="text-[10px] text-slate-500 uppercase">Brain (Theta)</span>
                    <span className="text-xl font-bold text-white">{lastPoint ? Math.round(lastPoint.theta) : '--'}</span>
                </div>
                <div className="bg-neuro-800/30 border border-neuro-700/30 p-3 rounded-xl flex flex-col items-center">
                    <HeartPulse size={16} className="text-red-400 mb-1" />
                    <span className="text-[10px] text-slate-500 uppercase">HRV (ms)</span>
                    <span className="text-xl font-bold text-white">{lastPoint ? Math.round(lastPoint.hrv) : '--'}</span>
                </div>
                <div className="bg-neuro-800/30 border border-neuro-700/30 p-3 rounded-xl flex flex-col items-center relative overflow-hidden">
                    <Zap size={16} className={`mb-1 ${isCompromised ? 'text-red-500' : 'text-neuro-accent'}`} />
                    <span className="text-[10px] text-slate-500 uppercase">Integrity</span>
                    <span className={`text-xl font-bold ${isCompromised ? 'text-red-500' : 'text-neuro-accent'}`}>
                        {lastPoint ? Math.round(lastPoint.integrity) : '--'}%
                    </span>
                    {/* Progress Bar background for integrity */}
                    <div 
                        className="absolute bottom-0 left-0 h-1 bg-neuro-accent transition-all duration-300" 
                        style={{ width: `${lastPoint ? lastPoint.integrity : 100}%`, opacity: isCompromised ? 0 : 1 }}
                    />
                </div>
            </div>
        </div>

        {/* Controls */}
        <div className="p-8 pb-32 flex justify-center">
            {!isRecording ? (
            <button 
                onClick={startSimulation}
                className="w-20 h-20 rounded-full bg-neuro-accent text-neuro-900 flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_30px_rgba(34,211,238,0.4)]"
            >
                <Play size={32} fill="currentColor" className="ml-1"/>
            </button>
            ) : (
            <button 
                onClick={stopSimulation}
                className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_30px_rgba(239,68,68,0.4)]"
            >
                <div className="w-8 h-8 bg-white rounded-md"></div>
            </button>
            )}
        </div>

        {/* Result Modal Overlay */}
        {showResult && (
            <div className="absolute inset-0 bg-neuro-900/95 backdrop-blur-xl z-50 p-6 flex flex-col justify-center animate-in fade-in duration-300">
                <div className="text-center mb-6">
                    {sessionResult?.verificationStatus === 'Verified' ? (
                         <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/50 mb-4">
                            <ShieldCheck size={20} />
                            <span className="font-bold uppercase tracking-wider text-sm">Proof Verified</span>
                         </div>
                    ) : (
                        <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-full border border-red-500/50 mb-4">
                            <ShieldAlert size={20} />
                            <span className="font-bold uppercase tracking-wider text-sm">Integrity Flagged</span>
                         </div>
                    )}
                    
                    <h2 className="text-2xl font-bold text-white mb-1">Session Complete</h2>
                    <p className="text-neuro-accent text-lg">+{sessionMining.doge.toFixed(3)} DOGE Mined</p>
                </div>

                <div className="bg-neuro-800 p-6 rounded-2xl border border-neuro-700 space-y-4">
                    <div>
                        <h3 className="text-xs font-bold uppercase text-slate-500 mb-1">AI Analysis</h3>
                        <p className="text-lg text-slate-200 leading-relaxed">
                            {sessionResult ? sessionResult.summary : "Analyzing brainwave patterns..."}
                        </p>
                    </div>
                    
                    {sessionResult && (
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neuro-700">
                            <div className="p-3 bg-neuro-900/50 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1">Neuro Score</p>
                                <p className="text-2xl font-bold text-white">{sessionResult.score}</p>
                            </div>
                            <div className="p-3 bg-neuro-900/50 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1">Integrity Score</p>
                                <p className={`text-2xl font-bold ${sessionResult.integrityScore > 80 ? 'text-green-400' : 'text-red-400'}`}>
                                    {sessionResult.integrityScore}%
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex gap-3">
                    <button onClick={() => { setShowResult(false); setCurrentView('feed'); }} className="flex-1 bg-neuro-700 text-white py-3 rounded-xl font-medium hover:bg-neuro-600 transition-colors">
                        Close
                    </button>
                    <button className="flex-1 bg-neuro-accent text-neuro-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                        <Share2 size={18} /> Share Proof
                    </button>
                </div>
            </div>
        )}
        </div>
    );
  }

  const FeedView = () => (
      <div className="pt-20 pb-24 px-4 space-y-5">
          <h2 className="text-xl font-bold mb-4">Community Flow</h2>
          
          {/* My completed session placeholder if simulated */}
          {sessionResult && (
             <div className="bg-neuro-800/80 p-4 rounded-xl border border-neuro-accent/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                 <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        <img src="https://picsum.photos/100/100" className="w-10 h-10 rounded-full border-2 border-neuro-accent" />
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-bold text-white">You</p>
                                {sessionResult.verificationStatus === 'Verified' && (
                                    <ShieldCheck size={14} className="text-green-400" />
                                )}
                            </div>
                            <p className="text-xs text-slate-400">Just now</p>
                        </div>
                    </div>
                 </div>
                 <div className="mb-3">
                     <p className="text-sm text-slate-300 mb-2">{sessionResult.summary}</p>
                     <div className="bg-neuro-900 p-3 rounded-lg flex justify-between items-center">
                         <div>
                             <p className="text-xs text-slate-500 uppercase">Integrity</p>
                             <p className={`font-bold ${sessionResult.integrityScore > 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                                 {sessionResult.integrityScore}%
                             </p>
                         </div>
                         <div className="text-right">
                             <p className="text-xs text-slate-500 uppercase">Reward</p>
                             <p className="font-bold text-crypto-doge">+{sessionMining.doge.toFixed(3)} DOGE</p>
                         </div>
                     </div>
                 </div>
                 <div className="flex gap-4 pt-2 border-t border-neuro-700/50">
                    <button className="text-slate-400 hover:text-white flex items-center gap-1 text-sm"><Award size={16}/> 0 Kudos</button>
                 </div>
             </div>
          )}

          {MOCK_FEED_DATA.map((post) => (
              <div key={post.id} className="bg-neuro-800 p-4 rounded-xl border border-neuro-700">
                 <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        <img src={post.avatar} className="w-10 h-10 rounded-full" />
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-bold text-white">{post.user}</p>
                                {post.verified && <ShieldCheck size={14} className="text-green-400" />}
                            </div>
                            <p className="text-xs text-slate-400">{post.timeAgo}</p>
                        </div>
                    </div>
                    {/* Badge */}
                    {post.avgTheta > 75 && (
                        <div className="bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded text-[10px] font-bold uppercase border border-yellow-500/20">
                            Deep Zen
                        </div>
                    )}
                 </div>

                 {/* Stats Visualization */}
                 <div className="grid grid-cols-3 gap-2 mb-4">
                     <div className="bg-neuro-900/50 p-2 rounded-lg text-center">
                         <span className="block text-[10px] text-slate-500 uppercase">Duration</span>
                         <span className="text-sm font-bold">{post.duration}m</span>
                     </div>
                     <div className="bg-neuro-900/50 p-2 rounded-lg text-center">
                         <span className="block text-[10px] text-slate-500 uppercase">Flow Score</span>
                         <span className="text-sm font-bold text-neuro-purple">{post.avgTheta}</span>
                     </div>
                     <div className="bg-neuro-900/50 p-2 rounded-lg text-center relative overflow-hidden group">
                         <div className="absolute inset-0 bg-yellow-400/5 group-hover:bg-yellow-400/10 transition-colors"></div>
                         <span className="block text-[10px] text-slate-500 uppercase">Mined</span>
                         <span className="text-sm font-bold text-crypto-doge">Ð {post.earnedDoge}</span>
                     </div>
                 </div>

                 <div className="flex gap-6 pt-2 border-t border-neuro-700 text-sm text-slate-400">
                     <button className="hover:text-neuro-accent flex items-center gap-1"><Trophy size={16} /> {post.kudos} Kudos</button>
                     <button className="hover:text-white">Comment ({post.comments})</button>
                 </div>
              </div>
          ))}
      </div>
  );

  const WalletView = () => (
      <div className="pt-20 pb-24 px-4 space-y-6">
          <div className="bg-gradient-to-r from-neuro-800 to-neuro-900 p-6 rounded-2xl border border-neuro-700 shadow-xl">
              <h2 className="text-slate-400 text-sm font-medium mb-4">Total Portfolio Value</h2>
              <p className="text-4xl font-bold text-white mb-1">$58.42</p>
              <p className="text-green-400 text-sm flex items-center gap-1">▲ 2.4% this week</p>

              <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between p-3 bg-neuro-900/50 rounded-xl border border-neuro-700/50">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-crypto-ltc text-white flex items-center justify-center font-bold">Ł</div>
                          <div>
                              <p className="font-bold">Litecoin</p>
                              <p className="text-xs text-slate-400">Proof-of-Relaxation</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <p className="font-mono font-bold">{wallet.ltc.toFixed(6)} LTC</p>
                          <p className="text-xs text-slate-500">≈ $11.20</p>
                      </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-neuro-900/50 rounded-xl border border-neuro-700/50">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-crypto-doge text-white flex items-center justify-center font-bold">Ð</div>
                          <div>
                              <p className="font-bold">Dogecoin</p>
                              <p className="text-xs text-slate-400">Merged Mining Bonus</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <p className="font-mono font-bold">{wallet.doge.toFixed(2)} DOGE</p>
                          <p className="text-xs text-slate-500">≈ $47.22</p>
                      </div>
                  </div>
              </div>
          </div>

          {/* Charity & Karma Card */}
          <div className="bg-neuro-800 p-6 rounded-2xl border border-neuro-700 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                   <HeartHandshake size={100} />
               </div>
               
               <div className="flex justify-between items-start mb-4">
                   <div>
                       <h3 className="font-bold text-white flex items-center gap-2">
                           <HeartHandshake size={18} className="text-pink-500" />
                           Karma & Impact
                       </h3>
                       <p className="text-xs text-slate-400 mt-1">Convert Zen into real-world good.</p>
                   </div>
                   <button 
                    onClick={() => setShowDonationSetup(true)}
                    className="p-2 bg-neuro-900/50 rounded-full hover:bg-neuro-900 text-slate-400 hover:text-white transition-colors"
                   >
                       <Settings size={16} />
                   </button>
               </div>

               {!donationConfig.enabled ? (
                   <div className="text-center py-4">
                       <p className="text-sm text-slate-300 mb-4">
                           Enable "Karma Goals" to automatically save towards a donation for your favorite charity.
                       </p>
                       <button 
                        onClick={() => setShowDonationSetup(true)}
                        className="bg-pink-500/10 text-pink-500 border border-pink-500/50 font-bold py-2 px-6 rounded-lg text-sm hover:bg-pink-500 hover:text-white transition-all"
                       >
                           Configure Giving
                       </button>
                   </div>
               ) : (
                   <div className="space-y-4">
                       <div className="flex justify-between text-sm">
                           <span className="text-slate-400">Goal: <span className="text-white font-medium">{getCharityName(donationConfig.charityId)}</span></span>
                           <span className="text-slate-400">{Math.min(100, Math.round((wallet.doge / donationConfig.threshold) * 100))}%</span>
                       </div>
                       
                       <div className="w-full h-3 bg-neuro-900 rounded-full overflow-hidden">
                           <div 
                            className="h-full bg-pink-500 transition-all duration-500"
                            style={{ width: `${Math.min(100, (wallet.doge / donationConfig.threshold) * 100)}%` }}
                           ></div>
                       </div>
                       
                       <div className="flex justify-between items-center text-xs text-slate-500">
                           <span>{wallet.doge.toFixed(0)} DOGE</span>
                           <span>Target: {donationConfig.threshold} DOGE</span>
                       </div>

                       {wallet.doge >= donationConfig.threshold && (
                           <button 
                            onClick={handleDonate}
                            className="w-full mt-2 bg-pink-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-pink-600 transition-colors animate-pulse"
                           >
                               <Gift size={18} />
                               Donate {donationConfig.threshold} DOGE Now
                           </button>
                       )}
                   </div>
               )}
          </div>

          <div className="bg-neuro-800 p-6 rounded-2xl border border-neuro-700">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Reward History</h3>
                  <button className="text-neuro-accent text-sm">View All</button>
              </div>
              <div className="space-y-4">
                  {donationSuccess && (
                      <div className="flex justify-between items-center text-sm animate-in fade-in slide-in-from-right">
                          <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                              <span className="text-pink-400 font-bold">Charity Donation</span>
                          </div>
                          <span className="font-mono text-pink-400">-{donationConfig.threshold} DOGE</span>
                      </div>
                  )}
                  {[1,2,3].map(i => (
                      <div key={i} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>Session Reward</span>
                          </div>
                          <span className="font-mono text-slate-400">+0.42 DOGE</span>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  const ProfileView = () => (
      <div className="pt-20 pb-24 px-4">
          <div className="text-center mb-8">
              <div className="relative inline-block">
                  <img src="https://picsum.photos/100/100" className="w-24 h-24 rounded-full ring-4 ring-neuro-800 mx-auto" />
                  <div className="absolute bottom-0 right-0 bg-neuro-accent text-neuro-900 text-xs font-bold px-2 py-1 rounded-full border border-neuro-900">
                      PRO
                  </div>
              </div>
              <h2 className="text-xl font-bold mt-4">Alex Neuro</h2>
              <p className="text-slate-400 text-sm">Mindful Miner since 2024</p>
          </div>

          <div className="space-y-4">
               {/* Wearable Integration Selector */}
               <div className="bg-neuro-800 p-4 rounded-xl border border-neuro-700">
                   <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                       <Watch size={16} /> Security Integrations
                   </h3>
                   <div className="grid grid-cols-2 gap-3">
                       <button 
                        onClick={() => setSelectedWearable('Apple')}
                        className={`p-3 rounded-lg border text-sm font-medium flex flex-col items-center gap-2 transition-colors ${selectedWearable === 'Apple' ? 'bg-neuro-accent/10 border-neuro-accent text-neuro-accent' : 'bg-neuro-900/50 border-neuro-700 text-slate-400'}`}
                       >
                           <Activity size={20} /> Apple Watch
                       </button>
                       <button 
                        onClick={() => setSelectedWearable('Garmin')}
                        className={`p-3 rounded-lg border text-sm font-medium flex flex-col items-center gap-2 transition-colors ${selectedWearable === 'Garmin' ? 'bg-neuro-accent/10 border-neuro-accent text-neuro-accent' : 'bg-neuro-900/50 border-neuro-700 text-slate-400'}`}
                       >
                           <Watch size={20} /> Garmin
                       </button>
                   </div>
                   <p className="text-[10px] text-slate-500 mt-3 text-center">
                       Biometric validation required for Proof-of-Meditation mining.
                   </p>
               </div>

               <div className="bg-neuro-800 p-4 rounded-xl border border-neuro-700 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                       <Settings className="text-slate-400" />
                       <span>Neurable Headset</span>
                   </div>
                   <div className="flex items-center gap-2 text-green-400 text-sm">
                       <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                       Connected
                   </div>
               </div>

               <div className="bg-gradient-to-r from-neuro-purple/20 to-neuro-cyan/20 p-4 rounded-xl border border-neuro-purple/30">
                   <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-white">Premium Tier</h3>
                       <Lock size={16} className="text-neuro-accent"/>
                   </div>
                   <p className="text-sm text-slate-300 mb-3">Unlock Deep Neuro-Analytics, CSV Export, and AI-Generated Binaural Beats.</p>
                   <button className="w-full bg-white text-neuro-900 font-bold py-2 rounded-lg text-sm">
                       Manage Subscription
                   </button>
               </div>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-neuro-900 text-slate-200 font-sans selection:bg-neuro-accent selection:text-neuro-900">
      {renderHeader()}
      
      <main className="min-h-screen">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'session' && <SessionView />}
        {currentView === 'feed' && <FeedView />}
        {currentView === 'wallet' && <WalletView />}
        {currentView === 'profile' && <ProfileView />}
      </main>

      {/* Hide navigation during active recording to prevent accidental exit */}
      <Navigation 
        currentView={currentView} 
        onChange={setCurrentView} 
        disabled={isRecording}
      />

      {/* Charity Configuration Modal */}
      {showDonationSetup && (
        <div className="fixed inset-0 bg-neuro-900/90 backdrop-blur-md z-[60] flex items-end sm:items-center justify-center p-4">
            <div className="bg-neuro-800 w-full max-w-md rounded-2xl border border-neuro-700 p-6 animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <HeartHandshake className="text-pink-500" /> Giving Settings
                    </h3>
                    <button onClick={() => setShowDonationSetup(false)} className="text-slate-400 hover:text-white">Close</button>
                </div>
                
                <div className="space-y-6">
                    {/* Toggle */}
                    <div className="flex items-center justify-between">
                        <span className="font-medium">Enable Karma Goals</span>
                        <button 
                            onClick={() => setDonationConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                            className={`w-12 h-6 rounded-full transition-colors relative ${donationConfig.enabled ? 'bg-pink-500' : 'bg-neuro-700'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${donationConfig.enabled ? 'left-7' : 'left-1'}`}></div>
                        </button>
                    </div>

                    {/* Charity Select */}
                    <div className={donationConfig.enabled ? 'opacity-100 transition-opacity' : 'opacity-50 pointer-events-none'}>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Select Charity</label>
                        <div className="grid gap-2">
                            {CHARITIES.map(charity => (
                                <button
                                    key={charity.id}
                                    onClick={() => setDonationConfig(prev => ({ ...prev, charityId: charity.id }))}
                                    className={`p-3 rounded-lg border text-left flex justify-between items-center transition-all ${
                                        donationConfig.charityId === charity.id 
                                        ? 'bg-pink-500/10 border-pink-500 text-white' 
                                        : 'bg-neuro-900 border-neuro-700 text-slate-400 hover:border-slate-500'
                                    }`}
                                >
                                    <span className="font-medium text-sm">{charity.name}</span>
                                    {donationConfig.charityId === charity.id && <div className="w-2 h-2 bg-pink-500 rounded-full"></div>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Threshold */}
                    <div className={donationConfig.enabled ? 'opacity-100 transition-opacity' : 'opacity-50 pointer-events-none'}>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">DOGE Threshold</label>
                        <div className="bg-neuro-900 p-4 rounded-xl border border-neuro-700">
                             <div className="flex justify-between items-center mb-2">
                                 <span className="text-xs text-slate-400">Target Amount</span>
                                 <span className="font-bold font-mono text-pink-400">{donationConfig.threshold} DOGE</span>
                             </div>
                             <input 
                                type="range" 
                                min="100" 
                                max="5000" 
                                step="100" 
                                value={donationConfig.threshold}
                                onChange={(e) => setDonationConfig(prev => ({ ...prev, threshold: Number(e.target.value) }))}
                                className="w-full h-2 bg-neuro-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                             />
                        </div>
                    </div>

                    <button 
                        onClick={() => setShowDonationSetup(false)}
                        className="w-full bg-neuro-700 hover:bg-white hover:text-neuro-900 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

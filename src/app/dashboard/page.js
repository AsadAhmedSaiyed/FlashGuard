'use client';
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link'; // 👈 Added for Redirect

// 🎨 TRAFFIC VISUALIZER (UI Aligned with Landing Page)
const TrafficVisualizer = ({ activeRequests, dbHits, shieldEnabled }) => {
  return (
    <div className="w-full bg-gray-900/40 border border-gray-800 h-64 rounded-2xl relative overflow-hidden mb-8 flex items-center shadow-2xl backdrop-blur-sm">
      
      {/* ZONE 1: USERS */}
      <div className="w-1/3 h-full border-r border-gray-800/50 flex flex-col items-center justify-center relative">
        <span className="text-gray-500 text-[10px] tracking-widest mb-4 font-semibold uppercase">Incoming Traffic</span>
        <div className="flex flex-wrap content-start gap-1.5 p-4 w-full h-full overflow-hidden justify-center">
          {activeRequests.map((req) => (
            <div 
              key={req.id} 
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                req.status === 'pending' ? 'bg-blue-500 animate-pulse' : 
                req.status === 'coalescing' ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 
                req.status === 'db_hit' ? 'bg-red-500 scale-150 shadow-[0_0_15px_red] z-10' : 
                'bg-green-500'
              }`} 
            />
          ))}
        </div>
      </div>

      {/* ZONE 2: THE GUARD */}
      <div className={`w-1/3 h-full border-r border-gray-800/50 flex flex-col items-center justify-center transition-all duration-500 ${shieldEnabled ? 'opacity-100' : 'opacity-20 grayscale'}`}>
        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-yellow-600 to-orange-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative p-6 border border-yellow-500/20 rounded-xl bg-gray-900/90 text-center ring-1 ring-white/10">
            <div className="text-3xl mb-2">⚡</div>
            <span className="text-yellow-500 font-bold text-sm tracking-wide">FLASHGUARD</span>
            <div className="text-xs text-gray-500 mt-2 font-mono">
               {activeRequests.filter(r => r.status === 'coalescing').length} Holding
            </div>
          </div>
        </div>
      </div>

      {/* ZONE 3: DATABASE */}
      <div className="w-1/3 h-full flex flex-col items-center justify-center bg-black/20">
        <span className="text-gray-500 text-[10px] tracking-widest mb-4 font-semibold uppercase">Database Layer</span>
        <div className={`p-6 rounded-full border-2 transition-all duration-300 ${dbHits > 0 ? 'bg-red-900/40 border-red-500/50 scale-110 shadow-[0_0_40px_rgba(239,68,68,0.4)]' : 'bg-gray-800/50 border-gray-700'}`}>
          <span className="text-3xl">🗄️</span>
        </div>
        <div className={`mt-4 font-mono text-xl font-bold ${dbHits > 5 ? 'text-red-400' : 'text-gray-600'}`}>
          {dbHits} <span className="text-xs font-normal text-gray-600">Queries</span>
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [liveReqs, setLiveReqs] = useState([]);
  const [liveDbHits, setLiveDbHits] = useState(0);
  const [isShieldActive, setIsShieldActive] = useState(false);

  // ⚡️ SIMULATION LOGIC
  const runSimulation = async (shieldEnabled) => {
    setLoading(true);
    setIsShieldActive(shieldEnabled);
    setStats(null);
    setLiveReqs([]);
    setLiveDbHits(0);

    try {
      const res = await axios.get(`/api/simulate?shield=${shieldEnabled}`);
      const { results, realDbReads, duration, totalRequests, mode } = res.data;

      // Visual Replay
      for (let i = 0; i < results.length; i++) {
        const reqLog = results[i];
        setLiveReqs(prev => [...prev, { id: reqLog.id, status: 'pending' }]);
        await new Promise(r => setTimeout(r, 10)); 
      }

      // Outcome Reveal
      setLiveReqs(prev => prev.map(req => {
        const log = results.find(r => r.id === req.id);
        let finalStatus = 'success'; 
        if (log.source === 'DATABASE') finalStatus = 'db_hit';
        if (log.source === 'COALESCED') finalStatus = 'coalescing';
        return { ...req, status: finalStatus };
      }));

      // Stats
      setLiveDbHits(realDbReads);
      setStats({
        total: totalRequests,
        dbHits: realDbReads,
        savings: (((totalRequests - realDbReads) / totalRequests) * 100).toFixed(0) + '%',
        duration: duration,
        type: mode
      });

    } catch (error) {
      console.error("Simulation failed", error);
    } finally {
      setLoading(false);
      setIsShieldActive(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-yellow-500/30 selection:text-yellow-200 p-6 md:p-12">
      
      {/* TOP NAVIGATION (Redirect) */}
      <div className="max-w-5xl mx-auto mb-12 flex justify-between items-center">
        <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2">
          ← Back to Home
        </Link>
        <div className="text-xs font-mono text-gray-600">Live Interactive Demo</div>
      </div>

      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* HEADER */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-yellow-500 text-xs font-mono">
             <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
             Simulation Environment
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
             See <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-500">FlashGuard</span> in Action
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
             Simulate a high-concurrency traffic spike (50 requests/sec) and observe how the system behaves with and without protection.
          </p>
        </div>

        {/* 🟢 VISUALIZER */}
        <TrafficVisualizer 
           activeRequests={liveReqs} 
           dbHits={liveDbHits} 
           shieldEnabled={loading && isShieldActive} 
        />

        {/* CONTROLS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <button 
                onClick={() => runSimulation(false)} 
                disabled={loading} 
                className="group relative p-6 bg-gray-900/50 border border-gray-800 rounded-xl hover:bg-red-950/20 hover:border-red-500/30 transition-all disabled:opacity-50"
             >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl group-hover:scale-110 transition-transform">🔥</span>
                    <span className="text-red-400 font-bold text-lg">Attack (No Shield)</span>
                    <span className="text-xs text-gray-500">Simulate Traffic Jam</span>
                </div>
             </button>

             <button 
                onClick={() => runSimulation(true)} 
                disabled={loading} 
                className="group relative p-6 bg-gray-900/50 border border-gray-800 rounded-xl hover:bg-yellow-950/20 hover:border-yellow-500/30 transition-all disabled:opacity-50"
             >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl group-hover:scale-110 transition-transform">🛡️</span>
                    <span className="text-yellow-400 font-bold text-lg">Defend (With Shield)</span>
                    <span className="text-xs text-gray-500">Activate Request Coalescing</span>
                </div>
             </button>
        </div>

        {/* 📊 RESULTS (Aligned UI) */}
        {stats && (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4">
                 
                 <div className="p-5 bg-gray-900/50 rounded-xl border border-gray-800 text-center">
                     <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">Total Requests</div>
                     <div className="text-3xl font-bold text-white">{stats.total}</div>
                 </div>

                 <div className="p-5 bg-gray-900/50 rounded-xl border border-gray-800 text-center">
                     <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">DB Executions</div>
                     <div className={`text-3xl font-bold ${stats.dbHits > 5 ? 'text-red-500' : 'text-green-500'}`}>
                         {stats.dbHits}
                     </div>
                 </div>

                 <div className="p-5 bg-gray-900/50 rounded-xl border border-gray-800 text-center">
                     <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">Total Time</div>
                     <div className="text-3xl font-bold text-white">
                         {(stats.duration / 1000).toFixed(2)}s
                     </div>
                 </div>

                 <div className="p-5 bg-gray-900/50 rounded-xl border border-gray-800 text-center relative overflow-hidden group">
                     <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors"></div>
                     <div className="text-yellow-500 text-[10px] uppercase tracking-wider mb-2 relative z-10">Load Reduction</div>
                     <div className="text-3xl font-bold text-yellow-400 relative z-10">{stats.savings}</div>
                 </div>

             </div>
         )}
      </div>
    </main>
  );
}
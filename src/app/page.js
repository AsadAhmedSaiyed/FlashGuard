'use client';
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);

  const runSimulation = async (shieldEnabled) => {
    setLoading(true);
    setLogs([]); 
    setStats(null);

    const start = Date.now();
    
    // 1. PREPARE THE REQUESTS
    const requests = Array.from({ length: 51 }).map(async(_, i) => {
      await new Promise(resolve => setTimeout(resolve, i * 50));
      return axios.get(`/api/simulate?shield=${shieldEnabled}`)
        .then(res => ({ ...res.data, status: 'success', id: i }))
        // 👇 NEW: If it crashes (500), we catch it here!
        .catch(err => ({ 
          status: 'error', 
          source: 'CRASH', 
          error: err.message, 
          id: i 
        }))
    });

    try {
      // 2. WAIT FOR ALL (Even the crashes)
      const results = await Promise.all(requests);
      const duration = Date.now() - start;

      // 3. COUNT THE RESULTS
      // A "Crash" counts as a DB Hit (because it tried and failed)
      const crashes = results.filter(r => r.status === 'error').length;
      const dbHits = results.filter(r => r.source === 'DATABASE' || r.source === 'DATABASE_UNPROTECTED').length + crashes;
      
      const protectedReqs = results.filter(r => 
        r.status === 'success' && 
        r.source !== 'DATABASE' && 
        r.source !== 'DATABASE_UNPROTECTED'
      ).length;

      const savings = ((51 - dbHits) / 51) * 100;

      setStats({
        total: requests.length,
        dbHits: `${dbHits} ${crashes > 0 ? `(${crashes} Crashed)` : ''}`,
        protectedReqs,
        savings: savings.toFixed(1) + '%',
        duration,
        type: shieldEnabled ? "SHIELD ON (Protected)" : "SHIELD OFF (Vulnerable)"
      });

      setLogs(results.slice(0, 5));

    } catch (error) {
      console.error("Critical Failure", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-10 bg-gray-900 text-white font-mono">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="border-b border-gray-700 pb-5">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            FlashGuard Defense System
          </h1>
          <p className="text-gray-400 mt-2">
            High-Concurrency Request Coalescing Demo
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 border border-red-900 bg-red-900/10 rounded-xl">
            <h2 className="text-xl font-bold text-red-400 mb-2">🔴 Simulate Crash</h2>
            <p className="text-sm text-gray-400 mb-4">
              Fires 50 + requests directly at Firestore. <br/>
              <span className="text-red-300">Warning: Creates 1,000 DB reads.</span>
            </p>
            <button 
              onClick={() => runSimulation(false)}
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 rounded font-bold transition disabled:opacity-50"
            >
              {loading ? "Attacking..." : "FIRE (Shield OFF)"}
            </button>
          </div>

          <div className="p-6 border border-green-900 bg-green-900/10 rounded-xl">
            <h2 className="text-xl font-bold text-green-400 mb-2">🟢 Activate Shield</h2>
            <p className="text-sm text-gray-400 mb-4">
              Fires 50+ requests through FlashGuard. <br/>
              <span className="text-green-300">Goal: 1 DB read, 999 Coalesced.</span>
            </p>
            <button 
              onClick={() => runSimulation(true)}
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 rounded font-bold transition disabled:opacity-50"
            >
              {loading ? "Processing..." : "FIRE (Shield ON)"}
            </button>
          </div>
        </div>

        {stats && (
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 animation-fade-in">
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-2xl font-bold">{stats.type}</h3>
              <span className="text-gray-400">{stats.duration}ms total time</span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-400">Total Users</div>
                <div className="text-3xl font-bold">{stats.total}</div>
              </div>
              <div className="p-4 rounded-lg bg-red-900/50 text-red-400">
                <div className="text-sm opacity-80">Database Load</div>
                <div className="text-xl font-bold">{stats.dbHits}</div>
              </div>
              <div className="p-4 bg-blue-900/30 text-blue-400 rounded-lg">
                <div className="text-sm opacity-80">Cost Savings</div>
                <div className="text-3xl font-bold">{stats.savings}</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-black rounded font-mono text-xs overflow-hidden">
              <div className="text-gray-500 mb-2">sample_telemetry (first 5 requests):</div>
              <pre className="text-green-400">
                {JSON.stringify(logs, null, 2)}
              </pre>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
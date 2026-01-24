'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-yellow-500/30 selection:text-yellow-200">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-125 bg-yellow-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-yellow-500 text-xs font-mono mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
          </span>
          v1.0.0 Stable Release
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white">
          Stop the <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-500">Thundering Herd</span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          High-performance <b>Distributed Request Coalescing</b> for Node.js. 
          Turn 1,000 concurrent database hits into <span className="text-white font-bold underline decoration-yellow-500/50 underline-offset-4">just one</span>.
        </p>

        {/* Install Command */}
        <div className="max-w-md mx-auto mb-12">
          <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border border-gray-800 rounded-xl font-mono text-sm text-gray-300 shadow-2xl">
            <span>npm install @asad-ahmed-saiyed/flashguard</span>
            <button 
              onClick={() => navigator.clipboard.writeText('npm install @asad-ahmed-saiyed/flashguard ioredis')}
              className="ml-4 text-gray-500 hover:text-white transition-colors"
              title="Copy to clipboard"
            >
              📋
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">* ioredis is a required peer dependency</p>
        </div>
      </section>

      {/* 2. ARCHITECTURE COMPARISON (Why it's better) */}
      <section className="px-6 max-w-6xl mx-auto mb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Why FlashGuard?</h2>
          <p className="text-gray-400">Architectural advantages over standard solutions.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: vs Standard Caching */}
          <div className="p-8 bg-gray-900/40 border border-gray-800 rounded-2xl hover:border-yellow-500/30 transition-all group">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-red-500">vs</span> Standard Caching
            </h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              <b>The Problem:</b> Standard caches suffer from "Race Conditions." If the cache is empty, 1,000 users will all hit the DB before the first one can populate the cache.
            </p>
            <p className="text-sm text-yellow-500/90 font-medium">
              ⚡ <b>FlashGuard Solution:</b> It queues the 1,000 users. The first one updates the cache; the other 999 wait and get the result instantly.
            </p>
          </div>

          {/* Card 2: vs Local Batching */}
          <div className="p-8 bg-gray-900/40 border border-gray-800 rounded-2xl hover:border-yellow-500/30 transition-all group">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-red-500">vs</span> Local Batching
            </h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              <b>The Problem:</b> Instance-level tools only group requests on <i>one</i> server. If you have 50 microservices, your DB still gets hit 50 times.
            </p>
            <p className="text-sm text-yellow-500/90 font-medium">
              ⚡ <b>FlashGuard Solution:</b> Distributed locking via Redis coordinates requests across your <b>entire cluster</b>. Total DB calls: 1.
            </p>
          </div>

          {/* Card 3: vs Job Queues */}
          <div className="p-8 bg-gray-900/40 border border-gray-800 rounded-2xl hover:border-yellow-500/30 transition-all group">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-red-500">vs</span> Job Queues
            </h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              <b>The Problem:</b> Background queues are designed for async tasks (like emails). They are too slow for users waiting for a profile page load.
            </p>
            <p className="text-sm text-yellow-500/90 font-medium">
              ⚡ <b>FlashGuard Solution:</b> Optimized for <b>real-time latency</b>. Users get data in milliseconds, not seconds.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CODE DEMO */}
      <section className="px-6 max-w-5xl mx-auto mb-32">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-6">Simple Integration</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Wrap your expensive database calls with a single function. FlashGuard handles the locking, caching, and coalescing automatically.
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-300">
                <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs">✓</span>
                First-class TypeScript Support
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs">✓</span>
                Fail-Open Design (Never blocks if Redis dies)
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs">✓</span>
                Stale-While-Revalidate Built-in
              </li>
            </ul>
          </div>

          <div className="flex-1 w-full">
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 shadow-2xl font-mono text-sm overflow-x-auto">
              <div className="text-gray-500 mb-4">/* Example: Protecting a Product Profile */</div>
              
              <div className="space-y-2">
                <div><span className="text-purple-400">const</span> guard = <span className="text-purple-400">new</span> <span className="text-yellow-400">FlashGuard</span>(driver);</div>
                <div className="h-4"></div>
                <div><span className="text-purple-400">async function</span> <span className="text-blue-400">getProduct</span>(id) {'{'}</div>
                <div className="pl-4">
                   <span className="text-purple-400">return await</span> guard.<span className="text-yellow-400">fetch</span>(
                </div>
                <div className="pl-8 text-green-400">`product:${'{'}id{'}'}`<span className="text-gray-400">,</span></div>
                <div className="pl-8 text-gray-400">// 🟢 The "Leader" Work (Runs Once)</div>
                <div className="pl-8">
                  <span className="text-purple-400">async</span> () ={'>'} <span className="text-purple-400">await</span> db.<span className="text-blue-400">query</span>(<span className="text-green-400">'SELECT *...'</span>)<span className="text-gray-400">,</span>
                </div>
                <div className="pl-8 text-gray-400">{'{'} ttl: 60 {'}'}</div>
                <div className="pl-4">);</div>
                <div>{'}'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BENCHMARKS (From README) */}
      <section className="px-6 max-w-4xl mx-auto mb-32">
        <h2 className="text-3xl font-bold text-white mb-10 text-center">Real-World Performance</h2>
        <p className="text-center text-gray-500 mb-8 text-sm">Tests conducted under high-concurrency load (100 concurrent users)</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {/* Stat 1 */}
          <div className="bg-gray-900 border border-gray-800 p-8 text-center first:rounded-t-2xl md:first:rounded-l-2xl md:first:rounded-tr-none">
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Response Time (p95)</div>
            <div className="text-4xl font-bold text-white mb-2">1.06<span className="text-lg text-gray-500">s</span></div>
            <div className="text-green-400 text-sm font-bold bg-green-400/10 inline-block px-2 py-1 rounded">19% Faster</div>
          </div>

          {/* Stat 2 */}
          <div className="bg-gray-900 border-x border-y md:border-y-0 md:border-x border-gray-800 p-8 text-center">
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Throughput</div>
            <div className="text-4xl font-bold text-white mb-2">132<span className="text-lg text-gray-500"> req/s</span></div>
            <div className="text-green-400 text-sm font-bold bg-green-400/10 inline-block px-2 py-1 rounded">27% More Capacity</div>
          </div>

          {/* Stat 3 */}
          <div className="bg-gray-900 border border-gray-800 p-8 text-center last:rounded-b-2xl md:last:rounded-r-2xl md:last:rounded-bl-none relative overflow-hidden">
             <div className="absolute inset-0 bg-yellow-500/5"></div>
            <div className="text-yellow-500 text-xs uppercase tracking-wider mb-2 relative z-10">Database Load</div>
            <div className="text-4xl font-bold text-white mb-2 relative z-10">1<span className="text-lg text-gray-500"> call</span></div>
            <div className="text-yellow-400 text-sm font-bold bg-yellow-400/10 inline-block px-2 py-1 rounded relative z-10">99% Load Reduction</div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <section className="text-center py-20 px-6 border-t border-gray-900/50">
        <h2 className="text-2xl font-bold text-white mb-6">Ready to scale safely?</h2>
        <div className="flex justify-center gap-4">
          <Link href="https://github.com/AsadAhmedSaiyed/FlashGuard-Library" className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
            View on GitHub
          </Link>
          <Link href="/dashboard" className="px-6 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
            View Live Demo
          </Link>
        </div>
        <div className="mt-10 text-gray-600 text-sm">
          MIT License © 2025 Asad Ahmed Saiyed | asadahmedsaiyed786@gmail.com
        </div>
      </section>
    </main>
  );
}
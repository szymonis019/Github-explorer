'use client';
import { useState } from 'react';
import { Swords, Trophy, Star, Zap, Users, Code2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Dev Duel Arena Component
 * Compares two GitHub users based on dynamic metrics.
 */
export default function DuelPage() {
  const [p1, setP1] = useState<any>(null);
  const [p2, setP2] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Unified fetch function for both players with error handling
  const fetchUser = async (name: string, setFn: any) => {
    if (!name) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/user/${name}/stats`);
      const data = await res.json();
      
      // Checking for error returned by the backend
      if (data.error) {
        alert(data.error);
        setFn(null);
        return;
      }

      setFn(data);
    } catch (err) {
      console.error("Duel API error:", err);
      alert("Failed to connect to the arena.");
      setFn(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * DUEL LOGIC: Dynamic winner calculation
   */
  const winner = p1 && p2 && p1.powerLevel !== undefined && p2.powerLevel !== undefined 
    ? (p1.powerLevel > p2.powerLevel ? 'p1' : 'p2') 
    : null;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10 font-sans relative overflow-hidden">
      
      {/* Title with bouncing swords animation */}
      <h1 className="text-center text-6xl font-black mb-16 italic tracking-tighter flex items-center justify-center gap-4">
        CODE <Swords size={50} className="text-red-500 animate-pulse" /> CLASH
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
        
        {/* PLAYER 1 SLOT */}
        <div className="order-1 space-y-4">
            <input 
              onKeyDown={(e: any) => e.key === 'Enter' && fetchUser(e.target.value, setP1)}
              id="p1-in" placeholder="Enter Player 1 Username..." 
              className="w-full mb-4 bg-gray-900 border border-gray-800 p-4 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            />
            {/* Loading state and conditional BattleCard render */}
            {loading ? <DuelSkeleton /> : 
             p1 && !p1.error && <BattleCard user={p1} isWinner={winner === 'p1'} color="blue" />}
        </div>

        {/* CENTRAL VERSUS ZONE */}
        <div className="order-2 flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center text-3xl font-black shadow-[0_0_50px_rgba(220,38,38,0.5)] border-4 border-black">
                VS
            </div>
            {!p1 && !loading && (
              <p className="mt-4 text-gray-500 animate-bounce text-sm font-bold uppercase tracking-widest">
                Type usernames and press Enter!
              </p>
            )}
        </div>

        {/* PLAYER 2 SLOT */}
        <div className="order-3 space-y-4">
            <input 
              onKeyDown={(e: any) => e.key === 'Enter' && fetchUser(e.target.value, setP2)}
              id="p2-in" placeholder="Enter Player 2 Username..." 
              className="w-full mb-4 bg-gray-900 border border-gray-800 p-4 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
            />
            {/* Loading state and conditional BattleCard render */}
            {loading ? <DuelSkeleton /> : 
             p2 && !p2.error && <BattleCard user={p2} isWinner={winner === 'p2'} color="red" />}
        </div>
      </div>
    </div>
  );
}

/**
 * BattleCard Utility Component
 * Renders the player's profile, stats, and power bar dynamically.
 */
function BattleCard({ user, isWinner, color }: { user: any, isWinner: boolean, color: string }) {
  const barColor = color === 'blue' ? 'bg-blue-500' : 'bg-red-500';
  
  return (
    <div className={`relative p-8 rounded-[2rem] bg-gray-900 border-2 transition-all duration-500 flex flex-col items-center ${
      isWinner ? 'winner-glow animate-float' : 'border-gray-800 opacity-80 scale-95'
    }`}>
      
      {/* Trophy and crown icons for the winner */}
      {isWinner && <Trophy className="absolute -top-6 -right-6 text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,1)]" size={60} />}
      
      <div className="flex flex-col items-center mb-8">
        {/* Profile Avatar */}
        {user.avatarUrl && (
          <Image 
            src={user.avatarUrl} 
            alt={user.username} 
            width={120} 
            height={120} 
            className={`rounded-full border-4 ${isWinner ? 'border-yellow-400' : 'border-gray-700'} mb-4`} 
          />
        )}
        <h2 className="text-3xl font-black">{user.username}</h2>
        {/* Optional name or language under username */}
        <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">{user.topLanguage} WIZARD</span>
      </div>

      <div className="space-y-6 w-full">
        {/* POWER LEVEL PROGRESS BAR */}
        <div>
            <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                <span>Power Level</span>
                {/* SAFE ACCESS: optional chaining and null fallback */}
                <span>{user.powerLevel?.toLocaleString() ?? '0'}</span>
            </div>
            <div className="w-full h-3 bg-black rounded-full overflow-hidden border border-gray-800">
                <div 
                  className={`h-full ${barColor} power-bar-fill shadow-[0_0_15px_rgba(59,130,246,0.5)]`} 
                  style={{ width: `${Math.min(((user.powerLevel || 0) / 10000) * 100, 100)}%` }} 
                />
            </div>
        </div>

        {/* COMBAT STATS GRID */}
        <div className="grid grid-cols-2 gap-4">
            {/* Replaced Lines with experience */}
            <StatBox 
              icon={<Zap size={14} className="text-yellow-400"/>} 
              label="Experience" 
              value={`${user.yearsActive ?? 1} Years`} 
            />
            <StatBox icon={<Star size={14}/>} label="Stars" value={user.totalStars ?? 0} />
            <StatBox icon={<Users size={14}/>} label="Followers" value={user.followers ?? 0} />
            <StatBox icon={<Code2 size={14}/>} label="Repos" value={user.analyzedRepos ?? 0} />
        </div>
      </div>
    </div>
  );
}

/**
* StatBox Sub-component
 */
function StatBox({ icon, label, value }: { icon: any, label: string, value: any }) {
    return (
        <div className="bg-black/30 p-3 rounded-xl border border-gray-800/50 flex-1 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-gray-500">
                {icon} <span className="text-[10px] uppercase font-bold tracking-tighter">{label}</span>
            </div>
            <div className="text-lg font-mono font-bold text-white">{value}</div>
        </div>
    )
}

/**
 * Animated Loading Skeleton
 */
function DuelSkeleton() {
    return <div className="h-[450px] bg-gray-900 animate-pulse rounded-[2rem]" />
}
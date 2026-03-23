import Image from 'next/image';
import { Trophy, Zap, Star, Users, Code2 } from 'lucide-react';
import StatBox from './StatBox';

interface BattleCardProps {
  user: any;
  isWinner: boolean;
  color: 'blue' | 'red';
}

export default function BattleCard({ user, isWinner, color }: BattleCardProps) {
  const barColor = color === 'blue' ? 'bg-blue-500' : 'bg-red-500';
  const glowClass = isWinner ? 'winner-glow animate-float' : 'border-gray-800 opacity-80 scale-95';

  return (
    <div className={`relative p-8 rounded-[2rem] bg-gray-900 border-2 transition-all duration-500 flex flex-col items-center ${glowClass}`}>
      {isWinner && (
        <Trophy 
          className="absolute -top-6 -right-6 text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,1)]" 
          size={60} 
        />
      )}
      
      <div className="flex flex-col items-center mb-8">
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
        <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">
          {user.topLanguage || 'Unknown'} Wizard
        </span>
      </div>

      <div className="space-y-6 w-full">
        {/* POWER LEVEL BAR */}
        <div>
          <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
            <span>Poziom mocy</span>
            <span>{user.powerLevel?.toLocaleString() ?? '0'}</span>
          </div>
          <div className="w-full h-3 bg-black rounded-full overflow-hidden border border-gray-800">
            <div 
              className={`h-full ${barColor} power-bar-fill shadow-[0_0_15px_rgba(59,130,246,0.3)]`} 
              style={{ width: `${Math.min(((user.powerLevel || 0) / 10000) * 100, 100)}%` }} 
            />
          </div>
        </div>

        {/* COMBAT STATS GRID */}
        <div className="grid grid-cols-2 gap-4">
          <StatBox 
            icon={<Zap size={14} className="text-yellow-400"/>} 
            label="Experience" 
            value={`${user.yearsActive ?? 1} Years`} 
          />
          <StatBox 
            icon={<Star size={14} className="text-yellow-500"/>} 
            label="Stars" 
            value={user.totalStars ?? 0} 
          />
          <StatBox 
            icon={<Users size={14} className="text-blue-400"/>} 
            label="Followers" 
            value={user.followers ?? 0} 
          />
          <StatBox 
            icon={<Code2 size={14} className="text-green-400"/>} 
            label="Repos" 
            value={user.analyzedRepos ?? 0} 
          />
        </div>
      </div>
    </div>
  );
}
'use client';
import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export default function CommitClock({ username }: { username: string }) {
  const [hours, setHours] = useState<number[]>(new Array(24).fill(0));

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}/events`)
      .then(res => res.json())
      .then(events => {
        const hCount = new Array(24).fill(0);
        events.forEach((e: any) => {
          const hour = new Date(e.created_at).getHours();
          hCount[hour]++;
        });
        setHours(hCount);
      });
  }, [username]);

  const maxActivity = Math.max(...hours);

  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
      <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2">
        <Clock size={16} /> AKTUALNY BIORYTM (Ostatnie 30 akcji)
      </h3>
      <div className="flex items-end gap-1 h-20">
        {hours.map((count, i) => (
          <div 
            key={i} 
            className="flex-1 bg-blue-600 rounded-t-sm transition-all" 
            style={{ height: maxActivity ? `${(count / maxActivity) * 100}%` : '2px', opacity: count ? 1 : 0.2 }}
            title={`${i}:00 - ${count} akcji`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-mono">
        <span>00:00</span>
        <span>12:00</span>
        <span>23:59</span>
      </div>
    </div>
  );
}
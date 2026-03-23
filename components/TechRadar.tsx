'use client';
import { useEffect, useState } from 'react';
import { Cpu } from 'lucide-react';

/**
 * TechRadar Component
 */
export default function TechRadar({ username }: { username: string }) {
  const [data, setData] = useState<{ repoName: string, type: string, dependencies: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/user/${username}/dependencies`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username]);

  if (loading) return <div className="h-40 bg-gray-900 animate-pulse rounded-2xl border border-gray-800" />;

  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 h-full flex flex-col">
      <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
        <Cpu size={16} className="text-purple-500" /> Tech Stack
      </h3>
      
      {data?.repoName && data.dependencies.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-2">
            <p className="text-xs text-gray-500 italic">
              Analiza projektu: <span className="text-blue-400 font-bold block sm:inline">{data.repoName}</span>
            </p>
            {/* Badge informing about the detected ecosystem (e.g. Python, Node.js) */}
            <span className="shrink-0 text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded uppercase font-bold border border-gray-700">
              {data.type}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {data.dependencies.map((dep, i) => (
              <span 
                key={i} 
                className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-mono font-bold hover:bg-blue-500/20 transition-colors"
              >
                {dep}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600 text-sm text-center italic">
            Nie wykryto konkretnych technologii w wybranym projekcie.
          </p>
        </div>
      )}
    </div>
  );
}
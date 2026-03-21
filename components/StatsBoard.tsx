'use client';

import { useEffect, useState } from 'react';
import { Star, Code2, BookOpen, Calendar } from 'lucide-react';

interface StatsBoardProps {
  username: string;
  publicRepos: number;
  joinYear: number;
}

/**
 * Client-side statistics board.
 * Implements the Client-Side Fetching pattern to offload heavy calculations 
 * to our internal API, keeping the initial page load extremely fast.
 */
export default function StatsBoard({ username, publicRepos, joinYear }: StatsBoardProps) {
  const [stats, setStats] = useState({ totalStars: 0, topLanguage: '...' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch aggregated data from our custom Backend-For-Frontend (BFF) endpoint
    fetch(`/api/user/${username}/stats`)
      .then(res => res.json())
      .then(data => {
        setStats({
          totalStars: data.totalStars || 0,
          topLanguage: data.topLanguage || 'Brak'
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch user statistics:", err);
        setLoading(false);
      });
  }, [username]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center text-center transition-all hover:border-gray-700">
        <Star className="text-yellow-500 mb-2" size={24} />
        <span className="text-2xl font-bold">
          {/* Display a pulsing placeholder while data is being fetched */}
          {loading ? <span className="animate-pulse text-gray-600">...</span> : stats.totalStars}
        </span>
        <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">Suma Gwiazdek</span>
      </div>
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center text-center transition-all hover:border-gray-700">
        <Code2 className="text-blue-500 mb-2" size={24} />
        <span className="text-2xl font-bold">
          {loading ? <span className="animate-pulse text-gray-600">...</span> : stats.topLanguage}
        </span>
        <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">Główny Język</span>
      </div>
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center text-center transition-all hover:border-gray-700">
        <BookOpen className="text-purple-500 mb-2" size={24} />
        <span className="text-2xl font-bold">{publicRepos}</span>
        <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">Repozytoria</span>
      </div>
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center text-center transition-all hover:border-gray-700">
        <Calendar className="text-green-500 mb-2" size={24} />
        <span className="text-2xl font-bold">{joinYear}</span>
        <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">Rok dołączenia</span>
      </div>
    </div>
  );
}
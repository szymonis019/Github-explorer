'use client';

import { Repo } from '@/types/github';
import { useState, useEffect } from 'react';
import { Folder, Search, Star } from 'lucide-react';

/**
 * Full repositories list with client-side searching and filtering.
 * Demonstrates state management for interactive UI elements.
 */
export default function ReposPage({ params }: { params: Promise<{ username: string }> }) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [search, setSearch] = useState('');
  const [selectedLang, setSelectedLang] = useState('All');
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Unwrapping Next.js 15 async params and fetching data
    params.then((resolved) => {
      setUsername(resolved.username);
      fetch(`https://api.github.com/users/${resolved.username}/repos?sort=updated&per_page=100`)
        .then(res => res.json())
        .then(data => {
          setRepos(Array.isArray(data) ? data : []);
          setLoading(false);
        });
    });
  }, [params]);

  // Extracting unique languages from the repos list for the filter dropdown
  const languages = ['All', ...Array.from(new Set(repos.map(r => r.language).filter(Boolean)))];

  /**
   * Combined filtering logic.
   * Filters by case-insensitive name match AND programming language.
   */
  const filteredRepos = repos.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(search.toLowerCase());
    const matchesLang = selectedLang === 'All' || repo.language === selectedLang;
    return matchesSearch && matchesLang;
  });

  if (loading) return <div className="min-h-screen bg-gray-950 text-white p-8 text-center pt-20">Ładowanie repozytoriów...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <a href={`/user/${username}`} className="inline-block text-gray-400 hover:text-white transition-colors">
          &larr; Wróć do profilu
        </a>
        
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-6">
          <Folder className="text-blue-500" size={32} />
          Wszystkie repozytoria ({repos.length})
        </h1>

        {/* Filter Panel: Search input and Language dropdown */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Szukaj repozytorium..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        {/* Results Grid: Displays filtered repositories or a "not found" message */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRepos.map(repo => (
            <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer" className="bg-gray-900 p-5 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all group">
              <div className="flex justify-between items-start mb-3">
                <div className="font-bold text-blue-400 group-hover:text-blue-300 truncate">
                  {repo.name}
                </div>
                <div className="flex items-center gap-1 text-gray-500 group-hover:text-yellow-500 transition-colors shrink-0">
                  <Star size={16} /> {repo.stargazers_count}
                </div>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{repo.description || 'Brak opisu.'}</p>
              <span className="px-3 py-1 bg-gray-800 text-xs rounded-full text-gray-300 border border-gray-700">{repo.language || 'Markdown'}</span>
            </a>
          ))}
          {filteredRepos.length === 0 && (
            <p className="text-gray-500 col-span-full text-center py-10">Nie znaleziono repozytoriów spełniających kryteria.</p>
          )}
        </div>
      </div>
    </div>
  );
}
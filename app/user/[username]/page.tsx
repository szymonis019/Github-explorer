import { GitHubUser, Repo } from '@/types/github';
import { Folder, Users, MapPin, ExternalLink, Activity, Star, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import StatsBoard from '@/components/StatsBoard';

/**
 * Server-side data fetching from GitHub API.
 */
async function getData(username: string) {
  const headers: Record<string, string> = process.env.GITHUB_TOKEN 
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } 
    : {};

  const [userRes, repoRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers, next: { revalidate: 3600 } }),
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, { headers, next: { revalidate: 3600 } })
  ]);
  
  if (!userRes.ok) return { user: null, repos: [] };
  
  return {
    user: (await userRes.json()) as GitHubUser,
    repos: (await repoRes.json()) as Repo[]
  };
}

/**
 * Dynamic User Profile Page (Server Component).
 */
export default async function UserPage({ params }: { params: Promise<{ username: string }> }) {
  // Unwrapping async params
  const resolvedParams = await params;
  const { user, repos } = await getData(resolvedParams.username);

  // Guard clause for non-existent GitHub profiles
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-2">Użytkownik nie znaleziony</h1>
        <p className="text-gray-400 mb-6">Sprawdź, czy wpisany login "{resolvedParams.username}" jest poprawny.</p>
        <Link href="/" className="bg-blue-600 px-6 py-2 rounded-xl hover:bg-blue-500 transition-colors">
          Wróć do wyszukiwarki
        </Link>
      </div>
    );
  }

  const joinYear = new Date(user.created_at || Date.now()).getFullYear();

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation back to search */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group w-fit"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Wróć do wyszukiwarki
        </Link>
        
        {/* Main User Profile Header */}
        <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 flex flex-col md:flex-row gap-8 items-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600" />
          <Image src={user.avatar_url} alt={user.login} width={120} height={120} className="rounded-full border-4 border-gray-800" />
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-extrabold mb-2">{user.name || user.login}</h1>
            <p className="text-gray-400 text-lg mb-4">{user.bio || 'Brak opisu profilu.'}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400 justify-center md:justify-start">
              <span className="flex items-center gap-1.5"><Users size={16} className="text-blue-400"/> {user.followers} followers</span>
              <span className="flex items-center gap-1.5"><MapPin size={16} className="text-red-400"/> {user.location || 'Remote'}</span>
              <a href={user.html_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-400 hover:underline"><ExternalLink size={16}/> GitHub</a>
            </div>
          </div>
        </div>

        {/* Integration of Client-Side statistics fetching */}
        <StatsBoard username={user.login} publicRepos={user.public_repos} joinYear={joinYear} />

        {/* Recent Repositories Grid */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Activity className="text-blue-500" /> Ostatnio aktualizowane
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {repos.map(repo => (
              <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer" className="bg-gray-900 p-5 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 font-bold text-blue-400 group-hover:text-blue-300 truncate">
                    <Folder size={20} className="shrink-0" /> <span className="truncate">{repo.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 group-hover:text-yellow-500 transition-colors shrink-0">
                    <Star size={16} fill="currentColor" className="hidden group-hover:block" />
                    <Star size={16} className="group-hover:hidden" />
                    {repo.stargazers_count}
                  </div>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{repo.description || 'Brak opisu.'}</p>
                <span className="px-3 py-1 bg-gray-800 text-xs rounded-full text-gray-300 border border-gray-700">{repo.language || 'Markdown'}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
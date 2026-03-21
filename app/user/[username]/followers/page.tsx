import { GitHubFollower } from '@/types/github';
import Image from 'next/image';
import Link from 'next/link';
import { Users } from 'lucide-react';

/**
 * Server-side function to fetch user's followers.
 * Uses time-based revalidation to keep community data relatively fresh 
 * without hitting GitHub's rate limits on every request.
 */
async function getFollowers(username: string) {
  const headers: Record<string, string> = process.env.GITHUB_TOKEN 
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } 
    : {};

  const res = await fetch(`https://api.github.com/users/${username}/followers?per_page=100`, { 
    headers, 
    next: { revalidate: 3600 } // Cache data for 1 hour
  });
  
  if (!res.ok) return [];
  return (await res.json()) as GitHubFollower[];
}

/**
 * Followers Gallery Page.
 * Displays a responsive grid of follower profiles with seamless navigation.
 */
export default async function FollowersPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const followers = await getFollowers(resolvedParams.username);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Simple back navigation to the main profile overview */}
        <a href={`/user/${resolvedParams.username}`} className="inline-block text-gray-400 hover:text-white transition-colors">
          &larr; Wróć do profilu
        </a>
        
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="text-blue-500" size={32} />
          Obserwujący ({followers.length})
        </h1>

        {/* Responsive followers grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {followers.map((follower) => (
            <Link 
              key={follower.id} 
              href={`/user/${follower.login}`} 
              className="bg-gray-900 p-4 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all flex flex-col items-center text-center group"
            >
              {/* Profile Image with hover scaling effect */}
              <Image 
                src={follower.avatar_url} 
                alt={follower.login} 
                width={80} 
                height={80} 
                className="rounded-full mb-3 group-hover:scale-105 transition-transform" 
              />
              <span className="font-semibold text-gray-200 group-hover:text-blue-400">
                {follower.login}
              </span>
            </Link>
          ))}
          
          {/* Handling state where the user has no followers */}
          {followers.length === 0 && (
            <p className="text-gray-500 col-span-full">
              Ten użytkownik nie ma jeszcze obserwujących.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
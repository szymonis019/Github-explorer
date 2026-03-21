import { GitHubEvent } from '@/types/github';
import { Activity, GitCommit, GitMerge, Star, Code } from 'lucide-react';

/**
 * Fetches the latest public activity events for a specific user.
 * Limits the result to 30 items to maintain performance and readability.
 */
async function getEvents(username: string) {
  const headers: Record<string, string> = process.env.GITHUB_TOKEN 
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } 
    : {};

  const res = await fetch(`https://api.github.com/users/${username}/events?per_page=30`, { 
    headers, 
    next: { revalidate: 3600 } 
  });
  
  if (!res.ok) return [];
  return (await res.json()) as GitHubEvent[];
}

/**
 * User Activity Timeline page (Server Component).
 * Renders a vertical list of recent GitHub events with type-specific icons and descriptions.
 */
export default async function ActivityPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const events = await getEvents(resolvedParams.username);

  /**
   * Helper function to map GitHub event types to specific Lucide icons.
   */
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'PushEvent': return <GitCommit className="text-green-500" size={20} />;
      case 'PullRequestEvent': return <GitMerge className="text-purple-500" size={20} />;
      case 'WatchEvent': return <Star className="text-yellow-500" size={20} />;
      default: return <Code className="text-blue-500" size={20} />;
    }
  };

  /**
   * Helper function to generate human-readable descriptions for different event types.
   */
  const getEventDescription = (event: GitHubEvent) => {
    switch (event.type) {
      case 'PushEvent': return `Wypchnął kod do repozytorium`;
      case 'PullRequestEvent': return `Zaktualizował Pull Request w`;
      case 'WatchEvent': return `Dodał gwiazdkę do`;
      case 'CreateEvent': return `Utworzył nowe repozytorium`;
      case 'IssuesEvent': return `Zgłosił problem (Issue) w`;
      default: return `Wykonał akcję w`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <a href={`/user/${resolvedParams.username}`} className="inline-block text-gray-400 hover:text-white transition-colors">
          &larr; Wróć do profilu
        </a>
        
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Activity className="text-blue-500" size={32} />
          Ostatnia aktywność
        </h1>

        {/* Timeline visual line implemented via a 'before' pseudo-element. 
            It creates a vertical gradient line that connects the activity icons.
        */}
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-800 before:to-transparent">
          {events.map((event) => (
            <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Event Icon Bubble */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-800 bg-gray-900 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                {getEventIcon(event.type)}
              </div>
              
              {/* Event Content Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-900 p-4 rounded-xl border border-gray-800 shadow">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-gray-200">{getEventDescription(event)}</span>
                  <span className="text-xs text-gray-500">{new Date(event.created_at).toLocaleDateString()}</span>
                </div>
                <a href={`https://github.com/${event.repo.name}`} target="_blank" rel="noreferrer" className="text-blue-400 text-sm hover:underline font-mono">
                  {event.repo.name}
                </a>
              </div>
            </div>
          ))}
          
          {/* Empty state handling */}
          {events.length === 0 && (
            <p className="text-gray-500 text-center">Brak publicznej aktywności w ostatnim czasie.</p>
          )}
        </div>
      </div>
    </div>
  );
}
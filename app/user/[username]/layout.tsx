import Link from 'next/link';
import { LayoutDashboard, Users, Folder, Activity } from 'lucide-react';

/**
 * Nested Layout for the user profile section.
 * Maintains a persistent sub-navigation bar (tabs) across all nested routes:
 * Overview, Repositories, Followers, and Activity.
 */
export default async function UserLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  // Accessing dynamic route parameters in Next.js 15
  const resolvedParams = await params;
  const username = resolvedParams.username;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Sub-navigation Tabs */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex overflow-x-auto no-scrollbar">
          <Link 
            href={`/user/${username}`} 
            className="flex items-center gap-2 px-4 py-4 text-gray-400 hover:text-white border-b-2 border-transparent hover:border-blue-500 transition-colors whitespace-nowrap"
          >
            <LayoutDashboard size={18} /> Profil
          </Link>
          <Link 
            href={`/user/${username}/repos`} 
            className="flex items-center gap-2 px-4 py-4 text-gray-400 hover:text-white border-b-2 border-transparent hover:border-blue-500 transition-colors whitespace-nowrap"
          >
            <Folder size={18} /> Wszystkie Repozytoria
          </Link>
          <Link 
            href={`/user/${username}/followers`} 
            className="flex items-center gap-2 px-4 py-4 text-gray-400 hover:text-white border-b-2 border-transparent hover:border-blue-500 transition-colors whitespace-nowrap"
          >
            <Users size={18} /> Obserwujący
          </Link>
          <Link 
            href={`/user/${username}/activity`} 
            className="flex items-center gap-2 px-4 py-4 text-gray-400 hover:text-white border-b-2 border-transparent hover:border-blue-500 transition-colors whitespace-nowrap"
          >
            <Activity size={18} /> Aktywność
          </Link>
        </div>
      </div>

      {/* Render the specific page content inside the layout */}
      <main>
        {children}
      </main>
    </div>
  );
}
import SearchInput from '@/components/SearchInput';
import { Github } from 'lucide-react';

/**
 * Landing page component.
 * Serves as the main entry point, providing the search interface for the application.
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      {/* Centered Hero Section */}
      <div className="text-center space-y-8 w-full max-w-2xl">
        
        {/* Decorative Brand Icon */}
        <div className="flex justify-center">
          <div className="bg-blue-600/20 p-5 rounded-full border border-blue-500/30">
            <Github className="text-blue-500" size={56} />
          </div>
        </div>

        {/* Headlines */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
            GitHub <span className="text-blue-500">Explorer</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl">
            Wyszukaj dowolnego programistę i sprawdź jego statystyki.
          </p>
        </div>

        {/* Core Search Interaction Point */}
        <div className="flex justify-center pt-4">
          <SearchInput />
        </div>
        
        {/* User Guidance / Examples */}
        <p className="text-gray-600 text-sm mt-4">
          Przykłady: <span className="text-gray-400 italic">user123, person 123, me123</span>
        </p>
      </div>
    </main>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

/**
 * Client-side search form.
 * Captures user input and handles programmatic navigation to the dynamic user route.
 */
export default function SearchInput() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only navigate if the input is not empty
    if (username.trim()) {
      router.push(`/user/${username}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Wpisz nazwę użytkownika..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-xl font-semibold text-white transition-all">
        Szukaj
      </button>
    </form>
  );
}
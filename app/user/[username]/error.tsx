'use client';

/**
 * Error Boundary for the user profile segment.
 * Gracefully handles runtime errors (like API failures) and provides
 * a 'reset' functionality to attempt re-rendering the component tree.
 */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white p-4">
      <h2 className="text-3xl font-bold mb-4">Coś poszło nie tak!</h2>
      <p className="text-gray-400 mb-6">Wystąpił błąd podczas pobierania danych z GitHuba.</p>
      <div className="flex gap-4">
        {/* reset() tries to recover by re-executing the server component fetch */}
        <button onClick={() => reset()} className="bg-blue-600 px-6 py-2 rounded-xl hover:bg-blue-500 transition-colors">
          Spróbuj ponownie
        </button>
        <a href="/" className="bg-gray-800 px-6 py-2 rounded-xl hover:bg-gray-700 transition-colors">
          Strona główna
        </a>
      </div>
    </div>
  );
}
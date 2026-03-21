/**
 * Skeleton loading screen.
 * Acts as a UI placeholder that matches the shape of the user profile,
 * improving perceived performance during server-side data fetching.
 */
export default function UserSkeleton() {
  return (
    // 'animate-pulse' provides the subtle fading effect typical for skeleton loaders
    <div className="animate-pulse space-y-8 w-full max-w-4xl mx-auto">
      
      {/* Profile Header Skeleton */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-8 bg-gray-900 rounded-3xl border border-gray-800">
        <div className="w-[120px] h-[120px] bg-gray-800 rounded-full shrink-0" />
        <div className="flex-1 w-full space-y-4 pt-2">
          <div className="h-8 bg-gray-800 rounded-md w-1/2 mx-auto md:mx-0" />
          <div className="h-4 bg-gray-800 rounded-md w-3/4 mx-auto md:mx-0" />
          <div className="flex gap-4 justify-center md:justify-start pt-2">
            <div className="h-4 bg-gray-800 rounded-md w-24" />
            <div className="h-4 bg-gray-800 rounded-md w-24" />
          </div>
        </div>
      </div>
      
      {/* Repositories Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-36 bg-gray-900 rounded-2xl border border-gray-800" />
        ))}
      </div>
    </div>
  );
}
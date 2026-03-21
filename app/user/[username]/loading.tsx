import UserSkeleton from '@/components/UserSkeleton';

/**
 * Streaming UI for the user profile segment.
 * Next.js automatically shows this while Server Components are fetching data,
 * providing a seamless transition using the UserSkeleton component.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-950 p-8 flex flex-col pt-20">
      <UserSkeleton />
    </div>
  );
}
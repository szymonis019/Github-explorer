export default function DuelSkeleton() {
  return (
    <div className="h-[480px] w-full bg-gray-900/50 animate-pulse rounded-[2rem] border border-gray-800 flex flex-col items-center p-8">
      <div className="w-32 h-32 bg-gray-800 rounded-full mb-6" />
      <div className="w-48 h-8 bg-gray-800 rounded-lg mb-4" />
      <div className="w-full space-y-4 mt-8">
        <div className="h-12 bg-gray-800 rounded-xl w-full" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-16 bg-gray-800 rounded-xl" />
          <div className="h-16 bg-gray-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
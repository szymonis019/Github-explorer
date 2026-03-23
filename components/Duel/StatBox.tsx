import { ReactNode } from 'react';

interface StatBoxProps {
  icon: ReactNode;
  label: string;
  value: string | number;
}

export default function StatBox({ icon, label, value }: StatBoxProps) {
  return (
    <div className="bg-black/30 p-3 rounded-xl border border-gray-800/50 flex-1 flex flex-col gap-1 transition-all hover:bg-black/50">
      <div className="flex items-center gap-2 text-gray-500">
        <span className="shrink-0">{icon}</span>
        <span className="text-[10px] uppercase font-bold tracking-tighter">{label}</span>
      </div>
      <div className="text-lg font-mono font-bold text-white truncate">{value}</div>
    </div>
  );
}
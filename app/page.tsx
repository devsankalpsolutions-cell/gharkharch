'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-indigo-600 to-purple-600 flex items-center justify-center font-black text-2xl animate-bounce mb-4">
        GK
      </div>
      <h2 className="text-xl font-extrabold tracking-tight">Ghar Kharch</h2>
      <p className="text-xs text-slate-400 mt-1">Loading your financial dashboard...</p>
    </div>
  );
}

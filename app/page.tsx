'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FamvexaLogo } from '@/components/ui/FamvexaLogo';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#081631] flex flex-col items-center justify-center text-white p-4">
      <FamvexaLogo showTagline={true} showSubCredit={true} size="lg" className="animate-pulse mb-4" />
      <p className="text-xs text-cyan-400 font-medium mt-2">Loading your secure financial workspace...</p>
    </div>
  );
}

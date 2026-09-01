'use client';

import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  colorClass?: string;
  heightClass?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  colorClass = 'bg-emerald-500',
  heightClass = 'h-2.5',
  showPercentage = true,
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`${colorClass} ${heightClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mt-1">
          <span>{clamped.toFixed(1)}% paid</span>
          <span>{(100 - clamped).toFixed(1)}% remaining</span>
        </div>
      )}
    </div>
  );
};

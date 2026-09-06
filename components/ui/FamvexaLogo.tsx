import React from 'react';
import Image from 'next/image';
import { FamvexaIcon } from './FamvexaIcon';

interface FamvexaLogoProps {
  showTagline?: boolean;
  showSubCredit?: boolean;
  variant?: 'full' | 'compact' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FamvexaLogo: React.FC<FamvexaLogoProps> = ({
  showTagline = true,
  showSubCredit = false,
  variant = 'full',
  size = 'md',
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const taglineSizes = {
    sm: 'text-[9px]',
    md: 'text-[10.5px]',
    lg: 'text-[12px]',
  };

  if (variant === 'icon-only') {
    return <FamvexaIcon className={`${iconSizes[size]} ${className}`} />;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon Mark */}
      <FamvexaIcon className={iconSizes[size]} />

      {/* Brand Text Stack */}
      <div className="flex flex-col justify-center">
        <div className={`font-extrabold tracking-tight leading-none flex items-center ${textSizes[size]}`}>
          <span className="text-slate-900 dark:text-white">Famve</span>
          <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 bg-clip-text text-transparent font-black px-[1px]">
            x
          </span>
          <span className="text-slate-900 dark:text-white">a</span>
          <span className="text-cyan-500 dark:text-cyan-400 text-xs font-semibold ml-0.5 self-start">.com</span>
        </div>

        {/* Tagline */}
        {showTagline && (
          <span className={`font-semibold tracking-wider text-cyan-600 dark:text-cyan-400 mt-1 uppercase ${taglineSizes[size]}`}>
            Smarter Finances for Everyday Living
          </span>
        )}

        {/* Sub-Credit */}
        {showSubCredit && (
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-normal mt-0.5">
            A Devsankalp Solutions product
          </span>
        )}
      </div>
    </div>
  );
};

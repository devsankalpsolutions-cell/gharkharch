'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';

interface FamvexaLogoProps {
  showTagline?: boolean;
  showSubCredit?: boolean;
  variant?: 'full' | 'compact' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FamvexaLogo: React.FC<FamvexaLogoProps> = ({
  showSubCredit = false,
  variant = 'full',
  size = 'md',
  className = '',
}) => {
  const { isDark } = useTheme();

  const heights = {
    sm: 32,
    md: 44,
    lg: 60,
  };

  if (variant === 'icon-only') {
    return (
      <img
        src="/famvexa-icon.png"
        alt="Famvexa Icon"
        className={`object-contain shrink-0 ${size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-12 w-12' : 'h-9 w-9'} ${className}`}
      />
    );
  }

  return (
    <div className={`flex flex-col items-start ${className}`}>
      {/* Dynamic Dark / Light Theme Logo Image */}
      <img
        src={isDark ? '/famvexa-logo-dark.png' : '/famvexa-logo-light.png'}
        alt="Famvexa - Smarter Finances for Everyday Living"
        style={{ height: `${heights[size]}px` }}
        className="object-contain shrink-0 w-auto transition-all duration-200"
      />

      {/* Sub-Credit */}
      {showSubCredit && (
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-normal mt-0.5 pl-1">
          A Devsankalp Solutions product
        </span>
      )}
    </div>
  );
};

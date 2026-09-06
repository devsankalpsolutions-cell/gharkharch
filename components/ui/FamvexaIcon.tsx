import React from 'react';

interface FamvexaIconProps {
  className?: string;
  size?: number;
}

export const FamvexaIcon: React.FC<FamvexaIconProps> = ({ className = 'w-9 h-9', size }) => {
  return (
    <svg
      width={size || undefined}
      height={size || undefined}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0`}
    >
      <defs>
        <linearGradient id="famvexa_f_grad1" x1="10" y1="10" x2="90" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="50%" stopColor="#0088FF" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="famvexa_f_grad2" x1="20" y1="40" x2="80" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="60%" stopColor="#00A3FF" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="famvexa_f_grad3" x1="15" y1="50" x2="45" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="100%" stopColor="#0099FF" />
        </linearGradient>
      </defs>

      {/* Top Wave Blade */}
      <path
        d="M25 15 C45 15, 80 16, 85 24 C90 32, 75 42, 50 42 C35 42, 28 35, 25 15 Z"
        fill="url(#famvexa_f_grad1)"
      />

      {/* Middle Wave Blade */}
      <path
        d="M25 45 C40 44, 68 45, 72 53 C76 61, 62 68, 42 68 C32 68, 27 60, 25 45 Z"
        fill="url(#famvexa_f_grad2)"
      />

      {/* Bottom Stem Curve */}
      <path
        d="M25 15 C23 35, 23 60, 25 78 C26 86, 35 88, 38 78 C40 70, 36 55, 38 45 C30 45, 27 30, 25 15 Z"
        fill="url(#famvexa_f_grad3)"
      />
    </svg>
  );
};

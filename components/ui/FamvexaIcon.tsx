import React from 'react';

interface FamvexaIconProps {
  className?: string;
  size?: number;
}

export const FamvexaIcon: React.FC<FamvexaIconProps> = ({ className = 'w-9 h-9', size }) => {
  return (
    <img
      src="/famvexa-icon.png"
      alt="Famvexa Icon"
      style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
      className={`object-contain shrink-0 ${className}`}
    />
  );
};

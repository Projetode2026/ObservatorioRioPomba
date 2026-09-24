import React from 'react';
import { Fish } from '../types';

interface FishVectorProps {
  fish: Fish;
  className?: string;
  isDiscovered?: boolean;
}

export const FishVector: React.FC<FishVectorProps> = ({ fish, className = 'w-full h-full', isDiscovered = true }) => {
  if (!isDiscovered) {
    return (
      <svg viewBox="0 0 100 60" className={className} xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="45" cy="30" rx="30" ry="16" fill="#c8d2cb" />
        <path d="M15 30 L0 16 L0 44 Z" fill="#c8d2cb" />
        <circle cx="64" cy="26" r="3" fill="#eef2ef" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 60" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Body with subtle gradient */}
      <defs>
        <linearGradient id={`grad-${fish.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: fish.color, stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: fish.accent, stopOpacity: 0.8}} />
        </linearGradient>
      </defs>
      
      {/* Main Body */}
      <path d="M10 30 C10 10 90 10 90 30 C90 50 10 50 10 30 Z" fill={`url(#grad-${fish.id})`} />
      
      {/* Tail Fin */}
      <path d="M90 30 L105 15 L105 45 Z" fill={fish.accent} />
      
      {/* Dorsal Fin */}
      <path d="M40 15 L55 5 L65 15 Z" fill={fish.accent} opacity="0.7" />
      
      {/* Eye */}
      <circle cx="25" cy="25" r="4" fill="white" />
      <circle cx="26" cy="25" r="2" fill="black" />
      
      {/* Scales/Detail lines */}
      <path d="M30 20 Q50 30 70 20" stroke="white" strokeWidth="0.5" fill="none" opacity="0.3" />
      <path d="M30 40 Q50 30 70 40" stroke="white" strokeWidth="0.5" fill="none" opacity="0.3" />
    </svg>
  );
};

import React from 'react';

interface GridBackgroundProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
  className?: string;
  patternOpacity?: number;
}

export function GridBackground({
  size = 20,
  color,
  backgroundColor,
  className = "",
  patternOpacity = 0.8
}: GridBackgroundProps) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id="smallGrid"
          width={size / 2}
          height={size / 2}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${size / 2} 0 L 0 0 0 ${size / 2}`}
            fill="none"
            style={{ stroke: color ?? "hsl(var(--grid-line))" }}
            strokeWidth="0.5"
            opacity={patternOpacity / 2}
          />
        </pattern>
        <pattern
          id="grid"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
        >
          <rect width={size} height={size} fill="url(#smallGrid)" />
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            style={{ stroke: color ?? "hsl(var(--grid-line))" }}
            strokeWidth="1"
            opacity={patternOpacity}
          />
        </pattern>
        <radialGradient id="vignette" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.03)" />
        </radialGradient>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={backgroundColor ?? "hsl(var(--grid-bg))"}
      />
      <rect width="100%" height="100%" fill="url(#grid)" />
      <rect width="100%" height="100%" fill="url(#vignette)" />
    </svg>
  );
} 
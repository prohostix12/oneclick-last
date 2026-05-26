import React from 'react';
import { LogoMarkProps } from './types';

export const LogoMark: React.FC<LogoMarkProps> = ({
  size,
  variant,
  className = ''
}) => {
  // Calculate proportional dimensions based on size
  const letterSize = size;
  const squareSize = size * 0.3; // Red square is 30% of letter size
  
  // SVG viewBox is always 100x100 for consistent scaling
  const viewBoxSize = 100;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      className={className}
      role="img"
      aria-label="One Click Logo Mark"
      style={{
        display: 'block',
        overflow: 'visible'
      }}
    >
      {/* Large "O" letter */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="var(--logo-text)"
        strokeWidth="8"
        style={{
          transition: 'all 0.3s ease'
        }}
      />
      
      {/* Red square accent positioned in the upper right of the "O" */}
      <rect
        x="65"
        y="20"
        width="25"
        height="25"
        fill="var(--logo-accent)"
        style={{
          transition: 'all 0.3s ease'
        }}
      />
      
      {/* Optional: Add subtle shadow/depth */}
      <defs>
        <filter id="logoShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="2"
            dy="2"
            stdDeviation="3"
            floodColor="rgba(0,0,0,0.1)"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default LogoMark;
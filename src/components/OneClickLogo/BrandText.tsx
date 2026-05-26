import React from 'react';
import { BrandTextProps } from './types';

export const BrandText: React.FC<BrandTextProps> = ({
  size,
  customFontSize,
  variant,
  showFullText,
  className = ''
}) => {
  // Font size configuration
  const fontSizes = {
    small: '1.2rem',
    medium: '1.8rem',
    large: 'clamp(2.5rem, 6vw, 4.5rem)',
    custom: customFontSize || '1.8rem'
  };

  const fontSize = fontSizes[size] || fontSizes.medium;
  
  // Font weight based on size
  const fontWeight = size === 'large' ? 900 : size === 'medium' ? 800 : 700;
  
  // Letter spacing for better readability
  const letterSpacing = size === 'large' ? '-2px' : size === 'medium' ? '-1px' : '-0.5px';

  const textStyle = {
    fontSize,
    fontWeight,
    letterSpacing,
    color: 'var(--logo-text)',
    lineHeight: 1,
    margin: 0,
    fontFamily: 'inherit',
    textRendering: 'optimizeLegibility' as const,
    WebkitFontSmoothing: 'antialiased' as const,
    MozOsxFontSmoothing: 'grayscale' as const,
    display: 'flex',
    alignItems: 'center',
    gap: '0'
  };

  const secondaryTextStyle = {
    fontSize: size === 'large' ? '0.8rem' : size === 'medium' ? '0.7rem' : '0.6rem',
    fontWeight: 600,
    color: 'var(--logo-secondary)',
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
    marginTop: '2px',
    lineHeight: 1,
  };

  // Calculate O size based on font size
  const getOSize = () => {
    if (size === 'large') return 60;
    if (size === 'medium') return 40;
    if (size === 'small') return 30;
    return 40;
  };

  const oSize = getOSize();
  const squareSize = oSize * 0.25;

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', alignItems: 'inherit' }}>
      {/* Main brand text with CUSTOM O and TWO red squares */}
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '0.08em' }}>
        {/* CUSTOM O - SVG Design (NOT a font) */}
        <div style={{ position: 'relative', display: 'inline-block', lineHeight: 1 }}>
          <svg 
            width={oSize} 
            height={oSize} 
            viewBox="0 0 120 120" 
            style={{ display: 'block' }}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Thick bold circular O - custom design */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="var(--logo-text)"
              strokeWidth="22"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Globe inside O */}
            <g style={{ pointerEvents: 'none' }}>
              <circle cx="60" cy="60" r="30" fill="none" stroke="var(--logo-accent)" strokeWidth="4" />
              <path d="M60,30 a30,30 0 0,1 0,60" fill="none" stroke="var(--logo-accent)" strokeWidth="2"/>
              <path d="M30,60 a30,30 0 0,1 60,0" fill="none" stroke="var(--logo-accent)" strokeWidth="2"/>
            </g>
          </svg>
          
          {/* FIRST red square - smaller, positioned above-right */}
          <div style={{
            position: 'absolute',
            top: '-18px',
            right: '12px',
            width: squareSize * 0.5,
            height: squareSize * 0.5,
            backgroundColor: '#FF1F3D',
            borderRadius: '2px',
            zIndex: 12
          }} />
          
          {/* SECOND red square - slightly larger, offset */}
          <div style={{
            position: 'absolute',
            top: '-8px',
            right: '-2px',
            width: squareSize * 0.65,
            height: squareSize * 0.65,
            backgroundColor: '#FF1F3D',
            borderRadius: '2px',
            zIndex: 11
          }} />
        </div>
        
        {/* "ne Click" text - Bold modern sans-serif */}
        <span style={{ 
          fontWeight: 900,
          fontSize: fontSize,
          color: 'var(--logo-text)',
          fontFamily: '"Inter", "Montserrat", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          letterSpacing: letterSpacing,
          lineHeight: 1,
          display: 'inline-block'
        }}>
          ne Click
        </span>
      </div>
    </div>
  );
};

export default BrandText;
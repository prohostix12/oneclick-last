import React from 'react';
import { LogoMark } from './LogoMark';
import { BrandText } from './BrandText';
import { OneClickLogoProps } from './types';
import styles from './styles.module.css';

export const OneClickLogo: React.FC<OneClickLogoProps> = ({
  size = 'medium',
  layout = 'horizontal',
  customSize,
  className = '',
  showFullText = true,
  variant = 'auto',
  as: Component = 'div',
  onClick,
  'aria-label': ariaLabel = 'One Click Advertisement Logo',
  ...props
}) => {
  // Size configuration
  const baseSizeConfig = {
    small: {
      logoMark: 30,
      fontSize: '1.2rem',
      gap: '8px',
      secondaryFontSize: '0.6rem'
    },
    medium: {
      logoMark: 40,
      fontSize: '1.8rem',
      gap: '12px',
      secondaryFontSize: '0.7rem'
    },
    large: {
      logoMark: 50,
      fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
      gap: '16px',
      secondaryFontSize: '0.8rem'
    }
  };

  const customSizeConfig = customSize ? {
    logoMark: customSize.width,
    fontSize: `${customSize.height * 0.8}px`,
    gap: `${customSize.width * 0.2}px`,
    secondaryFontSize: `${customSize.height * 0.3}px`
  } : baseSizeConfig.medium;

  const sizeConfig = {
    ...baseSizeConfig,
    custom: customSizeConfig
  };

  const currentSize = sizeConfig[size] || baseSizeConfig.medium;

  // Layout configuration
  const layoutStyles = {
    horizontal: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      textAlign: 'left' as const,
    },
    vertical: {
      flexDirection: 'column' as const,
      alignItems: 'center' as const,
      textAlign: 'center' as const,
    }
  };

  // Variant detection
  const getVariant = () => {
    if (variant !== 'auto') return variant;
    
    // Auto-detect based on system preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  const currentVariant = getVariant();

  const containerStyle = {
    display: 'flex',
    gap: currentSize.gap,
    ...layoutStyles[layout],
    cursor: onClick ? 'pointer' : 'default',
  };

  return (
    <Component
      className={`${styles.oneClickLogo} ${styles[`variant-${currentVariant}`]} ${className}`}
      style={containerStyle}
      onClick={onClick}
      aria-label={ariaLabel}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      <LogoMark 
        size={currentSize.logoMark} 
        variant={currentVariant} 
        className={styles.logoMark} 
      />
      <BrandText
        size={size}
        customFontSize={size === 'custom' ? currentSize.fontSize : undefined}
        variant={currentVariant}
        showFullText={showFullText}
        className={styles.brandText}
      />
    </Component>
  );
};

export default OneClickLogo;
export type { OneClickLogoProps } from './types';
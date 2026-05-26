"use client";

import Image from 'next/image';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showFullText?: boolean;
}

export default function Logo({ size = 'medium', className = '', showFullText = false }: LogoProps) {
  // Size configuration for the logo image - increased sizes
  const sizeConfig = {
    small: { width: 140, height: 70 },
    medium: { width: 200, height: 100 },
    large: { width: 400, height: 200 }
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  return (
    <div className={className} style={{ display: 'flex', alignItems: 'center' }}>
      <Image
        src="/oneclick-logo.png"
        alt="One Click Advertisement Logo"
        width={config.width}
        height={config.height}
        priority
        style={{
          width: '100%',
          height: 'auto',
          maxWidth: config.width,
        }}
      />
    </div>
  );
}

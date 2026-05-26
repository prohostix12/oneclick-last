"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedHeroHeadingProps {
  onReveal: () => void;
  onTagClick: () => void;
}

export default function AnimatedHeroHeading({ onReveal, onTagClick }: AnimatedHeroHeadingProps) {
  return (
    <div style={{ position: 'relative', display: 'block', width: '100%' }}>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: 'clamp(2.5rem, 8vw, 6.5rem)',
          fontWeight: 950,
          lineHeight: 1.05,
          marginBottom: '1.5rem',
          letterSpacing: '-2px',
          textShadow: '0 2px 20px rgba(0,0,0,0.9), 0 4px 40px rgba(0,0,0,0.7)',
          position: 'relative',
          display: 'block',
          width: '100%'
        }}
      >
        <span style={{ color: '#e61e25' }}>AT</span>
        <span style={{ color: '#ffffff' }}>TRACTIVE</span>
      </motion.h1>
    </div>
  );
}

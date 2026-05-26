"use client";
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function OfferRevealCard({ offer, onClaim }: { offer: any, onClaim: () => void }) {
  useEffect(() => {
    // Confetti effect on mount
    if (typeof window !== 'undefined') {
      import('canvas-confetti').then(({ default: confetti }) => {
        const duration = 2.5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(() => {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) return clearInterval(interval);

          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
      });
    }
  }, []);

  return (
    <motion.div 
      initial={{ scale: 0.5, y: 150, opacity: 0, rotateX: 45 }}
      animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
      transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
      className="mb-card"
    >
      <div className="mb-card-top-bar" />
      
      <div className="mb-card-icon">
        <span>🎁</span>
      </div>
      
      <div className="mb-card-badge">
         <span>Exclusive Advertising Offer</span>
      </div>

      <h3 className="mb-card-title">
         {offer.title}
      </h3>

      {offer.description && (
          <p className="mb-card-desc">{offer.description}</p>
      )}
      
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(230,30,37,0.7)' }}
        whileTap={{ scale: 0.95 }}
        onClick={onClaim}
        className="mb-card-btn"
      >
        Claim Offer Now
      </motion.button>
    </motion.div>
  );
}

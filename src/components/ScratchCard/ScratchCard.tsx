"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  type: 'percentage' | 'free' | 'fixed';
  color: string;
}

interface ScratchCardProps {
  offer: Offer;
  onComplete: (offer: Offer) => void;
}

export default function ScratchCard({ offer, onComplete }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const isDrawing = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const hasRevealed = useRef(false);

  useEffect(() => {
    initCanvas();
    window.addEventListener('resize', initCanvas);
    return () => window.removeEventListener('resize', initCanvas);
  }, []);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size - responsive
    const width = Math.min(450, window.innerWidth - 40);
    const height = (width / 450) * 280;
    canvas.width = width;
    canvas.height = height;

    // Create gradient scratch surface - RED THEME
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#e61e25');
    gradient.addColorStop(0.5, '#c41820');
    gradient.addColorStop(1, '#a01419');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle texture
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.05})`;
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 3,
        Math.random() * 3
      );
    }

    // Add scratch-off text with glow effect
    ctx.save();
    ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.max(14, canvas.width * 0.035)}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('🎁 Scratch to Reveal', canvas.width / 2, canvas.height / 2 - 15);
    ctx.fillText('Your Special Offer! 🎁', canvas.width / 2, canvas.height / 2 + 20);
    ctx.restore();

    // Add decorative border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);
    ctx.setLineDash([]);
  };

  const startScratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (isRevealed || hasRevealed.current) return;
    
    isDrawing.current = true;
    setIsScratching(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    lastX.current = ((clientX - rect.left) / rect.width) * canvas.width;
    lastY.current = ((clientY - rect.top) / rect.height) * canvas.height;
    
    scratch(e);
  };

  const scratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || isRevealed || hasRevealed.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    // Create smooth brush stroke effect
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 35;
    
    // Draw smooth line from last position to current
    ctx.beginPath();
    ctx.moveTo(lastX.current, lastY.current);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Add soft brush effect with multiple passes
    ctx.lineWidth = 25;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(lastX.current, lastY.current);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    ctx.globalAlpha = 1;
    
    lastX.current = x;
    lastY.current = y;

    // Calculate scratched area
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }

    const progress = (transparent / (pixels.length / 4)) * 100;
    setScratchProgress(progress);

    // Reveal offer when 1% is scratched (for testing)
    if (progress >= 1 && !hasRevealed.current) {
      hasRevealed.current = true;
      setIsRevealed(true);
      console.log('✅✅✅ SCRATCH DETECTED - Progress:', Math.round(progress) + '%');
      console.log('✅✅✅ Calling onComplete with offer:', offer);
      console.log('✅✅✅ onComplete function:', onComplete);
      console.log('✅✅✅ About to call onComplete NOW');
      setTimeout(() => {
        onComplete(offer);
      }, 100);
    }
  };

  const stopScratch = () => {
    isDrawing.current = false;
    setIsScratching(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* Scratch Card Container */}
      <div style={{
        position: 'relative',
        margin: '0 auto',
        width: 'clamp(280px, 90vw, 450px)',
        aspectRatio: '450 / 280',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
      }}>
        {/* Scratch Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={startScratch}
          onMouseMove={scratch}
          onMouseUp={stopScratch}
          onMouseLeave={stopScratch}
          onTouchStart={startScratch}
          onTouchMove={scratch}
          onTouchEnd={stopScratch}
          style={{ 
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            cursor: 'grab',
            opacity: isRevealed ? 0 : 1,
            transition: 'opacity 0.5s ease',
            touchAction: 'none',
            pointerEvents: 'auto'
          }}
        />

        {/* Glow Effect */}
        {isScratching && (
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '12px',
            border: '2px solid rgba(230, 30, 37, 0.5)',
            boxShadow: '0 0 20px rgba(230, 30, 37, 0.4)',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            pointerEvents: 'none'
          }} />
        )}
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isRevealed ? 0 : 1 }}
        className="text-center mt-4"
      >
        <p style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '0.9rem',
          margin: 0
        }}>
          {isScratching ? '🎉 Keep scratching...' : '👆 Click and drag to scratch'}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ fontSize: '1.5rem' }}
          >
            ✨
          </motion.div>
        </div>
      </motion.div>

      {/* Confetti Animation */}
      {isRevealed && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: ['#FF2A2A', '#FFD700', '#FF6B6B', '#FF4444', '#FF1111'][i % 5],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ 
                scale: [0, 1, 0], 
                rotate: 360,
                y: [0, -150, -300]
              }}
              transition={{ 
                duration: 2.5, 
                delay: Math.random() * 0.3,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

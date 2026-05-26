"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SimpleScratchCardProps {
  offer: {
    discount: string;
    title: string;
    color: string;
  };
  onComplete: () => void;
}

export default function SimpleScratchCard({ offer, onComplete }: SimpleScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Draw scratch surface with gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#9ca3af');
    gradient.addColorStop(1, '#6b7280');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add scratch instruction text with better positioning
    ctx.fillStyle = 'white';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Scratch to reveal!', canvas.width / 2, canvas.height / 2 - 10);
    
    // Add sparkle emoji
    ctx.font = '24px Arial';
    ctx.fillText('✨', canvas.width / 2, canvas.height / 2 + 15);

    // Set up scratch functionality
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 40;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const getEventPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
      };
    };

    const startScratch = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      isDrawing = true;
      setIsScratching(true);
      const pos = getEventPos(e);
      lastX = pos.x;
      lastY = pos.y;
      
      // Initial scratch point
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
      ctx.fill();
      
      checkScratchPercentage();
    };

    const scratch = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();

      const pos = getEventPos(e);
      
      // Draw line from last position to current position
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      
      // Also draw circles for smoother scratching
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
      ctx.fill();
      
      lastX = pos.x;
      lastY = pos.y;
      
      checkScratchPercentage();
    };

    const stopScratch = () => {
      isDrawing = false;
      setIsScratching(false);
    };

    const checkScratchPercentage = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let transparent = 0;
      const totalPixels = imageData.data.length / 4;
      
      for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 0) transparent++;
      }
      
      const percentage = (transparent / totalPixels) * 100;
      setScratchPercentage(percentage);
      
      if (percentage > 25 && !isCompleted) {
        setIsCompleted(true);
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    };

    // Mouse events
    canvas.addEventListener('mousedown', startScratch);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('mouseup', stopScratch);
    canvas.addEventListener('mouseleave', stopScratch);

    // Touch events
    canvas.addEventListener('touchstart', startScratch, { passive: false });
    canvas.addEventListener('touchmove', scratch, { passive: false });
    canvas.addEventListener('touchend', stopScratch);

    return () => {
      canvas.removeEventListener('mousedown', startScratch);
      canvas.removeEventListener('mousemove', scratch);
      canvas.removeEventListener('mouseup', stopScratch);
      canvas.removeEventListener('mouseleave', stopScratch);
      canvas.removeEventListener('touchstart', startScratch);
      canvas.removeEventListener('touchmove', scratch);
      canvas.removeEventListener('touchend', stopScratch);
    };
  }, [onComplete, isCompleted]);

  return (
    <div className="scratch-card-wrapper">
      <div 
        ref={containerRef}
        className="scratch-card-container"
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderRadius: '12px',
          padding: '2rem',
          margin: '1rem 0',
          minHeight: '140px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: '2px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Offer content behind canvas */}
        <div 
          className="scratch-card-content"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 1,
            width: '100%',
            padding: '1rem'
          }}
        >
          <h4 
            style={{ 
              fontSize: '2.5rem',
              fontWeight: '900',
              margin: '0 0 0.5rem 0',
              color: offer.color,
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {offer.discount}
          </h4>
          <p 
            style={{ 
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0',
              lineHeight: '1.3'
            }}
          >
            {offer.title}
          </p>
        </div>
        
        {/* Scratch canvas overlay */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            cursor: isScratching ? 'grabbing' : 'grab',
            borderRadius: '12px',
            zIndex: 2
          }}
        />
        
        {/* Progress indicator */}
        {scratchPercentage > 0 && (
          <div 
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              zIndex: 3
            }}
          >
            {Math.round(scratchPercentage)}% revealed
          </div>
        )}
      </div>
      
      {/* Instructions */}
      <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.7)', 
          fontSize: '0.85rem',
          margin: 0 
        }}>
          {scratchPercentage < 25 ? 'Scratch with your mouse or finger to reveal your offer!' : 'Great! Keep going...'}
        </p>
      </div>
    </div>
  );
}
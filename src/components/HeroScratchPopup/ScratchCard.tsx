"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  type: 'percentage' | 'free' | 'fixed';
  probability: number;
  color: string;
}

const offers: Offer[] = [
  {
    id: '1',
    title: '20% Off Advertisement Package',
    description: 'Get 20% discount on any advertisement package worth $500+',
    discount: '20%',
    type: 'percentage',
    probability: 30,
    color: '#3b82f6'
  },
  {
    id: '2',
    title: 'Free Social Media Post',
    description: 'Get a professional social media post design absolutely free',
    discount: 'FREE',
    type: 'free',
    probability: 25,
    color: '#10b981'
  },
  {
    id: '3',
    title: 'Free Banner Design',
    description: 'Get a custom banner design for your business at no cost',
    discount: 'FREE',
    type: 'free',
    probability: 20,
    color: '#8b5cf6'
  },
  {
    id: '4',
    title: '10% Discount on Branding',
    description: 'Save 10% on complete branding packages and logo design',
    discount: '10%',
    type: 'percentage',
    probability: 25,
    color: '#f59e0b'
  }
];

interface ScratchCardProps {
  onComplete: (offer: Offer) => void;
}

export default function ScratchCard({ onComplete }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [revealPercentage, setRevealPercentage] = useState(0);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  useEffect(() => {
    const randomOffer = selectRandomOffer();
    setSelectedOffer(randomOffer);
    initializeCanvas(randomOffer);
  }, []);

  const selectRandomOffer = (): Offer => {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const offer of offers) {
      cumulative += offer.probability;
      if (random <= cumulative) {
        return offer;
      }
    }
    
    return offers[0];
  };

  const initializeCanvas = (offer: Offer) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Draw scratch layer
    ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add texture
    ctx.fillStyle = 'rgba(150, 150, 150, 0.3)';
    for (let i = 0; i < 100; i++) {
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 5,
        Math.random() * 5
      );
    }

    // Add text
    ctx.fillStyle = 'rgba(100, 100, 100, 0.6)';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch to reveal', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '16px Arial';
    ctx.fillText('your offer', canvas.width / 2, canvas.height / 2 + 20);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    scratch(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
      scratch(e);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    scratch(mouseEvent as any);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      scratch(mouseEvent as any);
    }
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
  };

  const scratch = (e: React.MouseEvent<HTMLCanvasElement> | MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e as any).clientX - rect.left;
    const y = (e as any).clientY - rect.top;

    ctx.clearRect(x - 20, y - 20, 40, 40);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) {
        transparentPixels++;
      }
    }

    const percentage = (transparentPixels / (data.length / 4)) * 100;
    setRevealPercentage(percentage);

    if (percentage > 25 && selectedOffer) {
      onComplete(selectedOffer);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1rem',
        overflow: 'hidden'
      }}>
        {/* Offer Preview */}
        {selectedOffer && (
          <div style={{
            textAlign: 'center',
            marginBottom: '1.5rem',
            pointerEvents: 'none'
          }}>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              color: selectedOffer.color,
              marginBottom: '0.5rem'
            }}>
              {selectedOffer.discount}
            </div>
            <div style={{
              fontSize: '0.95rem',
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: 600
            }}>
              {selectedOffer.title}
            </div>
          </div>
        )}

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            width: '100%',
            height: '200px',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'block',
            touchAction: 'none'
          }}
        />
      </div>

      {/* Progress */}
      <div style={{
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '0.85rem'
      }}>
        Scratched: {Math.round(revealPercentage)}%
      </div>
    </div>
  );
}

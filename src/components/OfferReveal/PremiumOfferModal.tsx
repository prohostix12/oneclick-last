'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PremiumOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'offer' | 'scratch' | 'form';

export default function PremiumOfferModal({ isOpen, onClose }: PremiumOfferModalProps) {
  const [step, setStep] = useState<Step>('offer');
  const [scratchProgress, setScratchProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessName: ''
  });

  const [isRevealing, setIsRevealing] = useState(false);

  // Initialize Canvas for Scratch Card
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 360;
    canvas.height = rect.height || 220;

    // Gold scratch surface
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#D4AF37'); // Gold
    gradient.addColorStop(0.3, '#F9E2AF'); // Light Gold
    gradient.addColorStop(0.6, '#B8860B'); // Dark Gold
    gradient.addColorStop(1, '#D4AF37');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some noise/texture to make it look premium
    for (let i = 0; i < 500; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
    }

    // Add "Scratch to Reveal Offer" text
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Scratch to Reveal Offer', canvas.width / 2, canvas.height / 2);
  }, []);

  useEffect(() => {
    if (step === 'scratch') {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(initCanvas, 100);
      return () => clearTimeout(timer);
    }
  }, [step, initCanvas]);

  const handleScratchAction = (clientX: number, clientY: number) => {
    if (step !== 'scratch' || !canvasRef.current || isRevealing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 35, 0, Math.PI * 2);
    ctx.fill();

    // Occasional progress check
    if (Math.random() > 0.8) {
      checkProgress(ctx, canvas);
    }
  };

  const checkProgress = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }
    const progress = (transparent / (pixels.length / 4)) * 100;
    setScratchProgress(progress);

    if (progress > 50 && !isRevealing) {
      setIsRevealing(true);
      setTimeout(() => {
        setStep('form');
      }, 800);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="premium-offer-overlay">
      <style jsx>{`
        .premium-offer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(15px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
        }

        .modal-card {
          width: 100%;
          max-width: 460px;
          background: #0f0f0f;
          border: 2px solid #D4AF37;
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(212, 175, 55, 0.15);
        }

        @media (max-width: 480px) {
          .modal-card {
            width: 90%;
          }
        }

        /* Top Section - Sunburst Animation */
        .sunburst-container {
          position: absolute;
          inset: -100%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 0;
          pointer-events: none;
          opacity: 0.4;
        }

        .sunburst {
          width: 200%;
          height: 200%;
          background: repeating-conic-gradient(
            from 0deg,
            #D4AF37 0deg 15deg,
            transparent 15deg 30deg
          );
          opacity: 0.05;
          animation: rotateSunburst 30s linear infinite;
        }

        @keyframes rotateSunburst {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .glow-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
          z-index: 1;
          pointer-events: none;
        }

        .modal-content-inner {
          position: relative;
          z-index: 10;
          padding: 45px 35px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 100;
        }

        .close-btn:hover {
          background: rgba(212, 175, 55, 0.2);
          border-color: #D4AF37;
          transform: rotate(90deg);
        }

        .offer-title {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 3px;
          color: #D4AF37;
          margin-bottom: 35px;
          text-transform: uppercase;
        }

        /* Center Content Card */
        .inner-offer-card {
          width: 100%;
          background: rgba(20, 20, 20, 0.8);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 20px;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.5);
        }

        .main-hero-text {
          font-size: 85px;
          font-weight: 950;
          color: #D4AF37;
          line-height: 1;
          margin: 0;
          text-shadow: 0 0 20px rgba(212, 175, 55, 0.4), 0 4px 10px rgba(0, 0, 0, 0.8);
          letter-spacing: -2px;
        }

        .ribbon-banner {
          background: linear-gradient(90deg, #D4AF37 0%, #F9E2AF 50%, #B8860B 100%);
          color: #000;
          padding: 10px 40px;
          font-weight: 900;
          font-size: 18px;
          text-transform: uppercase;
          transform: rotate(-3deg);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
          margin: 25px 0;
          position: relative;
          white-space: nowrap;
        }

        .offer-subtext {
          font-size: 15px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 5px;
        }

        .badge-limited {
          position: absolute;
          top: -12px;
          right: -10px;
          background: #ff3d3d;
          color: white;
          font-size: 11px;
          font-weight: 900;
          padding: 5px 12px;
          border-radius: 50px;
          box-shadow: 0 4px 12px rgba(255, 61, 61, 0.4);
          text-transform: uppercase;
          transform: rotate(5deg);
          z-index: 20;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Unlock Button */
        .unlock-offer-btn {
          width: 100%;
          margin-top: 35px;
          padding: 18px;
          background: linear-gradient(135deg, #00BFA5 0%, #00897B 100%);
          border: none;
          border-radius: 16px;
          color: white;
          font-weight: 900;
          font-size: 19px;
          letter-spacing: 1.5px;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(0, 191, 165, 0.35);
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .unlock-offer-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(0, 191, 165, 0.5);
          filter: brightness(1.1);
        }

        .unlock-offer-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .unlock-offer-btn:hover::after {
          opacity: 1;
        }

        /* Scratch Card Space */
        .scratch-card-wrapper {
          width: 100%;
          height: 220px;
          border-radius: 20px;
          background: #111;
          border: 2px solid rgba(212, 175, 55, 0.3);
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .scratch-under-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #222;
          z-index: 1;
        }

        .scratch-canvas-surface {
          position: absolute;
          inset: 0;
          z-index: 10;
          cursor: crosshair;
          touch-action: none;
        }

        .shine-streak {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.25),
            transparent
          );
          transform: skewX(-20deg);
          animation: shineAnimation 4s infinite;
          z-index: 5;
          pointer-events: none;
        }

        @keyframes shineAnimation {
          to { left: 150%; }
        }

        /* Form Layout */
        .lead-form-container {
          width: 100%;
          text-align: left;
        }

        .form-header-title {
          font-size: 22px;
          font-weight: 900;
          color: #fff;
          margin-bottom: 25px;
          text-align: center;
          background: linear-gradient(90deg, #fff, #D4AF37);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .form-input-box {
          width: 100%;
          padding: 15px 20px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 12px;
          color: white;
          font-size: 16px;
          margin-bottom: 15px;
          transition: all 0.3s ease;
          outline: none;
          box-sizing: border-box;
        }

        .form-input-box:focus {
          border-color: #D4AF37;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
        }

        .final-claim-btn {
          width: 100%;
          padding: 18px;
          background: linear-gradient(90deg, #D4AF37 0%, #B8860B 100%);
          border: none;
          border-radius: 14px;
          color: #000;
          font-weight: 950;
          font-size: 18px;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          margin-top: 10px;
          box-shadow: 0 10px 25px rgba(212, 175, 55, 0.3);
          transition: all 0.3s ease;
        }

        .final-claim-btn:hover {
          filter: brightness(1.15);
          transform: translateY(-2px);
        }
      `}</style>

      <motion.div 
        className="modal-card"
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ type: 'spring', damping: 20, stiffness: 120 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Background */}
        <div className="sunburst-container">
          <div className="sunburst"></div>
        </div>
        <div className="glow-overlay"></div>

        <button className="close-btn" onClick={onClose} aria-label="Close">✕</button>

        <div className="modal-content-inner">
          <AnimatePresence mode="wait">
            {step === 'offer' && (
              <motion.div 
                key="step-offer"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                style={{ width: '100%' }}
              >
                <div className="offer-title">THE BEST OFFER!</div>
                
                <div className="inner-offer-card">
                  <h1 className="main-hero-text">ZERO</h1>
                  <div className="ribbon-banner">
                    Creative Design Fees
                    <div className="badge-limited">Limited Time Offer</div>
                  </div>
                  <div className="offer-subtext">For your first 3 months</div>
                </div>

                <motion.button 
                  className="unlock-offer-btn"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setStep('scratch')}
                >
                  UNLOCK OFFER
                </motion.button>
              </motion.div>
            )}

            {step === 'scratch' && (
              <motion.div 
                key="step-scratch"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                style={{ width: '100%' }}
              >
                <div className="offer-title">SCRATCH TO REVEAL</div>
                
                <div className="scratch-card-wrapper">
                  <div className="scratch-under-content">
                    <div className="main-hero-text" style={{ fontSize: '48px', marginBottom: '8px' }}>ZERO</div>
                    <div className="ribbon-banner" style={{ fontSize: '12px', padding: '6px 20px', margin: '5px 0' }}>DESIGN FEES</div>
                    <div className="shine-streak"></div>
                  </div>
                  <canvas
                    ref={canvasRef}
                    className="scratch-canvas-surface"
                    onMouseDown={() => (isDrawing.current = true)}
                    onMouseUp={() => (isDrawing.current = false)}
                    onMouseLeave={() => (isDrawing.current = false)}
                    onMouseMove={(e) => isDrawing.current && handleScratchAction(e.clientX, e.clientY)}
                    onTouchStart={(e) => {
                      isDrawing.current = true;
                      handleScratchAction(e.touches[0].clientX, e.touches[0].clientY);
                    }}
                    onTouchEnd={() => (isDrawing.current = false)}
                    onTouchMove={(e) => {
                      if (isDrawing.current) {
                        handleScratchAction(e.touches[0].clientX, e.touches[0].clientY);
                      }
                    }}
                  />
                  <div className="glow-overlay"></div>
                </div>
                
                <div style={{ marginTop: '20px', color: '#D4AF37', fontWeight: 800, fontSize: '13px', letterSpacing: '1px' }}>
                  {Math.round(scratchProgress)}% REVEALED
                </div>
              </motion.div>
            )}

            {step === 'form' && (
              <motion.div 
                key="step-form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ width: '100%' }}
              >
                <div className="lead-form-container">
                  <h2 className="form-header-title">Claim Your Special Offer</h2>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="form-input-box"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      className="form-input-box"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <input 
                      type="tel" 
                      placeholder="Phone Number" 
                      className="form-input-box"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                    <input 
                      type="text" 
                      placeholder="Business Name" 
                      className="form-input-box"
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    />
                  </div>

                  <motion.button 
                    className="final-claim-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      alert('Success! Your offer has been locked. We will contact you shortly.');
                      onClose();
                    }}
                  >
                    CLAIM MY OFFER NOW
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, User, Mail, Phone, Building, X } from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  type: 'percentage' | 'free' | 'fixed';
  probability: number;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  companyName?: string;
}

const offers: Offer[] = [
  {
    id: '1',
    title: 'One Click Premium Package',
    description: 'Get 20% discount on any full-service advertisement package',
    discount: '20% OFF',
    type: 'percentage',
    probability: 30
  },
  {
    id: '2',
    title: 'One Click Social Edge',
    description: 'Get a professional social media campaign post for free',
    discount: 'FREE POST',
    type: 'free',
    probability: 25
  },
  {
    id: '3',
    title: 'One Click Creative Asset',
    description: 'Get a custom high-impact banner design absolutely free',
    discount: 'FREE DESIGN',
    type: 'free',
    probability: 20
  },
  {
    id: '4',
    title: 'One Click Brand Ignite',
    description: 'Save 10% on complete strategic branding packages',
    discount: '10% OFF',
    type: 'percentage',
    probability: 25
  }
];

export default function ScratchCardOffer() {
  const [showCard, setShowCard] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    companyName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const scratchedArea = useRef(0);

  useEffect(() => {
    // Check if user has already seen the scratch card today
    const lastSeen = localStorage.getItem('scratchCardLastSeen');
    const today = new Date().toDateString();
    
    if (lastSeen !== today) {
      setTimeout(() => setShowCard(true), 2000);
    }
  }, []);

  useEffect(() => {
    if (showCard && canvasRef.current) {
      initCanvas();
    }
  }, [showCard]);

  const selectRandomOffer = (): Offer => {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const offer of offers) {
      cumulative += offer.probability;
      if (random <= cumulative) {
        return offer;
      }
    }
    
    return offers[0]; // Fallback
  };

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 180;
    canvas.height = 110;

    // Fill with scratch-off coating
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add scratch-off text
    ctx.fillStyle = '#666666';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch to Reveal', canvas.width / 2, canvas.height / 2 - 6);
    ctx.fillText('Your Offer!', canvas.width / 2, canvas.height / 2 + 10);
  };

  const startScratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (!selectedOffer) {
      const offer = selectRandomOffer();
      setSelectedOffer(offer);
    }
    
    isDrawing.current = true;
    setIsScratching(true);
    scratch(e);
  };

  const scratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fill();

    // Calculate scratched area
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }

    scratchedArea.current = (transparent / (pixels.length / 4)) * 100;

    // Reveal offer when 30% is scratched
    if (scratchedArea.current > 30 && !isRevealed) {
      setIsRevealed(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const stopScratch = () => {
    isDrawing.current = false;
    setIsScratching(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/scratch-offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          offer: selectedOffer,
          scratchedAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        // Mark as seen today
        localStorage.setItem('scratchCardLastSeen', new Date().toDateString());
        setShowCard(false);
        // Show success message or redirect
      }
    } catch (error) {
      console.error('Error submitting scratch card:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeCard = () => {
    setShowCard(false);
    localStorage.setItem('scratchCardLastSeen', new Date().toDateString());
  };

  return (
    <AnimatePresence>
      {showCard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="scratch-card-overlay"
          onClick={(e) => e.target === e.currentTarget && closeCard()}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="scratch-card-container"
          >
            {/* Close Button */}
            <button onClick={closeCard} className="close-button">
              <X size={20} />
            </button>

            {!showForm ? (
              /* Scratch Card */
              <div className="scratch-card">
                <div className="card-header">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Gift size={32} className="gift-icon" />
                  </motion.div>
                  <h2>Special Offer Just for You!</h2>
                  <p>Scratch the card below to reveal your exclusive offer</p>
                </div>

                <div className="scratch-area">
                  <div className="offer-background">
                    {selectedOffer && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: isRevealed ? 1 : 0, scale: isRevealed ? 1 : 0.8 }}
                        className="revealed-offer"
                      >
                        <div className="offer-badge">{selectedOffer.discount}</div>
                        <h3>{selectedOffer.title}</h3>
                        <p>{selectedOffer.description}</p>
                      </motion.div>
                    )}
                  </div>
                  
                  <canvas
                    ref={canvasRef}
                    className={`scratch-canvas ${isScratching ? 'scratching' : ''}`}
                    onMouseDown={startScratch}
                    onMouseMove={scratch}
                    onMouseUp={stopScratch}
                    onMouseLeave={stopScratch}
                    onTouchStart={startScratch}
                    onTouchMove={scratch}
                    onTouchEnd={stopScratch}
                    style={{ opacity: isRevealed ? 0 : 1 }}
                  />
                </div>

                {isRevealed && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => setShowForm(true)}
                    className="claim-button"
                  >
                    <Sparkles size={20} />
                    Claim This Offer
                  </motion.button>
                )}
              </div>
            ) : (
              /* User Form */
              <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                className="user-form"
              >
                <div className="form-header">
                  <h2>Claim Your Offer</h2>
                  <div className="selected-offer-summary">
                    <span className="offer-badge-small">{selectedOffer?.discount}</span>
                    <span>{selectedOffer?.title}</span>
                  </div>
                </div>

                <form onSubmit={handleFormSubmit} className="offer-form">
                  <div className="form-group">
                    <User size={20} className="form-icon" />
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={userData.name}
                      onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <Mail size={20} className="form-icon" />
                    <input
                      type="email"
                      placeholder="Email Address *"
                      value={userData.email}
                      onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <Phone size={20} className="form-icon" />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={userData.phone}
                      onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <Building size={20} className="form-icon" />
                    <input
                      type="text"
                      placeholder="Company Name (Optional)"
                      value={userData.companyName}
                      onChange={(e) => setUserData(prev => ({ ...prev, companyName: e.target.value }))}
                    />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="submit-offer-button">
                    {isSubmitting ? 'Claiming...' : 'Claim Offer Now'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Confetti Animation */}
            {showConfetti && (
              <div className="confetti-container">
                {[...Array(50)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="confetti"
                    initial={{ 
                      opacity: 1, 
                      y: -10, 
                      x: Math.random() * 400 - 200,
                      rotate: 0 
                    }}
                    animate={{ 
                      opacity: 0, 
                      y: 400, 
                      rotate: 360 
                    }}
                    transition={{ 
                      duration: 3, 
                      delay: Math.random() * 0.5 
                    }}
                    style={{
                      backgroundColor: ['#e61e25', '#ff4444', '#ffd700', '#00ff00'][Math.floor(Math.random() * 4)]
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>

          <style jsx>{`
            .scratch-card-overlay {
              position: fixed;
              inset: 0;
              background: rgba(0, 0, 0, 0.8);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1000;
              padding: 1rem;
            }

            .scratch-card-container {
              position: relative;
              background: linear-gradient(135deg, #1a1a1a 0%, #2d1b1b 100%);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 12px;
              padding: 1rem;
              max-width: 280px;
              width: 100%;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            }

            .close-button {
              position: absolute;
              top: 0.5rem;
              right: 0.5rem;
              background: rgba(255, 255, 255, 0.1);
              border: none;
              border-radius: 50%;
              width: 28px;
              height: 28px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: rgba(255, 255, 255, 0.7);
              cursor: pointer;
              transition: all 0.3s ease;
            }

            .close-button:hover {
              background: rgba(255, 255, 255, 0.2);
              color: white;
            }

            .scratch-card {
              text-align: center;
            }

            .card-header {
              margin-bottom: 1rem;
            }

            .gift-icon {
              color: #e61e25;
              margin-bottom: 0.5rem;
            }

            .card-header h2 {
              color: white;
              font-size: 1.3rem;
              font-weight: 800;
              margin-bottom: 0.4rem;
            }

            .card-header p {
              color: rgba(255, 255, 255, 0.7);
              font-size: 0.8rem;
            }

            .scratch-area {
              position: relative;
              margin: 1rem auto;
              width: 180px;
              height: 110px;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            }

            .offer-background {
              position: absolute;
              inset: 0;
              background: linear-gradient(45deg, #e61e25, #ff4444);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 1rem;
            }

            .revealed-offer {
              text-align: center;
              color: white;
            }

            .offer-badge {
              background: rgba(255, 255, 255, 0.2);
              padding: 0.3rem 0.6rem;
              border-radius: 12px;
              font-size: 1rem;
              font-weight: 900;
              margin-bottom: 0.3rem;
              display: inline-block;
            }

            .revealed-offer h3 {
              font-size: 0.9rem;
              font-weight: 700;
              margin-bottom: 0.3rem;
            }

            .revealed-offer p {
              font-size: 0.7rem;
              opacity: 0.9;
            }

            .scratch-canvas {
              position: absolute;
              inset: 0;
              cursor: grab;
              transition: opacity 0.5s ease;
            }

            .scratch-canvas.scratching {
              cursor: grabbing;
            }

            .claim-button {
              background: linear-gradient(45deg, #e61e25, #ff4444);
              color: white;
              border: none;
              padding: 0.6rem 1.2rem;
              border-radius: 8px;
              font-size: 0.9rem;
              font-weight: 700;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 0.4rem;
              margin: 0 auto;
              transition: all 0.3s ease;
            }

            .claim-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(230, 30, 37, 0.4);
            }

            .user-form {
              width: 100%;
            }

            .form-header {
              text-align: center;
              margin-bottom: 1rem;
            }

            .form-header h2 {
              color: white;
              font-size: 1.3rem;
              font-weight: 800;
              margin-bottom: 0.5rem;
            }

            .selected-offer-summary {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 0.5rem;
              color: rgba(255, 255, 255, 0.8);
            }

            .offer-badge-small {
              background: #e61e25;
              color: white;
              padding: 0.25rem 0.75rem;
              border-radius: 12px;
              font-size: 0.8rem;
              font-weight: 700;
            }

            .offer-form {
              display: flex;
              flex-direction: column;
              gap: 1rem;
            }

            .form-group {
              position: relative;
              display: flex;
              align-items: center;
              gap: 0.5rem;
              margin-bottom: 0.8rem;
            }

            .form-icon {
              color: rgba(255, 255, 255, 0.6);
              flex-shrink: 0;
              width: 16px;
              height: 16px;
            }

            .form-group input {
              flex: 1;
              padding: 0.6rem 0.8rem;
              background: rgba(255, 255, 255, 0.08);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 6px;
              color: white;
              font-size: 0.85rem;
              transition: all 0.3s ease;
              width: 100%;
              box-sizing: border-box;
            }

            .form-group input::placeholder {
              color: rgba(255, 255, 255, 0.5);
            }

            .form-group input:focus {
              outline: none;
              border-color: #e61e25;
              box-shadow: 0 0 0 2px rgba(230, 30, 37, 0.2);
            }

            .submit-offer-button {
              background: linear-gradient(45deg, #e61e25, #ff4444);
              color: white;
              border: none;
              padding: 0.7rem 1.2rem;
              border-radius: 6px;
              font-size: 0.9rem;
              font-weight: 700;
              cursor: pointer;
              margin-top: 0.8rem;
              transition: all 0.3s ease;
              width: 100%;
              box-sizing: border-box;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 0.4rem;
            }

            .submit-offer-button:hover:not(:disabled) {
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(230, 30, 37, 0.4);
            }

            .submit-offer-button:disabled {
              opacity: 0.7;
              cursor: not-allowed;
            }

            .confetti-container {
              position: absolute;
              inset: 0;
              pointer-events: none;
              overflow: hidden;
            }

            .confetti {
              position: absolute;
              width: 8px;
              height: 8px;
              border-radius: 2px;
            }

            /* Mobile Responsive */
            @media (max-width: 768px) {
              .scratch-card-container {
                padding: 0.8rem;
                margin: 0.5rem;
                max-width: 260px;
              }

              .scratch-area {
                width: 160px;
                height: 100px;
              }

              .card-header h2 {
                font-size: 1.2rem;
              }

              .card-header p {
                font-size: 0.75rem;
              }

              .form-group {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.4rem;
                margin-bottom: 0.8rem;
              }

              .form-icon {
                align-self: flex-start;
              }

              .form-group input {
                width: 100%;
                padding: 0.6rem;
                font-size: 0.8rem;
              }

              .submit-offer-button {
                padding: 0.6rem 1rem;
                font-size: 0.85rem;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
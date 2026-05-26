'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScratchCardProps {
  onFormReveal?: () => void;
}

export default function InteractiveScratchCard({ onFormReveal }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [showOffers, setShowOffers] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);

  const defaultOffers = [
    { id: '1', title: 'One Click Billboard Exclusive', description: '10% OFF on your first month of premium billboard advertising', discount: '10% OFF' },
    { id: '2', title: 'One Click Design Edge', description: 'Free professional graphic design mockup for your brand identity', discount: 'FREE DESIGN' },
    { id: '3', title: 'One Click Fleet Power', description: 'Exclusive 15% discount on high-impact vehicle wraps', discount: '15% OFF' },
    { id: '4', title: 'One Click Signage Audit', description: 'Free site survey and expert consultation worth 500 AED', discount: 'FREE CONSULT' },
    { id: '5', title: 'One Click Prime Spot', description: 'Priority access to high-traffic urban hoarding placements', discount: 'PRIORITY ACCESS' },
    { id: '6', title: 'One Click VIP Strategy', description: 'Complete 360° campaign strategy and priority installation', discount: 'VIP PASS' }
  ];

  useEffect(() => {
    setOffers(defaultOffers);
    // Pick a random offer to start with
    const randomOffer = defaultOffers[Math.floor(Math.random() * defaultOffers.length)];
    setSelectedOffer(randomOffer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Create scratch texture
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#c0c0c0');
    gradient.addColorStop(0.5, '#e8e8e8');
    gradient.addColorStop(1, '#a9a9a9');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add texture pattern
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 3,
        Math.random() * 3
      );
    }

    // Add text
    ctx.fillStyle = '#333';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎁 Scratch to Unlock', canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = '14px Arial';
    ctx.fillText('Your Exclusive Offer', canvas.width / 2, canvas.height / 2 + 15);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    scratch(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    scratch(e);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    scratchTouch(e);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    scratchTouch(e);
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
  };

  const scratch = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Clear scratch area
    ctx.clearRect(x - 20, y - 20, 40, 40);

    // Calculate progress
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) transparentPixels++;
    }

    const progress = (transparentPixels / (data.length / 4)) * 100;
    setScratchProgress(progress);

    if (progress > 50 && !isRevealed) {
      setIsRevealed(true);
      onFormReveal?.();
    }
  };

  const scratchTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    ctx.clearRect(x - 20, y - 20, 40, 40);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) transparentPixels++;
    }

    const progress = (transparentPixels / (data.length / 4)) * 100;
    setScratchProgress(progress);

    if (progress > 50 && !isRevealed) {
      setIsRevealed(true);
      onFormReveal?.();
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await fetch('/api/scratch-offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          companyName: formData.companyName,
          offer: selectedOffer || { title: 'Scratch Card Offer', discount: 'N/A', description: 'Generic Offer' },
          source: 'scratch_card'
        })
      });

      if (res.ok) {
        setSubmitStatus({ success: true, message: 'Thank you! We will contact you soon.' });
        setFormData({ fullName: '', email: '', phone: '', companyName: '' });
        setTimeout(() => {
          setSubmitStatus(null);
        }, 3000);
      } else {
        const errorData = await res.json();
        setSubmitStatus({ success: false, message: errorData.error || 'Failed to submit. Please try again.' });
      }
    } catch (error) {
      setSubmitStatus({ success: false, message: 'Error submitting form. Please try again.' });
    }

    setIsSubmitting(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        style={{
          maxWidth: '380px',
          margin: '0 auto',
          position: 'relative'
        }}
      >
        {/* Scratch Card Container */}
        <div
          style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(230, 30, 37, 0.3), 0 0 40px rgba(230, 30, 37, 0.1)',
            background: '#1a1a1a',
            border: '2px solid rgba(230, 30, 37, 0.2)',
            aspectRatio: isRevealed ? 'auto' : '16 / 14',
            minHeight: isRevealed ? '400px' : 'auto'
          }}
        >
          {/* Background Image */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(135deg, rgba(230, 30, 37, 0.85) 0%, rgba(20, 20, 20, 0.9) 100%), url("/advertisement-bg.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 1,
              zIndex: 1
            }}
          >
          </div>

          {/* Winning Offer Display (Under the scratch layer) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              pointerEvents: 'none',
              padding: '2rem',
              textAlign: 'center'
            }}
          >
            {selectedOffer && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  padding: '2rem',
                  borderRadius: '20px',
                  border: '2px solid #e61e25',
                  boxShadow: '0 0 30px rgba(230, 30, 37, 0.3)'
                }}
              >
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e61e25', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>
                  You Won!
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '0.25rem' }}>
                  {selectedOffer.discount}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', opacity: 0.9 }}>
                  {selectedOffer.title}
                </div>
              </motion.div>
            )}
          </div>
          <AnimatePresence>
            {isRevealed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'linear-gradient(rgba(20, 20, 20, 0.94), rgba(20, 20, 20, 0.94)), url("/advertisement-bg.png")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backdropFilter: 'blur(10px)',
                  padding: 'clamp(0.5rem, 2.5vw, 1rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  zIndex: 3,
                  overflowY: 'auto',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <h3 style={{ color: '#e61e25', fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)', fontWeight: 700, marginBottom: '0.4rem', textAlign: 'center' }}>
                    🎯 Claim Your Offer
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 'clamp(0.7rem, 1.2vw, 0.8rem)', textAlign: 'center', marginBottom: '0.8rem' }}>
                    Fill in your details to get started
                  </p>

                      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', width: '100%' }}>
                        <input
                          type="text"
                          name="fullName"
                          placeholder="Full Name"
                          value={formData.fullName}
                          onChange={handleFormChange}
                          required
                          style={{
                            padding: '0.65rem 0.9rem',
                            background: 'rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(5px)',
                            border: '1px solid rgba(230, 30, 37, 0.3)',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '0.85rem',
                            outline: 'none',
                            transition: 'all 0.3s ease',
                            width: '100%',
                            boxSizing: 'border-box'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#e61e25';
                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(230, 30, 37, 0.3)';
                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                          }}
                        />

                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleFormChange}
                          required
                          style={{
                            padding: '0.65rem 0.9rem',
                            background: 'rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(5px)',
                            border: '1px solid rgba(230, 30, 37, 0.3)',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '0.85rem',
                            outline: 'none',
                            transition: 'all 0.3s ease',
                            width: '100%',
                            boxSizing: 'border-box'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#e61e25';
                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(230, 30, 37, 0.3)';
                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                          }}
                        />

                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={handleFormChange}
                          required
                          style={{
                            padding: '0.65rem 0.9rem',
                            background: 'rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(5px)',
                            border: '1px solid rgba(230, 30, 37, 0.3)',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '0.85rem',
                            outline: 'none',
                            transition: 'all 0.3s ease',
                            width: '100%',
                            boxSizing: 'border-box'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#e61e25';
                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(230, 30, 37, 0.3)';
                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                          }}
                        />

                        <input
                          type="text"
                          name="companyName"
                          placeholder="Company Name (Optional)"
                          value={formData.companyName}
                          onChange={handleFormChange}
                          style={{
                            padding: '0.65rem 0.9rem',
                            background: 'rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(5px)',
                            border: '1px solid rgba(230, 30, 37, 0.3)',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '0.85rem',
                            outline: 'none',
                            transition: 'all 0.3s ease',
                            width: '100%',
                            boxSizing: 'border-box'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#e61e25';
                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = 'rgba(230, 30, 37, 0.3)';
                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                          }}
                        />

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isSubmitting}
                          style={{
                            padding: '0.75rem',
                            background: isSubmitting ? 'rgba(230, 30, 37, 0.5)' : '#e61e25',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            fontWeight: 800,
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            marginTop: '0.15rem',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 5px 15px rgba(230, 30, 37, 0.3)'
                          }}
                        >
                          {isSubmitting ? '⏳ Processing...' : '🎯 Claim My Campaign Offer'}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => setShowOffers(!showOffers)}
                          style={{
                            padding: '0.55rem',
                            background: 'transparent',
                            color: 'white',
                            border: '2px solid rgba(230, 30, 37, 0.5)',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            marginTop: '0.05rem',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          🔄 Try Another Offer
                        </motion.button>
                      </form>

                  {submitStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        marginTop: '1rem',
                        padding: '0.75rem',
                        background: submitStatus.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        border: `1px solid ${submitStatus.success ? '#10b981' : '#ef4444'}`,
                        borderRadius: '8px',
                        color: submitStatus.success ? '#10b981' : '#ef4444',
                        fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)',
                        textAlign: 'center'
                      }}
                    >
                      {submitStatus.message}
                    </motion.div>
                  )}

                  {/* Offers Display */}
                  <AnimatePresence>
                    {showOffers && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          marginTop: '1rem',
                          display: 'grid',
                          gap: '0.75rem',
                          maxHeight: '300px',
                          overflowY: 'auto'
                        }}
                      >
                        {offers.map((offer, index) => (
                          <motion.div
                            key={offer.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setSelectedOffer(offer)}
                            style={{
                              background: selectedOffer?.id === offer.id ? 'rgba(230, 30, 37, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                              border: selectedOffer?.id === offer.id ? '2px solid #e61e25' : '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '8px',
                              padding: '0.75rem',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                              <div style={{ flex: 1 }}>
                                <p style={{ color: 'white', fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', fontWeight: 700, margin: '0 0 0.25rem 0' }}>
                                  {offer.title}
                                </p>
                                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 'clamp(0.7rem, 1.2vw, 0.8rem)', margin: 0 }}>
                                  {offer.description}
                                </p>
                              </div>
                              <div style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', fontWeight: 900, color: '#e61e25', marginLeft: '0.5rem', whiteSpace: 'nowrap' }}>
                                {offer.discount}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scratch Canvas */}
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
              position: 'absolute',
              inset: 0,
              cursor: 'pointer',
              zIndex: isRevealed ? 1 : 2,
              opacity: isRevealed ? 0.3 : 1,
              transition: 'opacity 0.3s ease'
            }}
          />

          {/* Progress Indicator */}
          {!isRevealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                right: '1rem',
                zIndex: 2
              }}
            >
              <div style={{
                fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)',
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '0.5rem',
                textAlign: 'center'
              }}>
                {Math.round(scratchProgress)}% Scratched
              </div>
              <div style={{
                width: '100%',
                height: '4px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${scratchProgress}%` }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #e61e25, #ff4757)',
                    borderRadius: '2px'
                  }}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Completion Message */}
        <AnimatePresence>
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                marginTop: '1.5rem',
                textAlign: 'center',
                color: '#e61e25',
                fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                fontWeight: 600
              }}
            >
              ✨ Offer Unlocked! Fill in your details to claim.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

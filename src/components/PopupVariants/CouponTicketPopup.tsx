"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CouponTicketPopupProps {
  onClose?: () => void;
}

export default function CouponTicketPopup({ onClose }: CouponTicketPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Auto-show after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/scratch-offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          offer: {
            id: 'coupon-ticket-offer',
            title: 'Free Consultation',
            description: 'Worth $500 - Expert consultation session',
            discount: 'FREE',
            type: 'free',
            color: '#e61e25'
          },
          scratchedAt: new Date().toISOString(),
          source: 'homepage_coupon_ticket'
        }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          handleReset();
        }, 3000);
      } else {
        alert('Error submitting form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsVisible(false);
    setShowSuccess(false);
    setFormData({ name: '', email: '', phone: '', companyName: '' });
    onClose?.();
  };

  return (
    <>
      {/* Coupon Ticket Popup */}
      {isVisible && !showSuccess && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleReset}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000
            }}
          />

          {/* Coupon Ticket */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              top: '1rem',
              left: 0,
              right: 0,
              margin: '0 auto',
              background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.98) 0%, rgba(20, 10, 15, 0.98) 100%)',
              border: '2px dashed rgba(255, 42, 42, 0.5)',
              borderRadius: '12px',
              padding: 'clamp(1.5rem, 4vw, 2rem)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 60px rgba(255, 42, 42, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              zIndex: 1001,
              width: 'min(calc(100vw - 1rem), 500px)',
              maxHeight: 'calc(100vh - 2rem)',
              overflowY: 'auto',
              overflowX: 'hidden',
              boxSizing: 'border-box'
            }}
          >
            {/* Glow Effect */}
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center, rgba(255, 42, 42, 0.1) 0%, transparent 70%)',
                pointerEvents: 'none',
                borderRadius: '12px'
              }}
            />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              {/* Top Divider */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.1 }}
                style={{
                  height: '2px',
                  background: 'repeating-linear-gradient(90deg, #FF2A2A 0px, #FF2A2A 10px, transparent 10px, transparent 20px)',
                  marginBottom: '1.5rem',
                  transformOrigin: 'left'
                }}
              />

              {/* Offer Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{
                  textAlign: 'center',
                  marginBottom: '1.5rem'
                }}
              >
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#FF2A2A',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  🎁 SPECIAL OFFER
                </div>
                <h2 style={{
                  fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                  fontWeight: 900,
                  color: '#ffffff',
                  marginBottom: '0.5rem',
                  textShadow: '0 0 20px rgba(255, 42, 42, 0.3)'
                }}>
                  FREE CONSULTATION
                </h2>
                <p style={{
                  fontSize: '1rem',
                  color: '#FF2A2A',
                  fontWeight: 700,
                  marginBottom: '0.3rem'
                }}>
                  Worth $500
                </p>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: '1.4'
                }}>
                  Expert consultation session
                </p>
              </motion.div>

              {/* Middle Divider */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                  height: '2px',
                  background: 'repeating-linear-gradient(90deg, #FF2A2A 0px, #FF2A2A 10px, transparent 10px, transparent 20px)',
                  marginBottom: '1.5rem',
                  transformOrigin: 'left'
                }}
              />

              {/* Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}
              >
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 42, 42, 0.2)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255, 42, 42, 0.6)';
                    e.target.style.boxShadow = '0 0 12px rgba(255, 42, 42, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 42, 42, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  style={{
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 42, 42, 0.2)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255, 42, 42, 0.6)';
                    e.target.style.boxShadow = '0 0 12px rgba(255, 42, 42, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 42, 42, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  style={{
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 42, 42, 0.2)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255, 42, 42, 0.6)';
                    e.target.style.boxShadow = '0 0 12px rgba(255, 42, 42, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 42, 42, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <input
                  type="text"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  style={{
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 42, 42, 0.2)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255, 42, 42, 0.6)';
                    e.target.style.boxShadow = '0 0 12px rgba(255, 42, 42, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 42, 42, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </motion.div>

              {/* Bottom Divider */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  height: '2px',
                  background: 'repeating-linear-gradient(90deg, #FF2A2A 0px, #FF2A2A 10px, transparent 10px, transparent 20px)',
                  marginBottom: '1.5rem',
                  transformOrigin: 'left'
                }}
              />

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}
              >
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255, 42, 42, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    background: 'linear-gradient(135deg, #FF2A2A 0%, #FF4444 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: 800,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 8px 24px rgba(255, 42, 42, 0.3)',
                    transition: 'all 0.3s ease',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Contact Us'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    background: 'transparent',
                    color: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Try Another Offer
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}

      {/* Success Message */}
      {showSuccess && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.95) 0%, rgba(20, 10, 15, 0.95) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '16px',
              padding: '3rem 2.5rem',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 60px rgba(16, 185, 129, 0.15)',
              zIndex: 1001,
              textAlign: 'center'
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.8 }}
              style={{ fontSize: '3rem', marginBottom: '1rem' }}
            >
              ✨
            </motion.div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 900,
              color: '#10b981',
              marginBottom: '0.5rem'
            }}>
              Thank You!
            </h3>
            <p style={{
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              We will contact you soon with your exclusive offer
            </p>
          </motion.div>
        </>
      )}
    </>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface FloatingCouponCardProps {
  onClose?: () => void;
}

export default function FloatingCouponCard({ onClose }: FloatingCouponCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Auto-show after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleClaimClick = () => {
    setShowForm(true);
  };

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
            id: 'floating-coupon-offer',
            title: 'Premium Package',
            description: 'Get exclusive access to premium features',
            discount: '30% OFF',
            type: 'percentage',
            color: '#e61e25'
          },
          scratchedAt: new Date().toISOString(),
          source: 'homepage_floating_coupon'
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
    setShowForm(false);
    setShowSuccess(false);
    setFormData({ name: '', email: '', phone: '', companyName: '' });
    onClose?.();
  };

  return (
    <>
      {/* Floating Coupon Card */}
      {isVisible && !showForm && !showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 100, x: '-50%' }}
          animate={{ opacity: 1, y: [0, -10, 0], x: '-50%' }}
          exit={{ opacity: 0, y: 100, x: '-50%' }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 999
          }}
        >
          <motion.div
            style={{
              background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.98) 0%, rgba(20, 10, 15, 0.98) 100%)',
              border: '2px solid rgba(255, 42, 42, 0.4)',
              borderRadius: '16px',
              padding: '1.5rem 2rem',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(255, 42, 42, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              maxWidth: '420px',
              minWidth: '300px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Glow Effect */}
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center, rgba(255, 42, 42, 0.1) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(255, 42, 42, 0.15)',
                border: '1px solid rgba(255, 42, 42, 0.3)',
                color: '#FF2A2A',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                zIndex: 10
              }}
            >
              <X size={18} />
            </motion.button>

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              {/* Emoji */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
                style={{
                  fontSize: '2rem',
                  marginBottom: '0.75rem'
                }}
              >
                🎉
              </motion.div>

              {/* Discount */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                  fontSize: '2.2rem',
                  fontWeight: 900,
                  color: '#FF2A2A',
                  marginBottom: '0.25rem',
                  textShadow: '0 0 20px rgba(255, 42, 42, 0.3)'
                }}
              >
                30% OFF
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: '0.25rem',
                  margin: '0.25rem 0'
                }}
              >
                Premium Package
              </motion.h3>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  fontSize: '0.85rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '1rem',
                  margin: '0 0 1rem 0'
                }}
              >
                Limited Time Offer
              </motion.p>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClaimClick}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  background: 'linear-gradient(135deg, #FF2A2A 0%, #FF4444 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(255, 42, 42, 0.35)',
                  transition: 'all 0.3s ease'
                }}
              >
                Claim Offer
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Form Modal */}
      {showForm && !showSuccess && (
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

          {/* Form Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              top: '1rem',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.95) 0%, rgba(20, 10, 15, 0.95) 100%)',
              border: '1px solid rgba(255, 42, 42, 0.3)',
              borderRadius: '16px',
              padding: 'clamp(1.5rem, 4vw, 2rem)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 60px rgba(255, 42, 42, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              zIndex: 1001,
              maxWidth: 'calc(100vw - 2rem)',
              width: 'clamp(280px, 90vw, 480px)',
              maxHeight: 'calc(100vh - 3rem)',
              overflowY: 'auto',
              overflowX: 'hidden'
            }}
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'rgba(255, 42, 42, 0.15)',
                border: '1px solid rgba(255, 42, 42, 0.3)',
                color: '#FF2A2A',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              ✕
            </motion.button>

            {/* Offer Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ textAlign: 'center', marginBottom: '2rem' }}
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.6 }}
                style={{
                  fontSize: '3.5rem',
                  fontWeight: 900,
                  color: '#FF2A2A',
                  marginBottom: '0.5rem',
                  textShadow: '0 0 20px rgba(255, 42, 42, 0.3)'
                }}
              >
                30% OFF
              </motion.div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '0.5rem'
              }}>
                Premium Package
              </h2>
              <p style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: '1.6'
              }}>
                Get exclusive access to premium features
              </p>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <input
                type="text"
                placeholder="Full Name *"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                style={{
                  padding: '0.9rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 42, 42, 0.2)',
                  borderRadius: '8px',
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
                  padding: '0.9rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 42, 42, 0.2)',
                  borderRadius: '8px',
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
                  padding: '0.9rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 42, 42, 0.2)',
                  borderRadius: '8px',
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
                  padding: '0.9rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 42, 42, 0.2)',
                  borderRadius: '8px',
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

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255, 42, 42, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #FF2A2A 0%, #FF4444 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 8px 24px rgba(255, 42, 42, 0.3)',
                  transition: 'all 0.3s ease',
                  marginTop: '0.5rem',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Claim Offer'}
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
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Close
              </motion.button>
            </motion.div>
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
              We will contact you soon with your offer
            </p>
          </motion.div>
        </>
      )}
    </>
  );
}

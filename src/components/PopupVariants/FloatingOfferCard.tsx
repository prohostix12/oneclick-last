"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface FloatingOfferCardProps {
  onClose?: () => void;
}

export default function FloatingOfferCard({ onClose }: FloatingOfferCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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

  const handleCardClick = () => {
    setIsExpanded(true);
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
            id: 'floating-offer-card',
            title: 'Free Consultation',
            description: 'Worth $500 - Expert consultation session',
            discount: 'FREE',
            type: 'free',
            color: '#10b981'
          },
          scratchedAt: new Date().toISOString(),
          source: 'homepage_floating_offer'
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
    setIsExpanded(false);
    setShowSuccess(false);
    setFormData({ name: '', email: '', phone: '', companyName: '' });
    onClose?.();
  };

  return (
    <>
      {/* Floating Offer Card */}
      {isVisible && !isExpanded && !showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 999
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(16, 185, 129, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCardClick}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            style={{
              background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.95) 0%, rgba(20, 10, 15, 0.95) 100%)',
              border: '2px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '16px',
              padding: 'clamp(1rem, 3vw, 1.5rem) clamp(1.5rem, 4vw, 2rem)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 15px 50px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              maxWidth: 'clamp(280px, 90vw, 380px)',
              minWidth: '280px',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'left'
            }}
          >
            {/* Glow Effect */}
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              {/* Label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#10b981',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                FREE
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: '0.5rem',
                  margin: '0.5rem 0'
                }}
              >
                Free Consultation
              </motion.h3>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '1rem',
                  lineHeight: '1.4',
                  margin: '0 0 1rem 0'
                }}
              >
                Worth $500 - Expert consultation session
              </motion.p>

              {/* CTA Text */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                style={{
                  fontSize: '0.85rem',
                  color: '#10b981',
                  fontWeight: 600
                }}
              >
                Click to claim →
              </motion.div>
            </div>
          </motion.button>
        </motion.div>
      )}

      {/* Expanded Modal */}
      {isExpanded && !showSuccess && (
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

          {/* Modal */}
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
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '16px',
              padding: 'clamp(1.5rem, 4vw, 2rem)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 60px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10b981',
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
              {/* Label */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.6 }}
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#10b981',
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                FREE
              </motion.div>

              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '0.5rem'
              }}>
                Free Consultation
              </h2>

              <p style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: '1.6'
              }}>
                Worth $500 - Expert consultation session
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
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(16, 185, 129, 0.6)';
                  e.target.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(16, 185, 129, 0.2)';
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
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(16, 185, 129, 0.6)';
                  e.target.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(16, 185, 129, 0.2)';
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
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(16, 185, 129, 0.6)';
                  e.target.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(16, 185, 129, 0.2)';
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
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(16, 185, 129, 0.6)';
                  e.target.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(16, 185, 129, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.3s ease',
                  marginTop: '0.5rem',
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
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Try Another Offer
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
              We will contact you soon with your free consultation offer
            </p>
          </motion.div>
        </>
      )}
    </>
  );
}

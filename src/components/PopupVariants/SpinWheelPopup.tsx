"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SpinWheelPopupProps {
  onClose?: () => void;
}

const WHEEL_OFFERS = [
  { label: '10% OFF', value: '10%', color: '#3b82f6' },
  { label: '20% OFF', value: '20%', color: '#8b5cf6' },
  { label: '30% OFF', value: '30%', color: '#FF2A2A' },
  { label: 'Free Consultation', value: 'free', color: '#10b981' },
  { label: 'Premium Package', value: 'premium', color: '#f59e0b' },
  { label: '15% OFF', value: '15%', color: '#06b6d4' }
];

export default function SpinWheelPopup({ onClose }: SpinWheelPopupProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedOffer, setSelectedOffer] = useState<typeof WHEEL_OFFERS[0] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    const randomIndex = Math.floor(Math.random() * WHEEL_OFFERS.length);
    const spinRotation = 360 * 5 + (randomIndex * (360 / WHEEL_OFFERS.length));
    
    setRotation(spinRotation);

    setTimeout(() => {
      setSelectedOffer(WHEEL_OFFERS[randomIndex]);
      setIsSpinning(false);
      setTimeout(() => {
        setShowForm(true);
      }, 500);
    }, 3000);
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
            id: 'spin-wheel-offer',
            title: selectedOffer?.label || 'Special Offer',
            description: 'Won from Spin Wheel',
            discount: selectedOffer?.value || '30% OFF',
            type: 'percentage',
            color: selectedOffer?.color || '#FF2A2A'
          },
          scratchedAt: new Date().toISOString(),
          source: 'homepage_spin_wheel'
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
    setRotation(0);
    setSelectedOffer(null);
    setShowForm(false);
    setShowSuccess(false);
    setFormData({ name: '', email: '', phone: '', companyName: '' });
    onClose?.();
  };

  return (
    <div style={{ position: 'relative', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      {/* Spin Wheel Container */}
      {!selectedOffer && !showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center' }}
        >
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 900,
            color: '#ffffff',
            marginBottom: '2rem',
            letterSpacing: '-0.5px'
          }}>
            🎡 Spin & Win Your Offer!
          </h2>

          {/* Wheel Container */}
          <div style={{
            position: 'relative',
            width: '300px',
            height: '300px',
            margin: '0 auto 2rem',
            perspective: '1000px'
          }}>
            {/* Pointer */}
            <div style={{
              position: 'absolute',
              top: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '0',
              height: '0',
              borderLeft: '15px solid transparent',
              borderRight: '15px solid transparent',
              borderTop: '25px solid #FF2A2A',
              zIndex: 10,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }} />

            {/* Spinning Wheel */}
            <motion.div
              animate={{ rotate: rotation }}
              transition={{ duration: 3, ease: 'easeOut' }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'conic-gradient(' + WHEEL_OFFERS.map((offer, i) => `${offer.color} ${(i * 360) / WHEEL_OFFERS.length}deg ${((i + 1) * 360) / WHEEL_OFFERS.length}deg`).join(', ') + ')',
                boxShadow: '0 0 30px rgba(255, 42, 42, 0.3), inset 0 0 20px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              {/* Center Circle */}
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.95) 0%, rgba(20, 10, 15, 0.95) 100%)',
                border: '3px solid #FF2A2A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                zIndex: 5
              }}>
                🎁
              </div>

              {/* Wheel Segments */}
              {WHEEL_OFFERS.map((offer, index) => {
                const angle = (index * 360) / WHEEL_OFFERS.length;
                const nextAngle = ((index + 1) * 360) / WHEEL_OFFERS.length;
                const midAngle = (angle + nextAngle) / 2;
                const radians = (midAngle * Math.PI) / 180;
                const x = Math.cos(radians) * 90;
                const y = Math.sin(radians) * 90;

                return (
                  <div
                    key={index}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: `rotate(${angle}deg)`,
                      pointerEvents: 'none'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      transform: `translateY(-110px) rotate(${90 - midAngle}deg)`,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      textAlign: 'center',
                      maxWidth: '60px',
                      lineHeight: '1.2'
                    }}>
                      {offer.label}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Spin Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSpin}
            disabled={isSpinning}
            style={{
              padding: '1rem 2.5rem',
              background: 'linear-gradient(135deg, #FF2A2A 0%, #FF4444 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 800,
              cursor: isSpinning ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 24px rgba(255, 42, 42, 0.3)',
              transition: 'all 0.3s ease',
              opacity: isSpinning ? 0.7 : 1
            }}
          >
            {isSpinning ? 'Spinning...' : 'SPIN NOW 🎡'}
          </motion.button>

          <p style={{
            marginTop: '1.5rem',
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.9rem'
          }}>
            Click the button to spin and win an amazing offer!
          </p>
        </motion.div>
      )}

      {/* Form Modal */}
      {showForm && !showSuccess && selectedOffer && (
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
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.95) 0%, rgba(20, 10, 15, 0.95) 100%)',
              border: '1px solid rgba(255, 42, 42, 0.3)',
              borderRadius: '16px',
              padding: '2rem',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 60px rgba(255, 42, 42, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              zIndex: 1001,
              maxWidth: 'calc(100vw - 2rem)',
              width: '480px',
              maxHeight: '90vh',
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
                  color: selectedOffer.color,
                  marginBottom: '0.5rem',
                  textShadow: `0 0 20px ${selectedOffer.color}40`
                }}
              >
                🎉
              </motion.div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '0.5rem'
              }}>
                You Won!
              </h2>
              <p style={{
                fontSize: '1.2rem',
                color: selectedOffer.color,
                fontWeight: 700,
                marginBottom: '0.5rem'
              }}>
                {selectedOffer.label}
              </p>
              <p style={{
                fontSize: '0.95rem',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: '1.6'
              }}>
                Claim your exclusive offer now!
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
                Try Another Spin
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
    </div>
  );
}

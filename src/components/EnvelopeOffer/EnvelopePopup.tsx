"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  type: 'percentage' | 'free' | 'fixed';
  color: string;
}

interface EnvelopePopupProps {
  offers?: Offer[];
}

export default function EnvelopePopup({ offers = [] }: EnvelopePopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [currentStep, setCurrentStep] = useState<'envelope' | 'form' | 'success'>('envelope');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableOffers, setAvailableOffers] = useState<Offer[]>([]);

  // Fetch offers
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('/api/offers');
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          setAvailableOffers(data.data);
        } else {
          setAvailableOffers([
            {
              id: '1',
              title: 'Free Consultation',
              description: 'Worth $500 - Expert consultation session',
              discount: 'FREE',
              type: 'free',
              color: '#10b981',
            },
            {
              id: '2',
              title: 'Premium Package',
              description: 'Get exclusive access to premium features',
              discount: '30% OFF',
              type: 'percentage',
              color: '#e61e25',
            },
            {
              id: '3',
              title: 'Special Discount',
              description: 'Limited time offer on all services',
              discount: '$200 OFF',
              type: 'fixed',
              color: '#3b82f6',
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };
    fetchOffers();
  }, []);

  const handleEnvelopeClick = () => {
    console.log('💌 Envelope clicked');
    if (availableOffers.length > 0) {
      const randomOffer = availableOffers[Math.floor(Math.random() * availableOffers.length)];
      setSelectedOffer(randomOffer);
      setIsOpen(true);
      setCurrentStep('form');
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    if (!selectedOffer) {
      alert('Please open an offer first');
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
          offer: selectedOffer,
          scratchedAt: new Date().toISOString(),
          source: 'homepage_envelope_offer'
        }),
      });

      if (response.ok) {
        setCurrentStep('success');
        setTimeout(() => {
          handleReset();
        }, 3000);
      } else {
        alert('Error submitting form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsOpen(false);
    setCurrentStep('envelope');
    setSelectedOffer(null);
    setFormData({ name: '', email: '', phone: '', companyName: '' });
  };

  return (
    <section style={{
      padding: 'clamp(1rem, 4vw, 2rem) clamp(1rem, 4vw, 2rem)',
      background: `linear-gradient(135deg, rgba(12, 12, 12, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%), url('/dubai-hero-building.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      textAlign: 'center',
      position: 'relative',
      minHeight: '600px',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: 'clamp(2rem, 8vw, 4rem)'
    }}>


      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2, width: '100%' }}>
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
            fontWeight: 900,
            color: '#ffffff',
            marginBottom: '0.5rem',
            textAlign: 'center',
            letterSpacing: '-0.5px'
          }}
        >
          💌 You've Received an Offer
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}
        >
          Click to open your exclusive offer
        </motion.p>

        {/* Envelope Container */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}>
          {!isOpen ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              onClick={handleEnvelopeClick}
              style={{
                cursor: 'pointer',
                position: 'relative',
                width: '500px',
                height: '350px'
              }}
            >
              {/* Envelope Container */}
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%'
                }}
              >
                {/* Envelope Body */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                  borderRadius: '0px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                  border: '2px solid rgba(230, 30, 37, 0.3)',
                  overflow: 'hidden'
                }}>
                  {/* Envelope Flap */}
                  <motion.div
                    animate={{ rotateX: [0, -45, 0] }}
                    transition={{ 
                      duration: 1.2, 
                      repeat: Infinity,
                      repeatDelay: 2.5
                    }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '50%',
                      background: 'linear-gradient(135deg, #FF2A2A 0%, #e61e25 100%)',
                      transformOrigin: 'top',
                      transformStyle: 'preserve-3d',
                      borderBottom: '2px solid rgba(0, 0, 0, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '2rem',
                      fontWeight: 700
                    }}
                  >
                    ✉️
                  </motion.div>

                  {/* Envelope Body Content */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    color: '#666',
                    fontWeight: 600,
                    padding: '0.5rem'
                  }}>
                    CLICK TO OPEN
                  </div>
                </div>

                {/* Letter Inside (Slides out) */}
                <motion.div
                  animate={{ 
                    y: [0, -100, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 1.2, 
                    repeat: Infinity,
                    repeatDelay: 2.5,
                    delay: 0.3
                  }}
                  style={{
                    position: 'absolute',
                    top: '-80px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '220px',
                    height: '140px',
                    background: 'linear-gradient(135deg, #FFF8DC 0%, #FFFACD 100%)',
                    borderRadius: '2px',
                    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(230, 30, 37, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    zIndex: 10
                  }}
                >
                  🎁
                </motion.div>
              </motion.div>

              {/* Glow Effect */}
              <motion.div
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(255, 42, 42, 0.2)',
                    '0 0 40px rgba(255, 42, 42, 0.4)',
                    '0 0 20px rgba(255, 42, 42, 0.2)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  inset: '-20px',
                  borderRadius: '50%',
                  pointerEvents: 'none'
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                fontSize: '80px'
              }}
            >
              ✨
            </motion.div>
          )}
        </div>
      </div>

      {/* FORM MODAL */}
      {isOpen && currentStep === 'form' && selectedOffer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleReset}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'none',
              zIndex: 9998
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
              top: '20px',
              left: '0',
              right: '0',
              margin: '0 auto',
              background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.99) 0%, rgba(20, 10, 15, 0.99) 100%)',
              border: '2px dashed rgba(255, 42, 42, 0.8)',
              borderRadius: '16px',
              padding: '2rem',
              backdropFilter: 'none',
              boxShadow: '0 0 60px rgba(255, 42, 42, 0.4), 0 0 100px rgba(255, 42, 42, 0.2)',
              zIndex: 9999,
              width: 'clamp(300px, 90vw, 500px)',
              maxHeight: 'calc(100vh - 40px)',
              overflowY: 'auto',
              boxSizing: 'border-box'
            }}
          >
            {/* Close Button */}
            <button
              onClick={handleReset}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                color: '#FF2A2A',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              ✕
            </button>

            {/* Offer Info */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#FF2A2A',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                💌 SPECIAL OFFER
              </div>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: 900,
                color: '#ffffff',
                marginBottom: '0.5rem'
              }}>
                {selectedOffer.title}
              </h2>
              <p style={{
                fontSize: '1.2rem',
                color: '#FF2A2A',
                fontWeight: 700,
                marginBottom: '0.3rem'
              }}>
                {selectedOffer.discount}
              </p>
              <p style={{
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                {selectedOffer.description}
              </p>
            </div>

            {/* Divider */}
            <div style={{
              height: '2px',
              background: 'repeating-linear-gradient(90deg, #FF2A2A 0px, #FF2A2A 10px, transparent 10px, transparent 20px)',
              marginBottom: '1.5rem'
            }} />

            {/* Form */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <input
                type="text"
                placeholder="Full Name *"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                style={{
                  padding: '0.85rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 42, 42, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 42, 42, 0.6)';
                  e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 42, 42, 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 42, 42, 0.2)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <input
                type="email"
                placeholder="Email *"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                style={{
                  padding: '0.85rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 42, 42, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 42, 42, 0.6)';
                  e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 42, 42, 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 42, 42, 0.2)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                style={{
                  padding: '0.85rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 42, 42, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 42, 42, 0.6)';
                  e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 42, 42, 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 42, 42, 0.2)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <input
                type="text"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                style={{
                  padding: '0.85rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 42, 42, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 42, 42, 0.6)';
                  e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 42, 42, 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 42, 42, 0.2)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Divider */}
            <div style={{
              height: '2px',
              background: 'repeating-linear-gradient(90deg, #FF2A2A 0px, #FF2A2A 10px, transparent 10px, transparent 20px)',
              margin: '1.5rem 0'
            }} />

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  background: 'linear-gradient(135deg, #FF2A2A 0%, #FF4444 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 8px 24px rgba(255, 42, 42, 0.3)',
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
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </>
      )}

      {/* SUCCESS MODAL */}
      {currentStep === 'success' && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'none',
              zIndex: 9998
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
              background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.99) 0%, rgba(20, 10, 15, 0.99) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.5)',
              borderRadius: '16px',
              padding: 'clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)',
              backdropFilter: 'none',
              boxShadow: '0 0 60px rgba(16, 185, 129, 0.3)',
              zIndex: 9999,
              textAlign: 'center',
              width: 'min(calc(100vw - 1rem), 450px)',
              boxSizing: 'border-box'
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.8 }}
              style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', marginBottom: '1rem' }}
            >
              ✨
            </motion.div>
            <h3 style={{
              fontSize: 'clamp(1.2rem, 5vw, 1.5rem)',
              fontWeight: 900,
              color: '#10b981',
              marginBottom: '0.5rem'
            }}>
              Thank You!
            </h3>
            <p style={{
              fontSize: 'clamp(0.9rem, 3vw, 1rem)',
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: '1.5'
            }}>
              We will contact you soon
            </p>
          </motion.div>
        </>
      )}
    </section>
  );
}

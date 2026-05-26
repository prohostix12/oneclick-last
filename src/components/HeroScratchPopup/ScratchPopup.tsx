"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ScratchCard from './ScratchCard';

interface ScratchPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScratchPopup({ isOpen, onClose }: ScratchPopupProps) {
  const [currentStep, setCurrentStep] = useState<'scratch' | 'result'>('scratch');
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    console.log('ScratchPopup isOpen:', isOpen);
  }, [isOpen]);

  const handleScratchComplete = (offer: any) => {
    console.log('Scratch complete, offer:', offer);
    setSelectedOffer(offer);
    setCurrentStep('result');
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
          offer: selectedOffer,
          scratchedAt: new Date().toISOString(),
          source: 'homepage_hero_scratch'
        }),
      });

      if (response.ok) {
        alert('Thank you! We will contact you soon.');
        handleClose();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCurrentStep('scratch');
    setSelectedOffer(null);
    setFormData({ name: '', email: '', phone: '', companyName: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Blur Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              zIndex: 9998
            }}
          />

          {/* Popup Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999,
              width: '85%',
              maxWidth: '500px',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            {/* Glow Effect */}
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(230, 30, 37, 0.3)',
                  '0 0 40px rgba(230, 30, 37, 0.5)',
                  '0 0 20px rgba(230, 30, 37, 0.3)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '24px',
                pointerEvents: 'none'
              }}
            />

            {/* Card Content */}
            <motion.div
              style={{
                position: 'relative',
                background: 'linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(25, 10, 20, 0.95) 100%)',
                border: '2px solid rgba(230, 30, 37, 0.5)',
                borderRadius: '24px',
                padding: '1.5rem',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
              }}
            >
              {/* Close Button */}
              <motion.button
                onClick={handleClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  background: 'rgba(230, 30, 37, 0.2)',
                  border: '1px solid rgba(230, 30, 37, 0.4)',
                  color: '#e61e25',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  backdropFilter: 'blur(10px)'
                }}
              >
                <X size={20} />
              </motion.button>

              {/* Content */}
              <AnimatePresence mode="wait">
                {currentStep === 'scratch' && (
                  <motion.div
                    key="scratch"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                      <motion.div
                        animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        style={{ fontSize: '2.5rem', marginBottom: '0.75rem', display: 'inline-block' }}
                      >
                        🎁
                      </motion.div>
                      <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        color: '#ffffff',
                        marginBottom: '0.5rem',
                        letterSpacing: '-0.5px'
                      }}>
                        Special Offer
                      </h2>
                      <p style={{
                        fontSize: '0.9rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        lineHeight: '1.6'
                      }}>
                        Scratch to reveal your exclusive discount
                      </p>
                    </div>

                    <ScratchCard onComplete={handleScratchComplete} />
                  </motion.div>
                )}

                {currentStep === 'result' && selectedOffer && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.8 }}
                      style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}
                    >
                      ✨
                    </motion.div>
                    <h3 style={{
                      fontSize: '1.4rem',
                      fontWeight: 900,
                      color: '#10b981',
                      marginBottom: '1rem',
                      letterSpacing: '-0.5px',
                      textAlign: 'center'
                    }}>
                      Congratulations!
                    </h3>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '2px solid rgba(230, 30, 37, 0.3)',
                      borderRadius: '16px',
                      padding: '1.2rem',
                      marginBottom: '1.5rem',
                      backdropFilter: 'blur(10px)',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '2rem',
                        fontWeight: 900,
                        color: selectedOffer.color,
                        marginBottom: '0.5rem',
                        textShadow: '0 4px 12px rgba(230, 30, 37, 0.3)'
                      }}>
                        {selectedOffer.discount}
                      </div>
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: 'white',
                        marginBottom: '0.4rem'
                      }}>
                        {selectedOffer.title}
                      </h4>
                      <p style={{
                        fontSize: '0.85rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        lineHeight: '1.5'
                      }}>
                        {selectedOffer.description}
                      </p>
                    </div>

                    {/* Contact Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      <input
                        type="text"
                        placeholder="Full Name *"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        style={{
                          padding: '0.75rem',
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(230, 30, 37, 0.3)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}
                      />
                      <input
                        type="email"
                        placeholder="Email *"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        style={{
                          padding: '0.75rem',
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(230, 30, 37, 0.3)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}
                      />
                      <input
                        type="tel"
                        placeholder="Phone *"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        style={{
                          padding: '0.75rem',
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(230, 30, 37, 0.3)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={formData.companyName}
                        onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                        style={{
                          padding: '0.75rem',
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(230, 30, 37, 0.3)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      style={{
                        width: '100%',
                        padding: '0.9rem',
                        background: 'linear-gradient(135deg, #e61e25 0%, #ff2d35 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        fontWeight: 800,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        boxShadow: '0 10px 30px rgba(230, 30, 37, 0.4)',
                        transition: 'all 0.3s ease',
                        marginTop: '1rem',
                        opacity: isSubmitting ? 0.7 : 1
                      }}
                    >
                      {isSubmitting ? 'Submitting...' : 'Contact Us'}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

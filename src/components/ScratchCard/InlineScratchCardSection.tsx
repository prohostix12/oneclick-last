"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScratchCard from './ScratchCard';

export default function InlineScratchCardSection() {
  const [currentStep, setCurrentStep] = useState<'scratch' | 'result' | 'success'>('scratch');
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [availableOffers, setAvailableOffers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch offers from admin
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
              active: true
            },
            {
              id: '2',
              title: 'Premium Package',
              description: 'Get exclusive access to premium features',
              discount: '30% OFF',
              type: 'percentage',
              color: '#e61e25',
              active: true
            },
            {
              id: '3',
              title: 'Special Discount',
              description: 'Limited time offer on all services',
              discount: '$200 OFF',
              type: 'fixed',
              color: '#3b82f6',
              active: true
            },
            {
              id: '4',
              title: 'VIP Access',
              description: 'Exclusive benefits and priority support',
              discount: '50% OFF',
              type: 'percentage',
              color: '#f59e0b',
              active: true
            },
            {
              id: '5',
              title: 'Bonus Package',
              description: 'Extra services included with your purchase',
              discount: '25% OFF',
              type: 'percentage',
              color: '#8b5cf6',
              active: true
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
        setAvailableOffers([
          {
            id: '1',
            title: 'Premium Package',
            description: 'Get exclusive access to premium features',
            discount: '30% OFF',
            type: 'percentage',
            color: '#e61e25',
            active: true
          },
          {
            id: '2',
            title: 'Free Consultation',
            description: 'Worth $500 - Expert consultation session',
            discount: 'FREE',
            type: 'free',
            color: '#10b981',
            active: true
          },
          {
            id: '3',
            title: 'Special Discount',
            description: 'Limited time offer on all services',
            discount: '$200 OFF',
            type: 'fixed',
            color: '#3b82f6',
            active: true
          },
          {
            id: '4',
            title: 'VIP Access',
            description: 'Exclusive benefits and priority support',
            discount: '50% OFF',
            type: 'percentage',
            color: '#f59e0b',
            active: true
          },
          {
            id: '5',
            title: 'Bonus Package',
            description: 'Extra services included with your purchase',
            discount: '25% OFF',
            type: 'percentage',
            color: '#8b5cf6',
            active: true
          }
        ]);
      }
    };
    fetchOffers();
  }, []);

  const handleScratchComplete = (offer: any) => {
    console.log('✅✅✅ HANDLER CALLED - handleScratchComplete');
    console.log('✅✅✅ Offer received:', offer);
    console.log('✅✅✅ Current state before update - currentStep:', currentStep);
    setSelectedOffer(offer);
    setCurrentStep('result');
    console.log('✅✅✅ State updated - currentStep should now be "result"');
    console.log('✅✅✅ selectedOffer should be:', offer);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    if (!selectedOffer) {
      alert('Please scratch the card first to reveal an offer');
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
          source: 'homepage_inline_scratch'
        }),
      });

      if (response.ok) {
        setCurrentStep('success');
        setTimeout(() => {
          handleReset();
        }, 3000);
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        alert(errorData.error || 'Error submitting form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCurrentStep('scratch');
    setSelectedOffer(null);
    setFormData({ name: '', email: '', phone: '', companyName: '' });
  };

  return (
    <>
      <section style={{
        padding: 'clamp(1rem, 4vw, 2rem) clamp(1rem, 4vw, 2rem)',
        background: `linear-gradient(135deg, rgba(12, 12, 12, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%), url('/dubai-hero-building.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(230, 30, 37, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>

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
              marginBottom: '1rem',
              textAlign: 'center',
              letterSpacing: '-0.5px'
            }}
          >
            🎁 Exclusive Offer
          </motion.h2>



          {/* Scratch Card Container */}
          <div
            style={{
              maxWidth: '480px',
              margin: '0 auto',
              perspective: '1000px',
              position: 'relative',
              zIndex: 10,
              minHeight: '350px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {currentStep === 'scratch' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {(() => {
                  if (availableOffers.length === 0) return null;
                  const randomOffer = availableOffers[Math.floor(Math.random() * availableOffers.length)];
                  return <ScratchCard offer={randomOffer} onComplete={handleScratchComplete} />;
                })()}
              </motion.div>
            )}

            {currentStep === 'result' && selectedOffer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '2px solid rgba(230, 30, 37, 0.3)',
                  borderRadius: '16px',
                  padding: '1rem',
                  marginTop: '1.5rem',
                  marginBottom: '1rem',
                  backdropFilter: 'blur(10px)',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  color: selectedOffer.color,
                  marginBottom: '0.5rem',
                  textShadow: '0 4px 12px rgba(230, 30, 37, 0.3)'
                }}>
                  {selectedOffer.discount}
                </div>
                <h4 style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'white',
                  marginBottom: '0.3rem'
                }}>
                  {selectedOffer.title}
                </h4>
                <p style={{
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: '1.4'
                }}>
                  {selectedOffer.description}
                </p>
              </motion.div>
            )}

            {currentStep === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                style={{
                  textAlign: 'center',
                  padding: '2rem 0'
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
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.5px'
                }}>
                  Thank You!
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.6',
                  marginBottom: '1rem'
                }}>
                  We will contact you soon
                </p>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  marginTop: '1rem'
                }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#10b981'
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <style jsx>{`
          @media (max-width: 768px) {
            div[style*="maxWidth"] {
              max-width: 100% !important;
              padding: 0 1rem !important;
            }
          }
          
          @media (max-width: 480px) {
            div[style*="maxWidth"] {
              max-width: 100% !important;
              padding: 0 0.75rem !important;
            }
          }
        `}</style>
      </section>

      {/* POPUP MODAL - RENDERED OUTSIDE SECTION */}
      {currentStep === 'result' && selectedOffer && (
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

          {/* Modal Container */}
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
              background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.99) 0%, rgba(20, 10, 15, 0.99) 100%)',
              border: '2px dashed rgba(255, 42, 42, 0.8)',
              borderRadius: '16px',
              padding: '2rem',
              backdropFilter: 'none',
              boxShadow: '0 0 60px rgba(255, 42, 42, 0.4), 0 0 100px rgba(255, 42, 42, 0.2)',
              zIndex: 9999,
              width: 'clamp(300px, 90vw, 500px)',
              maxHeight: '90vh',
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
                🎁 SPECIAL OFFER
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
                Try Another Offer
              </motion.button>
            </div>
          </motion.div>
        </>
      )}

      {/* Success Modal */}
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
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              zIndex: 99999
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
              padding: 'clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 60px rgba(16, 185, 129, 0.15)',
              zIndex: 100000,
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
    </>
  );
}

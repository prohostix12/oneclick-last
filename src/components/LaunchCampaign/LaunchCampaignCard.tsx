"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LaunchCampaignCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [availableOffers, setAvailableOffers] = useState<any[]>([]);

  // Fetch offers on mount
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('/api/offers');
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          setAvailableOffers(data.data);
          setSelectedOffer(data.data[0]);
        } else {
          const defaultOffers = [
            {
              id: '1',
              title: 'Free Consultation',
              description: 'Worth 500 - Expert consultation session',
              discount: '500% DISCOUNT',
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
              discount: '200% OFF',
              type: 'fixed',
              color: '#3b82f6',
            },
          ];
          setAvailableOffers(defaultOffers);
          setSelectedOffer(defaultOffers[0]);
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };
    fetchOffers();
  }, []);

  const handleLaunchClick = () => {
    setIsExpanded(true);
    setTimeout(() => setShowForm(true), 300);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    if (!selectedOffer) {
      alert('Please select an offer first');
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
          source: 'homepage_launch_campaign'
        }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          handleReset();
        }, 2000);
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

  const handleGetAnotherOffer = () => {
    if (availableOffers.length > 0) {
      const randomOffer = availableOffers[Math.floor(Math.random() * availableOffers.length)];
      setSelectedOffer(randomOffer);
      setFormData({ name: '', email: '', phone: '', companyName: '' });
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setIsExpanded(false);
    setFormData({ name: '', email: '', phone: '', companyName: '' });
    setShowSuccess(false);
  };

  const handleReset = () => {
    setShowForm(false);
    setIsExpanded(false);
    setFormData({ name: '', email: '', phone: '', companyName: '' });
    setShowSuccess(false);
  };

  return (
    <section style={{
      padding: 'clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem)',
      background: 'linear-gradient(135deg, rgba(12, 12, 12, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
      textAlign: 'center',
      position: 'relative',
      minHeight: '500px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
            marginBottom: '2rem',
            textAlign: 'center',
            letterSpacing: '-0.5px'
          }}
        >
          📢 Launch Your Campaign
        </motion.h2>

        {/* Card Container */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}>
          {!isExpanded && selectedOffer && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.95) 0%, rgba(20, 10, 15, 0.95) 100%)',
                border: '1px solid rgba(230, 30, 37, 0.3)',
                borderRadius: '24px',
                padding: '3.5rem 3rem',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 0 80px rgba(230, 30, 37, 0.15), 0 20px 60px rgba(0, 0, 0, 0.4)',
                maxWidth: '600px',
                width: '100%',
                textAlign: 'center',
                margin: '0 auto',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Decorative gradient background */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(230, 30, 37, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none'
              }} />

              {/* Content wrapper */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Badge */}
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(230, 30, 37, 0.2)',
                  border: '1px solid rgba(230, 30, 37, 0.4)',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '50px',
                  marginBottom: '1.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#FF2A2A',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px'
                }}>
                  ⭐ Limited Time Offer
                </div>

                {/* Offer Title */}
                <h3 style={{
                  fontSize: '2.2rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  marginBottom: '0.8rem',
                  letterSpacing: '-0.5px'
                }}>
                  {selectedOffer.title}
                </h3>

                {/* Offer Description */}
                <p style={{
                  fontSize: '1.05rem',
                  color: 'rgba(255, 255, 255, 0.75)',
                  marginBottom: '2.5rem',
                  lineHeight: '1.7',
                  fontWeight: 500
                }}>
                  {selectedOffer.description}
                </p>

                {/* Discount Badge - Premium Style */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(230, 30, 37, 0.2) 0%, rgba(230, 30, 37, 0.05) 100%)',
                  border: '2px solid rgba(230, 30, 37, 0.5)',
                  borderRadius: '16px',
                  padding: '2rem 1.5rem',
                  marginBottom: '2.5rem',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)'
                }}>
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    fontWeight: 600
                  }}>
                    Your Exclusive Discount
                  </p>
                  <p style={{
                    fontSize: '3.2rem',
                    fontWeight: 950,
                    background: 'linear-gradient(135deg, #FF2A2A 0%, #FF6B6B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    margin: 0,
                    letterSpacing: '-1px'
                  }}>
                    {selectedOffer.discount}
                  </p>
                </div>

                {/* Launch Button - Premium Style */}
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 80px rgba(255, 42, 42, 0.6)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLaunchClick}
                  style={{
                    width: '100%',
                    padding: '1.4rem 2rem',
                    background: 'linear-gradient(135deg, #FF2A2A 0%, #FF4444 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '14px',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 12px 40px rgba(255, 42, 42, 0.4)',
                    transition: 'all 0.3s ease',
                    letterSpacing: '0.5px'
                  }}
                >
                  🚀 Launch Now
                </motion.button>

                {/* Trust Indicators - Professional Style */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '1.2rem',
                  marginTop: '2.5rem',
                  paddingTop: '2.5rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>✨</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                      Premium Design
                    </div>
                  </div>
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>⚡</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                      Fast Delivery
                    </div>
                  </div>
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>🎯</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                      Expert Support
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* FORM MODAL */}
      {showForm && selectedOffer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(5px)',
              zIndex: 9998,
              willChange: 'opacity'
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
              left: '50%',
              marginLeft: '-250px',
              background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.99) 0%, rgba(20, 10, 15, 0.99) 100%)',
              border: '2px dashed rgba(255, 42, 42, 0.8)',
              borderRadius: '16px',
              padding: '2rem',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 60px rgba(255, 42, 42, 0.4), 0 0 100px rgba(255, 42, 42, 0.2)',
              zIndex: 9999,
              width: '500px',
              maxHeight: 'calc(100vh - 40px)',
              overflowY: 'auto',
              boxSizing: 'border-box'
            }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
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
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#FF2A2A',
                marginBottom: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}>
                🎉 LAUNCH YOUR CAMPAIGN
              </div>
              <h2 style={{
                fontSize: '2.2rem',
                fontWeight: 900,
                color: '#ffffff',
                marginBottom: '0.8rem',
                letterSpacing: '-1px'
              }}>
                {selectedOffer.title}
              </h2>
              <p style={{
                fontSize: '0.95rem',
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '1.2rem',
                lineHeight: '1.5'
              }}>
                {selectedOffer.description}
              </p>

              {/* Discount Badge */}
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #FF2A2A 0%, #FF4444 100%)',
                padding: '0.8rem 1.5rem',
                borderRadius: '50px',
                marginBottom: '1.5rem'
              }}>
                <p style={{
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  margin: 0
                }}>
                  {selectedOffer.discount}
                </p>
              </div>
            </div>

            {/* Form */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem'
            }}>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                style={{
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 42, 42, 0.6)';
                  e.currentTarget.style.background = 'rgba(255, 42, 42, 0.05)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                style={{
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 42, 42, 0.6)';
                  e.currentTarget.style.background = 'rgba(255, 42, 42, 0.05)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                style={{
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 42, 42, 0.6)';
                  e.currentTarget.style.background = 'rgba(255, 42, 42, 0.05)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
              />
              <input
                type="text"
                placeholder="Company Name (Optional)"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                style={{
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 42, 42, 0.6)';
                  e.currentTarget.style.background = 'rgba(255, 42, 42, 0.05)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column', marginTop: '1.5rem' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '1.1rem',
                  background: 'linear-gradient(135deg, #FF2A2A 0%, #FF4444 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 8px 24px rgba(255, 42, 42, 0.3)',
                  opacity: isSubmitting ? 0.7 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                {isSubmitting ? 'Submitting...' : '✓ Contact Us'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGetAnotherOffer}
                style={{
                  width: '100%',
                  padding: '1.1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                🔄 Get Another Offer
              </motion.button>
            </div>
          </motion.div>
        </>
      )}

      {/* SUCCESS MODAL */}
      {showSuccess && (
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
              backdropFilter: 'blur(5px)',
              zIndex: 9998,
              willChange: 'opacity'
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              marginLeft: '-225px',
              background: 'linear-gradient(135deg, rgba(11, 11, 11, 0.99) 0%, rgba(20, 10, 15, 0.99) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.5)',
              borderRadius: '16px',
              padding: 'clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 60px rgba(16, 185, 129, 0.3)',
              zIndex: 9999,
              textAlign: 'center',
              width: '450px',
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

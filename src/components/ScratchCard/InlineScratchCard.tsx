"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, X, ArrowRight, User, Mail, Phone, Building } from 'lucide-react';
import SimpleScratchCard from './SimpleScratchCard';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  type: 'percentage' | 'free' | 'fixed';
  probability: number;
  color: string;
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
    title: '20% Off Advertisement Package',
    description: 'Get 20% discount on any advertisement package worth $500+',
    discount: '20%',
    type: 'percentage',
    probability: 30,
    color: '#3b82f6'
  },
  {
    id: '2',
    title: 'Free Social Media Post',
    description: 'Get a professional social media post design absolutely free',
    discount: 'FREE',
    type: 'free',
    probability: 25,
    color: '#10b981'
  },
  {
    id: '3',
    title: 'Free Banner Design',
    description: 'Get a custom banner design for your business at no cost',
    discount: 'FREE',
    type: 'free',
    probability: 20,
    color: '#8b5cf6'
  },
  {
    id: '4',
    title: '10% Discount on Branding',
    description: 'Save 10% on complete branding packages and logo design',
    discount: '10%',
    type: 'percentage',
    probability: 25,
    color: '#f59e0b'
  }
];

interface InlineScratchCardProps {
  placement: 'below-hero' | 'floating-popup' | 'sticky-corner' | 'modal';
  autoShow?: boolean;
  delay?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function InlineScratchCard({ 
  placement = 'below-hero', 
  autoShow = true, 
  delay = 2000,
  isOpen = false,
  onClose
}: InlineScratchCardProps) {
  const [isVisible, setIsVisible] = useState(placement === 'below-hero' || (placement === 'modal' && isOpen));
  const [currentStep, setCurrentStep] = useState<'form' | 'scratch' | 'result'>('form');
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    companyName: ''
  });
  const [errors, setErrors] = useState<Partial<UserData>>({});
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (placement === 'modal') {
      setIsVisible(isOpen);
    }
  }, [isOpen, placement]);

  useEffect(() => {
    if (placement === 'floating-popup' && autoShow) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
    
    if (placement === 'sticky-corner' && autoShow) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [placement, autoShow, delay]);

  const selectRandomOffer = (): Offer => {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const offer of offers) {
      cumulative += offer.probability;
      if (random <= cumulative) {
        return offer;
      }
    }
    
    return offers[0];
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setUserData(formData);
    const offer = selectRandomOffer();
    setSelectedOffer(offer);
    setCurrentStep('scratch');
  };

  const handleScratchComplete = () => {
    setCurrentStep('result');
  };

  const handleClaimOffer = async () => {
    if (!userData || !selectedOffer) return;

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
          scratchedAt: new Date().toISOString(),
          source: `homepage_${placement}`
        }),
      });

      if (response.ok) {
        localStorage.setItem('scratchCardLastSeen', new Date().toDateString());
        setIsVisible(false);
      }
    } catch (error) {
      console.error('Error claiming offer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    if (placement === 'modal' && onClose) {
      onClose();
    }
    localStorage.setItem('scratchCardLastSeen', new Date().toDateString());
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isVisible) return null;

  // Render different layouts based on placement
  const renderContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`
        ${placement === 'below-hero' ? 'inline-scratch-card' : ''}
        ${placement === 'floating-popup' || placement === 'modal' ? 'floating-scratch-card' : ''}
        ${placement === 'sticky-corner' ? `sticky-scratch-card ${isMinimized ? 'minimized' : ''}` : ''}
      `}
    >
      {/* Close button for popup and sticky */}
      {(placement === 'floating-popup' || placement === 'sticky-corner' || placement === 'modal') && (
        <button
          onClick={handleClose}
          className="scratch-card-close-btn"
        >
          <X size={16} />
        </button>
      )}

      {/* Minimize button for sticky */}
      {placement === 'sticky-corner' && !isMinimized && (
        <button
          onClick={() => setIsMinimized(true)}
          className="scratch-card-minimize-btn"
        >
          −
        </button>
      )}

      {/* Minimized state for sticky */}
      {placement === 'sticky-corner' && isMinimized ? (
        <div 
          className="minimized-content"
          onClick={() => setIsMinimized(false)}
        >
          <Gift size={24} className="text-red-500" />
          <span className="text-sm font-semibold">Special Offer!</span>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="scratch-card-inline-header">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="inline-block mb-3"
            >
              <Gift size={placement === 'below-hero' ? 48 : 32} className="text-red-500" />
            </motion.div>
            <h3 className="scratch-card-inline-title">
              🎉 Special Offer Just for You!
            </h3>
            <p className="scratch-card-inline-subtitle">
              {currentStep === 'form' && "Fill out the form below to reveal your exclusive offer"}
              {currentStep === 'scratch' && "Scratch the card below to reveal your offer"}
              {currentStep === 'result' && "Congratulations! Here's your exclusive offer"}
            </p>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {currentStep === 'form' && (
              <motion.form
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmit}
                className="scratch-card-inline-form"
              >
                <div className="form-grid">
                  <div className="input-group">
                    <User size={16} className="input-icon" />
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="form-input"
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>

                  <div className="input-group">
                    <Mail size={16} className="input-icon" />
                    <input
                      type="email"
                      placeholder="Email *"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="form-input"
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  <div className="input-group">
                    <Phone size={16} className="input-icon" />
                    <input
                      type="tel"
                      placeholder="Phone *"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="form-input"
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>

                  <div className="input-group">
                    <Building size={16} className="input-icon" />
                    <input
                      type="text"
                      placeholder="Company (Optional)"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="reveal-button"
                >
                  Reveal My Offer
                  <ArrowRight size={18} />
                </motion.button>

                <div className="trust-indicators">
                  <div className="trust-item">
                    <div className="trust-dot secure"></div>
                    <span>Secure</span>
                  </div>
                  <div className="trust-item">
                    <div className="trust-dot no-spam"></div>
                    <span>No Spam</span>
                  </div>
                  <div className="trust-item">
                    <div className="trust-dot instant"></div>
                    <span>Instant</span>
                  </div>
                </div>
              </motion.form>
            )}

            {currentStep === 'scratch' && selectedOffer && (
              <motion.div
                key="scratch"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="scratch-reveal"
              >
                <SimpleScratchCard
                  offer={selectedOffer}
                  onComplete={handleScratchComplete}
                />
              </motion.div>
            )}

            {currentStep === 'result' && selectedOffer && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="result-content"
              >
                <div className="offer-display" style={{ borderColor: selectedOffer.color }}>
                  <h4 style={{ color: selectedOffer.color }}>{selectedOffer.discount}</h4>
                  <h5>{selectedOffer.title}</h5>
                  <p>{selectedOffer.description}</p>
                </div>
                
                <motion.button
                  onClick={handleClaimOffer}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="claim-button"
                >
                  {isSubmitting ? 'Contacting...' : 'Contact Us'}
                  <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );

  // Render with overlay for floating popup and modal
  if (placement === 'floating-popup' || placement === 'modal') {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="floating-overlay"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
          >
            {renderContent()}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return renderContent();
}
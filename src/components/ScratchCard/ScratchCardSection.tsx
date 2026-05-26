"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, X } from 'lucide-react';
import ScratchCard from './ScratchCard';
import UserForm from './UserForm';
import OfferPopup from './OfferPopup';

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

export default function ScratchCardSection() {
  const [showScratchCard, setShowScratchCard] = useState(false);
  const [currentStep, setCurrentStep] = useState<'form' | 'scratch' | 'result'>('form');
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log('ScratchCardSection mounted');
    
    // Show immediately for testing
    console.log('Showing scratch card immediately');
    setShowScratchCard(true);
  }, []);

  const selectRandomOffer = (): Offer => {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const offer of offers) {
      cumulative += offer.probability;
      if (random <= cumulative) {
        return offer;
      }
    }
    
    return offers[0]; // Fallback
  };

  const handleFormSubmit = (formData: UserData) => {
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
          source: 'homepage_scratch_card'
        }),
      });

      if (response.ok) {
        // Mark as seen today
        localStorage.setItem('scratchCardLastSeen', new Date().toDateString());
        setShowScratchCard(false);
        // Reset state
        setCurrentStep('form');
        setUserData(null);
        setSelectedOffer(null);
      }
    } catch (error) {
      console.error('Error claiming offer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowScratchCard(false);
    localStorage.setItem('scratchCardLastSeen', new Date().toDateString());
    // Reset state
    setCurrentStep('form');
    setUserData(null);
    setSelectedOffer(null);
  };

  console.log('Render - showScratchCard:', showScratchCard);

  return (
    <>
      <AnimatePresence>
        {showScratchCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="scratch-card-section"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotateY: 90 }}
              transition={{ 
                type: "spring", 
                damping: 20, 
                stiffness: 300,
                duration: 0.6 
              }}
              className="scratch-card-container"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="scratch-card-close"
              >
                <X size={16} />
              </button>

              {/* Header */}
              <div className="scratch-card-header">
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
                  className="inline-block mb-4"
                >
                  <Gift size={40} className="text-red-500" />
                </motion.div>
                <h2 className="scratch-card-title">
                  🎉 Special Offer Just for You!
                </h2>
                <p className="scratch-card-subtitle">
                  {currentStep === 'form' && "Fill out the form below to reveal your exclusive offer"}
                  {currentStep === 'scratch' && "Scratch the card below to reveal your offer"}
                  {currentStep === 'result' && "Congratulations! Here's your exclusive offer"}
                </p>
              </div>

              {/* Content */}
              <AnimatePresence mode="wait">
                {currentStep === 'form' && (
                  <UserForm 
                    key="form"
                    onSubmit={handleFormSubmit} 
                  />
                )}
                
                {currentStep === 'scratch' && selectedOffer && (
                  <ScratchCard
                    key="scratch"
                    offer={selectedOffer}
                    onComplete={handleScratchComplete}
                  />
                )}
                
                {currentStep === 'result' && selectedOffer && (
                  <OfferPopup
                    key="result"
                    offer={selectedOffer}
                    onClaim={handleClaimOffer}
                    isSubmitting={isSubmitting}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
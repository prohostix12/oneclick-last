"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MysteryBox from './MysteryBox';
import OfferRevealCard from './OfferRevealCard';
import ClaimForm from './ClaimForm';

interface Offer {
  id: string;
  title: string;
  description: string;
}

import './mysterybox.css';

interface MysteryBoxProps {
  isModal?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function MysteryBoxSection({ isModal = false, isOpen = true, onClose }: MysteryBoxProps) {
  const [phase, setPhase] = useState<'idle' | 'shaking' | 'opening' | 'revealed'>('idle');
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    const defaultOffers = [
      { id: '1', title: '20% Off Advertisement Package', description: 'Exclusive discount' },
      { id: '2', title: 'Free Social Media Design', description: 'Professional assets' },
      { id: '3', title: 'Free Branding Consultation', description: 'Expert advice' },
      { id: '4', title: 'Free Campaign Setup', description: 'End-to-end setup' },
      { id: '5', title: 'Free Business Promotion', description: 'Promote your brand' }
    ];
    setOffers(defaultOffers);
    
    fetch('/api/offer-settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.offers && data.offers.length > 0) {
          setOffers(data.offers);
        }
      }).catch(console.error);
  }, []);

  // Reset state when opened as modal
  useEffect(() => {
    if (isOpen) {
      setPhase('idle');
      setShowForm(false);
    }
  }, [isOpen]);

  const handleOpenClick = () => {
    if (phase !== 'idle') return;
    setPhase('shaking');
    
    setTimeout(() => {
      setPhase('opening');
      
      setTimeout(() => {
        const randomOffer = offers[Math.floor(Math.random() * offers.length)];
        setSelectedOffer(randomOffer);
        setPhase('revealed');
      }, 1000);
    }, 800);
  };

  if (isModal && !isOpen) return null;

  const content = (
    <>
      <div className="mb-glow-bg" />
      {isModal && onClose && (
        <button 
          onClick={onClose}
          className="mb-form-close" 
          style={{ zIndex: 50, top: '2rem', right: '2rem', scale: 1.5 }}
        >
          ✕
        </button>
      )}
      
      <div className="mb-container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="mb-header"
        >
          <div className="mb-badge">
            Interactive Reveal
          </div>
          <h2 className="mb-title">
            🎁 Unlock Your <span className="mb-gradient-text">Special Offer</span>
          </h2>
          <p className="mb-subtitle">
            Click the mystery box to reveal your exclusive advertising offer. Test your luck!
          </p>
        </motion.div>

        <div className="mb-stage">
          <AnimatePresence mode="wait">
            {phase !== 'revealed' ? (
              <motion.div key="box" exit={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }} transition={{ duration: 0.5 }}>
                 <MysteryBox phase={phase} onOpen={handleOpenClick} />
              </motion.div>
            ) : (
              <motion.div key="card" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                 <OfferRevealCard 
                   offer={selectedOffer!} 
                   onClaim={() => setShowForm(true)} 
                 />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showForm && selectedOffer && (
          <ClaimForm 
            offer={selectedOffer} 
            onClose={() => {
              setShowForm(false);
              if (isModal && onClose) onClose();
            }} 
            isOpen={showForm} 
          />
        )}
      </AnimatePresence>
    </>
  );

  if (isModal) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="mb-form-overlay"
        style={{ zIndex: 1000 }}
      >
        <div className="mb-section" style={{ width: '100%', height: '100%', overflowY: 'auto', borderRadius: '1rem', padding: '4rem 1rem' }}>
           {content}
        </div>
      </motion.div>
    );
  }

  return (
    <section id="mystery-box-reveal" className="mb-section">
      {content}
    </section>
  );
}

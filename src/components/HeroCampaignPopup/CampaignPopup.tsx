'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveScratchCard from '@/components/ScratchCard/InteractiveScratchCard';

interface CampaignPopupProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function CampaignPopup({ isOpen: externalIsOpen, onOpenChange }: CampaignPopupProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  const setIsOpen = (value: boolean) => {
    if (externalIsOpen !== undefined) {
      onOpenChange?.(value);
    } else {
      setInternalIsOpen(value);
    }
  };

  // Auto-show popup after 3 seconds
  useEffect(() => {
    const hasShown = sessionStorage.getItem('campaignPopupShown');
    if (!hasShown && externalIsOpen === undefined) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('campaignPopupShown', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 40
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-60%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, x: '-50%', y: '-60%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              zIndex: 50,
              width: 'clamp(280px, 90vw, 700px)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {/* Glass Card Background */}
            <div
              style={{
                background: 'rgba(20, 20, 20, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: 'clamp(1rem, 3vw, 1.5rem)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
                position: 'relative',
                width: '100%'
              }}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(false)}
                style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}
              >
                ✕
              </motion.button>

              {/* Scratch Card Content */}
              <div style={{ padding: '1rem 0' }}>
                <InteractiveScratchCard onFormReveal={() => console.log('Form revealed')} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

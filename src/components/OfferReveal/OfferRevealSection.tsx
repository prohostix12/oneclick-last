"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OfferCards from './OfferCards';
import ClaimForm from './ClaimForm';

interface Offer {
  id: string;
  title: string;
  discount: string;
  description?: string;
  color?: string;
}

const DEFAULT_OFFERS: Offer[] = [
  { id: '1', title: 'Discount on Services',    discount: '20% OFF', color: '#e61e25',  description: 'On your first advertising campaign' },
  { id: '2', title: 'Free Branding Package',   discount: 'FREE',    color: '#3b82f6',  description: 'Full corporate identity design' },
  { id: '3', title: 'Advertisement Design',    discount: 'FREE',    color: '#10b981',  description: 'Professional billboard design' },
  { id: '4', title: 'Expert Consultation',     discount: 'FREE',    color: '#f59e0b',  description: 'One-on-one strategy session' },
  { id: '5', title: 'Social Media Promotion',  discount: 'FREE',    color: '#8b5cf6',  description: 'One week of targeted social ads' },
];

const STATS = [
  { value: '500+', label: 'Offers Claimed' },
  { value: '98%',  label: 'Satisfaction Rate' },
  { value: '24h',  label: 'Response Time' },
];

const OfferRevealSection: React.FC = () => {
  const [revealedOffer, setRevealedOffer] = useState<Offer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [offers, setOffers] = useState<Offer[]>(DEFAULT_OFFERS);
  const [sectionKey, setSectionKey] = useState(0); // reset cards

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/offer-settings');
        const data = await res.json();
        if (data.success) {
          const now = new Date();
          const expiry = new Date(data.expiryDate);
          if (!data.enabled || now > expiry) {
            setOffers([]);
            return;
          }
          if (data.offers && data.offers.length >= 3) {
            setOffers(data.offers);
          }
        }
      } catch {
        // keep defaults
      }
    };
    fetchSettings();
  }, []);

  const handleReveal = (offer: Offer) => setRevealedOffer(offer);

  const handleClaimSubmit = async (formData: Record<string, string>) => {
    await fetch('/api/offer-leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        businessName: formData.businessName,
        offerWon: formData.offerWon,
        offerId: revealedOffer?.id,
      }),
    });
  };

  const handlePlayAgain = () => {
    setRevealedOffer(null);
    setSectionKey((k) => k + 1);
  };

  if (offers.length === 0) return null;

  const offerColor = revealedOffer?.color || '#e61e25';

  return (
    <section className="relative overflow-hidden py-28" style={{ background: 'linear-gradient(180deg, #080808 0%, #0d0d0d 50%, #080808 100%)' }}>
      {/* ── Ambient background glows ── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full blur-[150px]"
          style={{ background: '#e61e25', transform: 'translate(-50%, -50%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.07, 0.04] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: '#3b82f6', transform: 'translate(50%, 50%)' }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-4xl">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6"
            style={{
              background: 'rgba(230,30,37,0.08)',
              border: '1px solid rgba(230,30,37,0.2)',
            }}
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xl"
            >
              🎁
            </motion.span>
            <span className="text-xs font-black uppercase tracking-[3px] text-[#e61e25]">
              Exclusive Campaign
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-black text-white leading-none mb-5">
            Unlock Your{' '}
            <span
              className="relative inline-block"
              style={{
                color: '#e61e25',
                textShadow: '0 0 40px rgba(230,30,37,0.4)',
              }}
            >
              Special Offer
              {/* Underline accent */}
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
                style={{ background: 'linear-gradient(90deg, #e61e25, #ff6b6b, #e61e25)' }}
                animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </span>
          </h2>

          <p className="text-lg text-white/50 max-w-md mx-auto leading-relaxed mt-4">
            Click to reveal your exclusive promotion and take your business to new heights.
          </p>
        </motion.div>

        {/* ── Card Stage ── */}
        <div key={sectionKey} className="mb-10">
          <OfferCards offers={offers} onReveal={handleReveal} />
        </div>

        {/* ── Claim CTA (after reveal) ── */}
        <AnimatePresence>
          {revealedOffer && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="flex flex-col items-center gap-5 mt-4"
            >
              {/* Won offer badge */}
              <motion.div
                animate={{ boxShadow: [`0 0 20px ${offerColor}30`, `0 0 60px ${offerColor}60`, `0 0 20px ${offerColor}30`] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="px-6 py-3 rounded-2xl text-center"
                style={{
                  background: `${offerColor}10`,
                  border: `1px solid ${offerColor}40`,
                }}
              >
                <div className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">
                  🎉 Congratulations! You won:
                </div>
                <div className="text-2xl font-black" style={{ color: offerColor }}>
                  {revealedOffer.discount} {revealedOffer.title}
                </div>
              </motion.div>

              {/* Claim button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="relative overflow-hidden px-14 py-5 rounded-full font-black text-xl text-white uppercase tracking-widest"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                  color: '#000',
                  boxShadow: '0 0 40px rgba(255,255,255,0.15), 0 20px 40px rgba(0,0,0,0.4)',
                }}
              >
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)' }}
                />
                <span className="relative z-10">Claim My Offer →</span>
              </motion.button>

              <button
                onClick={handlePlayAgain}
                className="text-white/25 text-sm hover:text-white/50 transition-colors font-medium"
              >
                Try again
              </button>

              <p className="text-white/25 text-xs italic">
                * Limited time offer. Terms and conditions apply.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Stats row ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 grid grid-cols-3 gap-4 max-w-md mx-auto"
        >
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-2xl font-black text-white mb-1">{value}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Claim Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ClaimForm
            offer={revealedOffer}
            onClose={() => setShowForm(false)}
            onSubmit={handleClaimSubmit}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default OfferRevealSection;

"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Gift, Star, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import './PremiumScratchCard.css';

interface PremiumScratchCardProps {
    onClaim?: () => void;
    onClose?: () => void;
}

interface Offer {
    id: string;
    title: string;
    discount: string;
    description: string;
    color: string;
}

const ICON_MAP = [Gift, Star, Zap, Star, Check];

export default function PremiumScratchCard({ onClaim, onClose }: PremiumScratchCardProps) {
    const [phase, setPhase] = useState<'teaser' | 'offers' | 'form'>('teaser');
    const [offers, setOffers] = useState<Offer[]>([]);
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', businessName: '' });
    const [visibleCards, setVisibleCards] = useState<number>(0);
    const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await fetch('/api/offer-settings');
                const data = await res.json();
                if (data.success && data.offers && data.offers.length > 0) {
                    setOffers(data.offers);
                } else {
                    setOffers([
                        { id: '1', title: '20% Discount on Services', discount: '20% OFF', description: 'On your first advertising campaign', color: '#e61e25' },
                        { id: '2', title: 'Free Branding Package', discount: 'FREE', description: 'Full corporate identity design', color: '#3b82f6' },
                        { id: '3', title: 'Advertisement Design', discount: 'FREE', description: 'Professional billboard design', color: '#10b981' },
                        { id: '4', title: 'Expert Consultation', discount: 'FREE', description: 'One-on-one strategy session', color: '#f59e0b' },
                        { id: '5', title: 'Social Media Promotion', discount: 'FREE', description: 'One week of targeted social ads', color: '#8b5cf6' },
                    ]);
                }
            } catch {
                setOffers([
                    { id: '1', title: '20% Discount on Services', discount: '20% OFF', description: 'On your first advertising campaign', color: '#e61e25' },
                    { id: '2', title: 'Free Branding Package', discount: 'FREE', description: 'Full corporate identity design', color: '#3b82f6' },
                    { id: '3', title: 'Advertisement Design', discount: 'FREE', description: 'Professional billboard design', color: '#10b981' },
                    { id: '4', title: 'Expert Consultation', discount: 'FREE', description: 'One-on-one strategy session', color: '#f59e0b' },
                    { id: '5', title: 'Social Media Promotion', discount: 'FREE', description: 'One week of targeted social ads', color: '#8b5cf6' },
                ]);
            }
        };

        fetchOffers();
    }, []);


    const handleSelectOffer = (offer: Offer) => {
        setSelectedOffer(offer);
        setPhase('form');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/offer-leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    offerWon: `${selectedOffer?.discount} - ${selectedOffer?.title}`
                })
            });
            if (res.ok) {
                setIsSubmitted(true);
                onClaim?.();
            } else {
                alert("Submission failed. Please try again.");
            }
        } catch {
            alert("Network error. Please check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="psc-overlay" onClick={onClose}>
            <motion.div
                className={`psc-container ${phase === 'teaser' ? 'teaser-mode' : ''}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 20 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="psc-bg-wrapper">
                    <div className="psc-modal-bg" />
                    <div className="psc-modal-overlay" />
                    <div className="psc-sunburst" />
                </div>

                {/* Header */}
                <header className="psc-header">

                    <button className="psc-close" onClick={onClose} aria-label="Close">
                        <X size={16} />
                    </button>
                </header>

                <main className="psc-content">
                    <AnimatePresence mode="wait">                        {/* Phase 1: Teaser - New Card Design */}
                        {phase === 'teaser' && (
                            <motion.div
                                key="teaser"
                                className="psc-form-wrap"
                                initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ type: 'spring', damping: 15 }}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    position: 'relative'
                                }}
                            >
                                <div className="psc-new-card-wrap" onClick={() => setPhase('offers')} style={{ cursor: 'pointer' }}>
                                    {/* Perfect Circle Glow Spotlight */}
                                    <div className="psc-card-spotlight" />
                                    <div className="psc-shout-lines">
                                        <div className="shout-line line-1" />
                                        <div className="shout-line line-2" />
                                        <div className="shout-line line-3" />
                                    </div>
                                    <div className="psc-new-card">
                                        <div className="psc-new-card-top">
                                            <span className="psc-card-limited">LIMITED</span>
                                            <span className="psc-card-time">TIME</span>
                                        </div>
                                        <div className="psc-new-card-bottom">
                                            <span className="psc-card-offer">OFFER</span>
                                        </div>
                                    </div>
                                    <div className="psc-new-customers">NEW CUSTOMERS</div>
                                </div>
                            </motion.div>
                        )}

                        {/* Phase 2: Offer Cards Popup */}
                        {phase === 'offers' && (
                            <motion.div
                                key="offers"
                                className="psc-offers-wrap"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <p className="psc-offers-subtitle">✨ Tap to claim your exclusive deal</p>
                                <div className="psc-offer-cards-list">
                                    {offers.map((offer, i) => {
                                        const Icon = ICON_MAP[i % ICON_MAP.length];
                                        return (
                                            <motion.button
                                                key={offer.id}
                                                className="psc-offer-card"
                                                style={{ '--offer-color': offer.color } as React.CSSProperties}
                                                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40, scale: 0.9 }}
                                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ type: 'spring', damping: 18, stiffness: 220, delay: i * 0.08 }}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleSelectOffer(offer)}
                                            >
                                                <div className="psc-offer-card-left">
                                                    <div className="psc-offer-icon-wrap">
                                                        <Icon size={24} color={offer.color} />
                                                    </div>
                                                </div>
                                                <div className="psc-offer-card-body">
                                                    <span className="psc-offer-card-title">{offer.title}</span>
                                                    <span className="psc-offer-card-desc">{offer.description}</span>
                                                </div>
                                                <div className="psc-offer-card-right">
                                                    <span className="psc-offer-badge">{offer.discount}</span>
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}



                        {/* Phase 4: Lead Form */}
                        {phase === 'form' && (
                            <motion.div
                                key="form"
                                className="psc-form-wrap"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {isSubmitted ? (
                                    <motion.div
                                        className="psc-success-view"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                    >
                                        <div className="psc-success-ring">
                                            <Check size={48} color="#33C6B9" />
                                        </div>
                                        <h2 className="psc-big-text" style={{ fontSize: '36px', marginBottom: '10px' }}>THANK YOU!</h2>
                                        <h3 className="psc-form-title" style={{ color: '#fff', fontSize: '20px' }}>Successfully Submitted</h3>
                                        <p className="psc-form-sub" style={{ fontSize: '15px', maxWidth: '280px', margin: '0 auto 30px', color: 'rgba(255,255,255,0.6)' }}>
                                            Your offer has been reserved. Our campaign manager will reach out to you within the hour.
                                        </p>
                                        <button className="psc-btn-teal" onClick={onClose}>CLOSE</button>
                                    </motion.div>
                                ) : (
                                    <>
                                        {/* Mini won offer reminder */}
                                        {selectedOffer && (
                                            <div className="psc-form-offer-reminder" style={{ '--offer-color': selectedOffer.color } as React.CSSProperties}>
                                                <span className="psc-form-offer-discount">{selectedOffer.discount}</span>
                                                <span className="psc-form-offer-name">{selectedOffer.title}</span>
                                            </div>
                                        )}
                                        <h3 className="psc-form-title">Claim Your Special Offer</h3>
                                        <p className="psc-form-sub">Fill your details to secure this limited offer</p>
                                        <form className="psc-fields" onSubmit={handleSubmit}>
                                            <input className="psc-input" type="text" placeholder="Full Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                            <input className="psc-input" type="email" placeholder="Email Address" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                            <input className="psc-input" type="tel" placeholder="Phone Number" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                            <input className="psc-input" type="text" placeholder="Business Name" required value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} />
                                            <button type="submit" className="psc-btn-submit" disabled={isSubmitting}>
                                                {isSubmitting ? 'Securing...' : 'Secure My Offer'}
                                                <div className="psc-shine" />
                                            </button>
                                        </form>
                                    </>
                                )}
                            </motion.div>
                        )}

                    </AnimatePresence>
                </main>
            </motion.div>
        </div>
    );
}

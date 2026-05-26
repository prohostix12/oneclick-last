"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Phone, Mail, Briefcase, CheckCircle2 } from 'lucide-react';

interface Offer {
  title: string;
  discount: string;
  color?: string;
}

interface ClaimFormProps {
  offer: Offer | null;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => Promise<void>;
}

const inputFields = [
  { id: 'name', label: 'Full Name', placeholder: 'e.g. Ahmed Al-Rasheed', type: 'text', icon: User, required: true },
  { id: 'phone', label: 'Phone Number', placeholder: '+971 50 123 4567', type: 'tel', icon: Phone, required: true },
  { id: 'email', label: 'Email Address', placeholder: 'you@company.com', type: 'email', icon: Mail, required: true },
  { id: 'businessName', label: 'Business Name', placeholder: 'Your company name', type: 'text', icon: Briefcase, required: true },
];

const ClaimForm: React.FC<ClaimFormProps> = ({ offer, onClose, onSubmit }) => {
  const [values, setValues] = useState<Record<string, string>>({
    name: '', phone: '', email: '', businessName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  if (!offer) return null;

  const color = offer.color || '#e61e25';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...values,
        offerWon: `${offer.discount} – ${offer.title}`,
      });
      setSubmitted(true);
    } catch {
      // handle silently
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
    >
      <motion.div
        initial={{ scale: 0.85, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="relative w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl"
        style={{
          background: 'linear-gradient(160deg, #111 0%, #0a0a0a 100%)',
          border: `1px solid ${color}30`,
          boxShadow: `0 0 60px ${color}20, 0 40px 80px rgba(0,0,0,0.8)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top glow strip */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        />

        {/* Background blob */}
        <div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none"
          style={{ background: `${color}12` }}
        />



        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 pt-7">
              {/* Offer badge */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest"
                  style={{ background: `${color}15`, color, border: `1px solid ${color}35`, fontSize: '0.7rem' }}
                >
                  🏆 {offer.discount} — {offer.title}
                </div>
              </div>

              <h2 className="text-2xl font-black text-white mb-1">
                Claim Your Reward
              </h2>
              <p className="text-white/40 text-xs mb-6">
                Fill in your details and we'll get in touch to activate the offer.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3" style={{ width: '100%' }}>
                {inputFields.map(({ id, label, placeholder, type, icon: Icon, required }) => (
                  <div key={id} style={{ width: '100%' }}>
                    <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: `${color}aa`, fontSize: '0.7rem' }}>
                      {label}
                    </label>
                    <div className="relative" style={{ width: '100%' }}>
                      <Icon
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300"
                        style={{ color: focused === id ? color : 'rgba(255,255,255,0.2)' }}
                      />
                      <input
                        required={required}
                        type={type}
                        placeholder={placeholder}
                        value={values[id]}
                        onFocus={() => setFocused(id)}
                        onBlur={() => setFocused(null)}
                        onChange={(e) => setValues((v) => ({ ...v, [id]: e.target.value }))}
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg text-white text-xs font-medium outline-none transition-all placeholder:text-white/20"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: `1px solid ${focused === id ? color : 'rgba(255,255,255,0.08)'}`,
                          boxShadow: focused === id ? `0 0 0 2px ${color}15` : 'none',
                          boxSizing: 'border-box',
                          width: '100%'
                        }}
                      />
                    </div>
                  </div>
                ))}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full py-4 rounded-xl font-black text-white text-base uppercase tracking-widest flex items-center justify-center gap-3 mt-6 transition-all disabled:opacity-60"
                  style={{
                    background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                    boxShadow: `0 0 30px ${color}40, 0 10px 30px rgba(0,0,0,0.4)`,
                  }}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Claim My Offer <Send size={18} />
                    </>
                  )}
                </motion.button>
              </form>

              <p className="text-center text-white/20 text-[10px] mt-5 px-8">
                By claiming, you agree to our terms. No spam — we'll only contact you about this offer.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ background: `${color}20`, border: `2px solid ${color}`, boxShadow: `0 0 40px ${color}60` }}
              >
                <CheckCircle2 size={36} style={{ color }} />
              </motion.div>
              <h3 className="text-3xl font-black text-white mb-3">Offer Claimed!</h3>
              <p className="text-white/50 leading-relaxed">
                Fantastic! Our team will reach out within <span className="text-white font-bold">24 hours</span> to activate your <span style={{ color }} className="font-bold">{offer.discount}</span> offer.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="mt-8 px-8 py-3 rounded-full text-sm font-bold text-white/60 hover:text-white border border-white/10 hover:border-white/30 transition-all"
              >
                Close
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default ClaimForm;

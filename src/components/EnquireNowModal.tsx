"use client";

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle } from 'lucide-react';

interface EnquireNowModalProps {
  serviceName: string;
  source: string;
  onClose: () => void;
}

export default function EnquireNowModal({ serviceName, source, onClose }: EnquireNowModalProps) {
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', companyName: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.85rem 1rem',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s',
    fontFamily: 'inherit',
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          interestedService: serviceName,
          source,
          submittedAt: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Failed to submit. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          padding: '1rem',
          backdropFilter: 'blur(6px)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#141414',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '480px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          }}
        >
          {/* Header */}
          <div style={{ background: '#e61e25', padding: '1.4rem 1.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.3rem' }}>
                Enquire Now
              </div>
              <h2 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 800, margin: 0, lineHeight: 1.3, maxWidth: '320px' }}>
                {serviceName}
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: '1rem', marginTop: '2px' }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '1.8rem' }}>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '0.5rem 0 1rem' }}
              >
                <CheckCircle size={52} color="#e61e25" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.6rem' }}>Thank you!</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  We've received your enquiry for <strong style={{ color: 'white' }}>{serviceName}</strong>. Our team will get back to you shortly.
                </p>
                <button
                  onClick={onClose}
                  style={{ marginTop: '1.5rem', padding: '0.75rem 2rem', background: '#e61e25', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', fontFamily: 'inherit' }}
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Full Name <span style={{ color: '#e61e25' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData(p => ({ ...p, fullName: e.target.value }))}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#e61e25')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Phone Number <span style={{ color: '#e61e25' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+971 XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#e61e25')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Email Address <span style={{ color: '#e61e25' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#e61e25')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Company Name{' '}
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your company"
                    value={formData.companyName}
                    onChange={(e) => setFormData(p => ({ ...p, companyName: e.target.value }))}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#e61e25')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
                  />
                </div>

                {error && (
                  <p style={{ color: '#ff6b6b', fontSize: '0.85rem', margin: 0 }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    marginTop: '0.3rem',
                    padding: '0.95rem',
                    background: isSubmitting ? 'rgba(230,30,37,0.5)' : '#e61e25',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit',
                  }}
                >
                  {isSubmitting ? 'Submitting...' : <><Send size={17} /> Send Enquiry</>}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

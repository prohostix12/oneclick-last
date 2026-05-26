"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Phone, Mail, Briefcase, CheckCircle } from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  description: string;
}

interface ClaimFormProps {
  offer: Offer;
  onClose: () => void;
  isOpen: boolean;
}

const ClaimForm: React.FC<ClaimFormProps> = ({ offer, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    businessName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/offer-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          offerWon: offer.title,
          offerId: offer.id
        })
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please check your internet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mb-form-overlay"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="mb-form-modal"
      >
        {/* Header Decor */}
        <div className="mb-form-top" />
        
        <button 
          onClick={onClose}
          className="mb-form-close"
        >
          <X size={24} />
        </button>

        <div className="mb-form-content">
          {!isSuccess ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <span className="mb-form-badge">
                  Claim Your Reward
                </span>
                <h2 className="mb-form-title">Almost There!</h2>
                <p className="mb-form-desc">Fill in your details to claim your <strong>{offer.title}</strong></p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-form-input-group">
                  <User className="mb-form-icon" size={20} />
                  <input
                    required
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mb-form-input"
                  />
                </div>

                <div className="mb-form-input-group">
                  <Phone className="mb-form-icon" size={20} />
                  <input
                    required
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mb-form-input"
                  />
                </div>

                <div className="mb-form-input-group">
                  <Mail className="mb-form-icon" size={20} />
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="mb-form-input"
                  />
                </div>

                <div className="mb-form-input-group">
                  <Briefcase className="mb-form-icon" size={20} />
                  <input
                    required
                    type="text"
                    name="businessName"
                    placeholder="Business Name"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="mb-form-input"
                  />
                </div>

                {error && (
                  <p className="mb-form-error">
                    {error}
                  </p>
                )}

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="mb-form-submit"
                >
                  {isSubmitting ? 'Processing...' : 'Secure Offer Now'}
                </button>
              </form>

              <p className="mb-form-footer">
                By submitting, you agree to our terms and privacy policy.
              </p>
            </>
          ) : (
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              style={{ textAlign: 'center', padding: '2.5rem 0' }}
            >
              <div className="mb-success-circle">
                <CheckCircle size={48} style={{ color: 'white' }} />
              </div>
              <h2 className="mb-form-title">Offer Secured!</h2>
              <p className="mb-form-desc" style={{ marginBottom: '2rem' }}>
                We've received your claim for <strong>{offer.title}</strong>. Our team will contact you within 24 hours.
              </p>
              <button
                onClick={onClose}
                className="mb-success-btn"
              >
                Back to Website
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClaimForm;

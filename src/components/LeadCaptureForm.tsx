"use client";

import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building, ChevronDown, Send, CheckCircle, AlertCircle, Briefcase } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  interestedService: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  interestedService?: string;
}

const services = [
  'Branding & Corporate Identity',
  'Digital Printed Graphics',
  'Vehicle Graphics & Fleet Branding',
  'Signage Production & Installation',
  'Exhibition, Display & POS',
  'Cladding & Facade Solutions',
  'Complete Advertising Campaign',
  'Other'
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

export default function LeadCaptureForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    interestedService: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[0-9\s\-\(\)]{8,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Service validation
    if (!formData.interestedService) {
      newErrors.interestedService = 'Please select a service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
          source: 'homepage_lead_form'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ 
          success: true, 
          message: 'Thank you! We\'ll contact you within 24 hours with your personalized offer.' 
        });
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          companyName: '',
          interestedService: ''
        });
        setErrors({});
      } else {
        setSubmitStatus({ 
          success: false, 
          message: data.error || 'Something went wrong. Please try again.' 
        });
      }
    } catch (error) {
      setSubmitStatus({ 
        success: false, 
        message: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <section className="lead-capture-section">
      <div className="lead-capture-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="lead-capture-content"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="lead-capture-header">
            <div className="urgency-badge">
              <span className="urgency-pulse"></span>
              Limited Time Offer
            </div>
            <h2>Get Your Free Advertising Quote</h2>
            <p>Join 500+ brands that trust us with their advertising campaigns across the UAE</p>
          </motion.div>

          {/* Form Card */}
          <motion.div variants={fadeInUp} className="form-card">
            {submitStatus?.success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="success-message"
              >
                <CheckCircle size={48} className="success-icon" />
                <h3>Request Submitted Successfully!</h3>
                <p>{submitStatus.message}</p>
                <div className="success-features">
                  <div className="success-feature">
                    <CheckCircle size={16} />
                    <span>Free consultation within 24 hours</span>
                  </div>
                  <div className="success-feature">
                    <CheckCircle size={16} />
                    <span>Personalized advertising strategy</span>
                  </div>
                  <div className="success-feature">
                    <CheckCircle size={16} />
                    <span>No obligation quote</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="lead-form">
                {/* Full Name */}
                <div className="form-group">
                  <User size={20} className="field-icon" />
                  <div className="input-container">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={errors.fullName ? 'error' : ''}
                    />
                    {errors.fullName && (
                      <span className="error-message">
                        <AlertCircle size={14} />
                        {errors.fullName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="form-group">
                  <Mail size={20} className="field-icon" />
                  <div className="input-container">
                    <input
                      type="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && (
                      <span className="error-message">
                        <AlertCircle size={14} />
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="form-group">
                  <Phone size={20} className="field-icon" />
                  <div className="input-container">
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && (
                      <span className="error-message">
                        <AlertCircle size={14} />
                        {errors.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Company Name */}
                <div className="form-group">
                  <Building size={20} className="field-icon" />
                  <div className="input-container">
                    <input
                      type="text"
                      placeholder="Company Name (Optional)"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                    />
                  </div>
                </div>

                {/* Service Dropdown */}
                <div className="form-group">
                  <Briefcase size={20} className="field-icon" />
                  <div className="input-container">
                    <div 
                      className={`dropdown-trigger ${errors.interestedService ? 'error' : ''}`}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <span className="dropdown-value">
                        {formData.interestedService || 'Select Interested Service *'}
                      </span>
                      <ChevronDown 
                        size={20} 
                        className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} 
                      />
                    </div>
                    {isDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="dropdown-menu"
                      >
                        {services.map((service) => (
                          <div
                            key={service}
                            className="dropdown-item"
                            onClick={() => {
                              handleInputChange('interestedService', service);
                              setIsDropdownOpen(false);
                            }}
                          >
                            {service}
                          </div>
                        ))}
                      </motion.div>
                    )}
                    {errors.interestedService && (
                      <span className="error-message">
                        <AlertCircle size={14} />
                        {errors.interestedService}
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="button-container">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="submit-button lead-capture-submit"
                    style={{
                      background: '#e61e25',
                      color: 'white',
                      border: 'none',
                      padding: '1.5rem 3rem',
                      borderRadius: '12px',
                      fontSize: '1.2rem',
                      fontWeight: '800',
                      minHeight: '65px',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      boxShadow: '0 6px 25px rgba(230,30,37,0.4)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="loading-spinner"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Get Offer Now
                        <Send size={24} />
                      </>
                    )}
                  </motion.button>
                </div>

                {submitStatus && !submitStatus.success && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="error-banner"
                  >
                    <AlertCircle size={16} />
                    {submitStatus.message}
                  </motion.div>
                )}
              </form>
            )}
          </motion.div>

        </motion.div>
      </div>

      <style jsx>{`
        .lead-capture-section {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d1b1b 100%);
          padding: clamp(4rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem);
          position: relative;
          overflow: hidden;
        }

        .lead-capture-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 70%, rgba(230, 30, 37, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .lead-capture-container {
          max-width: 600px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .lead-capture-content {
          text-align: center;
        }

        .lead-capture-header {
          margin-bottom: 3rem;
        }

        .urgency-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(45deg, #e61e25, #ff4444);
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 15px rgba(230, 30, 37, 0.3);
          position: relative;
        }

        .urgency-pulse {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }

        .lead-capture-header h2 {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 900;
          color: white;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .lead-capture-header p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .form-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 3rem 2.5rem;
          margin-bottom: 3rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .lead-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .field-icon {
          color: rgba(255, 255, 255, 0.6);
          flex-shrink: 0;
          width: 20px;
          height: 20px;
        }

        .input-container {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .input-container input {
          width: 100%;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
          height: 56px;
          box-sizing: border-box;
        }

        .input-container input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .input-container input:focus {
          outline: none;
          border-color: #e61e25;
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 0 0 3px rgba(230, 30, 37, 0.1);
        }

        .input-container input.error {
          border-color: #ff4444;
          background: rgba(255, 68, 68, 0.1);
        }

        .button-container {
          margin-left: 2rem;
          margin-top: 1.5rem;
          margin-bottom: 2rem;
        }

        .dropdown-wrapper {
          position: relative;
        }

        .dropdown-trigger {
          width: 100%;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
          height: 56px;
          box-sizing: border-box;
        }

        .dropdown-trigger:hover {
          border-color: #e61e25;
          background: rgba(255, 255, 255, 0.12);
        }

        .dropdown-trigger.error {
          border-color: #ff4444;
          background: rgba(255, 68, 68, 0.1);
        }

        .dropdown-value {
          color: rgba(255, 255, 255, 0.9);
          text-align: left;
        }

        .dropdown-icon {
          transition: transform 0.3s ease;
          color: rgba(255, 255, 255, 0.6);
        }

        .dropdown-icon.open {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(30, 30, 30, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          margin-top: 0.5rem;
          max-height: 200px;
          overflow-y: auto;
          z-index: 10;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .dropdown-item {
          padding: 0.75rem 1rem;
          color: white;
          cursor: pointer;
          transition: background 0.2s ease;
          font-size: 0.95rem;
        }

        .dropdown-item:hover {
          background: rgba(230, 30, 37, 0.2);
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #ff6b6b;
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }

        .submit-button,
        .lead-capture-submit,
        button.submit-button,
        button.lead-capture-submit {
          background: #e61e25 !important;
          color: white !important;
          border: none !important;
          padding: 1.5rem 3rem !important;
          border-radius: 12px !important;
          font-size: 1.2rem !important;
          font-weight: 800 !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 0.75rem !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 6px 25px rgba(230,30,37,0.4) !important;
          width: 100% !important;
          box-sizing: border-box !important;
          white-space: nowrap !important;
          text-decoration: none !important;
          min-height: 65px !important;
        }

        .submit-button:hover:not(:disabled),
        .lead-capture-submit:hover:not(:disabled),
        button.submit-button:hover:not(:disabled),
        button.lead-capture-submit:hover:not(:disabled) {
          background: #ff2d35 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 25px rgba(230, 30, 37, 0.4) !important;
        }

        .submit-button:disabled,
        .lead-capture-submit:disabled,
        button.submit-button:disabled,
        button.lead-capture-submit:disabled {
          opacity: 0.7 !important;
          cursor: not-allowed !important;
          background: #e61e25 !important;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-banner {
          background: rgba(255, 68, 68, 0.1);
          border: 1px solid #ff4444;
          color: #ff6b6b;
          padding: 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          margin-top: 1rem;
        }

        .success-message {
          text-align: center;
          padding: 2rem;
        }

        .success-icon {
          color: #4ade80;
          margin-bottom: 1rem;
        }

        .success-message h3 {
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .success-message p {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .success-features {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          text-align: left;
        }

        .success-feature {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.9rem;
        }

        .success-feature svg {
          color: #4ade80;
          flex-shrink: 0;
        }

        .trust-badges {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .trust-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
        }

        .trust-badge svg {
          color: #4ade80;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .lead-capture-section {
            padding: 3rem 1rem;
          }

          .form-card {
            padding: 2rem 1.5rem;
          }

          .form-group {
            gap: 0.75rem;
            align-items: center;
          }

          .button-container {
            margin-left: 0;
            width: 100%;
          }

          .trust-badges {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }

          .success-features {
            text-align: center;
          }

          .lead-capture-header h2 {
            font-size: 2rem;
          }

          .lead-capture-header p {
            font-size: 1rem;
          }

          .urgency-badge {
            font-size: 0.8rem;
            padding: 0.4rem 1.2rem;
          }
        }

        @media (max-width: 480px) {
          .lead-capture-section {
            padding: 2rem 0.75rem;
          }

          .form-card {
            padding: 1.5rem 1rem;
          }

          .form-group {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .input-container {
            width: 100%;
          }

          .button-container {
            margin-left: 0;
            width: 100%;
            margin-top: 1rem;
          }

          .submit-button {
            font-size: 1.1rem;
            padding: 1.3rem 2.5rem;
            border-radius: 10px;
            min-height: 58px;
          }

          .lead-capture-header h2 {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </section>
  );
}
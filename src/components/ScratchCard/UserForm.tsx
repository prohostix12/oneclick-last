"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building, ArrowRight } from 'lucide-react';

interface UserData {
  name: string;
  email: string;
  phone: string;
  companyName?: string;
}

interface UserFormProps {
  onSubmit: (data: UserData) => void;
}

export default function UserForm({ onSubmit }: UserFormProps) {
  const [formData, setFormData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    companyName: ''
  });
  const [errors, setErrors] = useState<Partial<UserData>>({});

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="scratch-card-form-container"
    >
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="scratch-card-input-group">
          <User size={18} className="scratch-card-icon" />
          <input
            type="text"
            placeholder="Full Name *"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="scratch-card-input"
          />
          {errors.name && (
            <span className="scratch-card-error">{errors.name}</span>
          )}
        </div>

        {/* Email Field */}
        <div className="scratch-card-input-group">
          <Mail size={18} className="scratch-card-icon" />
          <input
            type="email"
            placeholder="Email Address *"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="scratch-card-input"
          />
          {errors.email && (
            <span className="scratch-card-error">{errors.email}</span>
          )}
        </div>

        {/* Phone Field */}
        <div className="scratch-card-input-group">
          <Phone size={18} className="scratch-card-icon" />
          <input
            type="tel"
            placeholder="Phone Number *"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="scratch-card-input"
          />
          {errors.phone && (
            <span className="scratch-card-error">{errors.phone}</span>
          )}
        </div>

        {/* Company Field */}
        <div className="scratch-card-input-group">
          <Building size={18} className="scratch-card-icon" />
          <input
            type="text"
            placeholder="Company Name (Optional)"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            className="scratch-card-input"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="scratch-card-button"
        >
          Reveal My Offer
          <ArrowRight size={18} />
        </motion.button>

        {/* Trust Indicators */}
        <div className="scratch-card-trust-indicators">
          <div className="scratch-card-trust-item">
            <div className="scratch-card-trust-dot trust-secure"></div>
            <span>Secure</span>
          </div>
          <div className="scratch-card-trust-item">
            <div className="scratch-card-trust-dot trust-no-spam"></div>
            <span>No Spam</span>
          </div>
          <div className="scratch-card-trust-item">
            <div className="scratch-card-trust-dot trust-instant"></div>
            <span>Instant</span>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
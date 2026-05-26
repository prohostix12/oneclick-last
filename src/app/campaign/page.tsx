"use client";

import { motion } from 'framer-motion';
import { useState, FormEvent } from 'react';
import Logo from '../components/Logo';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 }
  }
};

export default function CampaignPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitStatus({ success: true, message: data.message });
        setFormData({ name: '', phone: '', email: '', company: '', service: '', message: '' });
      } else {
        setSubmitStatus({ success: false, message: data.error || 'Something went wrong.' });
      }
    } catch {
      setSubmitStatus({ success: false, message: 'Failed to connect to the server.' });
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <style jsx global>{`
        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        *::-webkit-scrollbar {
          display: none;
        }

        .campaign-page {
          background: #121212;
          min-height: 100vh;
          color: white;
          padding: 4rem 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .campaign-container {
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
        }

        .campaign-logo {
          text-align: center;
          margin-bottom: 4rem;
        }

        .campaign-logo-wrapper {
          display: inline-flex;
          align-items: center;
          gap: 0;
        }

        .campaign-logo-icon {
          position: relative;
          width: 50px;
          height: 50px;
          flex-shrink: 0;
          margin-right: -5px;
        }

        .campaign-logo-circle {
          position: absolute;
          width: 50px;
          height: 50px;
          border: 3px dashed rgba(255,255,255,0.4);
          border-radius: 50%;
        }

        .campaign-logo-square {
          position: absolute;
          width: 20px;
          height: 20px;
          background: #e61e25;
          top: 5px;
          right: 5px;
          border-radius: 2px;
        }

        .campaign-logo-text {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 200;
          color: rgba(255,255,255,0.3);
          letter-spacing: 3px;
          line-height: 1;
          text-transform: uppercase;
        }

        .campaign-logo-llc {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.3);
          font-weight: 300;
          margin-top: 0.8rem;
          letter-spacing: 4px;
          text-transform: uppercase;
        }

        .campaign-title {
          text-align: center;
          margin-bottom: 3rem;
        }

        .campaign-title h2 {
          color: white;
          font-size: clamp(3rem, 7vw, 5rem);
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .campaign-title .italic {
          color: #e61e25;
          font-style: italic;
          font-weight: 400;
        }

        .campaign-subtitle {
          color: rgba(255,255,255,0.6);
          font-size: 1.1rem;
        }

        .contact-form {
          display: grid;
          gap: 1.5rem;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 1.15rem 1.5rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #e61e25;
          background: rgba(255,255,255,0.06);
          box-shadow: 0 0 0 4px rgba(230, 30, 37, 0.1), inset 0 2px 4px rgba(0,0,0,0.2);
          transform: translateY(-2px);
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: rgba(255,255,255,0.3);
        }

        .form-select {
          cursor: pointer;
        }

        .form-select option {
          background: #1a1a1a;
          color: white;
        }

        .form-textarea {
          resize: vertical;
          min-height: 140px;
          font-family: inherit;
        }

        .submit-button-wrap {
          text-align: center;
          margin-top: 1.5rem;
        }

        .submit-button {
          padding: 1.25rem 4rem;
          background: linear-gradient(135deg, #e61e25 0%, #ff2d35 100%);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 100px;
          font-size: 1.1rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 10px 30px rgba(230, 30, 37, 0.4);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .submit-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #ff2d35 0%, #e61e25 100%);
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 20px 40px rgba(230, 30, 37, 0.5);
        }

        .submit-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          filter: grayscale(1);
        }

        .success-message {
          text-align: center;
          padding: 2rem;
        }

        .success-message h3 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: white;
        }

        .success-message p {
          color: rgba(255,255,255,0.7);
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .campaign-page {
            padding: 3rem 1.5rem;
          }

          .campaign-title h2 {
            font-size: 2.5rem;
          }

          .campaign-subtitle {
            font-size: 1rem;
          }
        }
      `}</style>

      <div className="campaign-page">
        <div className="campaign-container">
          <motion.div 
            className="campaign-logo"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Logo size="large" showFullText={true} />
          </motion.div>

          <motion.div 
            className="campaign-title"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h2>Start Your <span className="italic">Campaign</span></h2>
            <p className="campaign-subtitle">Tell us about your requirements and we'll get back to you quickly</p>
          </motion.div>

          {submitStatus?.success ? (
            <motion.div 
              className="success-message"
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
            >
              <div style={{ background: '#22c55e', width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h3>Request Submitted!</h3>
              <p>Thank you. Our experts will contact you shortly.</p>
              <button onClick={() => setSubmitStatus(null)} className="submit-button" style={{ marginTop: '1.5rem' }}>Send Another</button>
            </motion.div>
          ) : (
            <motion.form 
              className="contact-form" 
              onSubmit={handleSubmit}
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <input
                  type="text"
                  placeholder="Name"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </motion.div>
              <motion.div variants={fadeInUp}>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </motion.div>
              <motion.div variants={fadeInUp}>
                <input
                  type="email"
                  placeholder="Email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </motion.div>
              <motion.div variants={fadeInUp}>
                <input
                  type="text"
                  placeholder="Company Name (optional)"
                  className="form-input"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </motion.div>
              <motion.div variants={fadeInUp}>
                <select
                  className="form-select"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  required
                >
                  <option value="">Service (Brand Identity)</option>
                  <option value="branding">Brand Identity</option>
                  <option value="digital-graphics">Digital Graphics</option>
                  <option value="vehicle-graphics">Vehicle Graphics</option>
                  <option value="signage">Signage</option>
                  <option value="exhibition">Exhibition & POS</option>
                  <option value="cladding">Cladding & Facade</option>
                </select>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <textarea
                  placeholder="Message"
                  className="form-textarea"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </motion.div>
              <motion.div className="submit-button-wrap" variants={fadeInUp}>
                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Submit Request'}
                </button>
              </motion.div>
            </motion.form>
          )}
        </div>
      </div>
    </>
  );
}

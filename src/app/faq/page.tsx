"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneOutgoing } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    question: 'Where can I advertise my brand in the UAE?',
    answer: 'One Click Advertisement provides strategic high-impact locations across the UAE, including major hubs in Dubai (Sheikh Zayed Road, Dubai Marina, Downtown) and high-traffic areas in Abu Dhabi and Northern Emirates.'
  },
  {
    question: 'How long does the authority approval process take?',
    answer: 'The approval process for permits from RTA, Dubai Municipality, and other authorities typically takes between 7 to 14 working days, depending on the location and specific advertising medium.'
  },
  {
    question: 'What materials do you use for signage and vehicle wraps?',
    answer: 'We use high-grade, UV-resistant vinyl and premium materials designed to withstand the harsh UAE climate, ensuring your brand and visuals remain vibrant and durable for years.'
  },
  {
    question: 'Can you handle the creative design and installation?',
    answer: 'Yes, we provide end-to-end turnkey solutions including initial creative conceptualisation, precision fabrication, professional installation, and ongoing maintenance.'
  },
  {
    question: 'What is the minimum duration for a billboard campaign?',
    answer: 'Our standard campaign durations start from 1 month for digital billboards and outdoors, though we can accommodate special short-term event campaigns based on location availability.'
  },
  {
    question: 'How do you measure the effectiveness of a campaign?',
    answer: 'We provide detailed traffic data and location demographics for outdoor media, and for digital platforms, we provide engagement and impression reports to measure your campaign performance.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh', paddingTop: '140px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 900, letterSpacing: '-2px', marginBottom: '20px' }}
          >
            Frequently Asked <span style={{ color: '#e61e25' }}>Questions</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ fontSize: '1.2rem', color: '#888', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}
          >
            Everything you need to know about scaling your brand presence in the UAE market.
          </motion.p>
        </div>

        {/* FAQ Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                backgroundColor: openIndex === index ? 'rgba(230, 30, 37, 0.03)' : 'rgba(255,255,255,0.01)',
                border: openIndex === index ? '1px solid #e61e25' : '1px solid rgba(255,255,255,0.05)',
                borderRadius: '20px',
                overflow: 'hidden',
                transition: 'all 0.4s ease'
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                style={{
                  width: '100%',
                  padding: '30px 40px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <HelpCircle size={24} color={openIndex === index ? '#e61e25' : '#888'} />
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.4 }}>{faq.question}</span>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <ChevronDown size={24} color={openIndex === index ? '#e61e25' : '#888'} />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                  >
                    <div style={{ padding: '0 40px 40px 84px', color: '#888', fontSize: '1.1rem', lineHeight: 1.8 }}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          style={{ textAlign: 'center', marginTop: '100px', backgroundColor: '#e61e25', padding: '60px 40px', borderRadius: '32px' }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '20px' }}>Still Have Questions?</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '30px', fontSize: '1.1rem' }}>Our team is ready to provide you with a tailored advertising strategy.</p>
          <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: 'white', color: '#000', padding: '15px 40px', borderRadius: '50px', fontWeight: 800, textDecoration: 'none', transition: 'all 0.3s' }}>
            <PhoneOutgoing size={20} />
            Contact Experts
          </Link>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          button { padding: 25px 30px !important; }
          span { font-size: 1.1rem !important; }
          div[style*="padding: 0 40px 40px 84px"] {
            padding: 0 30px 30px 70px !important;
            font-size: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}

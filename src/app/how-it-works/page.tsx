"use client";

import { motion } from 'framer-motion';
import { Search, Palette, ClipboardCheck, Factory, Truck, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    icon: <Search size={32} />,
    title: 'Say Hi',
    description: 'Drop us a message or give us a call. Tell us what you\'re thinking, and we\'ll help you figure out the best approach for your business.'
  },
  {
    icon: <Palette size={32} />,
    title: 'The Design',
    description: 'We work together on a design that looks great and gets your message across clearly. We’ll even show you a 3D preview so you know exactly how it’ll look.'
  },
  {
    icon: <ClipboardCheck size={32} />,
    title: 'The Paperwork',
    description: 'Don\'t worry about the boring stuff. We handle all the permits and approvals from the RTA and local authorities for you.'
  },
  {
    icon: <Factory size={32} />,
    title: 'We Build It',
    description: 'Our team gets to work printing and building your ads using the best materials. We don\'t cut corners, so your signs stay looking fresh.'
  },
  {
    icon: <Truck size={32} />,
    title: 'Installation',
    description: 'We install everything for you. Our professional team makes sure it\'s secure, safe, and perfectly placed to get noticed.'
  },
  {
    icon: <CheckCircle2 size={32} />,
    title: 'Ongoing Support',
    description: 'We don\'t just leave you there. We\'re always here for maintenance or if you want to launch your next big idea.'
  }
];

export default function HowItWorks() {
  return (
    <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh', paddingTop: '120px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 900, letterSpacing: '-2px', marginBottom: '20px' }}
          >
            How it <span style={{ color: '#e61e25' }}>works</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ fontSize: '1.2rem', color: '#888', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}
          >
            A simple, stress-free process from your first idea to seeing your brand live across the UAE.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, backgroundColor: 'rgba(230, 30, 37, 0.05)', borderColor: '#e61e25' }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px',
                padding: '40px',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ color: '#e61e25', marginBottom: '24px' }}>
                {step.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>
                {index + 1}. {step.title}
              </h3>
              <p style={{ color: '#888', lineHeight: 1.7, fontSize: '1.05rem' }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          h1 { font-size: 3rem !important; }
          div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

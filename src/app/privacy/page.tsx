"use client";

import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh', paddingTop: '120px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '40px', letterSpacing: '-1px' }}
        >
          Privacy <span style={{ color: '#e61e25' }}>Policy</span>
        </motion.h1>

        <div style={{ color: '#ccc', lineHeight: 1.8, fontSize: '1.05rem' }}>
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>1. Information We Collect</h2>
            <p>One Click Advertisement collects basic business and contact information (names, emails, company logos, etc.) necessary to provide, manage, and execute advertising services across the UAE.</p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>2. Use of Information</h2>
            <p>Your information is used to facilitate communication, secure authority approvals, and provide high-impact advertising solutions. We do not sell or lease your commercial data to third parties.</p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>3. Data Security</h2>
            <p>We implement professional-grade security measures to safeguard your brand assets and commercial information from unauthorised access, ensuring complete confidentiality during project execution.</p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>4. Authority Requirements</h2>
            <p>In the course of securing necessary permits from RTA, Dubai Municipality, and other official bodies, we may be required to disclose certain project details for compliance and approval purposes.</p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>5. Cookies and Analytics</h2>
            <p>We use essential cookies and basic traffic analytics to improve the platform experience. You can manage your cookie preferences through your browser settings.</p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>6. Contact Us</h2>
            <p>If you have any questions regarding our data policies, please contact our team at hello@oneclickadv.ae.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh', paddingTop: '120px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '40px', letterSpacing: '-1px' }}
        >
          Terms & <span style={{ color: '#e61e25' }}>Conditions</span>
        </motion.h1>

        <div style={{ color: '#ccc', lineHeight: 1.8, fontSize: '1.05rem' }}>
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>1. Acceptance of Terms</h2>
            <p>By accessing and using the services provided by One Click Advertisement, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please refrain from using our services.</p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>2. Description of Services</h2>
            <p>One Click Advertisement provides full-service advertising solutions, including but not limited to outdoor advertising, digital printing, signage fabrication, and vehicle branding across the United Arab Emirates.</p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>3. Project Approvals</h2>
            <p>All advertising materials and installations are subject to approval by the relevant UAE authorities (RTA, Dubai Municipality, etc.). While we facilitate these approvals, we are not liable for delays caused by authority processing times.</p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>4. Intellectual Property</h2>
            <p>All designs, visualisations, and creative materials produced by One Click Advertisement remain our intellectual property unless explicitly transferred to the client upon final payment.</p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>5. Limitation of Liability</h2>
            <p>One Click Advertisement shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our advertising services under the laws of the UAE.</p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>6. Governing Law</h2>
            <p>These terms are governed by and construed in accordance with the laws of the United Arab Emirates as applied in the Emirate of Dubai.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ServiceMap from '@/app/components/ServiceMap';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.5 }
  }
};

export default function DigitalGraphicsPage() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const benefits = [
    { title: "Large Format Printing", desc: "High-quality digital printing for any size requirement" },
    { title: "Wall & Window Graphics", desc: "Transform spaces with custom printed graphics" },
    { title: "Interior Branding", desc: "Complete interior graphic solutions for offices and retail" },
    { title: "Premium Materials", desc: "UV-resistant, weatherproof materials for UAE climate" }
  ];

  

  return (
    <>
      <style jsx global>{`

        .service-detail-page {
          background: transparent;
          min-height: 100vh;
          padding-top: 140px;
          color: white;
        }

        .back-button {
          position: fixed;
          top: 140px;
          left: 40px;
          z-index: 100;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(12, 12, 12,0.3);
          cursor: pointer;
          transition: all 0.6s ease;
          border: none;
          color: white;
        }

        .back-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(12, 12, 12,0.15);
        }

        .service-hero {
          background: transparent;
          padding: 8rem 2rem;
          min-height: 50vh;
          display: flex;
          align-items: center;
          margin: 0 auto 2rem auto;
          max-width: 1200px;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 2rem;
          align-items: center;
        }

        .hero-text {
          padding: 2rem 0;
        }

        .hero-text h1 {
          font-size: 3.5rem;
          font-weight: 900;
          margin-bottom: 0;
          line-height: 1;
          color: white;
        }

        .hero-text .subtitle {
          font-style: italic;
          color: #e61e25;
          font-size: 3.5rem;
          font-weight: 400;
          margin-bottom: 1.5rem;
          line-height: 1;
        }

        .hero-text p {
          color: rgba(255,255,255,0.82);
          line-height: 1.8;
          font-size: 1.1rem;
          max-width: 90%;
        }

        .hero-image-large {
          border-radius: 0;
          overflow: hidden;
          height: 350px;
          box-shadow: 0 8px 30px rgba(12, 12, 12,0.15);
          position: relative;
          transition: all 0.6s ease;
        }

        .hero-image-large:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(12, 12, 12,0.2);
        }

        .hero-image-large img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          transition: opacity 0.8s ease-in-out;
        }

        .hero-image-large img.active {
          opacity: 1;
        }

        .why-choose-section {
          padding: 2rem;
          margin: 0 auto 2rem auto;
          max-width: 1200px;
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 3rem;
          align-items: start;
        }

        .why-choose-title {
          font-size: 2.5rem;
          font-weight: 900;
          line-height: 1.2;
          color: white;
        }

        .accordion-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .accordion-item {
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          overflow: hidden;
          background: rgba(255,255,255,0.03);
          transition: all 0.6s ease;
        }

        .accordion-item.open {
          background: rgba(230,30,37,0.08);
          border-color: #e61e25;
          box-shadow: 0 4px 25px rgba(12, 12, 12,0.2);
          transform: translateX(8px);
        }

        .accordion-header {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.6s ease;
          background: transparent;
          color: white;
        color: white;
        }

        .accordion-header:hover {
          background: rgba(230,30,37,0.05);
          transform: translateX(3px);
        }

        .accordion-icon {
          transition: transform 0.3s ease;
        }

        .accordion-icon.open {
          transform: rotate(180deg);
        }

        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .accordion-content.open {
          max-height: 200px;
        }

        .accordion-content-inner {
          padding: 0 1.5rem 1.5rem 1.5rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.7;
          font-size: 1rem;
          line-height: 1.6;
        }

        

        .cta-section {
          background: linear-gradient(rgba(12, 12, 12, 0.92), rgba(20, 0, 0, 0.88)), url('/signage-production.png');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          padding: 6rem 2rem;
          text-align: center;
          color: white;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .cta-title {
          font-size: 2.2rem;
          font-weight: 900;
          margin-bottom: 0.3rem;
          color: white;
        }

        .cta-subtitle {
          font-style: italic;
          color: #e61e25;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          text-shadow: 0 0 20px rgba(230, 30, 37, 0.4);
        }

        .cta-description {
          color: rgba(255,255,255,0.75);
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }

        .cta-form {
          max-width: 350px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .form-input,
        .form-select {
          padding: 0.9rem;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.05);
          color: white;
          font-size: 0.95rem;
          outline: none;
        }

        .form-input::placeholder {
          color: rgba(255,255,255,0.5);
        }

        .form-select {
          cursor: pointer;
        }

        .form-select option {
          background: #1c1c1c;
          color: white;
        }

        .submit-button {
          padding: 1rem 2rem;
          background: #e61e25;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.6s ease;
        }

        .submit-button:hover {
          background: #ff2d35;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(230, 30, 37, 0.4);
        }

        /* Frosted Glass Gallery Styles */
        .frosted-glass-section {
          padding: 8rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .section-header {
          margin-bottom: 4rem;
        }
        .section-header h2 {
          font-size: 3.5rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
          letter-spacing: -1px;
        }
        .section-header .accent {
          color: #e61e25;
          font-style: italic;
          font-weight: 300;
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
        }
        .gallery-card {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .gallery-card:hover {
          transform: translateY(-15px);
          border-color: rgba(230, 30, 37, 0.4);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
        }
        .card-image {
          width: 100%;
          height: 450px;
          object-fit: cover;
          transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .gallery-card:hover .card-image {
          transform: scale(1.15);
        }
        .card-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 2.5rem;
          background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, transparent 100%);
          opacity: 0;
          transition: all 0.5s ease;
        }
        .gallery-card:hover .card-overlay {
          opacity: 1;
        }
        .card-overlay h3 {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 0.8rem;
          color: white;
          transform: translateY(20px);
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .gallery-card:hover .card-overlay h3 {
          transform: translateY(0);
        }
        .card-overlay p {
          font-size: 1rem;
          color: rgba(255,255,255,0.8);
          line-height: 1.5;
          transform: translateY(20px);
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s;
        }
        .gallery-card:hover .card-overlay p {
          transform: translateY(0);
        }

        @media (max-width: 992px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .service-detail-page {
            padding-top: 80px;
          }

          .back-button {
            top: 90px;
            left: 20px;
          }

          .hero-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .hero-text h1 {
            font-size: 2rem;
          }

          .hero-text .subtitle {
            font-size: 1.8rem;
          }

          .why-choose-section {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .section-header h2 {
            font-size: 2.5rem;
          }
          
          .gallery-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .card-image {
            height: 350px;
          }
        }
      `}</style>

      <div className="service-detail-page">
        <Link href="/services" className="back-button"><ArrowLeft size={20} /></Link>

        {/* Hero Section */}
        <motion.section
          className="service-hero"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="hero-content">
            <motion.div className="hero-text" variants={fadeInUp}>
              <h1>Digital Printed</h1>
              <div className="subtitle">Graphics</div>
              <p>
                Large format printing & interior graphics solutions that withstand the UAE climate while maintaining premium aesthetics.
              </p>
            </motion.div>

            <motion.div className="hero-image-large" variants={fadeInUp}>
              {heroImages.map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`Digital Graphics ${index + 1}`}
                  className={currentImageIndex === index ? 'active' : ''}
                />
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Why Choose Section */}
        <motion.section
          className="why-choose-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 className="why-choose-title" variants={fadeInUp}>
            Digital Solutions
          </motion.h2>

          <motion.div className="accordion-list" variants={fadeInUp}>
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`accordion-item ${openAccordion === index ? 'open' : ''}`}
              >
                <div
                  className="accordion-header"
                  onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                >
                  <span>{benefit.title}</span>
                  <ChevronDown
                    size={20}
                    className={`accordion-icon ${openAccordion === index ? 'open' : ''}`}
                  />
                </div>
                <div className={`accordion-content ${openAccordion === index ? 'open' : ''}`}>
                  <div className="accordion-content-inner">
                    {benefit.desc}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.section>

        {/* Frosted Glass Gallery */}
        <section className="frosted-glass-section">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Frosted Glass <span className="accent">Solutions</span></h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px' }}>
              Elevate your workspace with our premium acid-etched and sandblasted effect glass films. 
              Ideal for corporate privacy and artistic architectural branding.
            </p>
          </motion.div>

          <div className="gallery-grid">
            <motion.div 
              className="gallery-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <img src="/frosted-glass-1.png" alt="Geometric Frosted Glass" className="card-image" />
              <div className="card-overlay">
                <h3>Minimalist Geometric</h3>
                <p>Sophisticated diamond patterns for luxury lounges and executive suites.</p>
              </div>
            </motion.div>

            <motion.div 
              className="gallery-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <img src="/frosted-glass-2.png" alt="Ornate Storefront Design" className="card-image" />
              <div className="card-overlay">
                <h3>Storefront Branding</h3>
                <p>Custom botanical and ornate patterns for high-end retail visibility.</p>
              </div>
            </motion.div>

            <motion.div 
              className="gallery-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <img src="/frosted-glass-3.png" alt="Modern Corporate Privacy" className="card-image" />
              <div className="card-overlay">
                <h3>Modern Corporate</h3>
                <p>Strategic privacy films with abstract lines for contemporary meeting rooms.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Service Locations */}
        <ServiceMap />
        {/* CTA Section */}
        <motion.section
          className="cta-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 className="cta-title" variants={fadeInUp}>
            Get in
</motion.h2>
<motion.div className="cta-subtitle" variants={fadeInUp}>
Touch
          </motion.div>
          <motion.p className="cta-description" variants={fadeInUp}>
            Tell us about your requirements and we'll get back to you quickly
          </motion.p>

          <motion.div variants={fadeInUp} style={{ marginTop: '2rem' }}>
            <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8rem', padding: '1.2rem 3rem', background: '#e61e25', color: 'white', fontWeight: 700, borderRadius: '12px', textDecoration: 'none', transition: 'all 0.3s ease', fontSize: '1.1rem', boxShadow: '0 4px 20px rgba(230, 30, 37, 0.4)' }}>
              Submit Request <ArrowRight size={22} />
            </Link>
          </motion.div>
        </motion.section>

        
      </div>
    </>
  );
}

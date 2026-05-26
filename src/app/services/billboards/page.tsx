"use client";

import { motion } from 'framer-motion';
import { ChevronDown, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ServiceMap from '@/app/components/ServiceMap';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } as any }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.5 } as any
  }
};

const heroImages = [
  "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&q=80",
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80",
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80"
];

const accordionItems = [
  {
    title: "Maximum Visibility",
    content: "Our billboards are strategically placed in high-traffic areas ensuring maximum exposure for your brand 24/7."
  },
  {
    title: "24/7 Exposure",
    content: "Your message is visible around the clock, reaching audiences at all times of day and night."
  },
  {
    title: "Prime Locations",
    content: "Access to premium billboard spaces across major highways, city centers, and high-traffic zones."
  },
  {
    title: "High Impact Format",
    content: "Large format displays that command attention and create lasting impressions on your target audience."
  }
];



export default function BillboardsPage() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Billboard Campaign',
    location: '',
    budget: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  // Auto-slide hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style jsx global>{`

        .billboard-page {
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
          background: #1c1c1c;
          width: 48px;
          height: 48px;
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

        .hero-section {
          background: #1c1c1c;
          padding: 8rem 2rem;
          min-height: 70vh;
          display: flex;
          align-items: center;
          margin-bottom: 3rem;
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-content h1 {
          font-size: 3.5rem;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        .hero-content h1 .italic {
          font-style: italic;
          font-weight: 400;
        }

        .hero-content p {
          color: #666;
          font-size: 1rem;
          line-height: 1.8;
        }

        .hero-image {
          position: relative;
          height: 400px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(12, 12, 12,0.15);
        }

        .hero-carousel {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .hero-carousel-track {
          display: flex;
          width: 100%;
          height: 100%;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hero-slide {
          min-width: 100%;
          height: 100%;
          position: relative;
        }

        .hero-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-carousel-dots {
          position: absolute;
          bottom: 20px;
          right: 20px;
          display: flex;
          gap: 8px;
          z-index: 10;
        }

        .hero-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: all 0.6s ease;
        }

        .hero-dot.active {
          background: #1c1c1c;
          width: 24px;
          border-radius: 4px;
        }

        .why-choose-section {
          background: #1c1c1c;
          padding: 4rem 2rem;
          margin-bottom: 3rem;
        }

        .why-choose-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }

        .why-choose-content h2 {
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .accordion {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .accordion-item {
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          overflow: hidden;
          background: #1c1c1c;
          transition: all 0.6s ease;
        }

        .accordion-item.open {
          border-color: #EF4444;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
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
        color: white;
        }

        .accordion-header:hover {
          background: rgba(239, 68, 68, 0.05);
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
          line-height: 1.6;
        }

        .locations-section {
          background: #1c1c1c;
          padding: 4rem 2rem;
          margin-bottom: 3rem;
        }

        .locations-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .locations-title {
          text-align: center;
          margin-bottom: 3rem;
        }

        .locations-title h2 {
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
        }

        .locations-title h2 .italic {
          font-style: italic;
        }

        .locations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }

        .location-card {
          position: relative;
          height: 250px;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.6s ease;
        }

        .location-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(12, 12, 12,0.2);
        }

        .location-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .location-card:hover img {
          transform: scale(1.1);
        }

        .location-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(12, 12, 12,0.7) 0%, transparent 100%);
          display: flex;
          align-items: flex-end;
          padding: 1.5rem;
        }

        .location-name {
          color: white;
          font-size: 1.2rem;
          font-weight: 700;
        }

        .contact-section {
          background: linear-gradient(rgba(12, 12, 12, 0.92), rgba(20, 0, 0, 0.88)), url('/signage-production.png');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          padding: 6rem 2rem;
          text-align: center;
          color: white;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .contact-container {
          max-width: 600px;
          margin: 0 auto;
        }

        .contact-title {
          text-align: center;
          margin-bottom: 2rem;
        }

        .contact-title h2 {
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
        }

        .contact-title h2 .italic {
          font-style: italic;
        }

        .contact-title p {
          color: rgba(255,255,255,0.7);
          font-size: 1rem;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-input,
        .form-select,
        .form-textarea {
          padding: 1rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          transition: all 0.6s ease;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #EF4444;
          background: rgba(255,255,255,0.08);
        }

        .form-textarea {
          min-height: 120px;
          resize: vertical;
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: rgba(255,255,255,0.4);
        }

        .submit-button {
          padding: 1rem 2rem;
          background: #e61e25;
          color: white;
          border: none;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.6s ease;
          margin-top: 1rem;
        }

        .submit-button:hover {
          background: #ff2d35;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(230, 30, 37, 0.4);
        }

        @media (max-width: 768px) {
          .billboard-page {
            padding-top: 80px;
          }

          .back-button {
            top: 100px;
            left: 20px;
          }

          .hero-container,
          .why-choose-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .hero-content h1 {
            font-size: 2.5rem;
          }

          .hero-image {
            height: 300px;
          }

          .locations-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
          }

          .location-card {
            height: 200px;
          }
        }
      `}</style>

      <div className="billboard-page">
        <Link href="/services" className="back-button"><ArrowLeft size={24} color="#1c1c1c" /></Link>

        {/* Hero Section */}
        <motion.section 
          className="hero-section"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="hero-container">
            <motion.div className="hero-content" variants={fadeInUp}>
              <h1>
                Billboard<br />
                <span className="italic">Advertising</span>
              </h1>
              <p>
                High-visibility outdoor advertising designed to place your brand in front of thousands every day.
              </p>
            </motion.div>
            <motion.div className="hero-image" variants={fadeInUp}>
              <div className="hero-carousel">
                <div 
                  className="hero-carousel-track"
                  style={{
                    transform: `translateX(-${currentHeroSlide * 100}%)`
                  }}
                >
                  {heroImages.map((image, index) => (
                    <div key={index} className="hero-slide">
                      <img src={image} alt={`Billboard ${index + 1}`} />
                    </div>
                  ))}
                </div>
                <div className="hero-carousel-dots">
                  {heroImages.map((_, index) => (
                    <div
                      key={index}
                      className={`hero-dot ${currentHeroSlide === index ? 'active' : ''}`}
                      onClick={() => setCurrentHeroSlide(index)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Why Choose Billboards */}
        <motion.section 
          className="why-choose-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="why-choose-container">
            <motion.div className="why-choose-content" variants={fadeInUp}>
              <h2>Why Choose<br />Billboards</h2>
            </motion.div>

            <motion.div className="accordion" variants={fadeInUp}>
              {accordionItems.map((item, index) => (
                <div
                  key={index}
                  className={`accordion-item ${openAccordion === index ? 'open' : ''}`}
                >
                  <div
                    className="accordion-header"
                    onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                  >
                    <span>{item.title}</span>
                    <ChevronDown 
                      size={20} 
                      className={`accordion-icon ${openAccordion === index ? 'open' : ''}`}
                    />
                  </div>
                  <div className={`accordion-content ${openAccordion === index ? 'open' : ''}`}>
                    <div className="accordion-content-inner">
                      {item.content}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Available Locations */}
        

        {/* Contact Form */}
        <motion.section 
          className="contact-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="contact-container">
            <motion.div className="contact-title" variants={fadeInUp}>
              <h2>
                Start Your<br />
                <span className="italic">Campaign</span>
              </h2>
              <p>Tell us about your requirements and we'll get back to you promptly</p>
            </motion.div>

            <motion.form className="contact-form" variants={fadeInUp} onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  className="form-input"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <select
                  className="form-select"
                  value={formData.service}
                  onChange={(e) => setFormData({...formData, service: e.target.value})}
                  required
                >
                  <option value="Billboard Campaign">Billboard Campaign</option>
                  <option value="Multiple Locations">Multiple Locations</option>
                  <option value="Long Term Campaign">Long Term Campaign</option>
                </select>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Preferred Location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Campaign Budget"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                />
              </div>

              <div className="form-group">
                <textarea
                  className="form-textarea"
                  placeholder="Message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className="submit-button">
                Submit Request
              </button>
            </motion.form>
          </div>
        </motion.section>
      </div>
    </>
  );
}

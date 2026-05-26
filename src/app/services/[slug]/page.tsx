"use client";

import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ServiceMap from '@/app/components/ServiceMap';

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

interface ServiceData {
  _id: string;
  name: string;
  description: string;
  category: string;
  items?: string[];
  createdAt: string;
}

const categoryImages: Record<string, string[]> = {
  signage: [
    "/signage-production.png",
    "/signage-cladding.png",
    "/signage-branding.png",
    "/projects-hero-bg.png"
  ],
  branding: [
    "/signage-branding.png",
    "/about-hero-bg.png",
    "/services-hero-bg.png",
    "/projects-hero-bg.png"
  ],
  graphics: [
    "/signage-digital-print.png",
    "/signage-vehicle.png",
    "/home-hero-bg.png",
    "/cta-bg-premium.png"
  ],
  vehicle: [
    "/signage-vehicle.png",
    "/home-hero-bg.png",
    "/cta-bg-premium.png",
    "/signage-branding.png"
  ],
  exhibition: [
    "/signage-exhibition.png",
    "/home-hero-bg.png",
    "/about-hero-bg.png",
    "/services-hero-bg.png"
  ],
  default: [
    "/home-hero-bg.png",
    "/about-hero-bg.png",
    "/services-hero-bg.png",
    "/projects-hero-bg.png"
  ]
};

function getImagesForCategory(category: string): string[] {
  const lower = category.toLowerCase();
  for (const key of Object.keys(categoryImages)) {
    if (lower.includes(key)) return categoryImages[key];
  }
  return categoryImages.default;
}

export default function DynamicServicePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/services?t=${timestamp}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          const found = data.find((s: ServiceData) => {
            const serviceSlug = s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            return serviceSlug === slug;
          });
          setService(found || null);
        }
      } catch (error) {
        console.error('Error fetching service:', error);
      }
      setLoading(false);
    };
    fetchService();
  }, [slug]);

  const heroImages = service ? getImagesForCategory(service.category) : categoryImages.default;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const benefits = [
    { title: "Expert Team", desc: "Our highly skilled professionals bring years of experience and dedication to every project, ensuring exceptional results." },
    { title: "Premium Quality", desc: "We use only the finest materials and cutting-edge technology to deliver lasting, high-impact solutions." },
    { title: "Fast Turnaround", desc: "Quick execution from concept to completion, keeping your business moving without delays." },
    { title: "Full UAE Coverage", desc: "We serve clients across Dubai, Abu Dhabi, Sharjah, Ajman, and the Northern Emirates." }
  ];

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          style={{
            width: 48,
            height: 48,
            border: '4px solid #e0e0e0',
            borderTopColor: '#e61e25',
            borderRadius: '50%'
          }}
        />
      </div>
    );
  }

  if (!service) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
        gap: '2rem',
        padding: '2rem'
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#1c1c1c' }}>Service Not Found</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>The service you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/services" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.8rem',
          padding: '1rem 2.5rem',
          background: '#1c1c1c',
          color: 'white',
          fontWeight: 700,
          borderRadius: '50px',
          textDecoration: 'none',
          transition: 'all 0.3s ease'
        }}>
          <ArrowLeft size={20} /> Back to Services
        </Link>
      </div>
    );
  }

  const titleParts = service.name.split(' ');
  const titleMain = titleParts.slice(0, Math.ceil(titleParts.length / 2)).join(' ');
  const titleSub = titleParts.slice(Math.ceil(titleParts.length / 2)).join(' ') || 'Solutions';

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
          background: rgba(255, 255, 255, 0.1);
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
          border: 1px solid rgba(255, 255, 255, 0.1);
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
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-text {
          padding: 2rem 0;
        }

        .hero-text h1 {
          font-size: 4rem;
          font-weight: 950;
          margin-bottom: 0;
          line-height: 1;
          color: white;
          letter-spacing: -2px;
        }

        .hero-text .subtitle {
          font-style: italic;
          color: #e61e25;
          font-size: 3.5rem;
          font-weight: 400;
          margin-bottom: 1.5rem;
          line-height: 1;
          text-shadow: 0 0 20px rgba(230, 30, 37, 0.3);
        }

        .hero-text p {
          color: rgba(255, 255, 255, 0.82);
          line-height: 1.8;
          font-size: 1.1rem;
          max-width: 90%;
        }

        .hero-image-large {
          border-radius: 20px;
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
          font-size: 2.8rem;
          font-weight: 950;
          line-height: 1.1;
          color: white;
          letter-spacing: -1px;
        }

        .accordion-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .accordion-item {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.03);
          transition: all 0.6s ease;
        }

        .accordion-item.open {
          background: rgba(230, 30, 37, 0.08);
          border-color: #e61e25;
          box-shadow: 0 4px 25px rgba(12, 12, 12, 0.2);
          transform: translateX(8px);
        }

        .accordion-header {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          font-weight: 600;
          font-size: 1.15rem;
          transition: all 0.6s ease;
          background: transparent;
          color: white;
        }

        .accordion-header:hover {
          background: rgba(255, 107, 53, 0.05);
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
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
          font-size: 1rem;
        }

        .items-section {
          padding: 4rem 2rem;
          margin: 0 auto 2rem auto;
          max-width: 1200px;
        }

        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .item-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 2.2rem;
          box-shadow: 0 10px 30px rgba(12, 12, 12,0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
          display: flex;
          align-items: center;
          gap: 1.5rem;
          backdrop-filter: blur(10px);
        }

        .item-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(12, 12, 12,0.1);
          border-color: #e61e25;
        }

        .item-card .item-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e61e25, #ff4444);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .item-card .item-text {
          font-size: 1.15rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
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

          .service-hero {
            padding: 4rem 1.5rem;
          }

          .hero-text h1 {
            font-size: 2rem;
          }

          .hero-text .subtitle {
            font-size: 1.8rem;
          }

          .why-choose-section {
            grid-template-columns: 1fr;
          }

          .items-grid {
            grid-template-columns: 1fr;
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
              <h1>{titleMain}</h1>
              <div className="subtitle">{titleSub}</div>
              <p>{service.description}</p>
            </motion.div>

            <motion.div className="hero-image-large" variants={fadeInUp}>
              {heroImages.map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={service.name}
                  className={currentImageIndex === index ? 'active' : ''}
                />
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Service Items / Portfolio */}
        {service.items && service.items.filter(item => item.trim()).length > 0 && (
          <motion.section
            className="items-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} style={{ fontSize: '2.5rem', fontWeight: 950, color: 'white', marginBottom: '1.5rem', letterSpacing: '-1px' }}>
              What We <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#e61e25' }}>Offer</span>
            </motion.h2>
            <motion.p variants={fadeInUp} style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem', maxWidth: '600px', lineHeight: 1.6 }}>
              Comprehensive solutions tailored to your specific requirements
            </motion.p>
            <motion.div className="items-grid" variants={fadeInUp}>
              {service.items.filter(item => item.trim()).map((item, index) => (
                <motion.div
                  key={index}
                  className="item-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="item-number">{index + 1}</div>
                  <div className="item-text">{item}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* Why Choose Section */}
        <motion.section
          className="why-choose-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 className="why-choose-title" variants={fadeInUp}>
            Why Choose <br />
            <span style={{ fontStyle: 'italic', fontWeight: 400 }}>One Click</span>
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
            Start Your
          </motion.h2>
          <motion.div className="cta-subtitle" variants={fadeInUp}>
            Campaign
          </motion.div>
          <motion.p className="cta-description" variants={fadeInUp}>
            Tell us about your requirements and we&apos;ll get back to you quickly
          </motion.p>
          <motion.div variants={fadeInUp} style={{ marginTop: '2rem' }}>
            <Link href="/contact#campaign" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.8rem',
              padding: '1.2rem 3rem',
              background: '#e61e25',
              color: 'white',
              fontWeight: 700,
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              fontSize: '1.1rem',
              boxShadow: '0 4px 20px rgba(230, 30, 37, 0.4)'
            }}>
              Get Started <ArrowRight size={22} />
            </Link>
          </motion.div>
        </motion.section>
      </div>
    </>
  );
}

"use client";

import { motion, Variants, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Award, 
  Globe, 
  TrendingUp, 
  Target, 
  Palette, 
  Settings, 
  Rocket, 
  ShieldCheck, 
  Building2, 
  Truck, 
  Store, 
  School, 
  Stethoscope, 
  Hotel,
  Factory,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { 
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.3, 
      delayChildren: 0.5 
    }
  }
};

export default function AboutPage() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  // 3D Parallax Mouse Tracking
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springConfig = { damping: 20, stiffness: 100 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  const rotateX = useTransform(springY, [0, 1], [15, -15]);
  const rotateY = useTransform(springX, [0, 1], [-15, 15]);
  const bgX = useTransform(springX, [0, 1], [-20, 20]);
  const bgY = useTransform(springY, [0, 1], [-20, 20]);
  
  const handleHeroMouseMove = (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const processSteps = [
    { 
      title: "Say Hi", 
      icon: <Target size={30} />, 
      image: "/signage-branding.png",
      desc: "Tell us what you're thinking, and we'll help you find the best approach." 
    },
    { 
      title: "The Design", 
      icon: <Palette size={30} />, 
      image: "/signage-digital-print.png",
      desc: "We work together on a design that looks great and gets your message across." 
    },
    { 
      title: "We Build It", 
      icon: <Settings size={30} />, 
      image: "/signage-production.png",
      desc: "Our team handles the printing and building. We even take care of the permits." 
    },
    { 
      title: "Go Live", 
      icon: <Rocket size={30} />, 
      image: "/signage-exhibition.png",
      desc: "We install everything for you. You sit back and watch your brand come to life." 
    }
  ];

  const industries = [
    { name: "Retail & Shopping Malls", icon: <Store /> },
    { name: "Corporate & Business Centers", icon: <Building2 /> },
    { name: "Real Estate & Property Developers", icon: <Globe /> },
    { name: "Schools & Educational Institutions", icon: <School /> },
    { name: "Automotive & Logistics", icon: <Truck /> },
    { name: "Hospitality (Hotels & Cafés)", icon: <Hotel /> },
    { name: "Healthcare & Clinics", icon: <Stethoscope /> },
    { name: "Government Entities", icon: <Award /> }
  ];

  const coreServices = [
    { title: "Branding & Identity", desc: "Corporate identity, implementation & interior graphics." },
    { title: "Digital Printing", desc: "Large format, wall, glass & window graphics." },
    { title: "Vehicle Branding", desc: "Full wraps, fleet graphics & RTA compliance." },
    { title: "Signage Production", desc: "3D letters, illuminated signs & wayfinding." },
    { title: "Exhibition & POS", desc: "Kiosks, pop-up stands & in-store displays." },
    { title: "Facade & Cladding", desc: "ACP cladding & architectural shopfront solutions." }
  ];

  return (
    <>
      <style jsx global>{`
        .about-page {
          background: transparent;
          color: #ffffff;
          overflow-x: hidden;
        }

        .hero-section {
          position: relative;
          height: 100vh;
          min-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          color: white;
          overflow: hidden;
          perspective: 1200px;
        }

        .hero-background {
          position: absolute;
          inset: -30px;
          z-index: 0;
        }

        .hero-background img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.6) contrast(1.1);
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(10,0,0,0.4) 0%, rgba(18, 18, 18,0.95) 100%);
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 1000px;
          padding: 2rem;
          transform-style: preserve-3d;
          pointer-events: none;
        }

        .hero-title {
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          font-weight: 950;
          line-height: 0.95;
          margin-bottom: 2rem;
          letter-spacing: -3px;
          transform: translateZ(80px);
          text-shadow: 0 10px 40px rgba(12, 12, 12,0.6);
        }

        .hero-title span {
          color: #e61e25;
          display: inline-block;
          transform: translateZ(120px);
          text-shadow: 0 0 30px rgba(230,30,37,0.5);
        }

        .hero-desc {
          font-size: 1.4rem;
          color: rgba(255,255,255,0.95);
          max-width: 750px;
          margin: 0 auto;
          line-height: 1.6;
          text-shadow: 0 4px 15px rgba(12, 12, 12,0.5);
          transform: translateZ(40px);
          font-weight: 500;
        }

        .content-section {
          padding: 5rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .profile-text h2 {
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          letter-spacing: -1px;
        }

        .profile-text p {
          font-size: 1.05rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.75);
          margin-bottom: 1.5rem;
        }

        .profile-image-container {
          position: relative;
        }

        .profile-image {
          width: 100%;
          height: 450px;
          border-radius: 30px;
          object-fit: cover;
          box-shadow: 0 30px 60px rgba(12, 12, 12,0.12);
        }

        .vision-mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 3rem;
          max-width: 1000px;
          margin-left: auto;
          margin-right: auto;
        }

        .vm-card {
          padding: 2.5rem;
          border-radius: 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.6s ease;
          color: white;
        }

        .vm-card:hover {
          background: rgba(230,30,37,0.06);
          box-shadow: 0 20px 40px rgba(12, 12, 12,0.4);
          border-color: #e61e25;
          transform: translateY(-8px);
        }

        .vm-card .icon {
          color: #e61e25;
          margin-bottom: 1.2rem;
          display: block;
        }

        .vm-card h3 {
          font-size: 1.6rem;
          font-weight: 900;
          margin-bottom: 1rem;
          letter-spacing: -0.5px;
        }

        .vm-card p {
          font-size: 1rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.7);
        }

        .services-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.2rem;
          margin-top: 2rem;
          align-items: stretch;
        }

        .service-summary-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          padding: 2.5rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
          color: white;
          position: relative;
          z-index: 2;
        }

        .service-summary-card:hover {
          border-color: #e61e25;
          box-shadow: 0 15px 40px rgba(230,30,37,0.1);
          transform: translateY(-8px);
        }

        .service-summary-card h4 {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 0.8rem;
          color: #ffffff;
        }

        .service-summary-card p {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin-bottom: 0;
          font-size: 0.95rem;
        }

        .service-summary-card .learn-more {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #e61e25;
          text-decoration: none;
          font-weight: 800;
          font-size: 0.9rem;
        }

        .process-section {
          background: #121212;
          padding: 8rem 2rem;
          text-align: center;
        }

        .section-header {
          margin-bottom: 4rem;
          text-align: center;
        }

        .section-header h2 {
          font-size: 4rem;
          font-weight: 900;
          color: inherit;
          margin-bottom: 0.5rem;
          letter-spacing: -2px;
        }

        .section-header h2 .italic {
          font-style: italic;
          color: rgba(255,255,255,0.6);
          font-weight: 400;
          margin-left: 10px;
        }

        .section-header p {
          color: inherit;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .section-header .steps-label {
          color: rgba(255,255,255,0.5);
          font-size: 1.1rem;
          font-weight: 600;
        }

        .process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        .process-wrapper {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
        }

        .process-static-line {
          display: none;
        }

        .process-animated-line {
          position: absolute;
          top: 50%;
          left: -100%;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, transparent, #e61e25, #e61e25, transparent);
          transform: translateY(-50%);
          z-index: 0;
          animation: processLineFlow 5s infinite linear;
        }

        @keyframes processLineFlow {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .process-step {
          background: #141414;
          padding: 2.5rem 1.5rem;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.6s ease;
          text-align: left;
          min-height: 280px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          z-index: 2;
          color: white;
        }

        .process-step:hover {
          border-color: #e61e25;
          box-shadow: 0 15px 40px rgba(12, 12, 12,0.4);
          transform: translateY(-8px);
          background: #1f1111;
        }

        .step-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 1.5rem;
        }

        .step-icon-box {
          width: 50px;
          height: 50px;
          background: rgba(255,255,255,0.08);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          transition: border-color 0.3s ease;
        }

        .process-step:hover .step-icon-box {
          border-color: #e61e25;
        }

        .process-step h4 {
          font-size: 1.8rem;
          font-weight: 700;
          color: white;
        }

        .process-step p {
          color: rgba(255,255,255,0.7);
          line-height: 1.5;
          font-size: 1.05rem;
        }

        .compliance-section {
          padding: 8rem 2rem;
          background: linear-gradient(rgba(18, 18, 18, 0.9), rgba(18, 18, 18, 0.9)), url('/compliance-approvals-bg.png');
          background-size: cover;
          background-attachment: fixed;
          background-position: center;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .compliance-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6rem;
          max-width: 1300px;
          margin: 0 auto;
          align-items: center;
        }

        .compliance-badge {
          background: rgba(230, 30, 37, 0.1);
          padding: 3rem;
          border-radius: 30px;
          border: 1px solid rgba(230, 30, 37, 0.2);
        }

        .compliance-list {
          list-style: none;
          padding: 0;
          margin: 2rem 0;
        }

        .compliance-list li {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
          color: rgba(255,255,255,0.8);
        }

        .compliance-list li .check {
          color: #e61e25;
        }

        .industries-section {
          padding: 8rem 2rem;
          background: #121212;
          color: white;
        }

        .industries-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .industry-card {
          padding: 2rem;
          background: rgba(255,255,255,0.04);
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          transition: all 0.6s ease;
          border: 1px solid rgba(255,255,255,0.08);
          color: white;
        }

        .industry-card:hover {
          background: rgba(230,30,37,0.08);
          border-color: #e61e25;
          box-shadow: 0 15px 30px rgba(12, 12, 12,0.3);
          transform: translateY(-8px);
        }

        .industry-card .icon {
          color: #e61e25;
          flex-shrink: 0;
        }

        .industry-card span {
          font-weight: 700;
          font-size: 1rem;
          line-height: 1.2;
        }

        .commitment-section {
          padding: 10rem 2rem;
          text-align: center;
          background: linear-gradient(rgba(12, 12, 12,0.8), rgba(12, 12, 12,0.8)), url('/cta-bg-premium.png');
          background-size: cover;
          background-attachment: fixed;
          color: white;
        }

        .commitment-content h2 {
          font-size: 4rem;
          font-weight: 900;
          margin-bottom: 2rem;
          letter-spacing: -2px;
        }

        .commitment-content p {
          font-size: 1.4rem;
          max-width: 800px;
          margin: 0 auto 3rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.9);
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 1.5rem 4rem;
          background: #e61e25;
          color: white;
          border-radius: 50px;
          font-weight: 800;
          font-size: 1.2rem;
          text-decoration: none;
          transition: all 0.6s ease;
        }

        .cta-button:hover {
          background: #1c1c1c;
          color: #e61e25;
          transform: scale(1.05);
          box-shadow: 0 20px 40px rgba(12, 12, 12,0.3);
        }

        @media (max-width: 1024px) {
          .profile-grid, .vision-mission-grid, .process-grid, .compliance-grid, .industries-grid, .services-summary-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            height: 100svh !important;
            height: 100vh !important;
            min-height: unset !important;
            padding: 140px 1.5rem 80px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            overflow: hidden !important;
            perspective: none !important;
          }
          .hero-background {
            position: absolute !important;
            inset: 0 !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            height: 100% !important;
            transform: none !important;
          }
          .hero-background img {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            object-position: center !important;
            transform: none !important;
          }
          .hero-overlay {
            position: absolute !important;
            inset: 0 !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
          }
          .hero-content {
            text-align: center !important;
            padding: 1rem !important;
            transform: none !important;
          }
          .hero-title { font-size: clamp(2.1rem, 10vw, 3rem); letter-spacing: -1px; margin-bottom: 1rem; text-align: center; transform: none !important; }
          .hero-title span { transform: none !important; }
          .hero-desc { font-size: 1rem; line-height: 1.5; text-align: center; transform: none !important; }
        }
      `}</style>

      <div className="about-page">
        {/* Hero Section */}
        <section className="hero-section" onMouseMove={handleHeroMouseMove}>
          <motion.div 
            className="hero-background"
            style={{ x: bgX, y: bgY }}
          >
            <img 
              src="/services-hero-bg.png" 
              alt="About Us Background" 
            />
          </motion.div>
          <div className="hero-overlay"></div>

          <motion.div 
            className="hero-content"
            style={{ rotateX, rotateY }}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.0, type: "spring", bounce: 0.3 }}
          >
            <motion.h1 
              className="hero-title"
              initial={{ z: -200, opacity: 0 }}
              animate={{ z: 0, opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.3 }}
            >
              Helping your brand <motion.span
                animate={{ 
                    textShadow: [
                        "0px 0px 10px rgba(230,30,37,0.4)",
                        "0px 0px 30px rgba(230,30,37,0.8)",
                        "0px 0px 10px rgba(230,30,37,0.4)"
                    ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >really stand out</motion.span>
            </motion.h1>
            <motion.p 
              className="hero-desc"
              initial={{ opacity: 0, y: 20, z: -50 }}
              animate={{ opacity: 1, y: 0, z: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              We’re a team of experts dedicated to making sure your business gets seen across the UAE—simply, quickly, and without the stress.
            </motion.p>
          </motion.div>
        </section>

        {/* Company Profile & About Us */}
        <section className="content-section">
          <div className="profile-grid">
            <motion.div 
              className="profile-text"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp}>A bit about us</motion.h2>
              <motion.p variants={fadeInUp}>
                We’re here to help you get your business in front of the right people. We design, print, and install high-quality ads that people actually notice while they're out and about.
              </motion.p>
              <motion.p variants={fadeInUp}>
                Whether you’re a local shop owner looking for a beautiful sign or a growing brand ready for a city-wide fleet, we’ve got you covered. We handle everything from the first sketch to the final install.
              </motion.p>
              <motion.p variants={fadeInUp}>
                We know the UAE market and all the local rules, so you don't have to worry about the paperwork. We just focus on making your brand look its absolute best.
              </motion.p>
            </motion.div>
            <motion.div 
              className="profile-image-container"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <img src="/signage-branding.png" alt="About One Click" className="profile-image" />
            </motion.div>
          </div>

          <div className="vision-mission-grid">
            <motion.div 
              className="vm-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Target className="icon" size={32} />
              <h3>Our Goal</h3>
              <p>We want to be the team you trust to make your business look great. We’re focused on simple, honest service and results that help your brand grow.</p>
            </motion.div>
            <motion.div 
              className="vm-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <ShieldCheck className="icon" size={32} />
              <h3>Our Promise</h3>
              <p>We promise to deliver high-quality work that lasts. We handle all the local permits and rules, so you can sit back and relax knowing everything is taken care of.</p>
            </motion.div>
          </div>
        </section>

        {/* Core Services Summary */}
        <section className="content-section" style={{ 
          position: 'relative',
          padding: '8rem 2rem',
          background: 'linear-gradient(rgba(12, 12, 12,0.85), rgba(12, 12, 12,0.85)), url(https://images.unsplash.com/photo-1549216348-12c85f7ea368?q=80&w=2070&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          color: 'white',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(230,30,37,0.1) 0%, transparent 80%)', pointerEvents: 'none' }}></div>
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 style={{ fontSize: '2.5rem' }}>Our Core <span className="italic" style={{ color: '#e61e25', fontStyle: 'italic', fontWeight: 'inherit' }}>Services</span></h2>
            <p style={{ fontWeight: 400 }}>Comprehensive branding and signage solutions tailored for the UAE market.</p>
          </motion.div>

          <motion.div 
            className="services-summary-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {coreServices.map((service, idx) => (
              <motion.div key={idx} className="service-summary-card" variants={fadeInUp}>
                <h4>{service.title}</h4>
                <p>{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Our Process Section */}
        <section className="process-section">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2>How we <span className="italic">work</span></h2>
            <p>A simple and stress-free way to get your brand noticed.</p>
            <div className="steps-label">Easy Steps</div>
          </motion.div>

          <div className="process-wrapper">
            <div className="process-static-line"></div>
            <div className="process-animated-line"></div>
            <motion.div 
              className="process-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {processSteps.map((step, idx) => (
                <motion.div key={idx} className="process-step" variants={fadeInUp}>
                  <div className="step-header">
                    <div className="step-icon-box">{step.icon}</div>
                    <h4>{step.title}</h4>
                  </div>
                  <p>{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Compliance & Authority Section */}
        <section className="compliance-section">
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(230,30,37,0.1) 0%, transparent 80%)', pointerEvents: 'none' }}></div>
          <div className="compliance-grid">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '2rem' }} variants={fadeInUp}>
                Compliance & <span style={{ color: '#e61e25' }}>Approvals</span>
              </motion.h2>
              <motion.p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', lineHeight: 1.6 }} variants={fadeInUp}>
                We are experienced in working in accordance with UAE municipality and mall regulations, ensuring smooth approvals and long-term durability.
              </motion.p>
              <ul className="compliance-list">
                <motion.li variants={fadeInUp}><CheckCircle size={20} className="check" /> Dubai Municipality guidelines</motion.li>
                <motion.li variants={fadeInUp}><CheckCircle size={20} className="check" /> RTA requirements for vehicle graphics</motion.li>
                <motion.li variants={fadeInUp}><CheckCircle size={20} className="check" /> Mall & property management standards</motion.li>
                <motion.li variants={fadeInUp}><CheckCircle size={20} className="check" /> Safety & installation compliance</motion.li>
              </ul>
            </motion.div>
            <motion.div 
              className="compliance-badge"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div style={{ textAlign: 'center' }}>
                <ShieldCheck size={100} color="#e61e25" style={{ margin: '0 auto 2rem' }} />
                <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>Certified Authority Standard</h3>
                <p style={{ marginTop: '1rem', opacity: 0.8 }}>We handle all the bureaucracy so you can focus on your business.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Industries We Serve Section */}
        <section className="industries-section">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2>Industries <span className="italic">We Serve</span></h2>
            <p>Providing specialized visual solutions across diverse sectors in the UAE.</p>
          </motion.div>

          <motion.div 
            className="content-section"
            style={{ paddingTop: 0 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <div className="industries-grid">
              {industries.map((item, idx) => (
                <motion.div key={idx} className="industry-card" variants={fadeInUp}>
                  <div className="icon">{item.icon}</div>
                  <span>{item.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Our Commitment Section */}
        <section className="commitment-section">
          <motion.div 
            className="commitment-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2>Our Commitment</h2>
            <p>We are committed to delivering professional workmanship, premium finishing, and long-lasting branding solutions that withstand the UAE climate while maintaining strong visual impact.</p>
            <Link href="/contact" className="cta-button">
              Start Your Project <ArrowRight />
            </Link>
          </motion.div>
        </section>
      </div>
    </>
  );
}

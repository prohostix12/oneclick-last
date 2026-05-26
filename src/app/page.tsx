"use client";

import React, { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence, Variants, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, MapPin, Phone, Mail, ChevronDown, Sparkles, Megaphone, Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';
import PremiumScratchCard from '@/components/PremiumScratchCard';
import EnquireNowModal from '@/components/EnquireNowModal';
import CinematicDoubleExposure from '@/components/CinematicDoubleExposure';


import './black-cards.css';
import './home.css';


const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } as any }
};

const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } as any }
};

const slideDown: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } as any }
};

const dropIn: Variants = {
  hidden: { opacity: 0, y: -200 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 25, stiffness: 180 } as any }
};

const bounceInDown: Variants = {
  hidden: { opacity: 0, y: -60 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 20, stiffness: 150 } as any }
};

const revealDown: Variants = {
  hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
  visible: { opacity: 1, clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.4 } as any }
};

const swipeLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } as any }
};

const swipeRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } as any }
};

const swipeUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } as any }
};

const swipeDown: Variants = {
  hidden: { opacity: 0, y: -60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } as any }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 } as any
  }
};

/*
 * SCRATCH CARD PLACEMENT GUIDE
 * ============================
 * 
 * To change the scratch card placement, modify the SCRATCH_CARD_CONFIG below:
 * 
 * 1. BELOW HERO SECTION (Default - Recommended for lead generation):
 *    placement: 'below-hero'
 *    - Shows prominently after hero section
 *    - High visibility and conversion
 *    - Best for capturing immediate attention
 * 
 * 2. FLOATING POPUP (Attention-grabbing):
 *    placement: 'floating-popup'
 *    - Shows as modal popup after delay
 *    - Can be closed by user
 *    - Good for re-engagement
 * 
 * 3. STICKY CORNER (Non-intrusive):
 *    placement: 'sticky-corner'
 *    - Shows in bottom-right corner
 *    - Can be minimized
 *    - Least intrusive option
 * 
 * Additional Options:
 * - autoShow: true/false (for popup and sticky)
 * - delay: milliseconds (for popup and sticky)
 * - useModalVersion: true to use old modal, false for new inline
 */

const WhatsAppIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.729-1.452L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.574 1.97 14.101.94 11.479.94c-5.44 0-9.866 4.369-9.87 9.8-.001 1.768.468 3.49 1.354 5.03l-.997 3.641 3.791-.983 1.3.766zm10.741-6.953c-.276-.139-1.637-.805-1.89-.897-.252-.093-.436-.139-.62.139-.184.277-.712.897-.872 1.082-.16.186-.32.208-.596.069-.276-.139-1.168-.429-2.223-1.372-.821-.73-1.376-1.631-1.537-1.909-.16-.277-.017-.427.121-.565.125-.124.276-.322.414-.484.14-.162.186-.277.278-.462.093-.185.047-.347-.023-.485-.07-.139-.62-1.493-.849-2.046-.223-.538-.448-.465-.62-.473-.16-.008-.344-.01-.528-.01-.184 0-.485.07-.74.347-.253.277-.965.943-.965 2.3s.988 2.668 1.126 2.853c.138.185 1.944 2.954 4.71 4.14 1.716.737 2.378.825 2.825.803.493-.024 1.638-.665 1.87-.13.232.536.232.996.115 1.204-.117.208-.574.348-.85.348z"/>
  </svg>
);

const heroServices = [
  { name: 'Branding & Corporate Identity', img: '/signage-branding.png', link: '/services/branding' },
  { name: 'Digital Printed Graphics', img: '/signage-digital-print.png', link: '/services/digital-graphics' },
  { name: 'Vehicle Graphics & Fleet Branding', img: '/signage-vehicle.png', link: '/services/vehicle-branding' },
  { name: 'Exhibition, Display & POS Solutions', img: '/signage-production.png', link: '/services/signage' },
  { name: 'Signage Production & Installation', img: '/signage-exhibition.png', link: '/services/exhibition' },
  { name: 'Cladding & Facade Solutions', img: '/signage-cladding.png', link: '/services/cladding' },
];

// Two groups of 4 for the paginated carousel
const carouselPages = [
  heroServices.slice(0, 4),
  [...heroServices.slice(4), ...heroServices.slice(0, 2)],
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'whyus' | 'reach' | 'solutions'>('whyus');
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [openBrandAccordion, setOpenBrandAccordion] = useState<number | null>(0);
  const [isScratchCardOpen, setIsScratchCardOpen] = useState(false);
  const [enquireItem, setEnquireItem] = useState<string | null>(null);
  const [carouselPage, setCarouselPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [shouldRenderVideo, setShouldRenderVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [heroServiceIndex, setHeroServiceIndex] = useState(0);

  useEffect(() => {
    const isAdminUser = typeof window !== 'undefined' && localStorage.getItem('adminAuth') === 'true';
    setIsAdmin(isAdminUser);
    setMounted(true);
    setVideoEnded(true);
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  // 3D Parallax Mouse Tracking
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springConfig = { damping: 20, stiffness: 100 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  const rotateX = useTransform(springY, [0, 1], [10, -10]);
  const rotateY = useTransform(springX, [0, 1], [-10, 10]);
  const bgX = useTransform(springX, [0, 1], [-20, 20]);
  const bgY = useTransform(springY, [0, 1], [-20, 20]);

  const handleHeroMouseMove = (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const locations = [
    { 
      name: 'Dubai Marina', 
      image: '/projects-hero-bg.png'
    },
    { 
      name: 'Abu Dhabi Corniche', 
      image: '/services-hero-bg.png'
    },
    { 
      name: 'Downtown Dubai', 
      image: '/premium_home_hero.png'
    },
    { 
      name: 'Jumeirah Beach', 
      image: '/about-hero-bg.png'
    }
  ];

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);



  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselPage((prev) => (prev + 1) % carouselPages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroServiceIndex((prev) => (prev + 1) % heroServices.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLocationIndex((prev) => (prev + 1) % locations.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [locations.length]);

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
        setSubmitStatus({ success: true, message: 'Message sent successfully!' });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setSubmitStatus({ success: false, message: data.error || 'Something went wrong.' });
      }
    } catch (_error) {
      setSubmitStatus({ success: false, message: 'Failed to connect to the server.' });
    }
    
    setIsSubmitting(false);
  };

  return (
    <>
      {isScratchCardOpen && (
        <PremiumScratchCard
          onClose={() => setIsScratchCardOpen(false)}
          onClaim={() => {
            console.log("Offer Claimed - Showing success message");
          }}
        />
      )}

      {enquireItem && (
        <EnquireNowModal
          serviceName={enquireItem}
          source="home-page"
          onClose={() => setEnquireItem(null)}
        />
      )}
      


      {/* Hero Section */}
      <section className="hero-section" onMouseMove={handleHeroMouseMove}>

        {/* Clean, high-key airy background with a very faint, washed city skyline at the bottom */}
        <div className="hero-bg-wrap">
          <div className="hero-clean-bg" />
          <div className="hero-faint-skyline" />
          <div className="hero-light-base" />
          <div className="hero-light-vignette" />
        </div>

        <motion.div
          className="hero-content hero-split"
          initial={isAdmin ? { opacity: 1 } : { opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={isAdmin ? { duration: 0 } : { duration: 0.9, type: 'spring', bounce: 0.25 }}
        >
          {/* ── LEFT: Text ── */}
          <div className="hero-text-side">
            <motion.h1
              className="hero-headline"
              initial={isAdmin ? { opacity: 1 } : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7, type: 'spring', bounce: 0.3 }}
            >
              We Make<br />
              <span className="hero-headline-accent">Brands Visible</span>
            </motion.h1>



            <motion.div
              className="hero-cta-row"
              initial={isAdmin ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
            >
              <Link href="/services" className="btn btn-primary">
                Explore Services <ArrowRight size={18} />
              </Link>
              <Link href="/contact" className="btn hero-btn-outline">
                Get a Quote
              </Link>
            </motion.div>

            {/* Cycling service name pill */}
          </div>

          {/* ── RIGHT: Cycling Service Image ── */}
          <div className="hero-image-side">
            <div className="hero-image-frame">
              <AnimatePresence mode="wait">
                <motion.img
                  key={heroServiceIndex}
                  src={heroServices[heroServiceIndex].img}
                  alt={heroServices[heroServiceIndex].name}
                  className="hero-service-img"
                  initial={{ opacity: 0, scale: 1.08, x: 30 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -30 }}
                  transition={{ duration: 0.85, ease: 'easeInOut' }}
                />
              </AnimatePresence>
              {/* Overlay label */}
              <div className="hero-img-label">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={heroServiceIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    {heroServices[heroServiceIndex].name}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating Social Icons Bar on Right Side of Landing Page */}
        <motion.div 
          className="floating-social-bar"
          initial={isAdmin ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          animate={(showContent || isAdmin) ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={isAdmin ? { duration: 0 } : { delay: showContent ? 1.0 : 0, duration: 0.8 }}
        >
          <a href="https://www.instagram.com/oneclick_advertisement?igsh=NzNwaGo2b2VwbDNh" target="_blank" rel="noopener noreferrer" className="social-icon-btn instagram" aria-label="Instagram">
            <Instagram size={22} />
          </a>
          <a href="https://www.facebook.com/oneclickadvertisement/" target="_blank" rel="noopener noreferrer" className="social-icon-btn facebook" aria-label="Facebook">
            <Facebook size={22} />
          </a>
          <a href="https://wa.me/971552574786" target="_blank" rel="noopener noreferrer" className="social-icon-btn whatsapp" aria-label="WhatsApp">
            <WhatsAppIcon size={22} />
          </a>
        </motion.div>



        <motion.div 
          className="claim-btn-floating-container"
          initial={isAdmin ? { opacity: 1, y: 0, scale: 0.45 } : { opacity: 0, y: 100, scale: 0 }}
          animate={{ opacity: 1, y: 0, scale: 0.45 }}
          transition={isAdmin ? { duration: 0 } : { delay: 1.5, type: "spring", stiffness: 260, damping: 20 }}
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 99999,
            pointerEvents: 'auto',
            width: 'fit-content',
            margin: 0,
            left: 'auto',
            top: 'auto',
            transformOrigin: 'bottom right'
          }}
        >
          <style jsx>{`
            @media (max-width: 768px) {
              .claim-btn-floating-container {
                right: 0.5rem !important;
                bottom: 5.5rem !important;
                transform: scale(0.38) !important;
                transform-origin: bottom right;
              }
            }
            @media (max-width: 480px) {
              .claim-btn-floating-container {
                right: 0.25rem !important;
                bottom: 5rem !important;
                transform: scale(0.32) !important;
                transform-origin: bottom right;
              }
            }
          `}</style>
          {/* Comic-Style Starburst Teaser */}
          <motion.div
            onTap={() => {
              console.log("Home Badge Tapped");
              setIsScratchCardOpen(true);
            }}
            initial={{ scale: 0 }}
            animate={{ 
              scale: [0.75, 1.1, 1],
              rotate: [-2, 2, -2]
            }}
            transition={{ 
              duration: 0.5,
              delay: 1.5,
              scale: { duration: 0.4 },
              rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            style={{
                position: 'relative',
                width: '180px',
                height: '180px',
                minWidth: '180px',
                minHeight: '180px',
                flexShrink: 0,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto',
                WebkitTapHighlightColor: 'transparent'
            }}
          >
              {/* White Starburst Shape */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))'
              }}>
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: '#e61e25' }}>
                   <path d="M50 2 L56 18 L70 8 L72 25 L88 20 L82 35 L98 40 L88 50 L98 60 L82 65 L88 80 L72 75 L70 92 L56 82 L50 98 L44 82 L30 92 L28 75 L12 80 L18 65 L2 60 L12 50 L2 40 L18 35 L12 20 L28 25 L30 8 L44 18 Z" />
                </svg>
              </div>

              {/* Megaphone Icon */}
              <div style={{
                position: 'absolute',
                top: '-5px',
                right: '5px',
                background: 'white',
                padding: '8px',
                borderRadius: '50%',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                zIndex: 15,
                transform: 'rotate(15deg)',
                pointerEvents: 'none'
              }}>
                <Megaphone size={24} color="#000" fill="#000" />
              </div>

              {/* Text Content Overlay */}
              <div style={{
                  position: 'relative',
                  zIndex: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  pointerEvents: 'none'
              }}>
                  <span style={{ 
                      color: '#fff', 
                      fontSize: '18px', 
                      fontWeight: 950, 
                      lineHeight: 1, 
                      letterSpacing: '-0.5px',
                  }}>
                      EXTENDED
                  </span>
                  
                  <span style={{ 
                      color: '#fff', 
                      fontSize: '32px', 
                      fontWeight: 950, 
                      lineHeight: 0.9, 
                      letterSpacing: '-1px',
                  }}>
                      OFFER
                  </span>
              </div>
          </motion.div>
        </motion.div>

        {/* Removed Services Paginated Carousel */}
      </section>


      {/* We Build Section */}
      <section className="we-build-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="container"
        >
          <motion.h2 className="we-build-title" variants={bounceInDown} style={{
            fontWeight: 950,
            fontSize: 'clamp(2.5rem, 8vw, 4rem)',
            letterSpacing: '-1px',
            textTransform: 'uppercase',
            lineHeight: 1.1
          }}>
            We build <span style={{
              color: '#e61e25',
              fontWeight: 950,
              textTransform: 'uppercase'
            }}>signs that people actually see</span>
          </motion.h2>
          <motion.p className="we-build-subtitle" variants={slideDown}>
            From simple shop signs to massive city-wide campaigns, we help you get your brand in front of the right people.
          </motion.p>
          
          <motion.div className="portfolio-grid" variants={staggerContainer}>
              {[
               { 
                id: 1, 
                icon: <MapPin size={32} color="#e61e25" />, 
                title: 'Branding & Corporate Identity',
                desc: 'We’ll help you create a look that people remember. (Like that local cafe everyone knows by its logo.)',
                image: '/signage-branding.png'
              },
              { 
                id: 2, 
                icon: <Mail size={32} color="#e61e25" />, 
                title: 'Digital Printed Graphics',
                desc: 'High-resolution prints that look sharp from across the street. Perfect for windows and banners.',
                image: '/signage-digital-print.png'
              },
              { 
                id: 3, 
                icon: <Phone size={32} color="#e61e25" />, 
                title: 'Vehicle Graphics & Fleet Branding',
                desc: 'Turn your car or van into a mobile billboard. One of the best ways to get seen all over town.',
                image: '/signage-vehicle.png'
              },
              { 
                id: 4, 
                icon: <ArrowRight size={32} color="#e61e25" />, 
                title: 'Exhibition, Display & POS Solutions',
                desc: 'Indoor, outdoor, or glowing neon. We use tough materials that handle the UAE sun without fading.',
                image: '/signage-production.png'
              },
              { 
                id: 5, 
                icon: <MapPin size={32} color="#e61e25" />, 
                title: 'Signage Production & Installation',
                desc: 'Exhibition booths and kiosks that make people want to walk over and say hi.',
                image: '/signage-exhibition.png'
              },
              { 
                id: 6, 
                icon: <ArrowRight size={32} color="#e61e25" />, 
                title: 'Cladding & Facade Solutions',
                desc: 'Give your building a fresh, modern look. Turning old storefronts into local landmarks.',
                image: '/signage-cladding.png'
              }
            ].map((item, index) => (
              <motion.div 
                key={item.id} 
                className="portfolio-item" 
                variants={swipeUp}
                whileHover={{ scale: 1.02 }}
                style={{
                  backgroundImage: `linear-gradient(rgba(12, 12, 12,0.6), rgba(12, 12, 12,0.85)), url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <h3 className={`portfolio-title ${item.title.length > 25 ? 'long-title' : (item.title.length > 20 ? 'medium-title' : '')}`}>
                  {item.title.includes('&') ? (
                    <>
                      <span style={{ color: 'white' }}>{item.title.split('&')[0].trim()}</span>
                      <span style={{ color: '#e61e25' }}> & </span>
                      <span style={{ color: 'white' }}>{item.title.split('&')[1]?.trim()}</span>
                    </>
                  ) : item.title}
                </h3>

                <div className="portfolio-divider"></div>
                
                <p className="portfolio-desc" style={{ marginBottom: 'auto' }}>{item.desc}</p>

                <button
                  onClick={() => setEnquireItem(item.title)}
                  style={{
                    alignSelf: 'flex-start',
                    padding: '0.6rem 1.3rem',
                    background: 'transparent',
                    color: '#e61e25',
                    border: '2px solid #e61e25',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit',
                    marginBottom: '3.5rem',
                    position: 'relative',
                    zIndex: 20,
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#e61e25'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#e61e25'; }}
                >
                  Enquire Now
                </button>

                <div className="portfolio-scallop">
                  <div className="portfolio-number">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Link href="/services" className="btn btn-primary">
              Explore Services <ArrowRight size={20} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* For Brands Section */}
      <section className="section section-dark">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="for-brands-section container"
        >
          <motion.div 
            className="for-brands-content" 
            variants={swipeLeft}
          >
            <h2>For Businesses Large & Small</h2>
            <p>
              We make outdoor advertising easy for everyone. Whether you're a startup or a global brand, we help you find the best spots to get noticed across the city.
            </p>
          </motion.div>
          
          <motion.div 
            className="for-brands-accordion"
            variants={swipeRight}
          >
            {[
              { 
                title: 'We handle the hard stuff', 
                desc: 'From the first sketch to the final screw, we take care of everything so you don\'t have to worry about the details.' 
              },
              { 
                title: 'Quality you can trust', 
                desc: 'We use premium materials that stay looking fresh, even in the middle of a UAE summer.' 
              },
              { 
                title: 'No permit headaches', 
                desc: 'We know the RTA and local rules inside out. We\'ll handle all the paperwork and approvals for you.' 
              },
              { 
                title: 'Always on time', 
                desc: 'When we say it\'ll be ready, it\'ll be ready. We deliver and install across the UAE, exactly when you need us.' 
              }
            ].map((item, index) => (
              <div
                key={index}
                className="accordion-item-brand"
              >
                <div
                  className="accordion-header-brand"
                  onClick={() => setOpenBrandAccordion(openBrandAccordion === index ? null : index)}
                >
                  <span>{item.title}</span>
                  <ChevronDown
                    size={20}
                    className={`accordion-icon-brand ${openBrandAccordion === index ? 'open' : ''}`}
                  />
                </div>
                <div className={`accordion-content-brand ${openBrandAccordion === index ? 'open' : ''}`}>
                  <div className="accordion-content-inner-brand">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Prime Locations */}
      <section className="section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="prime-locations container"
        >
          <motion.div 
            className="prime-locations-image" 
            variants={swipeLeft}
            whileHover={{ scale: 1.02, x: 5, transition: { duration: 0.6 } }}
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            {locations.map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 100 }}
                animate={{ 
                  opacity: currentLocationIndex === index ? 1 : 0,
                  x: currentLocationIndex === index ? 0 : currentLocationIndex > index ? -100 : 100,
                  scale: currentLocationIndex === index ? 1 : 1.1
                }}
                transition={{ 
                  duration: 0.6, 
                  ease: "easeInOut",
                  delay: currentLocationIndex === index ? 0 : 0
                }}
                style={{
                  position: index === 0 ? 'relative' : 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}
              >
                <img 
                  src={location.image}
                  alt={location.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                
                {/* Gradient Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(12, 12, 12,0.7) 0%, rgba(12, 12, 12,0.3) 50%, transparent 100%)'
                }} />

                {/* Location Name */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ 
                    opacity: currentLocationIndex === index ? 1 : 0,
                    y: currentLocationIndex === index ? 0 : 30
                  }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  style={{
                    position: 'absolute',
                    bottom: '2rem',
                    left: '2rem',
                    right: '2rem',
                    color: 'white',
                    zIndex: 2
                  }}
                >
                  <h3 style={{
                    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                    fontWeight: 900,
                    marginBottom: '0.5rem',
                    textShadow: '0 4px 12px rgba(12, 12, 12,0.5)',
                    letterSpacing: '-0.5px'
                  }}>
                    {location.name}
                  </h3>
                  <div style={{
                    width: '60px',
                    height: '4px',
                    background: '#e61e25',
                    borderRadius: '2px',
                    boxShadow: '0 0 10px rgba(230, 30, 37, 0.6)'
                  }} />
                </motion.div>
              </motion.div>
            ))}
            
            {/* Location indicators */}
            <div style={{
              position: 'absolute',
              bottom: '1.5rem',
              right: '2rem',
              display: 'flex',
              gap: '0.5rem',
              zIndex: 10
            }}>
              {locations.map((_, index) => (
                <motion.div
                  key={index}
                  onClick={() => setCurrentLocationIndex(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: currentLocationIndex === index ? '2.5rem' : '0.6rem',
                    height: '0.6rem',
                    borderRadius: '0.3rem',
                    background: currentLocationIndex === index 
                      ? '#e61e25' 
                      : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: currentLocationIndex === index 
                      ? '0 0 12px rgba(230, 30, 37, 0.8)' 
                      : 'none'
                  }}
                />
              ))}
            </div>
          </motion.div>
          <motion.div 
            className="prime-locations-content" 
            variants={swipeRight}
            whileHover={{ x: -5, transition: { duration: 0.6 } }}
          >
            <h2>Right where your customers are</h2>
            <p>
              We’ve picked the best spots in high-traffic areas to make sure people see your brand. From the busiest streets in Dubai to the main hubs in Abu Dhabi, we’ve got the UAE covered.
            </p>
          </motion.div>
        </motion.div>
      </section>




      {/* We Reach Section */}
      <section className="we-reach-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="we-reach-content container"
        >
          <motion.div 
            className="we-reach-text" 
            variants={swipeLeft}
            whileHover={{ x: 5, transition: { duration: 0.6 } }}
          >
            <h2>We’re all over the city</h2>
            <p>
              With teams in Dubai, Abu Dhabi, and across the UAE, we’re ready to help you reach your customers wherever they are.
            </p>
            <Link href="/contact" className="btn btn-primary">
              Let's chat <ArrowRight size={20} />
            </Link>
          </motion.div>
          <motion.div 
            className="we-reach-image" 
            variants={swipeRight}
            whileHover={{ scale: 1.02, x: -5, transition: { duration: 0.6 } }}
          >
            <img 
              src="/images/cities_reach.png"
              alt="Cities"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Tabbed Section - Why Us, Reach, Solutions */}
      <section className="section" style={{ background: 'rgba(12, 12, 12, 0.9)', backdropFilter: 'blur(10px)', padding: 'clamp(4rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem)' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="container"
        >
          {/* Tabs */}
          <motion.div 
            variants={fadeInDown}
            className="tabs-nav-wrapper"
            style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginBottom: '3rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              width: '100%'
            }}
          >
            <div 
              onClick={() => setActiveTab('whyus')}
              className={`tabs-nav-item ${activeTab === 'whyus' ? 'active' : ''}`}
              style={{ 
                padding: '1rem 3rem', 
                background: activeTab === 'whyus' ? '#e61e25' : 'rgba(255,255,255,0.1)', 
                color: 'white', 
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
            >
              Why Us
            </div>
            <div 
              onClick={() => setActiveTab('reach')}
              className={`tabs-nav-item ${activeTab === 'reach' ? 'active' : ''}`}
              style={{ 
                padding: '1rem 3rem', 
                background: activeTab === 'reach' ? '#e61e25' : 'rgba(255,255,255,0.1)', 
                color: 'white', 
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
            >
              Reach
            </div>
            <div 
              onClick={() => setActiveTab('solutions')}
              className={`tabs-nav-item ${activeTab === 'solutions' ? 'active' : ''}`}
              style={{ 
                padding: '1rem 3rem', 
                background: activeTab === 'solutions' ? '#e61e25' : 'rgba(255,255,255,0.1)', 
                color: 'white', 
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
            >
              Solutions
            </div>
          </motion.div>

          {/* Content */}
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            className="tabs-content-grid"
            style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '4rem', 
              alignItems: 'center' 
            }}
          >
            {activeTab === 'whyus' && (
              <>
                <div>
                  <h2 style={{ 
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
                    fontWeight: 900, 
                    marginBottom: '1.5rem',
                    lineHeight: 1.2,
                    color: 'white'
                  }}>
                    Get Seen
                  </h2>
                  <p style={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: '1.1rem', 
                    lineHeight: 1.8,
                    marginBottom: '2rem'
                  }}>
                    We’re here to help you get your business in front of the right people. We design, print, and install high-quality ads that people actually notice while they're out and about. No stress, no confusion.
                  </p>
                  <Link 
                    href="/about" 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      color: 'white',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    See our story <ArrowRight size={20} />
                  </Link>
                </div>
                <div className="leaf-image-container">
                  <div className="leaf-image-wrapper">
                    <img 
                      src="/signage-branding.png"
                      alt="Built for Visibility"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'reach' && (
              <>
                <div>
                  <h2 style={{ 
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
                    fontWeight: 900, 
                    marginBottom: '1.5rem',
                    lineHeight: 1.2,
                    color: 'white'
                  }}>
                    We’ve got the UAE covered
                  </h2>
                  <p style={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: '1.1rem', 
                    lineHeight: 1.8,
                    marginBottom: '2rem'
                  }}>
                    Whether you're looking to reach people on the main streets of Dubai or in the business hubs of Abu Dhabi, we’ve got spots in all seven emirates. Your message goes exactly where it needs to be.
                  </p>
                  <Link 
                    href="/contact" 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      color: 'white',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Drop us a message <ArrowRight size={20} />
                  </Link>
                </div>
                <div className="leaf-image-container">
                  <div className="leaf-image-wrapper">
                    <img 
                      src="/about-hero-bg.png"
                      alt="Nationwide Coverage"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'solutions' && (
              <>
                <div>
                  <h2 style={{ 
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
                    fontWeight: 900, 
                    marginBottom: '1.5rem',
                    lineHeight: 1.2,
                    color: 'white'
                  }}>
                    Everything you need
                  </h2>
                  <p style={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: '1.1rem', 
                    lineHeight: 1.8,
                    marginBottom: '2rem'
                  }}>
                    From the first sketch to the final install, we handle it all. Branding, printing, vehicle wraps, and signs—we make sure your business looks professional and gets noticed.
                  </p>
                  <Link 
                    href="/services" 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      color: 'white',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    See what we can do <ArrowRight size={20} />
                  </Link>
                </div>
                <div className="leaf-image-container">
                  <div className="leaf-image-wrapper">
                    <img 
                      src="/services-hero-bg.png"
                      alt="Complete Solutions"
                    />
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* Responsive styles */}
          <style jsx>{`
            @media (max-width: 1024px) {
              div[style*="gridTemplateColumns"] {
                grid-template-columns: 1fr !important;
                gap: 2.5rem !important;
              }
            }
          `}</style>
        </motion.div>
      </section>

      {/* CTA Section with Background */}
      <section style={{ 
        position: 'relative', 
        minHeight: '70vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        overflow: 'hidden',
        backgroundImage: "url('/cta-campaign-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#111'
      }}>
        {/* Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(12, 12, 12, 0.4) 0%, rgba(12, 12, 12, 0.85) 100%)', zIndex: 1 }}></div>
        
        {/* Content */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white', padding: 'clamp(3rem, 6vw, 4rem) clamp(1.5rem, 4vw, 2rem)', maxWidth: '900px', width: '100%' }}
        >
          <motion.h2 variants={bounceInDown} style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.2 }}>
            Ready to get your brand <span style={{ fontStyle: 'italic' }}>really noticed?</span>
          </motion.h2>
          <motion.p variants={slideDown} style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '2rem', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', maxWidth: '700px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            No pressure, let's just have a quick chat about your ideas. We'll help you figure out the best way to stand out.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link href="/contact#campaign" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8rem', padding: '1rem 2.5rem', background: '#e61e25', color: 'white', fontWeight: 700, borderRadius: '8px', textDecoration: 'none', transition: 'all 0.3s ease', fontSize: '1rem', boxShadow: '0 4px 20px rgba(230,30,37,0.4)' }}>
              Let's talk <ArrowRight size={20} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </>
  );
}

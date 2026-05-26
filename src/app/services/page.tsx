"use client";

import { motion, Variants, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronDown, ArrowRight, Phone, Mail, MapPin, Check } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ServiceMap from '@/app/components/ServiceMap';
import EnquireNowModal from '@/components/EnquireNowModal';

// Default static content (used as fallback)
const DEFAULT_STATIC_SERVICES = [
  {
    title: "Branding & Corporate Identity",
    image: "/signage-branding.png",
    description: "We'll help you create a look that people remember. No more generic designs—just a brand that feels like you.",
    details: ["Professional logos", "Brand identity guides", "Office & interior branding", "Consistent look across all locations"],
    link: "/services/branding"
  },
  {
    title: "Digital Printed Graphics",
    image: "/signage-digital-print.png",
    description: "High-resolution prints that look sharp from across the street. Perfect for windows and massive banners.",
    details: ["Large format printing", "Wall & window graphics", "Privacy films", "Stickers & floor graphics", "Custom wallpaper"],
    link: "/services/digital-graphics"
  },
  {
    title: "Vehicle Graphics & Fleet Branding",
    image: "/signage-vehicle.png",
    description: "Turn your car, van, or truck into a mobile billboard. One of the best ways to get seen all over the city.",
    details: ["Full & partial wraps", "Corporate fleet branding", "Safety & reflective graphics", "Mobile advertising"],
    link: "/services/vehicle-branding"
  },
  {
    title: "Exhibition, Display & POS Solutions",
    image: "/signage-production.png",
    description: "Indoor, outdoor, or glowing neon. We use tough materials that handle the UAE sun without fading.",
    details: ["Outdoor signboards", "Indoor office signs", "3D illuminated letters", "Wayfinding signs", "Retail & mall signage"],
    link: "/services/signage"
  },
  {
    title: "Signage Production & Installation",
    image: "/signage-exhibition.png",
    description: "Exhibition booths and kiosks that make people want to walk over and say hi.",
    details: ["Custom exhibition stands", "Portable kiosks", "Pop-up backdrops", "Roll-up banners", "In-store displays"],
    link: "/services/exhibition"
  },
  {
    title: "Cladding & Facade Solutions",
    image: "/signage-cladding.png",
    description: "Give your building a fresh, modern look. Turning old storefronts into local landmarks.",
    details: ["ACP cladding", "Aluminum paneling", "Shopfront branding", "Modern architectural finishes", "Integrated signage"],
    link: "/services/cladding"
  }
];

const DEFAULT_ACCORDION = [
  { title: "You'll be seen", content: "We pick the best spots so your brand gets the most attention from people passing by." },
  { title: "All over the UAE", content: "From the busy streets of Dubai to the main hubs in Abu Dhabi, we've got you covered." },
  { title: "No waiting around", content: "We work quickly to get your campaign live so you can start seeing results sooner." },
  { title: "We handle everything", content: "From the first design to the final install, we take care of the hard work for you." }
];

const DEFAULT_WHY_POINTS = [
  { title: "Extensive Network", desc: "Access the most premium advertising locations across all of UAE." },
  { title: "Premium Quality", desc: "We use high-grade, durable materials to ensure long-lasting brand impact." },
  { title: "Strategic Precision", desc: "Data-driven placements that reach your specific target demographic." },
  { title: "Full Scale Service", desc: "From design and planning to installation and legal approvals." }
];

const cardReveal: Variants = {
  hidden: { 
    opacity: 0, 
    y: 15,
    scale: 0.99
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.03,
      delayChildren: 0.03
    }
  }
};

const services = [
  {
    title: "Branding & Corporate Identity",
    image: "/signage-branding.png",
    description: "We’ll help you create a look that people remember. No more generic designs—just a brand that feels like you.",
    details: ["Professional logos", "Brand identity guides", "Office & interior branding", "Consistent look across all locations"],
    link: "/services/branding"
  },
  {
    title: "Digital Printed Graphics",
    image: "/signage-digital-print.png",
    description: "High-resolution prints that look sharp from across the street. Perfect for windows and massive banners.",
    details: ["Large format printing", "Wall & window graphics", "Privacy films", "Stickers & floor graphics", "Custom wallpaper"],
    link: "/services/digital-graphics"
  },
  {
    title: "Vehicle Graphics & Fleet Branding",
    image: "/signage-vehicle.png",
    description: "Turn your car, van, or truck into a mobile billboard. One of the best ways to get seen all over the city.",
    details: ["Full & partial wraps", "Corporate fleet branding", "Safety & reflective graphics", "Mobile advertising"],
    link: "/services/vehicle-branding"
  },
  {
    title: "Exhibition, Display & POS Solutions",
    image: "/signage-production.png",
    description: "Indoor, outdoor, or glowing neon. We use tough materials that handle the UAE sun without fading.",
    details: ["Outdoor signboards", "Indoor office signs", "3D illuminated letters", "Wayfinding signs", "Retail & mall signage"],
    link: "/services/signage"
  },
  {
    title: "Signage Production & Installation",
    image: "/signage-exhibition.png",
    description: "Exhibition booths and kiosks that make people want to walk over and say hi.",
    details: ["Custom exhibition stands", "Portable kiosks", "Pop-up backdrops", "Roll-up banners", "In-store displays"],
    link: "/services/exhibition"
  },
  {
    title: "Cladding & Facade Solutions",
    image: "/signage-cladding.png",
    description: "Give your building a fresh, modern look. Turning old storefronts into local landmarks.",
    details: ["ACP cladding", "Aluminum paneling", "Shopfront branding", "Modern architectural finishes", "Integrated signage"],
    link: "/services/cladding"
  }
];

const accordionItems = [
  {
    title: "You'll be seen",
    content: "We pick the best spots so your brand gets the most attention from people passing by."
  },
  {
    title: "All over the UAE",
    content: "From the busy streets of Dubai to the main hubs in Abu Dhabi, we've got you covered."
  },
  {
    title: "No waiting around",
    content: "We work quickly to get your campaign live so you can start seeing results sooner."
  },
  {
    title: "We handle everything",
    content: "From the first design to the final install, we take care of the hard work for you."
  }
];

export default function ServicesPage() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [dbServices, setDbServices] = useState<any[]>([]);
  const [enquireService, setEnquireService] = useState<string | null>(null);

  // 3D Parallax Mouse Tracking
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springConfig = { damping: 20, stiffness: 100 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  const rotateX = useTransform(springY, [0, 1], [12, -12]);
  const rotateY = useTransform(springX, [0, 1], [-12, 12]);
  const bgX = useTransform(springX, [0, 1], [-20, 20]);
  const bgY = useTransform(springY, [0, 1], [-20, 20]);
  
  const handleHeroMouseMove = (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
  };

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services', { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
      if (response.ok) {
        const data = await response.json();
        const servicesList = Array.isArray(data) ? data : [];
        setDbServices(servicesList);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  // Use DB services as primary source; fall back to hardcoded only if DB is empty
  const allServices = dbServices.length > 0
    ? dbServices.filter((s: any) => s.name || s.title).map((service: any) => {
        const name = service.name || service.title;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return {
          title: name,
          image: service.image || '/services-hero-bg.png',
          description: service.description,
          details: service.items || service.details || [],
          link: `/services/${slug}`
        };
      })
    : services;

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, link: string) => {
    const card = e.currentTarget;
    
    // Create ripple effect
    const ripple = document.createElement('span');
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple-effect');
    
    card.appendChild(ripple);
    
    // Add clicked animation
    card.classList.add('clicked');
    
    // Navigate after animation
    setTimeout(() => {
      window.location.href = link;
    }, 600);
    
    setTimeout(() => {
      ripple.remove();
    }, 1000);
  };

  return (
    <>
      <style jsx global>{`

        .services-page {
          background: transparent;
          min-height: 100vh;
          color: white;
        }

        .hero-services {
          position: relative;
          height: 100vh;
          min-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 160px 1.5rem 80px;
          background-color: transparent;
          perspective: 1500px;
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
          background: linear-gradient(135deg, rgba(30,0,0,0.15) 0%, rgba(12, 12, 12,0.85) 100%);
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: white;
          max-width: 900px;
          padding: 2rem;
          margin: 0 auto;
          transform-style: preserve-3d;
          pointer-events: none;
        }

        .hero-title {
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          font-weight: 950;
          line-height: 1.05;
          margin-bottom: 1.5rem;
          letter-spacing: -2px;
          color: white;
          word-break: keep-all;
          overflow-wrap: break-word;
          transform: translateZ(100px);
          text-shadow: 0 15px 40px rgba(12, 12, 12,0.8);
        }

        .hero-title .highlight {
          color: #e61e25;
          display: inline-block;
          transform: translateZ(150px);
          text-shadow: 0 0 30px rgba(230,30,37,0.6);
        }

        .hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.3rem);
          color: rgba(255,255,255,0.95);
          max-width: 600px;
          margin: 0 auto 2rem auto;
          line-height: 1.6;
          text-shadow: 0 4px 15px rgba(12, 12, 12,0.6);
          transform: translateZ(60px);
          font-weight: 500;
        }

        .services-section {
          padding: 6rem 1.5rem;
          background: rgba(12, 12, 12, 0.8);
          backdrop-filter: blur(10px);
        }

        .section-header {
          text-align: center;
          margin-bottom: 5rem;
        }

        .section-title {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 900;
          margin-bottom: 1rem;
          color: #ffffff;
          letter-spacing: -1px;
        }

        .section-title .italic {
          font-style: italic;
          color: #e61e25;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.7);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .services-deck {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2.5rem;
          max-width: 1300px;
          margin: 4rem auto;
          padding: 0 20px;
        }

        .service-card {
          min-height: 420px;
          background: #1c222d;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.6s ease;
          position: relative;
          padding: 3rem 2.5rem;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255, 255, 255, 0.05);
          justify-content: flex-start;
          text-decoration: none;
        }

        .service-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 30px 60px rgba(230, 30, 37, 0.15);
          border-color: rgba(230, 30, 37, 0.4);
        }

        .service-title {
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 2.5rem !important;
          color: white !important;
          line-height: 1.1;
          text-align: left;
          width: 100%;
          text-shadow: 0 2px 10px rgba(12, 12, 12,0.5);
        }

        .service-title.long-title {
          font-size: 1.45rem;
        }

        .service-divider {
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.2);
          margin-bottom: 2.5rem;
        }

        .service-desc {
          font-size: 1.05rem;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
          text-align: left;
          margin-bottom: auto;
          text-shadow: 0 2px 8px rgba(12, 12, 12,0.5);
        }

        .service-scallop {
          position: absolute;
          bottom: -1px;
          right: -1px;
          width: 100px;
          height: 100px;
          background: #1c1c1c;
          border-top-left-radius: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: all 0.6s ease;
        }

        .service-number {
          font-size: 1.5rem;
          font-weight: 900;
          color: white;
          margin-top: 15px;
          margin-left: 15px;
          transition: all 0.6s ease;
        }
        
        .service-card:hover .service-scallop {
          background: #e61e25;
        }
        
        .service-card:hover .service-number {
          color: white;
        }

        .service-card.clicked {
          transform: scale(1.08);
          z-index: 50;
          box-shadow: 0 0 100px rgba(230, 30, 37, 0.4);
        }

        .ripple-effect {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          transform: scale(0);
          animation: ripple 0.8s linear;
          pointer-events: none;
          z-index: 10;
        }

        .why-choose-section {
          padding: 8rem 1.5rem;
          background: transparent;
          backdrop-filter: blur(10px);
          color: white;
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
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 900;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          color: white;
        }

        .why-choose-content p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .accordion {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .accordion-item {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
          transition: all 0.6s ease;
        }

        .accordion-item.open {
          border-color: #e61e25;
          box-shadow: 0 4px 12px rgba(230, 30, 37, 0.1);
        }

        .accordion-header {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          font-weight: 600;
          font-size: 1.1rem;
          color: white;
          transition: all 0.6s ease;
        }

        .accordion-header:hover {
          background: rgba(230, 30, 37, 0.05);
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
          color: #666;
          line-height: 1.6;
        }

        .cta-section {
          position: relative;
          padding: 10rem 2rem;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: linear-gradient(rgba(12, 12, 12,0.8), rgba(12, 12, 12,0.4)), url('/images/cities_reach.png');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          color: white;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .cta-content {
          position: relative;
          z-index: 5;
          text-align: center;
          max-width: 900px;
          padding: 4rem 1.5rem;
          width: 100%;
        }

        .cta-title {
          font-size: clamp(1.85rem, 5vw, 3.2rem);
          font-weight: 900;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .cta-subtitle {
          font-size: clamp(0.95rem, 2vw, 1.15rem);
          color: rgba(255,255,255,0.9);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1rem 2.5rem;
          background: #e61e25;
          color: white;
          font-weight: 700;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.6s ease;
          font-size: 1rem;
          box-shadow: 0 4px 15px rgba(230, 30, 37, 0.3);
        }

        .cta-button:hover {
          transform: translateY(-2px);
          background: #ff2d35;
          box-shadow: 0 8px 25px rgba(230, 30, 37, 0.4);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .why-choose-container { grid-template-columns: 1fr; gap: 3rem; }
        }

        @media (max-width: 768px) {
          .hero-services {
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
          .hero-content {
            transform: none !important;
            transform-style: flat !important;
          }
          .hero-title {
            font-size: clamp(2.2rem, 10vw, 3.2rem) !important;
            letter-spacing: -1px !important;
            margin-bottom: 1rem !important;
            transform: none !important;
          }
          .hero-title .highlight {
            transform: none !important;
          }
          .hero-subtitle {
            font-size: 1rem !important;
            padding: 0 !important;
            margin-bottom: 1.5rem !important;
            transform: none !important;
          }

          .services-deck {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 0 1rem;
            margin: 2.5rem auto;
          }

          .service-card {
            min-height: 280px;
            height: auto;
            padding: 2.5rem 2rem;
          }

          .service-title {
            font-size: 1.4rem;
          }

          .why-choose-section {
            padding: 3rem 1rem 4rem 1rem;
          }

          .why-choose-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .why-choose-content h2 {
            font-size: 2.2rem;
            text-align: left;
          }

          .why-choose-content p {
            text-align: left;
          }
        }

        @media (max-width: 480px) {
          .hero-services {
            height: 100svh !important;
            height: 100vh !important;
            min-height: unset !important;
            padding: 100px 1rem 40px !important;
          }
          .hero-title {
            font-size: clamp(2rem, 10vw, 2.5rem);
            line-height: 1.2;
          }

          .service-card {
            padding: 2rem 1.5rem;
          }

          .service-title {
            font-size: 1.3rem;
          }
        }

      `}</style>

      {enquireService && (
        <EnquireNowModal
          serviceName={enquireService}
          source="services-page"
          onClose={() => setEnquireService(null)}
        />
      )}

      <div className="services-page">
        {/* Hero Section */}
        <section className="hero-services" onMouseMove={handleHeroMouseMove}>
          <motion.div 
            className="hero-background"
            style={{ x: bgX, y: bgY }}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.0, ease: "easeOut" }}
          >
            <img 
              src="/signage-production.png" 
              alt="Services Background" 
            />
          </motion.div>
          <div className="hero-overlay"></div>

          <motion.div 
            className="hero-content"
            style={{ rotateX, rotateY }}
            initial={{ opacity: 0, rotateX: 20, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            transition={{ duration: 1.4, type: "spring", bounce: 0.3 }}
          >
            <motion.h1 
              className="hero-title" 
              initial={{ z: -150, rotateY: -15, opacity: 0 }}
              animate={{ z: 0, rotateY: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.4, type: "spring", bounce: 0.4 }}
            >
              Get Noticed <br />
              Every<motion.span 
                className="highlight"
                animate={{ 
                    textShadow: [
                        "0px 0px 10px rgba(230,30,37,0.5)",
                        "0px 0px 40px rgba(230,30,37,1)",
                        "0px 0px 10px rgba(230,30,37,0.5)"
                    ]
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >where</motion.span>
            </motion.h1>
            <motion.p 
              className="hero-subtitle" 
              initial={{ opacity: 0, y: 30, z: -50 }}
              animate={{ opacity: 1, y: 0, z: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              We’re here to help you get your business in front of the right people. No stress, no confusion—just high-quality ads that work.
            </motion.p>
          </motion.div>
        </section>

        {/* Our Services Section */}
        <section className="services-section">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="section-header" variants={cardReveal}>
              <h2 className="section-title">
                What we <span className="italic">do</span>
              </h2>
              <p className="section-subtitle">
                Everything you need to make your business look its best.
              </p>
            </motion.div>

            <div className="services-deck">
              {allServices.map((service, index) => {
                const total = allServices.length;
                const offset = index - (total - 1) / 2;
                const absOffset = Math.abs(offset);
                const zIndex = 50 - Math.floor(absOffset * 10);
                
                return (
                <motion.div
                  key={index}
                  className="service-card"
                  onClick={(e) => handleCardClick(e, service.link)}
                  initial={{ 
                    opacity: 0, 
                    y: 15,
                    scale: 0.99
                  }}
                  whileInView={{ 
                    opacity: 1, 
                    y: 0,
                    scale: 1
                  }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.03,
                    ease: "easeOut"
                  }}
                  style={{
                    backgroundImage: `linear-gradient(rgba(12, 12, 12,0.6), rgba(12, 12, 12,0.85)), url(${service.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <h3 className={`service-title ${service.title.length > 25 ? 'long-title' : ''}`}>
                    {service.title.includes('&') ? (
                      service.title === "Signage Production & Installation" ? (
                        <>
                          <span style={{ color: 'white' }}>Signage Production</span>
                          <span style={{ color: '#e61e25' }}> & </span>
                          <span style={{ color: 'white' }}>Installation</span>
                        </>
                      ) : (
                        <>
                          <span style={{ color: 'white' }}>{service.title.split('&')[0].trim()}</span>
                          <span style={{ color: '#e61e25' }}> & </span>
                          <span style={{ color: 'white' }}>{service.title.split('&')[1].trim()}</span>
                        </>
                      )
                    ) : (
                      service.title
                    )}
                  </h3>
                  
                  <div className="service-divider"></div>

                  <p className="service-desc">{service.description}</p>

                  <button
                    onClick={(e) => { e.stopPropagation(); setEnquireService(service.title); }}
                    style={{
                      alignSelf: 'flex-start',
                      marginBottom: '3.5rem',
                      padding: '0.65rem 1.5rem',
                      background: '#e61e25',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontFamily: 'inherit',
                      zIndex: 20,
                      position: 'relative',
                      boxShadow: '0 4px 14px rgba(230, 30, 37, 0.35)',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#ff2d35'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(230, 30, 37, 0.55)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#e61e25'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(230, 30, 37, 0.35)'; }}
                  >
                    Enquire Now
                  </button>

                  <div className="service-scallop">
                    <div className="service-number">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                </motion.div>
              )})}
            </div>
          </motion.div>
        </section>

        {/* Why Choose One Click Section */}
        <section className="why-choose-section">
          <motion.div
            className="why-choose-container"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.4, delayChildren: 0.3 }}
          >
            <motion.div className="why-choose-content" 
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                Why Choose{' '}
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="40" height="40" viewBox="0 0 40 40" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                    <circle cx="20" cy="20" r="17" fill="none" stroke="white" strokeWidth="4"/>
                    <rect x="23" y="3" width="13" height="13" fill="#e61e25" rx="1"/>
                  </svg>
                  <span style={{ color: 'white' }}>ne Click</span>
                </span>
              </h2>
              <p style={{ marginBottom: '2.5rem' }}>
                As the leader in outdoor advertising, we deliver measurable results through strategic placements and creative excellence.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  { title: "Extensive Network", desc: "Access the most premium advertising locations across all of UAE." },
                  { title: "Premium Quality", desc: "We use high-grade, durable materials to ensure long-lasting brand impact." },
                  { title: "Strategic Precision", desc: "Data-driven placements that reach your specific target demographic." },
                  { title: "Full Scale Service", desc: "From design and planning to installation and legal approvals." }
                ].map((point, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -50, scale: 0.9 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 1.0,
                      delay: i * 0.15,
                      ease: "easeOut"
                    }}
                    style={{ 
                      display: 'flex', 
                      gap: '1.2rem', 
                      alignItems: 'flex-start',
                      background: 'rgba(255,255,255,0.03)',
                      padding: '1.2rem',
                      borderRadius: '12px',
                      borderLeft: '4px solid #e61e25'
                    }}
                  >
                    <div style={{ 
                      minWidth: '10px', 
                      height: '10px', 
                      borderRadius: '50%', 
                      background: '#e61e25', 
                      marginTop: '6px' 
                    }}></div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem', color: 'white' }}>{point.title}</div>
                      <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.4' }}>{point.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div className="accordion" 
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            >
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
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <motion.div 
            className="cta-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 className="cta-title" variants={cardReveal}>
              Ready to make your brand <span className="italic">impossible to ignore?</span>
            </motion.h2>
            <motion.p className="cta-subtitle" variants={cardReveal}>
              Launch your advertising campaign with high-impact placements across prime locations - fast, simple, and effective.
            </motion.p>
            <motion.div variants={cardReveal}>
              <Link href="/contact#campaign" className="cta-button">
                Get started <ArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </section>

      </div>
    </>
  );
}

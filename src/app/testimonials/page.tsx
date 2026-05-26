"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const categories = [
  'Brand Identity',
  'Digital Printing',
  'Vehicle Branding',
  'Display Solutions',
  'Signage',
  'Facade & Cladding'
] as const;

type CategoryKey = typeof categories[number];

const projectsByCategory: Record<CategoryKey, {
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  images: { title: string; image: string; tag: string }[];
}> = {
  'Brand Identity': {
    title: 'Brand',
    subtitle: 'Identity',
    description: 'Explore our branding projects featuring logo applications, interior branding, and complete identity systems designed to create strong, consistent, and memorable brand experiences.',
    accent: '#2c4a5e',
    images: [
      { title: 'DIOR Luxury Billboard', tag: 'Luxury', image: '/projects-hero-bg.png' },
      { title: 'Times Square LED Display', tag: 'LED', image: '/services-hero-bg.png' },
      { title: 'Corporate Branding', tag: 'Corporate', image: '/about-hero-bg.png' },
      { title: 'Brand Launch Campaign', tag: 'Campaign', image: '/signage-branding.png' }
    ]
  },
  'Digital Printing': {
    title: 'Digital',
    subtitle: 'Printing',
    description: 'High-resolution digital print solutions for banners, posters, window graphics, and large-format displays that bring your brand visuals to life with vibrant, lasting quality.',
    accent: '#e61e25',
    images: [
      { title: 'Large Format Banner', tag: 'Banner', image: '/signage-digital-print.png' },
      { title: 'Window Graphics', tag: 'Window', image: '/signage-exhibition.png' },
      { title: 'Exhibition Panels', tag: 'Exhibition', image: '/about-hero-bg.png' },
      { title: 'Retail Poster Display', tag: 'Retail', image: '/services-hero-bg.png' }
    ]
  },
  'Vehicle Branding': {
    title: 'Vehicle',
    subtitle: 'Branding',
    description: 'Mobile advertising solutions that turn every vehicle into a powerful marketing tool. Reach thousands of potential customers daily with eye-catching fleet wraps and luxury vinyl graphics.',
    accent: '#1a8a6a',
    images: [
      { title: 'Fleet Full Wrap', tag: 'Fleet', image: '/signage-vehicle.png' },
      { title: 'Delivery Van Branding', tag: 'Van', image: '/home-hero-bg.png' },
      { title: 'Bus Advertisement', tag: 'Transit', image: '/cta-bg-premium.png' },
      { title: 'Sports Car Wrap', tag: 'Luxury', image: '/signage-branding.png' }
    ]
  },
  'Display Solutions': {
    title: 'Display',
    subtitle: 'Solutions',
    description: 'Innovative display solutions including LED screens, digital kiosks, interactive displays, and POS materials that capture attention and engage customers at point of purchase.',
    accent: '#7c3aed',
    images: [
      { title: 'LED Video Wall', tag: 'LED', image: '/services-hero-bg.png' },
      { title: 'Interactive Kiosk', tag: 'Interactive', image: '/signage-branding.png' },
      { title: 'Retail POS Display', tag: 'POS', image: '/signage-exhibition.png' },
      { title: 'Exhibition Booth', tag: 'Exhibition', image: '/home-hero-bg.png' }
    ]
  },
  'Signage': {
    title: 'Premium',
    subtitle: 'Signage',
    description: 'From illuminated signs to laser-cut lettering, our signage solutions combine precision engineering with stunning aesthetics, ensuring your brand stands out day and night.',
    accent: '#d97706',
    images: [
      { title: 'Illuminated Channel Letters', tag: 'Illuminated', image: '/signage-production.png' },
      { title: 'Wayfinding System', tag: 'Wayfinding', image: '/projects-hero-bg.png' },
      { title: 'Office Signage', tag: 'Office', image: '/signage-cladding.png' },
      { title: 'Outdoor Pylon', tag: 'Outdoor', image: '/about-hero-bg.png' }
    ]
  },
  'Facade & Cladding': {
    title: 'Facade &',
    subtitle: 'Cladding',
    description: 'Transform building exteriors with premium cladding and facade graphics that communicate brand authority at an architectural scale—ideal for commercial towers and retail hubs.',
    accent: '#0e7490',
    images: [
      { title: 'Commercial Tower Wrap', tag: 'Tower', image: '/signage-cladding.png' },
      { title: 'Mall Facade Graphics', tag: 'Mall', image: '/projects-hero-bg.png' },
      { title: 'Hotel Exterior Branding', tag: 'Hotel', image: '/services-hero-bg.png' },
      { title: 'Retail Park Cladding', tag: 'Retail', image: '/signage-branding.png' }
    ]
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: 'easeOut' as const } }
};

interface AdminProject {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  clientName?: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('Brand Identity');
  const [hoveredImg, setHoveredImg] = useState<number | null>(null);
  const [adminProjects, setAdminProjects] = useState<AdminProject[]>([]);
  const current = projectsByCategory[activeCategory];

  useEffect(() => {
    // Immediately load cached projects from localStorage for instant rendering
    try {
      const cached = localStorage.getItem('cachedAdminProjects');
      if (cached) {
        setAdminProjects(JSON.parse(cached));
      }
    } catch {}
    // Then fetch fresh data from API
    const fetchProjects = async () => {
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/projects?t=${timestamp}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
        });
        if (response.ok) {
          const data = await response.json();
          const list: AdminProject[] = Array.isArray(data.projects) ? data.projects : [];
          setAdminProjects(list);
          try { localStorage.setItem('cachedAdminProjects', JSON.stringify(list)); } catch {}
        }
      } catch (error) {
        console.error('Error fetching admin projects:', error);
      }
    };
    fetchProjects();
  }, []);


  return (
    <>
      <style jsx global>{`
        * { scrollbar-width: none; -ms-overflow-style: none; }
        *::-webkit-scrollbar { display: none; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }

        @media (max-width: 768px) {
          /* Hero */
          section[style*="height: 100vh"] {
            padding-top: 80px !important;
          }

          /* Category tabs */
          div[style*="staggerChildren"] > div {
            justify-content: flex-start;
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 0.5rem;
          }

          /* Split layout: stack vertically */
          div[style*="gridTemplateColumns: '1fr 1.6fr'"] {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }

          /* Image grid: 1 column on mobile */
          div[style*="gridTemplateColumns: 'repeat(2,1fr)'"] {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }

          /* Admin projects grid: 1 column */
          div[style*="repeat(auto-fill, minmax(320px, 1fr))"] {
            grid-template-columns: 1fr !important;
            gap: 1.2rem !important;
          }

          /* Sticky panel: remove sticky on mobile */
          div[style*="position: 'sticky'"] {
            position: relative !important;
            top: auto !important;
          }

          /* Headings */
          h1[style*="clamp(3rem"] {
            font-size: 2.5rem !important;
            letter-spacing: -1px !important;
          }

          h2[style*="clamp(2.5rem"] {
            font-size: 2rem !important;
          }

          h3[style*="font-size: '3rem'"] {
            font-size: 2rem !important;
          }

          /* CTA section */
          section[style*="padding: '6rem 2rem'"] {
            padding: 4rem 1.5rem !important;
          }

          /* Footer */
          footer {
            padding: 4rem 1.5rem 3rem !important;
          }
        }

        @media (max-width: 480px) {
          h1[style*="clamp(3rem"] {
            font-size: 2rem !important;
          }

          h2[style*="clamp(2.5rem"] {
            font-size: 1.8rem !important;
          }
        }
      `}</style>

      <div style={{ background: '#f4f4f0', minHeight: '100vh' }}>

        {/* ─── Hero ─── */}
        <section style={{ position: 'relative', height: '100vh', minHeight: 600, overflow: 'hidden', paddingTop: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="/signage-exhibition.png"
            alt="Impact Portfolio"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5) contrast(1.1)' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(26,58,82,0.4) 0%, rgba(12, 12, 12,0.1) 100%)' }} />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' as const }}
            style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '2rem', maxWidth: 900 }}
          >
            {/* Removed Our Portfolio Badge */}
            <h1 style={{ fontSize: 'clamp(3rem,8vw,5.5rem)', fontWeight: 900, color: 'white', lineHeight: 1.05, letterSpacing: '-2px', margin: '0 0 1rem' }}>
              Campaigns That<br />
              <span style={{ color: '#e61e25' }}>Make an Impact</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
              Explore real-world advertising campaigns crafted to maximize visibility, attract attention, and deliver strong brand impact across prime locations.
            </p>
          </motion.div>
        </section>

        {/* ─── Projects Section ─── */}
        <section style={{ maxWidth: 1400, margin: '0 auto', padding: '5rem 2rem' }}>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '3.5rem' }}
          >
            <h2 style={{ fontSize: 'clamp(2.5rem,5vw,3.5rem)', fontWeight: 900, color: '#1c1c1c', lineHeight: 1.1, margin: '0 0 1rem' }}>
              Our <em style={{ fontStyle: 'italic', color: '#888', fontWeight: 400 }}>Projects</em>
            </h2>
            <p style={{ color: '#777', fontSize: '1rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.8 }}>
              Explore real-world advertising campaigns crafted to maximize visibility, attract attention, and deliver strong brand impact across prime locations.
            </p>
          </motion.div>

          {/* Tab Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}
          >
            {categories.map((cat) => {
              const isActive = cat === activeCategory;
              return (
                <motion.button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '0.65rem 1.5rem',
                    borderRadius: 50,
                    border: isActive ? `2px solid ${projectsByCategory[cat].accent}` : '2px solid #ddd',
                    background: isActive ? projectsByCategory[cat].accent : 'white',
                    color: isActive ? 'white' : '#444',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: isActive ? `0 4px 16px ${projectsByCategory[cat].accent}40` : 'none'
                  }}
                >
                  {cat}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Split Layout */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.0, ease: 'easeOut' as const }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '3rem', alignItems: 'start' }}
            >
              {/* Left Info Panel */}
              <motion.div
                style={{
                  background: 'white',
                  borderRadius: 24,
                  padding: '3rem',
                  boxShadow: '0 4px 30px rgba(12, 12, 12,0.08)',
                  position: 'sticky',
                  top: 120,
                  borderTop: `5px solid ${current.accent}`
                }}
              >
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'inline-block', background: `${current.accent}18`, color: current.accent, padding: '0.3rem 0.9rem', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '1rem' }}>
                    {activeCategory}
                  </div>
                  <h3 style={{ fontSize: '3rem', fontWeight: 900, color: '#1c1c1c', lineHeight: 1.1, margin: 0 }}>
                    {current.title}<br />
                    <span style={{ color: current.accent }}>{current.subtitle}</span>
                  </h3>
                </div>
                <p style={{ color: '#666', lineHeight: 1.85, fontSize: '1rem', marginBottom: '2rem' }}>
                  {current.description}
                </p>

              </motion.div>

              {/* Right Image Grid */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.25rem' }}
              >
                {current.images.map((img, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    onHoverStart={() => setHoveredImg(i)}
                    onHoverEnd={() => setHoveredImg(null)}
                    whileHover={{ y: -8, boxShadow: '0 24px 50px rgba(12, 12, 12,0.18)' }}
                    style={{
                      position: 'relative',
                      height: i === 0 ? 340 : 260,
                      borderRadius: 20,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(12, 12, 12,0.1)'
                    }}
                  >
                    <motion.img
                      src={img.image}
                      alt={img.title}
                      animate={{ scale: hoveredImg === i ? 1.08 : 1 }}
                      transition={{ duration: 1.0, ease: 'easeOut' as const }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    {/* Gradient overlay */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12, 12, 12,0.75) 0%, rgba(12, 12, 12,0.1) 55%, transparent 100%)' }} />

                    {/* Tag badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: hoveredImg === i ? 1 : 0.9, scale: 1 }}
                      style={{
                        position: 'absolute', top: '1rem', left: '1rem',
                        background: `${current.accent}e0`, color: 'white',
                        padding: '0.3rem 0.7rem', borderRadius: 50,
                        fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.5px'
                      }}
                    >
                      {img.tag}
                    </motion.div>

                    {/* Open icon */}
                    <motion.div
                      animate={{ opacity: hoveredImg === i ? 1 : 0, y: hoveredImg === i ? 0 : 10 }}
                      transition={{ duration: 0.6 }}
                      style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'white', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <ArrowUpRight size={18} color="#1c1c1c" />
                    </motion.div>

                    {/* Title */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem' }}>
                      <motion.div
                        animate={{ y: hoveredImg === i ? 0 : 4 }}
                        transition={{ duration: 0.6 }}
                        style={{ fontWeight: 700, fontSize: '1rem', color: 'white', lineHeight: 1.3 }}
                      >
                        {img.title}
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ─── Admin Projects Section ─── */}
        {adminProjects.length > 0 && (
          <section style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem 2rem 5rem 2rem' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: '3.5rem' }}
            >
              <h2 style={{ fontSize: 'clamp(2.5rem,5vw,3.5rem)', fontWeight: 900, color: '#1c1c1c', lineHeight: 1.1, margin: '0 0 1rem' }}>
                Our <em style={{ fontStyle: 'italic', color: '#888', fontWeight: 400 }}>Work</em>
              </h2>
              <p style={{ color: '#777', fontSize: '1rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.8 }}>
                A showcase of projects delivered by our team across the UAE.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}
            >
              {adminProjects.map((project, i) => (
                <motion.div
                  key={project.id || i}
                  variants={itemVariants}
                  whileHover={{ y: -8, boxShadow: '0 24px 50px rgba(12, 12, 12,0.15)' }}
                  style={{
                    background: 'white',
                    borderRadius: 20,
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(12, 12, 12,0.08)',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.3s ease'
                  }}
                >
                  {/* Image */}
                  <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                    <img
                      src={project.image || '/projects-hero-bg.png'}
                      alt={project.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12, 12, 12,0.5) 0%, transparent 60%)' }} />
                    {/* Category badge */}
                    <div style={{
                      position: 'absolute', top: '1rem', left: '1rem',
                      background: '#e61e25', color: 'white',
                      padding: '0.3rem 0.8rem', borderRadius: 50,
                      fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.5px'
                    }}>
                      {project.category}
                    </div>
                  </div>
                  {/* Content */}
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1c1c1c', margin: '0 0 0.5rem' }}>
                      {project.title}
                    </h3>
                    <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.7, margin: '0 0 1rem' }}>
                      {project.description}
                    </p>
                    {project.clientName && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e61e2520', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#e61e25' }}>
                          {project.clientName.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: 600 }}>{project.clientName}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* ─── CTA Banner ─── */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ position: 'relative', padding: '6rem 2rem', overflow: 'hidden', textAlign: 'center', color: 'white' }}
        >
          <img
            src="/cta-bg-premium.png"
            alt="CTA"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.25)' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(26,58,82,0.7) 0%, rgba(255,107,53,0.3) 100%)' }} />
          <div style={{ position: 'relative', zIndex: 2, maxWidth: 800, margin: '0 auto' }}>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.15 }}
            >
              Ready to Build Your <span style={{ color: '#e61e25' }}>Next Campaign?</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem', lineHeight: 1.7 }}
            >
              A strategically placed outdoor campaign built to maximize visibility, attract attention, and deliver a strong brand impact across prime commercial locations.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <Link href="/contact" style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.7rem', padding: '1rem 2.5rem', background: '#e61e25', color: 'white', fontWeight: 700, borderRadius: 50, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 8px 24px rgba(255,107,53,0.4)' }}
                >
                  Start a Campaign <ArrowRight size={20} />
                </motion.div>
              </Link>
              <Link href="/contact" style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.7rem', padding: '1rem 2.5rem', background: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 700, borderRadius: 50, fontSize: '1rem', cursor: 'pointer', border: '2px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)' }}
                >
                  Get in Touch
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        
      </div>
    </>
  );
}

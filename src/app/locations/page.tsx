"use client";

import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Building2, Globe } from 'lucide-react';
import Link from 'next/link';

const locations = [
  {
    city: "Dubai",
    region: "Headquarters",
    description: "The heart of innovation and premium outdoor advertising. Controlling prime spots across Sheikh Zayed Road and Downtown.",
    image: "/projects-hero-bg.png"
  },
  {
    city: "Abu Dhabi",
    region: "Capital Presence",
    description: "Strategic placement across the capital's busiest commercial hubs and government districts.",
    image: "/services-hero-bg.png"
  },
  {
    city: "Sharjah",
    region: "Cultural Hub",
    description: "High-traffic billboards and digital displays connecting the northern emirates with the cultural heart of Sharjah.",
    image: "/about-hero-bg.png"
  },
  {
    city: "Ajman & Northern Emirates",
    region: "Strategic Reach",
    description: "Comprehensive coverage across Ajman, UAQ, RAK, and Fujairah for total UAE market dominance.",
    image: "/home-hero-bg.png"
  }
];

export default function LocationsPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ 
        position: 'relative',
        padding: '10rem 2rem 6rem', 
        textAlign: 'center', 
        background: '#121212',
        overflow: 'hidden',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img 
            src="/cta-bg-premium.png" 
            alt="UAE Network" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35) contrast(1.1)' }} 
          />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(30,0,0,0.2) 0%, rgba(12, 12, 12,0.85) 100%)', zIndex: 1 }} />
        
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeInUp} 
          style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2 }}
        >
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: 'white', 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            letterSpacing: '2px', 
            fontSize: '0.85rem', 
            marginBottom: '1.5rem',
            background: 'rgba(230, 30, 37, 0.2)',
            padding: '0.6rem 1.5rem',
            borderRadius: '50px',
            border: '1px solid rgba(230, 30, 37, 0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <MapPin size={16} color="#e61e25" /> Our UAE Network
          </div>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 8vw, 5rem)', 
            fontWeight: 950, 
            letterSpacing: '-2px', 
            marginBottom: '1.5rem', 
            color: 'white',
            lineHeight: 1,
            textShadow: '0 10px 30px rgba(12, 12, 12,0.5)'
          }}>
            Strategic <span style={{ color: '#e61e25' }}>Locations</span>
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: 'rgba(255,255,255,0.9)', 
            lineHeight: 1.6,
            fontWeight: 500,
            textShadow: '0 2px 10px rgba(12, 12, 12,0.3)'
          }}>
            Command attention in the UAE's most high-traffic locations. From iconic landmarks to busy commercial arteries, we put your brand where the world is watching.
          </p>
        </motion.div>
      </section>

      {/* Grid */}
      <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '6rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {locations.map((loc, index) => (
            <motion.div
              key={loc.city}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(12, 12, 12,0.05)', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                <img src={loc.image} alt={loc.city} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '0.4rem 0.8rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700, color: '#1c1c1c' }}>
                  {loc.region}
                </div>
              </div>
              <div style={{ padding: '2rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem', color: '#1c1c1c' }}>{loc.city}</h3>
                <p style={{ color: '#666', lineHeight: 1.7, fontSize: '1rem', marginBottom: '2rem', flexGrow: 1 }}>{loc.description}</p>
                <Link href="/contact" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e61e25', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem' }}>
                  Inquire Now <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Stats */}
      <section style={{ background: '#111', color: 'white', padding: '8rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '4rem' }}>Maximum Market Dominance</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
            <div>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#e61e25' }}>500+</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Prime UAE Spots</div>
            </div>
            <div>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#e61e25' }}>10M+</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Weekly Impressions</div>
            </div>
            <div>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#e61e25' }}>7/7</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Emirates Coverage</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

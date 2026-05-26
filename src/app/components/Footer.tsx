"use client";

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { useState, useEffect } from 'react';
import Logo from './Logo';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [siteContact, setSiteContact] = useState({ email: 'hello@oneclickadv.ae', phone: '+971 52 406 5110', location: 'Dubai, United Arab Emirates' });

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setSiteContact({
              email: data.email || siteContact.email,
              phone: data.phone || siteContact.phone,
              location: data.location || siteContact.location
            });
          }
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  return (
    <footer style={{ background: '#121212', color: 'white', padding: '100px 40px 60px 40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '60px', marginBottom: '80px' }}>
          {/* Services Column */}
          <div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2.5rem', color: 'white', letterSpacing: '-0.5px' }}>Services</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <li><Link href="/services" style={{ color: '#888', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.3s' }}>Branding & Corporate Identity</Link></li>
              <li><Link href="/services" style={{ color: '#888', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.3s' }}>Digital Printed Graphics</Link></li>
              <li><Link href="/services" style={{ color: '#888', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.3s' }}>Vehicle Graphics & Fleet Branding</Link></li>
              <li><Link href="/services" style={{ color: '#888', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.3s' }}>Exhibition, Display & POS Solutions</Link></li>
              <li><Link href="/services" style={{ color: '#888', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.3s' }}>Signage Production & Installation</Link></li>
              <li><Link href="/services" style={{ color: '#888', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.3s' }}>Cladding & Facade Solutions</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2.5rem', color: 'white', letterSpacing: '-0.5px' }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <li><Link href="/about" style={{ color: '#888', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.3s' }}>About</Link></li>
              <li><Link href="/projects" style={{ color: '#888', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.3s' }}>Projects</Link></li>
              <li><Link href="/locations" style={{ color: '#888', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.3s' }}>Locations</Link></li>
              <li><Link href="/contact" style={{ color: '#888', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.3s' }}>Contact</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2.5rem', color: 'white', letterSpacing: '-0.5px' }}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <li><Link href="/how-it-works" style={{ color: '#888', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.3s' }}>How it Works</Link></li>
              <li><Link href="/faq" style={{ color: '#888', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.3s' }}>FAQs</Link></li>
              <li><Link href="/terms" style={{ color: '#888', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.3s' }}>Terms & Conditions</Link></li>
              <li><Link href="/privacy" style={{ color: '#888', textDecoration: 'none', fontSize: '1rem', transition: 'color 0.3s' }}>Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Connect with us Column */}
          <div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2.5rem', color: 'white', letterSpacing: '-0.5px' }}>Connect with us</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Phone size={18} style={{ color: '#888' }} />
                <a href={`tel:${siteContact.phone.replace(/\s+/g, '')}`} style={{ color: 'white', textDecoration: 'none', fontSize: '1rem', fontWeight: 500 }}>{siteContact.phone}</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Mail size={18} style={{ color: '#888' }} />
                <a href={`mailto:${siteContact.email}`} style={{ color: 'white', textDecoration: 'none', fontSize: '1rem', fontWeight: 500 }}>{siteContact.email}</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginTop: '0.5rem' }}>
                <a href="https://www.facebook.com/oneclickadvertisement/" target="_blank" rel="noopener noreferrer" style={{ color: '#888', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#e61e25'} onMouseOut={(e) => e.currentTarget.style.color = '#888'} aria-label="Facebook">
                  <Facebook size={22} />
                </a>
                <a href="https://www.instagram.com/oneclick_advertisement?igsh=NzNwaGo2b2VwbDNh" target="_blank" rel="noopener noreferrer" style={{ color: '#888', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#e61e25'} onMouseOut={(e) => e.currentTarget.style.color = '#888'} aria-label="Instagram">
                  <Instagram size={22} />
                </a>
                <a href="#" style={{ color: '#888', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#e61e25'} onMouseOut={(e) => e.currentTarget.style.color = '#888'} aria-label="LinkedIn">
                  <Linkedin size={22} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '40px', textAlign: 'center', color: '#666', fontSize: '0.9rem', fontWeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Logo size="medium" showFullText={true} />
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', letterSpacing: '0.5px', textTransform: 'uppercase', marginTop: '8px' }}>
              Advertisement LLC
            </div>
          </Link>
          <span suppressHydrationWarning>&copy; {currentYear || new Date().getFullYear()} One Click Advertisement LLC. All rights reserved.</span>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          footer { padding: 60px 20px 40px 20px !important; }
          div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 640px) {
          div[style*="grid-template-columns: repeat(2, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}

"use client";

import Link from 'next/link';
import { Mail, Facebook, Instagram, Linkedin, Edit2 } from 'lucide-react';
import Logo from '../../components/Logo';

export default function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ 
      marginTop: '8rem', 
      padding: '5rem 0 3rem 0', 
      background: '#111111', 
      borderTop: '1px solid rgba(255,255,255,0.05)', 
      color: 'white',
      width: '100%',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '4rem', 
          marginBottom: '5rem' 
        }}>
          {/* Logo Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Logo size="small" showFullText={true} />
            </Link>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '280px' }}>
              Premium advertising and outdoor media solutions across the UAE. Excellence in every impression.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.5rem' }}>
              <a href="https://www.facebook.com/oneclickadvertisement/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)', transition: 'all 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#e61e25'} onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'} aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/oneclick_advertisement?igsh=NzNwaGo2b2VwbDNh" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)', transition: 'all 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#e61e25'} onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'} aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.4)', transition: 'all 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color = '#e61e25'} onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'} aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '2.5rem', color: 'white', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Navigation</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <li><Link href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'all 0.3s' }} className="footer-link">Home</Link></li>
              <li><Link href="/projects" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'all 0.3s' }} className="footer-link">Projects</Link></li>
              <li><Link href="/services" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'all 0.3s' }} className="footer-link">Services</Link></li>
              <li><Link href="/contact" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'all 0.3s' }} className="footer-link">Contact</Link></li>
              <li><Link href="/about" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'all 0.3s' }} className="footer-link">About Us</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '2.5rem', color: 'white', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Admin Settings</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div 
                onClick={() => window.location.href = '/admin/settings'}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1.2rem', 
                  padding: '1.5rem',
                  background: 'rgba(230, 30, 37, 0.03)',
                  border: '1px solid rgba(230, 30, 37, 0.15)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                className="admin-footer-cta"
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(230, 30, 37, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(230, 30, 37, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(230, 30, 37, 0.03)';
                  e.currentTarget.style.borderColor = 'rgba(230, 30, 37, 0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e61e25', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 16px rgba(230, 30, 37, 0.25)' }}>
                  <Edit2 size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'white', marginBottom: '2px' }}>Edit Contact Details</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>Update global phone, email, and locations</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.05)', 
          paddingTop: '3rem', 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          color: 'rgba(255,255,255,0.3)', 
          fontSize: '0.85rem' 
        }}>
          <p>&copy; {currentYear} One Click Advertisement LLC. All Rights Reserved.</p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link href="/privacy" style={{ transition: 'color 0.3s' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ transition: 'color 0.3s' }}>Terms of Service</Link>
          </div>
        </div>
      </div>
      <style jsx>{`
        .footer-link:hover {
          color: #e61e25 !important;
          padding-left: 5px;
        }
        .footer-link {
          display: inline-block;
        }
      `}</style>
    </footer>
  );
}

"use client";

import styles from './Navbar.module.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Check if logged in as admin
    if (typeof window !== 'undefined') {
      setIsAdmin(localStorage.getItem('adminAuth') === 'true');
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* ===== NAVBAR WRAPPER — Always fixed, always on top ===== */}
      <div
        style={{
          position: 'fixed',
          top: 8,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 99999,
          display: 'flex',
          justifyContent: 'center',
          padding: 'clamp(6px, 1.5vw, 12px) 16px',
          pointerEvents: 'none',
        }}
      >
        <nav
          style={{
            width: '100%',
            maxWidth: '1200px',
            background: 'rgba(8, 8, 8, 0.96)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(12, 12, 12,0.4)',
            pointerEvents: 'all',
            position: 'relative',
            zIndex: 99999,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'clamp(5px, 1vw, 8px) clamp(12px, 2vw, 24px)',
            }}
          >
            {/* Logo */}
            <Link href="/" className={styles.navbarLogo} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Logo size="small" showFullText={true} />
            </Link>
            {/* Desktop Nav Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className={styles.desktopNav}>
              <Link href="/" className={styles.navLink}>Home</Link>
              <Link href="/projects" className={styles.navLink}>Projects</Link>
              <Link href="/services" className={styles.navLink}>Services</Link>
              <Link href="/contact" className={styles.navLink}>Contact</Link>
              <Link href="/about" className={styles.navLink}>About</Link>
            </div>

            {/* Desktop Login Button */}
            <div className={styles.desktopNav}>
              {isAdmin ? (
                <Link href="/admin" className={styles.btnLogin} style={{ padding: '8px 20px', fontSize: '0.85rem', background: '#e61e25', borderColor: '#e61e25' }}>Admin Portal</Link>
              ) : (
                <Link href="/admin/login" className={styles.btnLogin} style={{ padding: '8px 20px', fontSize: '0.85rem' }}>Login</Link>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle Menu"
              className={styles.mobileToggle}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '8px',
                zIndex: 999999,
                position: 'relative',
              }}
            >
              {isMobileMenuOpen ? <X size={26} color="white" /> : <Menu size={26} color="white" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        style={{
          position: 'fixed',
          top: isMobileMenuOpen ? '80px' : '-400px',
          left: '16px',
          right: '16px',
          background: 'rgba(22, 22, 22, 0.98)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '1.5rem',
          zIndex: 99998,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          boxShadow: '0 20px 60px rgba(12, 12, 12,0.6)',
          transition: 'top 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: isMobileMenuOpen ? 1 : 0,
          pointerEvents: isMobileMenuOpen ? 'all' : 'none',
        }}
      >
        <Link href="/" className={styles.mobileNavLink} onClick={closeMobileMenu}>Home</Link>
        <Link href="/projects" className={styles.mobileNavLink} onClick={closeMobileMenu}>Projects</Link>
        <Link href="/services" className={styles.mobileNavLink} onClick={closeMobileMenu}>Services</Link>
        <Link href="/contact" className={styles.mobileNavLink} onClick={closeMobileMenu}>Contact</Link>
        <Link href="/about" className={styles.mobileNavLink} onClick={closeMobileMenu}>About</Link>
        {isAdmin ? (
          <Link href="/admin" className={`${styles.mobileNavLink} ${styles.mobileNavLinkLogin}`} style={{ color: '#e61e25', fontWeight: 'bold' }} onClick={closeMobileMenu}>Admin Portal</Link>
        ) : (
          <Link href="/admin/login" className={`${styles.mobileNavLink} ${styles.mobileNavLinkLogin}`} onClick={closeMobileMenu}>Admin Login</Link>
        )}
      </div>
    </>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AnimatedServicesCircle.css';

interface Service {
  name: string;
  img: string;
  link: string;
}

interface AnimatedServicesCircleProps {
  services: Service[];
  skipDelay?: boolean;
}

export default function AnimatedServicesCircle({ services, skipDelay = false }: AnimatedServicesCircleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZigzagging, setIsZigzagging] = useState(false);
  const [showServices, setShowServices] = useState(skipDelay);

  useEffect(() => {
    if (skipDelay) {
      setShowServices(true);
      return;
    }
    const timer = setTimeout(() => {
      setShowServices(true);
    }, 3000); // 3 seconds matches the page transition delay
    return () => clearTimeout(timer);
  }, [skipDelay]);

  useEffect(() => {
    if (!services || services.length === 0 || !showServices) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
    }, 3000); // cycle every 3 seconds

    return () => clearInterval(interval);
  }, [services, showServices]);

  if (!services || services.length === 0) return null;

  return (
    <motion.div 
      className={`animated-circle-container ${isZigzagging ? 'is-zigzagging' : ''}`}
      onClick={() => setIsZigzagging(!isZigzagging)}
      drag
      dragConstraints={{ left: -500, right: 500, top: -400, bottom: 400 }}
      animate={isZigzagging ? {
        // [center, top-right, bottom-left, top-left, bottom-right, center-left, top-center, center]
        x: [0,  300, -250, -250,  250, -200,    0, 0],
        y: [0, -200,  200, -250,  250,    0, -300, 0],
      } : { x: 0, y: 0 }}
      transition={isZigzagging ? {
        duration: 12,
        ease: "linear",
        repeat: Infinity,
      } : { type: "spring", bounce: 0.4 }}
      style={{ cursor: 'grab', zIndex: 100, pointerEvents: 'auto' }}
      whileTap={{ cursor: 'grabbing' }}
    >
      {/* Outer spinning rings */}
      <div className="spinning-ring-1"></div>
      <div className="spinning-ring-2"></div>
      <div className="spinning-ring-3"></div>
      
      {/* Inner glowing 3D orb */}
      <motion.div 
        className="glowing-orb"
        initial={skipDelay ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={skipDelay ? { duration: 0 } : { duration: 1.2, type: "spring", bounce: 0.4 }}
      >
        {/* Rotating Globe Background Elements */}
        <motion.div
          animate={{ rotate: currentIndex * 90 }}
          transition={{ duration: 1.5, type: "spring", bounce: 0.4 }}
          style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}
        >
          <div className="glass-highlight"></div>
          {/* 3D Twisting Ribbons / Threads */}
          <div className="ribbon ribbon-1"></div>
          <div className="ribbon ribbon-2"></div>
          <div className="ribbon ribbon-3"></div>
          <div className="ribbon ribbon-4"></div>
        </motion.div>
 
        {/* Centered Image and Text */}
        <AnimatePresence mode="wait">
          {!showServices ? (
            <motion.div
              key="brand-logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
              }}
            >
              {/* Brand Logo Text inside the globe */}
              <h2 style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '1.8rem',
                fontWeight: 900,
                color: '#fff',
                letterSpacing: '-1px',
                margin: 0,
                textAlign: 'center',
                textTransform: 'uppercase',
                textShadow: '0 2px 10px rgba(0,0,0,0.8)'
              }}>
                <span style={{ color: '#e61e25' }}>ONE</span> CLICK
              </h2>
            </motion.div>
          ) : (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
              }}
            >
              {/* Flowing morphing image container */}
              <div 
                style={{
                  position: 'absolute',
                  top: '0%',
                  left: '0%',
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  animation: 'morph-thread-2 15s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate-reverse',
                  zIndex: 10,
                  opacity: 0.6, // Keep it slightly transparent so the globe's red glow shows through
                  boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)' // Inner shadow for depth
                }}
              >
                <img 
                  src={services[currentIndex].img} 
                  alt=""
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    filter: 'contrast(1.1) brightness(0.9)'
                  }}
                />
              </div>

              <h3 className={`service-name ${services[currentIndex].name.length > 25 ? 'long-name' : (services[currentIndex].name.length > 20 ? 'medium-name' : '')}`} style={{ 
                margin: 0, 
                textAlign: 'center',
                maxWidth: '180px',
                wordWrap: 'break-word',
                color: 'rgba(255, 255, 255, 1)',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 0, 0, 0.8)',
                zIndex: 20
              }}>
                {services[currentIndex].name}
              </h3>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

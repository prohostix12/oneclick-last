"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicDoubleExposureProps {
  activeIndex: number;
  rotateX: any;
  rotateY: any;
}

const heroServices = [
  { name: 'Branding & Corporate Identity', img: '/signage-branding.png' },
  { name: 'Digital Printed Graphics', img: '/signage-digital-print.png' },
  { name: 'Vehicle Graphics & Fleet Branding', img: '/signage-vehicle.png' },
  { name: 'Exhibition, Display & POS Solutions', img: '/signage-production.png' },
  { name: 'Signage Production & Installation', img: '/signage-exhibition.png' },
  { name: 'Cladding & Facade Solutions', img: '/signage-cladding.png' },
];

export default function CinematicDoubleExposure({ activeIndex, rotateX, rotateY }: CinematicDoubleExposureProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="double-exposure-wrapper">
      {/* Absolute background atmospheric glow/haze behind the artwork */}
      <div className="atmospheric-haze" />

      {/* Main double exposure container with dynamic 3D mouse parallax tracking */}
      <motion.div
        className="double-exposure-container"
        style={{ rotateX, rotateY }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {/* Handshake Silhouette Masked Area (Clipped by CSS mask handshake-mask.png) */}
        <div className="silhouette-masked-area">
          
          {/* Layer 1: Cycling Service Images (Constrained inside the handshake via mask) */}
          <div className="de-layer de-service-images">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 1.12, filter: 'blur(10px) brightness(0.8)' }}
                animate={{ opacity: 1, scale: 1.02, filter: 'blur(0px) brightness(1.15) contrast(1.1)' }}
                exit={{ opacity: 0, scale: 0.96, filter: 'blur(10px)' }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                className="de-service-image-bg"
                style={{
                  backgroundImage: `url(${heroServices[activeIndex].img})`,
                }}
              />
            </AnimatePresence>
          </div>

          {/* Handshake overlays removed as per request. Ready for new silhouette. */}

          {/* Layer 4: Reflective Glass Window sheens sweeping across */}
          <div className="de-layer de-glass-sheen" style={{ zIndex: 5 }}>
            <div className="glass-reflection-line reflection-1" />
            <div className="glass-reflection-line reflection-2" />
          </div>

          {/* Layer 5: Soft warm radial light leak at the handshake center interlocking joint */}
          <div className="de-layer de-light-leak" style={{ zIndex: 4 }} />
        </div>

        {/* Dynamic reflective glass border overlay */}
        <div className="double-exposure-border-glass" />
      </motion.div>
    </div>
  );
}

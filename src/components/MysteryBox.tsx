"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function MysteryBox({ phase, onOpen }: { phase: string, onOpen: () => void }) {
  const isShaking = phase === 'shaking';
  const isOpening = phase === 'opening';

  return (
    <motion.div 
      className="mb-box-wrap"
      onClick={phase === 'idle' ? onOpen : undefined}
      animate={
        isShaking 
          ? { x: [-15, 15, -15, 15, -10, 10, -5, 5, 0], transition: { duration: 0.6 } } 
          : { y: [0, -15, 0], transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' } }
      }
    >
      <div className="mb-box-inner">
        
        {/* Intense Pulse Glow behind box */}
        <motion.div 
          className="mb-box-glow"
          animate={{ scale: isOpening ? 2 : [0.8, 1.2, 0.8], opacity: isOpening ? 0 : [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: isOpening ? 0 : Infinity }}
        />

        {/* --- THE LID --- */}
        <motion.div 
          className="mb-lid"
          animate={isOpening ? { y: -150, opacity: 0, scale: 1.2, rotate: -10 } : { y: 0, opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        >
          {/* Vertical Ribbon */}
          <div className="mb-v-ribbon" />
          
          {/* Bow on Top */}
          <div className="mb-bow">
             <div className="mb-bow-loop" style={{ transform: 'translateX(4px)' }} />
             <div className="mb-bow-loop" style={{ transform: 'translateX(-4px)' }} />
          </div>
        </motion.div>

        {/* --- THE BOX BODY --- */}
        <motion.div 
          className="mb-body"
          animate={isOpening ? { scale: 0.95 } : { scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Vertical Ribbon */}
          <div className="mb-v-ribbon" style={{ position: 'absolute' }} />
          {/* Horizontal Ribbon */}
          <div className="mb-h-ribbon" />
          
          {/* Glow inside the box when revealing */}
          <motion.div 
             className="mb-core-light"
             initial={{ opacity: 0 }}
             animate={{ opacity: isOpening ? 1 : 0 }}
             transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Light explosion effect */}
        {isOpening && (
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 3, 5], filter: ['blur(5px)', 'blur(20px)', 'blur(50px)'] }}
            transition={{ duration: 1.2 }}
            className="mb-core-light"
            style={{ borderRadius: '50%', mixBlendMode: 'screen', width: '10rem', height: '10rem', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 30, pointerEvents: 'none' }}
          />
        )}
      </div>

      {phase === 'idle' && (
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(230,30,37,0.8)' }}
          whileTap={{ scale: 0.95 }}
          className="mb-btn"
        >
          Open Mystery Box
        </motion.button>
      )}
    </motion.div>
  );
}

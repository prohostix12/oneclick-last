"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Clock, CheckCircle, Sparkles } from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  type: 'percentage' | 'free' | 'fixed';
  color: string;
}

interface OfferPopupProps {
  offer: Offer;
  onClaim: () => void;
  isSubmitting: boolean;
}

export default function OfferPopup({ offer, onClaim, isSubmitting }: OfferPopupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="text-center"
    >
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          damping: 15, 
          stiffness: 300,
          delay: 0.1 
        }}
        className="mb-6"
      >
        <div className="relative inline-block">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-red-500/30"
          />
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
            style={{ backgroundColor: offer.color }}
          >
            {offer.discount}
          </div>
        </div>
      </motion.div>

      {/* Offer Details */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <h3 className="text-xl font-bold text-white mb-2">
          🎉 Congratulations!
        </h3>
        <h4 className="text-lg font-semibold text-white mb-3">
          {offer.title}
        </h4>
        <p className="text-white/70 text-sm leading-relaxed">
          {offer.description}
        </p>
      </motion.div>

      {/* Offer Features */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6 space-y-2"
      >
        <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
          <CheckCircle size={16} />
          <span>Valid for 24 hours</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-blue-400 text-sm">
          <CheckCircle size={16} />
          <span>No hidden fees</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-purple-400 text-sm">
          <CheckCircle size={16} />
          <span>Instant activation</span>
        </div>
      </motion.div>

      {/* Countdown Timer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-6 p-3 bg-white/5 rounded-lg border border-white/10"
      >
        <div className="flex items-center justify-center gap-2 text-orange-400 mb-2">
          <Clock size={16} />
          <span className="text-sm font-medium">Limited Time Offer</span>
        </div>
        <div className="text-white/60 text-xs">
          This exclusive offer expires in 24 hours
        </div>
      </motion.div>

      {/* Claim Button */}
      <motion.button
        onClick={onClaim}
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:from-gray-600 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-red-500/25 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
            Claiming Offer...
          </>
        ) : (
          <>
            <Sparkles size={20} />
            Claim My Offer Now
            <Gift size={20} />
          </>
        )}
      </motion.button>

      {/* Trust Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-4 text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Secure & Verified Offer</span>
        </div>
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${20 + (i * 10)}%`,
              top: `${20 + (i * 8)}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + (i * 0.2),
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
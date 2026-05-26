"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

interface Offer {
  id: string;
  title: string;
  discount: string;
  description?: string;
  color?: string;
}

interface OfferCardsProps {
  offers: Offer[];
  onReveal: (offer: Offer) => void;
}

type Phase = 'idle' | 'explode' | 'shuffle' | 'select' | 'reveal';

const CARD_COLORS = ['#e61e25', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

const OfferCards: React.FC<OfferCardsProps> = ({ offers, onReveal }) => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [shufflePositions, setShufflePositions] = useState<{ x: number; y: number; rotate: number }[]>([]);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => timerRefs.current.forEach(clearTimeout);

  const getCardColor = (offer: Offer, index: number) =>
    offer.color || CARD_COLORS[index % CARD_COLORS.length];

  const displayOffers = offers.slice(0, 5);
  const count = displayOffers.length;

  const basePositions = (i: number) => ({
    x: (i - (count - 1) / 2) * 150,
    y: 0,
    rotate: (i - (count - 1) / 2) * 5,
  });

  const generateShufflePositions = () =>
    displayOffers.map(() => ({
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 200,
      rotate: (Math.random() - 0.5) * 60,
    }));

  const start = () => {
    clearTimers();
    setWinnerIndex(null);

    // Phase 1: Explode out
    setPhase('explode');

    timerRefs.current.push(
      setTimeout(() => {
        // Phase 2: Collect into row
        setPhase('shuffle');
        setShufflePositions(generateShufflePositions());

        // Inner shuffle re-randomise twice
        timerRefs.current.push(
          setTimeout(() => setShufflePositions(generateShufflePositions()), 600),
        );
        timerRefs.current.push(
          setTimeout(() => setShufflePositions(generateShufflePositions()), 1200),
        );

        timerRefs.current.push(
          setTimeout(() => {
            // Phase 3: Return to row
            const winner = Math.floor(Math.random() * count);
            setWinnerIndex(winner);
            setPhase('select');

            timerRefs.current.push(
              setTimeout(() => {
                // Phase 4: Reveal winner
                setPhase('reveal');
                onReveal(displayOffers[winner]);

                // Confetti
                if (typeof window !== 'undefined') {
                  import('canvas-confetti').then(({ default: confetti }) => {
                    confetti({ particleCount: 200, spread: 100, origin: { y: 0.55 }, colors: ['#e61e25', '#ffffff', '#ffd700', '#3b82f6'] });
                    setTimeout(() => confetti({ particleCount: 80, spread: 60, origin: { x: 0.2, y: 0.6 }, colors: ['#10b981', '#f59e0b'] }), 400);
                    setTimeout(() => confetti({ particleCount: 80, spread: 60, origin: { x: 0.8, y: 0.6 }, colors: ['#8b5cf6', '#ec4899'] }), 600);
                  });
                }
              }, 800),
            );
          }, 1800),
        );
      }, 500),
    );
  };

  useEffect(() => () => clearTimers(), []);

  const getCardAnimation = (i: number) => {
    const base = basePositions(i);

    if (phase === 'idle') return { x: base.x, y: base.y, rotate: base.rotate, scale: 1, opacity: 0 };

    if (phase === 'explode') {
      const angle = (i / count) * Math.PI * 2;
      return { x: Math.cos(angle) * 350, y: Math.sin(angle) * 250, rotate: base.rotate * 4, scale: 0.8, opacity: 1 };
    }

    if (phase === 'shuffle') {
      return {
        x: shufflePositions[i]?.x ?? base.x,
        y: shufflePositions[i]?.y ?? base.y,
        rotate: shufflePositions[i]?.rotate ?? base.rotate,
        scale: 1,
        opacity: 1,
      };
    }

    if (phase === 'select') {
      const isWinner = winnerIndex === i;
      return {
        x: isWinner ? 0 : base.x * 1.4,
        y: isWinner ? -60 : 40,
        rotate: isWinner ? 0 : base.rotate,
        scale: isWinner ? 1.2 : 0.75,
        opacity: isWinner ? 1 : 0.35,
      };
    }

    if (phase === 'reveal') {
      const isWinner = winnerIndex === i;
      return {
        x: isWinner ? 0 : base.x * 2,
        y: isWinner ? -30 : 80,
        rotate: isWinner ? 0 : base.rotate,
        scale: isWinner ? 1.6 : 0.4,
        opacity: isWinner ? 1 : 0,
      };
    }

    return { x: base.x, y: base.y, rotate: base.rotate, scale: 1, opacity: 1 };
  };

  const cardTransition = {
    type: 'spring' as const,
    stiffness: 200,
    damping: 22,
  };

  return (
    <div className="flex flex-col items-center">
      {/* Unlock Button */}
      <AnimatePresence>
        {phase === 'idle' && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={start}
            className="relative group overflow-hidden px-14 py-5 rounded-full font-black text-xl uppercase tracking-widest text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, #e61e25 0%, #ff4444 50%, #e61e25 100%)',
              backgroundSize: '200% 100%',
              boxShadow: '0 0 40px rgba(230,30,37,0.5), 0 0 80px rgba(230,30,37,0.2)',
            }}
          >
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 w-full h-full"
              animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
              }}
            />
            {/* Pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ border: '2px solid rgba(230,30,37,0.8)' }}
            />
            <span className="relative z-10 flex items-center gap-3">
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🎁
              </motion.span>
              Unlock Offer
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cards Stage */}
      <div
        className="relative w-full"
        style={{ height: 340, marginTop: phase === 'idle' ? 0 : 20 }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {displayOffers.map((offer, i) => {
            const isWinner = winnerIndex === i;
            const color = getCardColor(offer, i);
            const anim = getCardAnimation(i);

            return (
              <motion.div
                key={offer.id || i}
                animate={anim}
                transition={cardTransition}
                className="absolute"
                style={{
                  transformStyle: 'preserve-3d',
                  zIndex: phase === 'reveal' && isWinner ? 50 : phase === 'select' && isWinner ? 40 : 10 - i,
                }}
              >
                {/* Card flip wrapper */}
                <motion.div
                  animate={{
                    rotateY: phase === 'reveal' && isWinner ? 180 : 0,
                  }}
                  transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                  style={{ transformStyle: 'preserve-3d', position: 'relative', width: 140, height: 200 }}
                >
                  {/* ── CARD BACK ── */}
                  <div
                    className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-2 overflow-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      background: 'linear-gradient(160deg, #1a1a1a 0%, #0d0d0d 100%)',
                      border: `2px solid ${color}40`,
                      boxShadow: phase !== 'idle' && isWinner
                        ? `0 0 30px ${color}80, 0 20px 60px rgba(0,0,0,0.5)`
                        : '0 10px 30px rgba(0,0,0,0.4)',
                    }}
                  >
                    {/* Animated background lines */}
                    <div className="absolute inset-0 overflow-hidden">
                      {[...Array(5)].map((_, li) => (
                        <motion.div
                          key={li}
                          className="absolute w-full h-px"
                          style={{
                            top: `${20 + li * 15}%`,
                            background: `linear-gradient(90deg, transparent, ${color}30, transparent)`,
                          }}
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2 + li * 0.3, repeat: Infinity, ease: 'linear', delay: li * 0.2 }}
                        />
                      ))}
                    </div>

                    {/* Gift icon */}
                    <motion.div
                      animate={
                        phase === 'shuffle'
                          ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }
                          : { scale: 1, rotate: 0 }
                      }
                      transition={{ duration: 0.5, repeat: phase === 'shuffle' ? Infinity : 0 }}
                      className="text-5xl z-10"
                    >
                      🎁
                    </motion.div>

                    <div
                      className="z-10 text-[9px] font-black uppercase tracking-[3px]"
                      style={{ color: `${color}cc` }}
                    >
                      One Click
                    </div>

                    {/* Glow blob */}
                    <div
                      className="absolute w-24 h-24 rounded-full blur-xl"
                      style={{ background: `${color}20`, bottom: -10, right: -10 }}
                    />

                    {/* Winner glow ring */}
                    {(phase === 'select' || phase === 'reveal') && isWinner && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        style={{ border: `2px solid ${color}`, boxShadow: `0 0 20px ${color}` }}
                      />
                    )}
                  </div>

                  {/* ── CARD FRONT (revealed) ── */}
                  <div
                    className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-5 text-center overflow-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: `linear-gradient(160deg, #0d0d0d 0%, ${color}25 100%)`,
                      border: `2px solid ${color}`,
                      boxShadow: `0 0 40px ${color}60, 0 25px 60px rgba(0,0,0,0.6)`,
                    }}
                  >
                    {/* Confetti dots */}
                    {[...Array(8)].map((_, di) => (
                      <motion.div
                        key={di}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          background: color,
                          left: `${10 + di * 12}%`,
                          top: `${Math.random() * 80 + 10}%`,
                        }}
                        animate={{ y: [-5, 5, -5], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1 + di * 0.1, repeat: Infinity, delay: di * 0.1 }}
                      />
                    ))}

                    <div className="text-[8px] font-black uppercase tracking-[3px] text-white/30 mb-2">
                      🏆 You Won!
                    </div>
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, type: 'spring' }}
                      className="text-3xl font-black mb-3"
                      style={{
                        color,
                        textShadow: `0 0 20px ${color}`,
                        filter: `drop-shadow(0 0 8px ${color})`,
                      }}
                    >
                      {offer.discount}
                    </motion.div>
                    <div className="text-sm font-bold text-white leading-tight">
                      {offer.title}
                    </div>
                    {offer.description && (
                      <div className="text-[10px] text-white/40 mt-2 leading-tight">
                        {offer.description}
                      </div>
                    )}

                    {/* Glow pulse */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      animate={{ opacity: [0, 0.15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ background: `radial-gradient(circle at center, ${color}, transparent)` }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Status text below cards */}
      <AnimatePresence mode="wait">
        {phase === 'explode' && (
          <motion.p key="explode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-white/40 text-sm font-bold uppercase tracking-widest mt-4">
            ⚡ Shuffling your cards…
          </motion.p>
        )}
        {phase === 'shuffle' && (
          <motion.p key="shuffle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-white/40 text-sm font-bold uppercase tracking-widest mt-4">
            🔀 Mixing the deck…
          </motion.p>
        )}
        {phase === 'select' && (
          <motion.p key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-[#e61e25] text-sm font-black uppercase tracking-widest mt-4">
            ✨ Winner selected!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OfferCards;

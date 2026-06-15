'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface IntroStageProps {
  intro: {
    title: string;
    subtitle: string;
  };
  flowerStyle?: string;
  onComplete: () => void;
}

export default function IntroStage({ intro, flowerStyle = 'rose', onComplete }: IntroStageProps) {
  console.log('flowerStyle in IntroStage:', flowerStyle);
  
  const [isAppeared, setIsAppeared] = useState(false);

  useEffect(() => {
    // Set isAppeared to true after the initial entry animation finishes
    const appearTimer = setTimeout(() => {
      setIsAppeared(true);
    }, 1200);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearTimeout(appearTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Rose Animation Helpers
  const petalVariants = (delay: number) => ({
    hidden: { scale: 0, opacity: 0, rotate: 0 },
    visible: {
      scale: 1,
      opacity: 0.9,
      rotate: 0,
      transition: {
        delay: delay,
        duration: 1.8,
        ease: 'easeOut' as const,
      },
    },
  });

  // Render function for different animations
  const renderAnimation = () => {
    switch (flowerStyle) {
      case 'heart':
        return (
          <svg className="w-48 h-48 drop-shadow-md overflow-visible" viewBox="0 0 200 200">
            <g transform="translate(100, 95)">
              {/* Glowing Pulse Heart */}
              <motion.path
                d="M 0 45 C -50 5, -60 -35, -30 -50 C -10 -60, 0 -35, 0 -35 C 0 -35, 10 -60, 30 -50 C 60 -35, 50 5, 0 45 Z"
                fill="#fecdd3"
                initial={{ scale: 0, opacity: 0 }}
                animate={isAppeared ? {
                  scale: [1, 1.25, 1],
                  opacity: [0.3, 0.6, 0.3]
                } : {
                  scale: 1.1,
                  opacity: 0.4
                }}
                transition={isAppeared ? {
                  scale: {
                    duration: 1.2,
                    ease: 'easeInOut' as const,
                    repeat: Infinity,
                    repeatDelay: 0.4,
                    type: 'tween'
                  },
                  opacity: {
                    duration: 1.2,
                    ease: 'easeInOut' as const,
                    repeat: Infinity,
                    repeatDelay: 0.4,
                    type: 'tween'
                  }
                } : {
                  scale: { type: 'spring', damping: 15, stiffness: 100, delay: 0.4 },
                  opacity: { duration: 0.5, delay: 0.4 }
                }}
              />
              
              {/* Main Heart */}
              <motion.path
                d="M 0 45 C -50 5, -60 -35, -30 -50 C -10 -60, 0 -35, 0 -35 C 0 -35, 10 -60, 30 -50 C 60 -35, 50 5, 0 45 Z"
                fill="#f43f5e"
                initial={{ scale: 0, opacity: 0 }}
                animate={isAppeared ? {
                  scale: [1, 1.12, 1.02, 1.12, 1],
                  opacity: 0.9
                } : {
                  scale: 1,
                  opacity: 0.9
                }}
                transition={isAppeared ? {
                  scale: {
                    duration: 1.2,
                    ease: 'easeInOut' as const,
                    repeat: Infinity,
                    repeatDelay: 0.4,
                    type: 'tween'
                  }
                } : {
                  scale: { type: 'spring', damping: 12, stiffness: 100, delay: 0.7 },
                  opacity: { duration: 0.5, delay: 0.7 }
                }}
              />

              {/* Floating Mini Hearts */}
              {Array.from({ length: 6 }).map((_, i) => {
                const angle = (i * 60 * Math.PI) / 180;
                const radius = 45;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <motion.g
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 1.2, 0.8, 0],
                      opacity: [0, 0.9, 0.9, 0],
                      x: [x, x * 1.4],
                      y: [y, y - 35]
                    }}
                    transition={{ 
                      delay: 1.0 + i * 0.25, 
                      duration: 2.0, 
                      repeat: Infinity,
                      repeatDelay: 0.8,
                      type: 'tween',
                      ease: 'easeOut' as const
                    }}
                  >
                    <path
                      d="M 0 -6 C -3.5 -10, -8 -8, -8 -4 C -8 0, 0 6, 0 6 C 0 6, 8 0, 8 -4 C 8 -8, 3.5 -10, 0 -6 Z"
                      fill="#fda4af"
                    />
                  </motion.g>
                );
              })}
            </g>
          </svg>
        );

      case 'fireworks':
        return (
          <svg className="w-48 h-48 drop-shadow-md overflow-visible" viewBox="0 0 200 200">
            <g transform="translate(100, 95)">
              {/* Radiating Spark Lines */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const length = 55;
                const x2 = Math.cos(angle) * length;
                const y2 = Math.sin(angle) * length;
                const colors = ['#fde047', '#6ee7b7', '#fecdd3', '#fda4af', '#a5f3fc'];
                const color = colors[i % colors.length];

                return (
                  <motion.line
                    key={i}
                    x1="0"
                    y1="0"
                    x2={x2}
                    y2={y2}
                    stroke={color}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: [0, 1, 1],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      delay: 0.4 + (i % 3) * 0.25, 
                      duration: 1.2,
                      type: 'tween',
                      ease: 'easeOut' as const,
                      repeat: Infinity,
                      repeatDelay: 0.8
                    }}
                  />
                );
              })}

              {/* Exploding Dot Ring */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * 45 * Math.PI) / 180;
                const distance = 65;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                return (
                  <motion.circle
                    key={`dot-${i}`}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="#fde047"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 1.2, 0],
                      opacity: [0, 0.9, 0]
                    }}
                    transition={{ 
                      delay: 0.8 + (i % 2) * 0.15, 
                      duration: 1.0,
                      type: 'tween',
                      ease: 'easeOut' as const,
                      repeat: Infinity,
                      repeatDelay: 1.0
                    }}
                  />
                );
              })}

              {/* Center Flash */}
              <motion.circle
                cx="0"
                cy="0"
                r="8"
                fill="#fde047"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: 0.2, 
                  type: 'spring', 
                  stiffness: 120, 
                  damping: 10 
                }}
              />
            </g>
          </svg>
        );

      case 'envelope':
        return (
          <svg className="w-48 h-48 drop-shadow-md overflow-visible" viewBox="0 0 200 200">
            {/* Ambient shadow for the entire envelope */}
            <rect x="26" y="77" width="148" height="82" rx="4" fill="rgba(0, 0, 0, 0.12)" filter="blur(1px)" />

            {/* 1. Envelope Back Pocket (inside backing) */}
            <rect x="30" y="75" width="140" height="80" rx="3" fill="#eae7dd" stroke="#d4af37" strokeWidth="1" />

            {/* 2. Envelope Top Flap (rendered behind the letter card, morphs open) */}
            <motion.path
              initial={{ d: "M 30 75 L 100 115 L 170 75 Z" }}
              animate={{
                d: "M 30 75 L 100 32 L 170 75 Z"
              }}
              transition={{ delay: 0.8, duration: 0.7, ease: 'easeInOut' as const }}
              fill="#fcfbf7"
              stroke="#d4af37"
              strokeWidth="1.5"
            />

            {/* 3. The Letter Card (slides up in front of the back pocket and top flap, but behind front flaps) */}
            <motion.g
              initial={{ y: 78, opacity: 0 }}
              animate={{ y: 15, opacity: 1 }}
              transition={{ delay: 1.5, duration: 1.2, ease: 'easeOut' as const, type: 'tween' }}
            >
              {/* Parchment letter paper */}
              <rect x="36" y="0" width="128" height="82" rx="4" fill="#fefae0" stroke="#d4af37" strokeWidth="1.5" />
              {/* Inner dashed gold frame */}
              <rect x="40" y="4" width="120" height="74" rx="2" fill="none" stroke="#e9c46a" strokeWidth="0.5" strokeDasharray="3 2" />
              
              {/* Royal Seal Watermark / Emblem at top center of letter */}
              <circle cx="100" cy="18" r="8" fill="#d4af37" opacity="0.95" />
              <path d="M 97 20 L 95 16 L 98 17 L 100 13 L 102 17 L 105 16 L 103 20 Z" fill="#fefae0" />
              
              {/* Elegant navy handwriting script lines */}
              <line x1="50" y1="36" x2="150" y2="36" stroke="#264653" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="4 2" />
              <line x1="50" y1="46" x2="150" y2="46" stroke="#264653" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="5 3" />
              <line x1="50" y1="56" x2="150" y2="56" stroke="#264653" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 2" />
              <line x1="50" y1="66" x2="110" y2="66" stroke="#264653" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="4 2" />
            </motion.g>

            {/* 4. Envelope Front Flaps (drawn on top of the sliding letter pocket) */}
            {/* Left Flap */}
            <path d="M 30 75 L 30 155 L 100 115 Z" fill="#f6f4ed" stroke="#e3dfd5" strokeWidth="0.5" />
            {/* Right Flap */}
            <path d="M 170 75 L 170 155 L 100 115 Z" fill="#f6f4ed" stroke="#e3dfd5" strokeWidth="0.5" />
            {/* Bottom Flap */}
            <path d="M 30 155 L 170 155 L 100 115 Z" fill="#faf9f5" stroke="#e3dfd5" strokeWidth="0.5" />
            {/* Gold trim along front flap edges */}
            <path d="M 30 155 L 100 115 L 170 155" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* 5. Wax Seal (initially holding the top flap tip at 100, 115) */}
            <motion.g
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: [1, 1.15, 0], opacity: [1, 1, 0] }}
              transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' as const, type: 'tween' }}
            >
              {/* Organic circular wax drops in dark crimson */}
              <path
                d="M 100 92 C 112 90, 118 102, 116 112 C 114 122, 106 128, 98 126 C 90 124, 84 116, 86 106 C 88 96, 90 94, 100 92 Z"
                fill="#800020"
                filter="drop-shadow(0px 3px 5px rgba(0,0,0,0.3))"
              />
              <circle cx="100" cy="109" r="12" fill="#5c0017" />
              {/* Crown emblem inside seal */}
              <path
                d="M 96 112 L 94 107 L 98 108 L 100 104 L 102 108 L 106 107 L 104 112 Z"
                fill="#d4af37"
              />
            </motion.g>
          </svg>
        );

      case 'scroll':
        return (
          <svg className="w-48 h-48 drop-shadow-md overflow-visible" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
            </defs>
            <g transform="translate(100, 100)">
              {/* Parchment background */}
              <motion.rect
                x="-55"
                y="-60"
                width="110"
                height="120"
                rx="4"
                fill="#f5ebd0"
                stroke="#d4af37"
                strokeWidth="2.5"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: 'easeInOut' as const, type: 'tween' }}
                style={{ originY: 0.5 }}
              />

              {/* Royal handwritten lines */}
              <motion.path
                d="M -35 -30 L 35 -30"
                stroke="#78350f"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="4 3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{ delay: 1.2, duration: 0.8, type: 'tween' }}
              />
              <motion.path
                d="M -40 -10 L 40 -10"
                stroke="#78350f"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="5 3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{ delay: 1.5, duration: 0.8, type: 'tween' }}
              />
              <motion.path
                d="M -30 10 L 30 10"
                stroke="#78350f"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="3 3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{ delay: 1.8, duration: 0.8, type: 'tween' }}
              />

              {/* Top Golden Roller */}
              <motion.g
                initial={{ y: 0 }}
                animate={{ y: -60 }}
                transition={{ duration: 1.5, ease: 'easeInOut' as const, type: 'tween' }}
              >
                <rect x="-60" y="-4" width="120" height="8" rx="2" fill="url(#goldGradient)" />
                <circle cx="-60" cy="0" r="6" fill="#b45309" />
                <circle cx="60" cy="0" r="6" fill="#b45309" />
              </motion.g>

              {/* Bottom Golden Roller */}
              <motion.g
                initial={{ y: 0 }}
                animate={{ y: 60 }}
                transition={{ duration: 1.5, ease: 'easeInOut' as const, type: 'tween' }}
              >
                <rect x="-60" y="-4" width="120" height="8" rx="2" fill="url(#goldGradient)" />
                <circle cx="-60" cy="0" r="6" fill="#b45309" />
                <circle cx="60" cy="0" r="6" fill="#b45309" />
              </motion.g>

              {/* Royal Wax Seal */}
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2.2, type: 'spring', stiffness: 150, damping: 12 }}
              >
                <circle cx="0" cy="30" r="16" fill="#b91c1c" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.15))" />
                <circle cx="0" cy="30" r="12" fill="none" stroke="#991b1b" strokeWidth="1" />
                <path
                  d="M -5 34 L -7 28 L -2 30 L 0 25 L 2 30 L 7 28 L 5 34 Z"
                  fill="#fde047"
                />
              </motion.g>
            </g>
          </svg>
        );

      case 'rose':
      default:
        return (
          <svg className="w-48 h-48 drop-shadow-md overflow-visible" viewBox="0 0 200 200">
            <motion.path
              d="M 75 140 Q 60 115 70 105 Q 85 110 85 130 Z"
              fill="#a7f3d0"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1.2 }}
            />
            <motion.path
              d="M 125 145 Q 140 120 130 110 Q 115 115 115 135 Z"
              fill="#a7f3d0"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.0, duration: 1.2 }}
            />
            <motion.path
              d="M 100 180 Q 95 140 100 100"
              fill="none"
              stroke="#6ee7b7"
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />

            <g transform="translate(100, 95)">
              <motion.path
                d="M 0 0 C -20 -40, 20 -40, 0 0"
                fill="#fda4af"
                variants={petalVariants(0.5)}
                initial="hidden"
                animate="visible"
              />
              <motion.path
                d="M 0 0 C 40 -20, 40 20, 0 0"
                fill="#fecdd3"
                transform="rotate(60)"
                variants={petalVariants(0.7)}
                initial="hidden"
                animate="visible"
              />
              <motion.path
                d="M 0 0 C 40 20, -10 45, 0 0"
                fill="#fda4af"
                transform="rotate(120)"
                variants={petalVariants(0.9)}
                initial="hidden"
                animate="visible"
              />
              <motion.path
                d="M 0 0 C 20 40, -20 40, 0 0"
                fill="#fecdd3"
                transform="rotate(180)"
                variants={petalVariants(1.1)}
                initial="hidden"
                animate="visible"
              />
              <motion.path
                d="M 0 0 C -40 20, -40 -20, 0 0"
                fill="#fda4af"
                transform="rotate(240)"
                variants={petalVariants(1.3)}
                initial="hidden"
                animate="visible"
              />
              <motion.path
                d="M 0 0 C -40 -20, 10 -45, 0 0"
                fill="#fecdd3"
                transform="rotate(300)"
                variants={petalVariants(1.5)}
                initial="hidden"
                animate="visible"
              />

              <motion.circle
                cx="0"
                cy="0"
                r="12"
                fill="#fde047"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.8, duration: 0.8, type: 'spring' }}
              />
            </g>
          </svg>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-md px-6 space-y-8 select-none">
      <div className="relative w-48 h-48 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' as const, type: 'tween' }}
          className="absolute w-36 h-36 bg-rose-200/50 rounded-full blur-2xl"
        />

        {renderAnimation()}
      </div>

      <div className="space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 1.0 }}
          className="text-3xl md:text-4xl font-serif font-bold text-stone-800 tracking-tight"
        >
          {intro.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8, duration: 1.0 }}
          className="text-stone-500 italic text-md md:text-lg font-light leading-relaxed"
        >
          {intro.subtitle}
        </motion.p>
      </div>

      <div className="w-24 h-1 bg-stone-100 rounded-full overflow-hidden mt-4 mx-auto">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 4.5, ease: 'easeInOut' as const }}
          className="h-full bg-rose-400"
        />
      </div>
    </div>
  );
}
